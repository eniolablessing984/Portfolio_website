"use client"

import * as React from "react"
import { useEffect, useRef } from "react"
import * as THREE from "three"

const SWEEP_POWER = 1.35

const SAMPLES = 150

const DEFAULTS = {
    core: "#00FFE6",
    tip: "#00BDFF",
    petals: 21,
    lines: 20,
    twist: 8,
    wave: 20,
    node: 20,
    speed: 20,
    spin: 20,
    scale: 79,
}

type Config = {
    core: string
    tip: string
    petals: number
    lines: number
    twist: number
    wave: number
    node: number
    speed: number
    spin: number
    scale: number
}

function clamp(v: number, lo: number, hi: number, fallback: number): number {
    const n = typeof v === "number" && isFinite(v) ? v : fallback
    return Math.max(lo, Math.min(hi, n))
}

function toOklab(hex: string, fallback: string): THREE.Vector3 {
    const c = new THREE.Color(hex || fallback)
    const l = Math.cbrt(0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b)
    const m = Math.cbrt(0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b)
    const s = Math.cbrt(0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b)
    return new THREE.Vector3(
        0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
        1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
    )
}

function settingsFor(cfg: Config) {
    return {
        petals: Math.round(clamp(cfg.petals, 3, 24, DEFAULTS.petals)),
        lines: Math.round(clamp(cfg.lines, 2, 20, DEFAULTS.lines)),

        twist: clamp(cfg.twist, 0, 20, DEFAULTS.twist) * 0.032,
        sweepPower: SWEEP_POWER,

        wave: clamp(cfg.wave, 0, 20, DEFAULTS.wave) * 0.032,

        node: clamp(cfg.node, 0, 20, DEFAULTS.node) * 0.0011,

        speed: clamp(cfg.speed, 0, 20, DEFAULTS.speed) * 0.016,

        spin: clamp(cfg.spin, 0, 20, DEFAULTS.spin) * 0.008,
        scale: clamp(cfg.scale, 20, 200, DEFAULTS.scale) / 100,
    }
}

const VORTEX_VERTEX =  `
    precision highp float;

    #define TAU 6.28318530718
    #define PI 3.14159265359

    #define REACH_C 0.46
    #define STAGGER_C 1.1
    #define SPREAD_C 0.44
    #define WEIGHT_C 0.0081

    uniform vec2 uResolution;
    uniform float uTime;
    uniform float uTurn;
    uniform float uPetals;
    uniform float uTwist;
    uniform float uSweepPower;
    uniform float uWave;
    uniform float uNode;
    uniform float uScale;

    attribute vec3 aData;

    varying float vAlong;
    varying float vBody;
    varying float vHead;

    void main() {
        float petal = aData.x;
        float along = aData.y;
        float lane = aData.z;

        float slot = TAU / uPetals;
        float clock = uTime * TAU;

        float radius = along * REACH_C;

        float lag = lane * STAGGER_C;
        float swim = sin(along * 2.6 - clock + lag);

        float wave = uWave * slot * swim * pow(along, 1.2);

        float apart = lane * SPREAD_C * slot * (0.12 + 0.88 * along);

        float sweep = uTwist * pow(along, uSweepPower);

        float angle = (petal + 0.5) * slot + apart + wave - (sweep + uTurn) * TAU;
        vec2 at = vec2(cos(angle), sin(angle)) * radius;

        float unit = min(uResolution.x, uResolution.y) * uScale;
        gl_Position = vec4(at * (2.0 * unit) / uResolution, 0.0, 1.0);

        float body = pow(max(sin(PI * along), 0.0), 0.4);

        float head = smoothstep(0.9, 1.0, along);

        gl_PointSize = unit * (WEIGHT_C * (0.35 + 0.75 * body) + uNode * head);

        vAlong = along;
        vBody = body;
        vHead = head;
    }
`

const VORTEX_FRAGMENT =  `
    precision highp float;

    uniform vec3 uCore;
    uniform vec3 uTip;

    varying float vAlong;
    varying float vBody;
    varying float vHead;

    vec3 rgbFromOklab(vec3 lab) {
        float l = lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z;
        float m = lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z;
        float s = lab.x - 0.0894841775 * lab.y - 1.291485548 * lab.z;
        l = l * l * l;
        m = m * m * m;
        s = s * s * s;
        return vec3(
            4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
            -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
            -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
        );
    }

    void main() {
        float fall = 1.0 - min(length(gl_PointCoord - 0.5) * 2.0, 1.0);

        float shape = pow(fall, 5.0) + pow(fall, 1.6) * 0.35;

        float emerge = smoothstep(0.0, 0.1, vAlong);

        vec3 col = rgbFromOklab(mix(uCore, uTip, smoothstep(0.1, 1.0, vAlong)));
        float a = shape * emerge * (0.08 + 0.5 * vBody + 0.95 * vHead);
        if (a < 0.003) discard;

        gl_FragColor = vec4(col * a, a);
    }
`

class VortexScene {
    private container: HTMLElement
    private cfg: Config

    private renderer: THREE.WebGLRenderer
    private scene = new THREE.Scene()
    private camera = new THREE.Camera()
    private material: THREE.ShaderMaterial
    private geometry: THREE.BufferGeometry | null = null
    private points: THREE.Points | null = null

    private time = 0
    private turn = 0

    private width = 1
    private height = 1
    private frameId = 0
    private lastT = 0
    private disposed = false

    constructor(container: HTMLElement, cfg: Config) {
        this.container = container
        this.cfg = cfg
        const S = settingsFor(cfg)

        this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        this.renderer.outputColorSpace = THREE.SRGBColorSpace
        this.renderer.setClearColor(0x000000, 0)
        const el = this.renderer.domElement
        el.style.position = "absolute"
        el.style.inset = "0"
        el.style.width = "100%"
        el.style.height = "100%"
        container.appendChild(el)

        this.material = new THREE.ShaderMaterial({
            vertexShader: VORTEX_VERTEX,
            fragmentShader: VORTEX_FRAGMENT,
            uniforms: {
                uResolution: { value: new THREE.Vector2(1, 1) },
                uTime: { value: 0 },
                uTurn: { value: 0 },
                uCore: { value: toOklab(cfg.core, DEFAULTS.core) },
                uTip: { value: toOklab(cfg.tip, DEFAULTS.tip) },
                uPetals: { value: S.petals },
                uTwist: { value: S.twist },
                uSweepPower: { value: S.sweepPower },
                uWave: { value: S.wave },
                uNode: { value: S.node },
                uScale: { value: S.scale },
            },
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            depthWrite: false,
        })

        this.build()
    }

    private build() {
        const S = settingsFor(this.cfg)

        if (this.points) this.scene.remove(this.points)
        this.geometry?.dispose()

        const count = S.petals * S.lines * SAMPLES
        const data = new Float32Array(count * 3)

        const positions = new Float32Array(count * 3)

        let i = 0
        for (let p = 0; p < S.petals; p++) {
            for (let f = 0; f < S.lines; f++) {
                const lane = (f / (S.lines - 1)) * 2 - 1
                for (let s = 0; s < SAMPLES; s++) {
                    data[i * 3 + 0] = p
                    data[i * 3 + 1] = s / (SAMPLES - 1)
                    data[i * 3 + 2] = lane
                    i++
                }
            }
        }

        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
        this.geometry.setAttribute("aData", new THREE.BufferAttribute(data, 3))

        this.points = new THREE.Points(this.geometry, this.material)

        this.points.frustumCulled = false
        this.scene.add(this.points)
    }

    start() {
        this.lastT = performance.now()
        const loop = () => {
            this.frameId = requestAnimationFrame(loop)
            this.step()
        }
        loop()
    }

    setSize(width: number, height: number) {
        if (this.disposed || width <= 0 || height <= 0) return
        this.renderer.setSize(width, height, false)
        const dpr = this.renderer.getPixelRatio()
        this.width = width * dpr
        this.height = height * dpr
        this.material.uniforms.uResolution.value.set(this.width, this.height)
    }

    updateConfig(cfg: Config) {
        if (this.disposed) return
        const prev = this.cfg
        this.cfg = cfg
        const u = this.material.uniforms
        u.uCore.value.copy(toOklab(cfg.core, DEFAULTS.core))
        u.uTip.value.copy(toOklab(cfg.tip, DEFAULTS.tip))

        if (cfg.petals !== prev.petals || cfg.lines !== prev.lines) {
            this.build()
        }
    }

    private step() {
        if (this.disposed) return
        const now = performance.now()
        let dt = (now - this.lastT) / 1000
        this.lastT = now
        if (!isFinite(dt) || dt < 0) dt = 0

        if (dt > 0.05) dt = 0.05

        const S = settingsFor(this.cfg)

        this.time = (this.time + dt * S.speed) % 1
        this.turn = (this.turn + dt * S.spin) % 1

        const u = this.material.uniforms
        u.uTime.value = this.time
        u.uTurn.value = this.turn
        u.uPetals.value = S.petals
        u.uTwist.value = S.twist
        u.uSweepPower.value = S.sweepPower
        u.uWave.value = S.wave
        u.uNode.value = S.node
        u.uScale.value = S.scale

        this.renderer.render(this.scene, this.camera)
    }

    dispose() {
        this.disposed = true
        cancelAnimationFrame(this.frameId)
        const el = this.renderer.domElement
        this.geometry?.dispose()
        this.material.dispose()
        this.renderer.dispose()
        if (el.parentNode === this.container) this.container.removeChild(el)
    }
}

export interface PetalVortexProps {
    core?: string
    tip?: string
    petals?: number
    lines?: number
    twist?: number
    wave?: number
    node?: number
    speed?: number
    spin?: number
    scale?: number
    style?: React.CSSProperties
}

export default function PetalVortex(props: PetalVortexProps) {
    const {
        core = DEFAULTS.core,
        tip = DEFAULTS.tip,
        petals = DEFAULTS.petals,
        lines = DEFAULTS.lines,
        twist = DEFAULTS.twist,
        wave = DEFAULTS.wave,
        node = DEFAULTS.node,
        speed = DEFAULTS.speed,
        spin = DEFAULTS.spin,
        scale = DEFAULTS.scale,
        style,
    } = props

    const containerRef = useRef<HTMLDivElement | null>(null)
    const sceneRef = useRef<VortexScene | null>(null)

    const cfgRef = useRef<Config>(null as any)
    cfgRef.current = {
        core,
        tip,
        petals,
        lines,
        twist,
        wave,
        node,
        speed,
        spin,
        scale,
    }

    useEffect(() => {
        const container = containerRef.current
        if (!container) return
        let scene: VortexScene
        try {
            scene = new VortexScene(container, cfgRef.current)
        } catch {
            return
        }
        sceneRef.current = scene
        scene.setSize(container.clientWidth, container.clientHeight)
        scene.start()

        const ro = new ResizeObserver(() => {
            scene.setSize(container.clientWidth, container.clientHeight)
        })
        ro.observe(container)
        return () => {
            ro.disconnect()
            scene.dispose()
            sceneRef.current = null
        }
    }, [])

    useEffect(() => {
        sceneRef.current?.updateConfig(cfgRef.current)
    }, [
        core,
        tip,
        petals,
        lines,
        twist,
        wave,
        node,
        speed,
        spin,
        scale,
    ])

    return (
        <div
            ref={containerRef}
            role="img"
            aria-label="A flower of line groups turning clockwise, each line tipped with a bright node"
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                minWidth: 120,
                minHeight: 120,
                overflow: "hidden",
                ...style,
            }}
        />
    )
}

PetalVortex.displayName = "Petal Vortex"
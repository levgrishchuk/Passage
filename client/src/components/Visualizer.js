import { Uniform } from 'three/src/core/Uniform'
import { Vector2 } from 'three/src/math/Vector2'
import { Scene } from 'three/src/scenes/Scene'
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer'
import { OrthographicCamera } from 'three/src/cameras/OrthographicCamera'
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry'
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial'
import { Mesh } from 'three/src/objects/Mesh'
import { DoubleSide } from 'three/src/constants'
import * as THREE from 'three'


export default function visualizer() {


    const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
    }


    function printUniforms () {
    return Object.keys(uniforms).reduce((acc, key) => {
        let { value } = uniforms[key]
        const isVec2 = value instanceof Vector2
        let type = isVec2 ? Vector2 : typeof value
        if (type === 'string') {
        value = parseFloat(value)
        type = 'number'
        }
        switch (type) {
        case 'number':
            acc += `uniform float ${key};\n`
            break
        case 'boolean':
            acc += `uniform bool ${key};\n`
            break
        case Vector2:
            acc += `uniform vec2 ${key};\n`
            break
        }
        return acc
    }, `varying vec2 vUv;\n`)
    }

    // flower
    // const shader = 
    // `
    // vec4 hue(vec4 color, float shift) {
    //   const vec4 kRGBToYPrime = vec4(0.299, 0.587, 0.114, 0.0);
    //   const vec4 kRGBToI = vec4(0.596, -0.275, -0.321, 0.0);
    //   const vec4 kRGBToQ = vec4(0.212, -0.523, 0.311, 0.0);
    //   const vec4 kYIQToR = vec4(1.0, 0.956, 0.621, 0.0);
    //   const vec4 kYIQToG = vec4(1.0, -0.272, -0.647, 0.0);
    //   const vec4 kYIQToB = vec4(1.0, -1.107, 1.704, 0.0);
    //   float YPrime = dot(color, kRGBToYPrime);
    //   float I = dot(color, kRGBToI);
    //   float Q = dot(color, kRGBToQ);
    //   float hue = atan(Q, I);
    //   float chroma = sqrt(I * I + Q * Q);
    //   hue += shift;
    //   Q = chroma * sin(hue);
    //   I = chroma * cos(hue);
    //   vec4 yIQ = vec4(YPrime, I, Q, 0.0);
    //   color.r = dot(yIQ, kYIQToR);
    //   color.g = dot(yIQ, kYIQToG);
    //   color.b = dot(yIQ, kYIQToB);
    //   return color;
    // }

    // void main() {
    //   vec2 uv = -1.0 + 2.0 * vUv;
    //   uv.x *= resolution.x / resolution.y;
    //   uv *= zoom;
    //   uv = abs(fract(uv) - .5) * 2.1;
    //   uv = abs(fract(uv) - .5) * .1;
    //   uv = abs(fract(uv) - .5) * 1.;
    //   uv = abs(fract(uv) - .5) * 1.;
    //   uv *= 2. * atan(uv.x / 50. + stream / 100.) - .1;
    //   vec4 result = vec4(0, 0, 0, 1);
    //   float t = 1.8;
    //   float base = 1000. * length(uv);
    //   for (int p = 0; p < 3; p++) {
    //     float a = cos((t * base) - stream / 1000.);
    //     float b = cos(660. * uv.x / .25 - stream / 100.);
    //     result[p] = 2.52 * a + 1.7 * b + base / 1000.;
    //     t += 2.6;
    //   }
    //   float col = hue(result.xyxy, stream / 1000.).g;
    //   result.xyz *= brightness * col;
    //   result.xyz = (result.xyz);
    //   result.xy *= abs(tan(uv.x * 200.));
    //   gl_FragColor = log(abs(result));
    //   gl_FragColor.r *= red;
    //   gl_FragColor.g *= green;
    //   gl_FragColor.b *= blue;
    // }
    // `

    // fractal
    const shader = 
    `
    vec2 p;
    void main() {
    p = -1.0 + 2.0 * vUv.xy;
    p *= zoom;
    p.x *= resolution.x / resolution.y;
    gl_FragColor = vec4(1, 1, 1, 1);
    for (float i = 1.; i < 3.; i++) {
        float a = cos(p.y - stream / 2000.);
        float k = 10. * sin(stream / 2000.);
        vec4 b = vec4(.842, .185, k, 0.);
        vec2 c = abs(2. * fract(p - .5) - 1.);
        float h = (stream / 2000.);
        p = c * mat2(sin(h * i * i + a * a * b));
        float d = log(abs(p.y*2.) * 10.48);
        float e = cos(p.x - stream / 32000.);
        float f = pattern * p.x + stream / 3000.;
        vec4 g = vec4((pattern * p.y), e, f, 0.);
        gl_FragColor *= d * brightness * (cos(g * i * i) * .5 + .5);
    }
    gl_FragColor.r *= red;
    gl_FragColor.g *= green;
    gl_FragColor.b *= blue;
    }
    `
    // flower
    // const uniforms = 
    // {
    //   resolution: new Uniform(new Vector2(window.innerWidth, window.innerHeight)),
    //   time: {
    //     value: 0
    //   },
    //   stream: {
    //     value: 0
    //   },
    //   volume: {
    //     value: 0
    //   },
    //   beat: {
    //     value: 0
    //   },
    //   beatBasis: {
    //     value: 0
    //   },
    //   beatBool: {
    //     value: true
    //   },
    //   tatum: {
    //     value: 0
    //   },
    //   tatumBasis: {
    //     value: 0
    //   },
    //   tatumBool: {
    //     value: true
    //   },
    //   bar: {
    //     value: 0
    //   },
    //   barBasis: {
    //     value: 0
    //   },
    //   barBool: {
    //     value: true
    //   },
    //   section: {
    //     value: 0
    //   },
    //   sectionBasis: {
    //     value: 0
    //   },
    //   sectionBool: {
    //     value: true
    //   },
    //   segment: {
    //     value: 0
    //   },
    //   segmentBasis: {
    //     value: 0
    //   },
    //   segmentBool: {
    //     value: true
    //   },
    //   "speed": {
    //     "name": "speed",
    //     "min": 0,
    //     "max": 12,
    //     "value": "10.02",
    //     "step": 0.01
    //   },
    //   "bump": {
    //     "name": "bump",
    //     "min": 0,
    //     "max": 75,
    //     "value": "65.77",
    //     "step": 0.01
    //   },
    //   "zoom": {
    //     "name": "zoom",
    //     "min": ".002",
    //     "max": ".01",
    //     "step": "0.0001",
    //     "value": "0.002"
    //   },
    //   "brightness": {
    //     "name": "brightness",
    //     "min": 0,
    //     "max": "50",
    //     "step": 0.01,
    //     "value": "26.95"
    //   },
    //   "red": {
    //     "name": "red",
    //     "min": 0,
    //     "max": 1,
    //     "step": 0.01,
    //     "value": "0.19"
    //   },
    //   "green": {
    //     "name": "green",
    //     "min": 0,
    //     "max": 1,
    //     "step": 0.01,
    //     "value": "0.18"
    //   },
    //   "blue": {
    //     "name": "blue",
    //     "min": 0,
    //     "max": 1,
    //     "step": 0.01,
    //     "value": "1"
    //   }
    // }

    // fractal
    const uniforms = 
    {
    resolution: new Uniform(new Vector2(window.innerWidth, window.innerHeight)),
    time: {
        value: 0
    },
    stream: {
        value: 0
    },
    volume: {
        value: 0
    },
    beat: {
        value: 0
    },
    beatBasis: {
        value: 0
    },
    beatBool: {
        value: true
    },
    tatum: {
        value: 0
    },
    tatumBasis: {
        value: 0
    },
    tatumBool: {
        value: true
    },
    bar: {
        value: 0
    },
    barBasis: {
        value: 0
    },
    barBool: {
        value: true
    },
    section: {
        value: 0
    },
    sectionBasis: {
        value: 0
    },
    sectionBool: {
        value: true
    },
    segment: {
        value: 0
    },
    segmentBasis: {
        value: 0
    },
    segmentBool: {
        value: true
    },
    "speed": {
        "name": "speed",
        "min": 0,
        "max": 20,
        "value": "8.07",
        "step": 0.01
    },
    "bump": {
        "name": "bump",
        "min": 0,
        "max": "200",
        "value": "61.47",
        "step": 0.01
    },
    "red": {
        "name": "red",
        "min": 0,
        "max": 1,
        "step": 0.01,
        "value": "0.45",
    },
    "green": {
        "name": "green",
        "min": 0,
        "max": 1,
        "step": 0.01,
        "value": "0.18",
    },
    "blue": {
        "name": "blue",
        "min": 0,
        "max": 1,
        "step": 0.01,
        "value": "1"
    },
    "brightness": {
        "name": "brightness",
        "min": "1",
        "max": "15",
        "step": 0.01,
        "value": "1.63"
    },
    "zoom": {
        "name": "zoom",
        "min": ".01",
        "max": ".6",
        "step": "0.0001",
        "value": "0.1394"
    },
    "pattern": {
        "name": "pattern",
        "min": "10",
        "max": "200",
        "step": 0.01,
        "value": "20.82"
    }
    }


    console.log(printUniforms())

    const scene = new Scene()

    const canvas = document.querySelector('canvas.webgl')
    const renderer = new WebGLRenderer({
    powerPreference: 'high-performance',
    canvas: canvas
    })



    renderer.setClearColor( '#000000', 1 )
    const camera = new OrthographicCamera(-1, 1, 1, -1, -1, 1)
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    window.renderer = renderer
    const geometry = new PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
    vertexShader: `
    ${printUniforms()}
    void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );
        gl_Position = projectionMatrix * mvPosition;
    }
    `,
    fragmentShader: `
    ${printUniforms()}
    ${shader}`,
    uniforms: uniforms
    })

    const mesh = new Mesh(geometry, material)
    scene.add(mesh)
    window.addEventListener('resize', onResize.bind(this))
    onResize()
    // initErrorHandler()


    // function initErrorHandler () {
    //   window.__KALEIDOSYNC_LOGGER__ = Observe({
    //     error: null
    //   })

    //   window.__KALEIDOSYNC_LOGGER__.watch('error', val => {
    //     parseError(val)
    //   })
    // }

    // function parseError (e) { 
    //   const raw = e.split('\n')
    //   const unadjustedLineNumber = parseInt(raw[1].match(/([0-9])\w+/)[0], 10)
    //   const startingIndex = raw.reduce((acc, line, i) => {
    //     if (line.indexOf('// KALEIDOSYNC //') !== -1) acc = i + 1
    //     return acc
    //   }, -1)
    //   const lineNumber = unadjustedLineNumber - startingIndex - Object.keys(_uniforms).length - Object.keys(booleans).length - 3
    //   const errors = raw.reduce((acc, item) => {
    //     if (item.indexOf('ERROR') !== -1) acc.push(item)
    //     return acc
    //   }, []).map(error => {
    //     return {
    //       error: error.replace(unadjustedLineNumber, lineNumber),
    //       line: lineNumber
    //     }
    //   }) 
    //   $store.dispatch('visualizer/shaderErrors', errors)
    // }

    function onResize () {
      if (uniforms) uniforms.resolution = new Uniform(new Vector2(window.innerWidth, window.innerHeight))
      renderer.setSize(window.innerWidth, window.innerHeight)
    //   renderer.setPixelRatio(hidpi ? window.devicePixelRatio : 1)
    }

    // function tick (now) {
    //   try {
    //     const base = parseFloat(_uniforms.speed.value) 
    //     const tick = parseFloat(_uniforms.bump.value) 

    //     if (!activeIntervals) {
    //       _uniforms.stream.value += base / 5
    //       _uniforms.time.value = now
    //       _uniforms.volume.value = 1
    //       renderer.render(scene, camera)
    //       return
    //     }

    //     let volume = 1
    //     queues.forEach(queue => {
    //       volume *= volumeQueues[queue.name].volume
    //     })
    //     const { progress } = activeIntervals[beatInterval]
    //     const stream = interpolateBasis([base, (base + (tick * volume)), base])(ease(progress, 'easeOutQuart'))
    //     _uniforms.stream.value += stream 
    //     _uniforms.time.value = now / 1000
    //     _uniforms.volume.value = volume
    //     const intervals = ['segment', 'tatum', 'beat', 'bar', 'section']
    //     const intervalInterpolator = interpolateBasis([0, 1, 0])
    //     intervals.forEach(interval => {
    //       _uniforms[interval].value = activeIntervals[interval + 's'].progress
    //       _uniforms[interval + 'Basis'].value = intervalInterpolator(ease(activeIntervals[interval + 's'].progress, 'easeInOutQuint'))
    //     })
    //     renderer.render(scene, camera)
    //   } catch (e) {
    //     console.log(e) // eslint-disable-line
    //   }
    // }

    const clock = new THREE.Clock()

    const tick = () => {
    try {
        const base = parseFloat(uniforms.speed.value) 
        // const tick = parseFloat(uniforms.bump.value) 

        const now = clock.getElapsedTime()
        // console.log(now)

        // if (true) {
        uniforms.stream.value += base / 5
        uniforms.time.value = now
        uniforms.volume.value = 1
        renderer.render(scene, camera)
        window.requestAnimationFrame(tick)
        // }

        // let volume = 1
        // // queues.forEach(queue => {
        // //   volume *= volumeQueues[queue.name].volume
        // // })
        // // const { progress } = activeIntervals[beatInterval]
        // // const stream = interpolateBasis([base, (base + (tick * volume)), base])(ease(progress, 'easeOutQuart'))
        // uniforms.stream.value += stream 
        // uniforms.time.value = now / 1000
        // uniforms.volume.value = volume
        // const intervals = ['segment', 'tatum', 'beat', 'bar', 'section']
        // // const intervalInterpolator = interpolateBasis([0, 1, 0])
        // // intervals.forEach(interval => {
        // //   uniforms[interval].value = activeIntervals[interval + 's'].progress
        // //   uniforms[interval + 'Basis'].value = intervalInterpolator(ease(activeIntervals[interval + 's'].progress, 'easeInOutQuint'))
        // // })
        // renderer.render(scene, camera)
    } catch (e) {
        console.log(e) // eslint-disable-line
    }
    }

    tick()
}
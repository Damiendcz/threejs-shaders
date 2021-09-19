import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vextex.glsl'
import testTexture from './texture.jpg'
import * as dat from 'dat.gui'

export default class Sketch {
    constructor(options) {
        this.container = options.domElement;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.camera = new THREE.PerspectiveCamera(80, this.width / this.height, .001, 1000);
        this.camera.position.z = 300;

        // Permet de changer la taille des géometries en pixels et plus en unitées
        this.camera.fov = 2*Math.atan((this.height / 2) / this.camera.position.z) * 180/Math.PI;

        this.scene = new THREE.Scene()

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.container.appendChild(this.renderer.domElement)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)

        this.time = 0;
        this.setupSettings();
        this.resize();
        this.createMesh();
        this.render();
        this.setupResize();

    }

    setupSettings() {
        this.settings = {
            progress: 0
        }
        this.gui = new dat.GUI();
        this.gui.add(this.settings, "progress", 0, 1, 0.001)
    }

    resize() {
        this.width = this.container.offsetWidth
        this.height = this.container.offsetHeight
        this.renderer.setSize( this.width, this.height );
        this.camera.aspect = this.width/this.height
        this.camera.updateProjectionMatrix();
    }

    setupResize() {
        window.addEventListener('resize', this.resize.bind(this))
    }

    createMesh() {
        this.geometry = new THREE.PlaneBufferGeometry(200, 200, 100, 100)
        this.material = new THREE.ShaderMaterial({
            wireframe: false,
            uniforms: {
                time: { value: 1.0 },
                uProgress: {value: 1.0},
                uTexture: {value: new THREE.TextureLoader().load(testTexture)},
                uTextureSize: {value: new THREE.Vector2(100, 100)},
                uResolution: { value: new THREE.Vector2(this.width, this.height) },
                uQuadSize: { value: new THREE.Vector2(200, 200) },
            },
            vertexShader: vertex,
            fragmentShader: fragment,
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.x = 200;
        this.mesh.rotation.z = .5;
        // this.mesh.scale.set(2, 1, 1)
        this.scene.add(this.mesh)
    }

    render() {
        this.time += .05;
        this.material.uniforms.time.value = this.time;
        this.material.uniforms.uProgress.value = this.settings.progress
        this.mesh.rotation.x = this.time / 2000;
        this.mesh.rotation.y = this.time / 1000;
    
        this.renderer.render( this.scene, this.camera );
        requestAnimationFrame(this.render.bind(this))
    }
}

new Sketch({
    domElement: document.getElementById('container')
})
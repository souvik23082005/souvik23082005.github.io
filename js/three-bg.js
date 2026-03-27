/* ==========================================
   THREE.JS 3D BACKGROUND
   ========================================== */

class ThreeBackground {
    constructor() {
        this.canvas = document.getElementById('bgCanvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
        this.objects = [];
        this.clock = new THREE.Clock();
        this.mouse = { x: 0, y: 0 };

        this.init();
        this.createObjects();
        this.createGrid();
        this.animate();
        this.bindEvents();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.camera.position.z = 30;

        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x112244, 0.5);
        this.scene.add(ambientLight);

        // Point lights
        const light1 = new THREE.PointLight(0x00d4ff, 1.5, 100);
        light1.position.set(20, 20, 20);
        this.scene.add(light1);

        const light2 = new THREE.PointLight(0xa855f7, 1.5, 100);
        light2.position.set(-20, -20, 20);
        this.scene.add(light2);

        const light3 = new THREE.PointLight(0xec4899, 0.8, 100);
        light3.position.set(0, 10, -20);
        this.scene.add(light3);
    }

    createObjects() {
        // Floating Icosahedron
        const icoGeo = new THREE.IcosahedronGeometry(3, 0);
        const icoMat = new THREE.MeshPhongMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.15,
            wireframe: true,
            emissive: 0x00d4ff,
            emissiveIntensity: 0.1
        });
        const ico = new THREE.Mesh(icoGeo, icoMat);
        ico.position.set(-12, 5, -10);
        this.scene.add(ico);
        this.objects.push({ mesh: ico, rotSpeed: { x: 0.003, y: 0.005 }, floatSpeed: 0.5, floatAmp: 2, baseY: 5 });

        // Floating Octahedron
        const octGeo = new THREE.OctahedronGeometry(2.5, 0);
        const octMat = new THREE.MeshPhongMaterial({
            color: 0xa855f7,
            transparent: true,
            opacity: 0.12,
            wireframe: true,
            emissive: 0xa855f7,
            emissiveIntensity: 0.1
        });
        const oct = new THREE.Mesh(octGeo, octMat);
        oct.position.set(15, -3, -8);
        this.scene.add(oct);
        this.objects.push({ mesh: oct, rotSpeed: { x: 0.004, y: 0.003 }, floatSpeed: 0.7, floatAmp: 1.5, baseY: -3 });

        // Floating Torus
        const torusGeo = new THREE.TorusGeometry(2, 0.5, 8, 20);
        const torusMat = new THREE.MeshPhongMaterial({
            color: 0xec4899,
            transparent: true,
            opacity: 0.1,
            wireframe: true,
            emissive: 0xec4899,
            emissiveIntensity: 0.08
        });
        const torus = new THREE.Mesh(torusGeo, torusMat);
        torus.position.set(8, 10, -15);
        this.scene.add(torus);
        this.objects.push({ mesh: torus, rotSpeed: { x: 0.005, y: 0.002 }, floatSpeed: 0.3, floatAmp: 1.8, baseY: 10 });

        // Floating Dodecahedron
        const dodGeo = new THREE.DodecahedronGeometry(2, 0);
        const dodMat = new THREE.MeshPhongMaterial({
            color: 0x22d3ee,
            transparent: true,
            opacity: 0.1,
            wireframe: true,
            emissive: 0x22d3ee,
            emissiveIntensity: 0.08
        });
        const dod = new THREE.Mesh(dodGeo, dodMat);
        dod.position.set(-15, -8, -12);
        this.scene.add(dod);
        this.objects.push({ mesh: dod, rotSpeed: { x: 0.002, y: 0.004 }, floatSpeed: 0.6, floatAmp: 2.5, baseY: -8 });

        // Small floating spheres
        for (let i = 0; i < 15; i++) {
            const size = Math.random() * 0.4 + 0.1;
            const sphereGeo = new THREE.SphereGeometry(size, 8, 8);
            const hue = Math.random() > 0.5 ? 0x00d4ff : 0xa855f7;
            const sphereMat = new THREE.MeshPhongMaterial({
                color: hue,
                transparent: true,
                opacity: Math.random() * 0.15 + 0.05,
                emissive: hue,
                emissiveIntensity: 0.2
            });
            const sphere = new THREE.Mesh(sphereGeo, sphereMat);
            sphere.position.set(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30 - 10
            );
            this.scene.add(sphere);
            this.objects.push({
                mesh: sphere,
                rotSpeed: { x: 0, y: 0 },
                floatSpeed: Math.random() * 0.5 + 0.2,
                floatAmp: Math.random() * 3 + 1,
                baseY: sphere.position.y
            });
        }
    }

    createGrid() {
        // Subtle moving grid on bottom
        const gridSize = 60;
        const gridDivisions = 30;
        const gridMat = new THREE.LineBasicMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.04
        });

        // Create grid lines manually
        const gridGeo = new THREE.BufferGeometry();
        const gridVertices = [];
        const half = gridSize / 2;
        const step = gridSize / gridDivisions;

        for (let i = 0; i <= gridDivisions; i++) {
            const pos = -half + i * step;
            // X lines
            gridVertices.push(-half, 0, pos);
            gridVertices.push(half, 0, pos);
            // Z lines
            gridVertices.push(pos, 0, -half);
            gridVertices.push(pos, 0, half);
        }

        gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gridVertices, 3));
        const grid = new THREE.LineSegments(gridGeo, gridMat);
        grid.position.y = -15;
        grid.rotation.x = -0.1;
        this.grid = grid;
        this.scene.add(grid);
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const elapsed = this.clock.getElapsedTime();

        // Animate objects
        this.objects.forEach(obj => {
            obj.mesh.rotation.x += obj.rotSpeed.x;
            obj.mesh.rotation.y += obj.rotSpeed.y;
            obj.mesh.position.y = obj.baseY + Math.sin(elapsed * obj.floatSpeed) * obj.floatAmp;
        });

        // Animate grid
        if (this.grid) {
            this.grid.position.z = (elapsed * 0.5) % 2;
        }

        // Camera parallax with mouse
        this.camera.position.x += (this.mouse.x * 2 - this.camera.position.x) * 0.02;
        this.camera.position.y += (this.mouse.y * 1 - this.camera.position.y) * 0.02;
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThreeBackground();
});

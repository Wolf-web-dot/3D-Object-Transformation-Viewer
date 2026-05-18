let scene, camera, renderer, cube;

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1e1e1e);

    camera = new THREE.PerspectiveCamera(
        75,
        (window.innerWidth - 260) / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth - 260, window.innerHeight);
    document.getElementById("canvas-container").appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    scene.add(new THREE.GridHelper(10, 10));
    scene.add(new THREE.AxesHelper(5));

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0x00bfff });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    createUI();

    window.addEventListener("resize", onWindowResize);
}

function createUI() {
    const controls = document.querySelector(".controls");

    controls.innerHTML += `
        <hr>

        <h2>Rotasi</h2>
        <label>X</label>
        <input id="rotX" type="range" min="-3.14" max="3.14" step="0.01" value="0">

        <label>Y</label>
        <input id="rotY" type="range" min="-3.14" max="3.14" step="0.01" value="0">

        <label>Z</label>
        <input id="rotZ" type="range" min="-3.14" max="3.14" step="0.01" value="0">

        <h2>Skala</h2>
        <input id="scale" type="range" min="0.2" max="2" step="0.01" value="1">

        <h2>Posisi X</h2>
        <input id="posX" type="range" min="-5" max="5" step="0.1" value="0">

        <h2>Posisi Y</h2>
        <input id="posY" type="range" min="-5" max="5" step="0.1" value="0">

        <h2>Posisi Z</h2>
        <input id="posZ" type="range" min="-5" max="5" step="0.1" value="0">

        <hr>

        <div id="info">
            <p><b>Posisi:</b> <span id="posText"></span></p>
            <p><b>Rotasi:</b> <span id="rotText"></span></p>
            <p><b>Skala:</b> <span id="scaleText"></span></p>
        </div>
    `;

    const rotX = document.getElementById("rotX");
    const rotY = document.getElementById("rotY");
    const rotZ = document.getElementById("rotZ");

    const scale = document.getElementById("scale");

    const posX = document.getElementById("posX");
    const posY = document.getElementById("posY");
    const posZ = document.getElementById("posZ");


    function update() {
        cube.rotation.x = parseFloat(rotX.value);
        cube.rotation.y = parseFloat(rotY.value);
        cube.rotation.z = parseFloat(rotZ.value);

        const scaleValue = parseFloat(scale.value);
        cube.scale.set(scaleValue, scaleValue, scaleValue);

        cube.position.x = parseFloat(posX.value);
        cube.position.y = parseFloat(posY.value);
        cube.position.z = parseFloat(posZ.value);
        updateInfo();
        updateMathPanel();
    }

    [rotX, rotY, rotZ, scale, posX, posY, posZ].forEach(el => {
        el.addEventListener("input", update);
    });

    update();
}

function updateInfo() {
    document.getElementById("posText").innerText =
        `(${cube.position.x.toFixed(2)}, ${cube.position.y.toFixed(2)}, ${cube.position.z.toFixed(2)})`;

    document.getElementById("rotText").innerText =
        `(${cube.rotation.x.toFixed(2)}, ${cube.rotation.y.toFixed(2)}, ${cube.rotation.z.toFixed(2)})`;

    document.getElementById("scaleText").innerText =
        `(${cube.scale.x.toFixed(2)}, ${cube.scale.y.toFixed(2)}, ${cube.scale.z.toFixed(2)})`;
}

function updateMathPanel() {

     const x = cube.rotation.x;
    const y = cube.rotation.y;
    const z = cube.rotation.z;

    const cx = Math.cos(x).toFixed(2);
    const sx = Math.sin(x).toFixed(2);

    const cy = Math.cos(y).toFixed(2);
    const sy = Math.sin(y).toFixed(2);

    const cz = Math.cos(z).toFixed(2);
    const sz = Math.sin(z).toFixed(2);

    document.getElementById("rotMatriks").innerText = `
Rotasi X:
[1  0   0]
[0 ${cx} ${-sx}]
[0 ${sx} ${cx}]

Rotasi Y:
[${cy} 0 ${sy}]
[0   1  0]
[-${sy} 0 ${cy}]

Rotasi Z:
[${cz} ${-sz} 0]
[${sz} ${cz}  0]
[0   0   1]
`;

    const s = cube.scale.x.toFixed(2);

    document.getElementById("scaleMatriks").innerText = `
[ ${s}  0   0 ]
[ 0   ${s}  0 ]
[ 0   0   ${s} ]
`;

    document.getElementById("vectorText").innerText =
        `v = (${cube.position.x.toFixed(2)}, ${cube.position.y.toFixed(2)}, ${cube.position.z.toFixed(2)})`;
}

function onWindowResize() {
    camera.aspect = (window.innerWidth - 260) / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth - 260, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
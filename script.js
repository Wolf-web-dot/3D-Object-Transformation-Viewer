let scene, camera, renderer, object3D, controls;

const objects = [
    { label: "Kubus",      geo: () => new THREE.BoxGeometry(), color: 0x00bfff },
    { label: "Balok",      geo: () => new THREE.BoxGeometry(1.4, 0.8, 0.6),  color: 0x74b9ff },
    { label: "Bola",       geo: () => new THREE.SphereGeometry(0.7, 32, 32), color: 0xff6b6b },
    { label: "Kerucut",    geo: () => new THREE.ConeGeometry(0.7, 1.5, 32), color: 0xf9ca24 },
    { label: "Torus",      geo: () => new THREE.TorusGeometry(0.6, 0.25, 16, 100), color: 0xa29bfe },
    { label: "Silinder",   geo: () => new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32), color: 0x55efc4 },
    { label: "Prisma",     geo: () => new THREE.CylinderGeometry(0.6, 0.6, 1.5, 3),  color: 0xff9ff3 },
    { label: "Oktahedron", geo: () => new THREE.OctahedronGeometry(0.8), color: 0xfd79a8 },
    { label: "Piramida",   geo: () => new THREE.ConeGeometry(0.8, 1.2, 4), color: 0xffd166 },
];

init();
animate();

function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1e1e1e);

    const panelWidth = 260;

    camera = new THREE.PerspectiveCamera(
        75,
        (window.innerWidth - panelWidth) / window.innerHeight,
        0.1,
        1000
    );

    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(
        window.innerWidth - panelWidth,
        window.innerHeight
    );

    controls = new THREE.OrbitControls(
        camera,
        renderer.domElement
    );

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    document
        .getElementById("canvas-container")
        .appendChild(renderer.domElement);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);

    dirLight.position.set(5, 5, 5);

    scene.add(dirLight);

    scene.add(new THREE.AmbientLight(0x404040));

    scene.add(new THREE.GridHelper(10, 10));
    scene.add(new THREE.AxesHelper(5));

    createAxisLabel("X", 5.5, 0, 0, "red");
    createAxisLabel("Y", 0, 5.5, 0, "green");
    createAxisLabel("Z", 0, 0, 5.5, "blue");

    object3D = new THREE.Mesh(
        objects[0].geo(),
        new THREE.MeshStandardMaterial({
            color: objects[0].color
        })
    );

    scene.add(object3D);

    createUI();

    window.addEventListener("resize", onWindowResize);
}

function createUI() {

    const controls = document.querySelector(".controls");

    controls.innerHTML += `

        <hr>

        <h2>Pilih Objek</h2>

        <div class="obj-grid">
            ${objects.map((o, i) => `
                <button class="obj-btn ${i === 0 ? "active" : ""}" data-i="${i}">
                    ${o.label}
                </button>
            `).join("")}
        </div>

        <hr>

        <h2>Rotasi</h2>

        <label>X</label>
        <div class="input-row">
            <input id="rotX" type="range" min="-3.14" max="3.14" step="0.01" value="0">
            <input id="rotXNum" type="number" min="-3.14" max="3.14" step="0.01" value="0">
        </div>

        <label>Y</label>
        <div class="input-row">
            <input id="rotY" type="range" min="-3.14" max="3.14" step="0.01" value="0">
            <input id="rotYNum" type="number" min="-3.14" max="3.14" step="0.01" value="0">
        </div>

        <label>Z</label>
        <div class="input-row">
            <input id="rotZ" type="range" min="-3.14" max="3.14" step="0.01" value="0">
            <input id="rotZNum" type="number" min="-3.14" max="3.14" step="0.01" value="0">
        </div>

        <h2>Skala</h2>

        <div class="input-row">
            <input id="scale" type="range" min="0.2" max="2" step="0.01" value="1">
            <input id="scaleNum" type="number" min="0.2" max="2" step="0.01" value="1">
        </div>

        <h2>Posisi X</h2>

        <div class="input-row">
            <input id="posX" type="range" min="-5" max="5" step="0.1" value="0">
            <input id="posXNum" type="number" min="-5" max="5" step="0.1" value="0">
        </div>

        <h2>Posisi Y</h2>

        <div class="input-row">
            <input id="posY" type="range" min="-5" max="5" step="0.1" value="0">
            <input id="posYNum" type="number" min="-5" max="5" step="0.1" value="0">
        </div>

        <h2>Posisi Z</h2>

        <div class="input-row">
            <input id="posZ" type="range" min="-5" max="5" step="0.1" value="0">
            <input id="posZNum" type="number" min="-5" max="5" step="0.1" value="0">
        </div>

        <hr>

        <button id="resetBtn">Reset Transform</button>

        <hr>

        <div id="info">
            <p><b>Posisi:</b> <span id="posText"></span></p>
            <p><b>Rotasi:</b> <span id="rotText"></span></p>
            <p><b>Skala:</b> <span id="scaleText"></span></p>
        </div>
    `;

    const ids = [
        "rotX",
        "rotY",
        "rotZ",
        "scale",
        "posX",
        "posY",
        "posZ"
    ];

    ids.forEach(id => {

        const slider = document.getElementById(id);
        const num = document.getElementById(id + "Num");

        slider.addEventListener("input", () => {

            num.value = slider.value;

            update();
        });

        num.addEventListener("input", () => {

            let v = Math.min(
                parseFloat(num.max),
                Math.max(
                    parseFloat(num.min),
                    parseFloat(num.value) || 0
                )
            );

            num.value = v;
            slider.value = v;

            update();
        });
    });

    document.querySelectorAll(".obj-btn").forEach(btn => {

        btn.addEventListener("click", () => {

            const i = parseInt(btn.dataset.i);

            const obj = objects[i];

            const oldRotation = object3D.rotation.clone();
            const oldPosition = object3D.position.clone();
            const oldScale = object3D.scale.clone();

            scene.remove(object3D);

            object3D = new THREE.Mesh(
                obj.geo(),
                new THREE.MeshStandardMaterial({
                    color: obj.color
                })
            );

            object3D.rotation.copy(oldRotation);
            object3D.position.copy(oldPosition);
            object3D.scale.copy(oldScale);

            scene.add(object3D);

            document
                .querySelectorAll(".obj-btn")
                .forEach(b => b.classList.remove("active"));

            btn.classList.add("active");

            document.getElementById("objLabel").innerText = obj.label;

            update();
        });
    });

    document.getElementById("resetBtn").addEventListener("click", () => {

        const defaults = {
            rotX: 0,
            rotY: 0,
            rotZ: 0,
            scale: 1,
            posX: 0,
            posY: 0,
            posZ: 0
        };

        Object.keys(defaults).forEach(id => {

            document.getElementById(id).value = defaults[id];

            document.getElementById(id + "Num").value = defaults[id];
        });

        update();
    });

    update();
}

function update() {

    object3D.rotation.set(
        parseFloat(document.getElementById("rotX").value),
        parseFloat(document.getElementById("rotY").value),
        parseFloat(document.getElementById("rotZ").value)
    );

    const s = parseFloat(document.getElementById("scale").value);

    object3D.scale.set(s, s, s);

    object3D.position.set(
        parseFloat(document.getElementById("posX").value),
        parseFloat(document.getElementById("posY").value),
        parseFloat(document.getElementById("posZ").value)
    );

    updateInfo();
    updateMathPanel();
}

function updateInfo() {

    const p = object3D.position;
    const r = object3D.rotation;
    const s = object3D.scale;

    document.getElementById("posText").innerText =
        `(${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)})`;

    document.getElementById("rotText").innerText =
        `(${r.x.toFixed(2)}, ${r.y.toFixed(2)}, ${r.z.toFixed(2)})`;

    document.getElementById("scaleText").innerText =
        `(${s.x.toFixed(2)}, ${s.y.toFixed(2)}, ${s.z.toFixed(2)})`;
}

function updateMathPanel() {

    const rx = object3D.rotation.x;
    const ry = object3D.rotation.y;
    const rz = object3D.rotation.z;

    const s = object3D.scale.x;

    const f = v => String(math.round(v, 2)).padStart(6);

    const Rx = [
        [1, 0, 0],
        [0, math.cos(rx), -math.sin(rx)],
        [0, math.sin(rx), math.cos(rx)]
    ];

    const Ry = [
        [math.cos(ry), 0, math.sin(ry)],
        [0, 1, 0],
        [-math.sin(ry), 0, math.cos(ry)]
    ];

    const Rz = [
        [math.cos(rz), -math.sin(rz), 0],
        [math.sin(rz), math.cos(rz), 0],
        [0, 0, 1]
    ];

    const mat3Str = m =>
        m.map(r => `[${r.map(f).join(" ")} ]`).join("\n");

    document.getElementById("rotMatriks").innerText =
`Rx:
${mat3Str(Rx)}

Ry:
${mat3Str(Ry)}

Rz:
${mat3Str(Rz)}`;

    document.getElementById("scaleMatriks").innerText =
        mat3Str([
            [s, 0, 0],
            [0, s, 0],
            [0, 0, s]
        ]);

    const p = object3D.position;

    document.getElementById("vectorText").innerText =
        `v = (${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)})`;
}

function onWindowResize() {

    const panelWidth = 260;

    camera.aspect =
        (window.innerWidth - panelWidth) / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth - panelWidth,
        window.innerHeight
    );
}

function animate() {

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}

function createAxisLabel(text, x, y, z, color) {

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 128;
    canvas.height = 128;

    context.fillStyle = color;
    context.font = "80px Arial";
    context.textAlign = "center";
    context.fillText(text, 64, 90);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.SpriteMaterial({
        map: texture
    });

    const sprite = new THREE.Sprite(material);

    sprite.position.set(x, y, z);

    sprite.scale.set(0.7, 0.7, 0.7);

    scene.add(sprite);
}
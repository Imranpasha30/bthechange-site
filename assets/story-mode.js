/* ============================================================================
   STORY MODE 3D v4 — Walkable Islands Edition
   - Schooner ship + Gerstner ocean (from v3)
   - Bigger islands you can land on (radius 25)
   - Press G to disembark when ship is near an island
   - Walk mode: control a person avatar with WASD
   - 3 lore pillars per island — walk to a pillar to read program lore
   - Press G near island edge to re-board the ship
   - All 11 programs have 3 unique lore entries (33 in total)
   - R / E to dismiss any panel; Esc to exit
   ============================================================================ */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') {
    console.error('[story-mode] Three.js failed to load');
    return;
  }

  /* ---------- DATA ---------- */
  var SHORE_DATA = [
    { num: '01', tag: 'EDUCATION · ADILABAD',          title: 'Coding on Wheels',           text: 'A van teaching code, AI and robotics where schools never reached.', link: 'programs/coding-on-wheels.html',          color: 0xf4a23a },
    { num: '02', tag: 'CIVIC · SECUNDERABAD',          title: 'Changemakers',               text: 'Civic action lit by ordinary people.',                                link: 'programs/changemakers.html',              color: 0x6ab8c9 },
    { num: '03', tag: 'HEALTH · HYDERABAD',            title: 'Organ Donation Campaign',    text: 'Cards signed. Sight returned. Lives extended.',                       link: 'programs/organ-donation-on-wheels.html',  color: 0xe85d6b },
    { num: '04', tag: 'ENVIRONMENT · TELANGANA',       title: 'EKO Warriors',               text: 'Petitions, surveys, forests still standing.',                         link: 'programs/eko-warriors.html',              color: 0x6ed089 },
    { num: '05', tag: 'ANIMAL WELFARE · ALMASGUDA',    title: 'PAWtection Force',           text: 'Guardians for those who cannot ask.',                                 link: 'programs/pawtection-force.html',          color: 0xb89674 },
    { num: '06', tag: 'DIGNITY · TELANGANA',           title: 'WE: Women Empowerment',      text: 'Economic dignity. Health awareness. Real autonomy.',                  link: 'programs/we-women-empowerment.html',      color: 0xe06bb4 },
    { num: '07', tag: 'JUSTICE · UK & INDIA',          title: 'Global Human Rights Front',  text: 'Asylum, immigration, the long fight for status.',                    link: 'programs/global-human-rights-front.html', color: 0x5b89c4 },
    { num: '08', tag: 'LEGAL · LONDON',                title: 'Cross Connect Legal Aid',    text: 'From immigration to reconciliation, we stand with you.',              link: 'programs/cross-connect-legal-aid.html',   color: 0x8a8e96 },
    { num: '09', tag: 'EDUCATION · NIZAMABAD',         title: 'DreamCatchers',              text: 'After-school tutoring, scholarships, futures.',                       link: 'programs/dreamcatchers.html',             color: 0xf4d03f },
    { num: '10', tag: 'LIVELIHOOD · HYDERABAD',        title: 'Launchpad',                  text: 'First job. First salary. First step.',                                link: 'programs/launchpad.html',                 color: 0xff8855 },
    { num: '11', tag: 'PRO-BONO · INDIA',              title: 'L.A.W.G.I.C.',               text: 'Free legal aid for those the system forgets.',                        link: 'programs/lawgic.html',                    color: 0xa886ff }
  ];

  /* 3 lore points per program (3 × 11 = 33 entries) */
  var SHORE_LORE = [
    /* 01 CODING ON WHEELS */
    [
      { title: 'The Bus',     text: 'Built in 2018, the Coding Bus visits 12 villages per fortnight. Each visit lasts four hours.' },
      { title: 'The Student', text: 'Arjun, Class 9, wrote his first Python script three weeks after his first lesson. He now mentors his sister.' },
      { title: 'The Impact',  text: '2,400+ students taught code; nineteen have been admitted to engineering colleges.' }
    ],
    /* 02 CHANGEMAKERS */
    [
      { title: 'The Call',    text: 'Kamala, 71, started organising water complaints in 2019. Her first WhatsApp group had four members.' },
      { title: 'The Network', text: 'Today she runs three ward-level groups. Together they have filed 47 civic complaints.' },
      { title: 'The Lesson',  text: '"Civic action isn\'t an age. It\'s a decision."' }
    ],
    /* 03 ORGAN DONATION */
    [
      { title: 'The Card',    text: 'Distributed at 31 college campuses this term. 2,341 signed.' },
      { title: 'The Story',   text: 'Fathima signed at 22. Two years later, her father\'s corneas restored sight to a man she will never meet.' },
      { title: 'The Numbers', text: 'India needs 200,000 organ transplants per year. Current supply is under one percent.' }
    ],
    /* 04 EKO WARRIORS */
    [
      { title: 'The PIL',      text: 'Filed in 2023. Stayed by the bench in February 2026. A forest of 400 acres protected.' },
      { title: 'The Tree Walk',text: 'Quarterly field surveys with college volunteers. 89 species catalogued.' },
      { title: 'The Line',     text: '"Defenders of nature, protectors of place — for nine years and counting."' }
    ],
    /* 05 PAWTECTION FORCE */
    [
      { title: 'The Rescue',   text: '18 strays this month, 247 this year. Each rehomed or treated.' },
      { title: 'The Shelter',  text: 'Almasguda colony\'s volunteer-run safe zone. 24/7 hotline.' },
      { title: 'The Ethic',    text: '"Guardians of the speechless. We answer for those who cannot ask."' }
    ],
    /* 06 WE */
    [
      { title: 'The Training', text: 'Tailoring, accounting, digital basics. 67 women in this quarter alone.' },
      { title: 'The Dignity',  text: 'First income earned by 41 of them. Eleven have left abusive homes since.' },
      { title: 'The Echo',     text: '"Economic dignity. Health awareness. Real autonomy."' }
    ],
    /* 07 GLOBAL HUMAN RIGHTS */
    [
      { title: 'The Brief',    text: 'Asylum and immigration support across UK & India. Twelve active cases.' },
      { title: 'The Family',   text: 'A family from Myanmar — granted leave to remain after a 14-month battle.' },
      { title: 'The Stand',    text: '"Defending rights. Defying silence."' }
    ],
    /* 08 CROSS CONNECT LEGAL AID */
    [
      { title: 'The Case',     text: 'Immigration appeal #2026/41 — won, March 2026.' },
      { title: 'The Bridge',   text: 'From immigration to reconciliation. Legal aid spans both sides of every line.' },
      { title: 'The Promise',  text: '"We stand with you, here or there."' }
    ],
    /* 09 DREAMCATCHERS */
    [
      { title: 'The Student',  text: 'Three years of after-school tutoring. Scholarship awarded.' },
      { title: 'The Family',   text: 'Third in family to attend college. Mother walks her to the bus every day.' },
      { title: 'The Future',   text: '"From dreams to reality."' }
    ],
    /* 10 LAUNCHPAD */
    [
      { title: 'The First Day',text: 'Placement program for first-generation graduates. 38 in current cohort.' },
      { title: 'The Salary',   text: 'Average first salary: ₹22,000. Often the household\'s largest income.' },
      { title: 'The Promise',  text: '"First job. First salary. First step."' }
    ],
    /* 11 L.A.W.G.I.C. */
    [
      { title: 'The Void',     text: 'Free legal aid for daily-wage workers, manual labourers, those the system forgets.' },
      { title: 'The File',     text: '73 cases opened in 2025. 41 closed favourably. None turned away.' },
      { title: 'The Law',      text: '"Free legal aid for those the system forgets."' }
    ]
  ];

  var CHAPTERS = [
    { num: '01', text: 'The Beginning — there is a river' },
    { num: '02', text: 'The Choice — change is not observed, it is chosen' },
    { num: '03', text: 'The Journeys — eleven shores ahead' },
    { num: '04', text: 'The Realisation — these are people, not statistics' },
    { num: '05', text: 'The Turning Point — the boat moves because of people' },
    { num: '06', text: 'The Decision — two paths appear' },
    { num: '07', text: 'The Ending — which is the beginning' }
  ];

  var BEACH_PEOPLE = [
    { name: 'AARTI',   color: 0xe85d6b, quote: '"My grandmother taught girls to read in this village. I want to keep teaching."' },
    { name: 'KIRAN',   color: 0x1a365d, quote: '"I lost my brother to a road accident. I sign donor cards now."' },
    { name: 'MEERA',   color: 0xf4a23a, quote: '"I run a small co-op. Eleven women have left abusive homes because of it."' },
    { name: 'RAVI',    color: 0x6ed089, quote: '"I clean the lake every Sunday. People used to laugh. They don\'t anymore."' },
    { name: 'PRIYA',   color: 0xa886ff, quote: '"My amma never went to court. I went, and I won. For her."' },
    { name: 'TEJAS',   color: 0x6ab8c9, quote: '"I built a school chatbot in Telugu. It answers in three languages now."' }
  ];

  /* ---------- DOM REFS ---------- */
  var canvas        = document.getElementById('sm3-canvas');
  var loadingEl     = document.getElementById('sm3-loading');
  var loadingFill   = document.getElementById('sm3-loading-fill');
  var introEl       = document.getElementById('sm3-intro');
  var introGoBtn    = document.getElementById('sm3-intro-go');
  var visitedEl     = document.getElementById('sm3-visited');
  var chapterEl     = document.getElementById('sm3-chapter');
  var chapterNumEl  = chapterEl.querySelector('.sm3-chapter-num');
  var chapterTextEl = chapterEl.querySelector('.sm3-chapter-text');
  var compassEl     = document.getElementById('sm3-compass');
  var compassNeedle = document.getElementById('sm3-compass-needle');
  var compassLbl    = document.getElementById('sm3-compass-lbl');
  var disembarkEl   = document.getElementById('sm3-disembark');
  var disembarkName = document.getElementById('sm3-disembark-name');
  var disembarkAct  = document.getElementById('sm3-disembark-action');
  var loreEl        = document.getElementById('sm3-lore');
  var loreEyebrow   = document.getElementById('sm3-lore-eyebrow');
  var loreTitleEl   = document.getElementById('sm3-lore-title');
  var loreTextEl    = document.getElementById('sm3-lore-text');
  var loreProgress  = document.getElementById('sm3-lore-progress');
  var loreClose     = document.getElementById('sm3-lore-close');
  var shorePanel    = document.getElementById('sm3-shore-panel');
  var shoreNumEl    = document.getElementById('sm3-shore-num');
  var shoreTagEl    = document.getElementById('sm3-shore-tag');
  var shoreTitleEl  = document.getElementById('sm3-shore-title');
  var shoreTextEl   = document.getElementById('sm3-shore-text');
  var shoreLinkEl   = document.getElementById('sm3-shore-link');
  var shoreCloseBtn = document.getElementById('sm3-shore-close');
  var decisionEl    = document.getElementById('sm3-decision');
  var decisionClose = document.getElementById('sm3-decision-close');
  var sponsorChoice = document.getElementById('sm3-sponsor');
  var endingEl      = document.getElementById('sm3-ending');
  var touchBtns     = document.querySelectorAll('.sm3-touch-btn');

  if (!canvas) return;

  /* ---------- SCENE & RENDERER ---------- */
  var scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x6b9bc4, 90, 460);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  if (renderer.outputColorSpace !== undefined) renderer.outputColorSpace = THREE.SRGBColorSpace;
  if (THREE.ACESFilmicToneMapping !== undefined) renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  var camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.5, 2000);
  camera.position.set(0, 14, 28);

  var sunLight = new THREE.DirectionalLight(0xffe0b3, 1.65);
  sunLight.position.set(120, 140, 60);
  scene.add(sunLight);
  var rimLight = new THREE.DirectionalLight(0x88aaff, 0.35);
  rimLight.position.set(-100, 60, -120);
  scene.add(rimLight);
  scene.add(new THREE.AmbientLight(0x6688aa, 0.42));
  scene.add(new THREE.HemisphereLight(0xfff1d6, 0x14304f, 0.55));

  var skyMat = new THREE.ShaderMaterial({
    uniforms: {
      topColor:    { value: new THREE.Color(0x143058) },
      midColor:    { value: new THREE.Color(0x6ba0d8) },
      bottomColor: { value: new THREE.Color(0xfdd9a7) }
    },
    vertexShader: 'varying vec3 vWp; void main(){ vec4 wp = modelMatrix * vec4(position,1.0); vWp = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }',
    fragmentShader: 'uniform vec3 topColor; uniform vec3 midColor; uniform vec3 bottomColor; varying vec3 vWp; void main(){ float h = normalize(vWp).y; vec3 c = mix(bottomColor, midColor, smoothstep(-0.05, 0.4, h)); c = mix(c, topColor, smoothstep(0.4, 0.92, h)); gl_FragColor = vec4(c, 1.0); }',
    side: THREE.BackSide,
    depthWrite: false
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(950, 32, 16), skyMat));

  var sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(18, 24, 16),
    new THREE.MeshBasicMaterial({ color: 0xffd58a })
  );
  sunMesh.position.set(180, 150, -240);
  scene.add(sunMesh);

  /* ---------- OCEAN ---------- */
  var WAVES = [
    { dir: new THREE.Vector2( 1.0,  0.25).normalize(), amp: 0.85, wlen: 36, speed: 0.85 },
    { dir: new THREE.Vector2(-0.6,  0.85).normalize(), amp: 0.55, wlen: 22, speed: 1.10 },
    { dir: new THREE.Vector2( 0.3, -0.95).normalize(), amp: 0.40, wlen: 14, speed: 1.45 },
    { dir: new THREE.Vector2( 0.9,  0.45).normalize(), amp: 0.28, wlen: 9.5, speed: 1.85 },
    { dir: new THREE.Vector2(-0.85, -0.5).normalize(), amp: 0.18, wlen: 6.0, speed: 2.20 },
    { dir: new THREE.Vector2( 0.55, -0.3).normalize(), amp: 0.12, wlen: 3.8, speed: 2.55 }
  ];
  function getOceanHeight(x, z, t) {
    var h = 0;
    for (var i = 0; i < WAVES.length; i++) {
      var w = WAVES[i];
      var k = (Math.PI * 2) / w.wlen;
      h += Math.cos((w.dir.x * x + w.dir.y * z) * k - t * w.speed) * w.amp;
    }
    return h;
  }
  function getOceanGradient(x, z, t) {
    var d = 0.4;
    return {
      nx: (getOceanHeight(x - d, z, t) - getOceanHeight(x + d, z, t)) / (2 * d),
      nz: (getOceanHeight(x, z - d, t) - getOceanHeight(x, z + d, t)) / (2 * d)
    };
  }

  var WATER_SIZE = 1500;
  var WATER_SEG  = 160;
  var waterGeo = new THREE.PlaneGeometry(WATER_SIZE, WATER_SIZE, WATER_SEG, WATER_SEG);
  waterGeo.rotateX(-Math.PI / 2);
  var waterMat = new THREE.MeshStandardMaterial({
    color: 0x1a4870, roughness: 0.32, metalness: 0.55,
    transparent: true, opacity: 0.95, flatShading: true,
    side: THREE.DoubleSide, envMapIntensity: 1.2
  });
  var water = new THREE.Mesh(waterGeo, waterMat);
  scene.add(water);
  var waterPositions = waterGeo.attributes.position;

  var deepGeo = new THREE.PlaneGeometry(WATER_SIZE, WATER_SIZE);
  deepGeo.rotateX(-Math.PI / 2);
  var deepWater = new THREE.Mesh(deepGeo, new THREE.MeshBasicMaterial({ color: 0x081d33 }));
  deepWater.position.y = -1.2;
  scene.add(deepWater);

  /* ---------- BEACH (starting village) ---------- */
  var beachGroup = new THREE.Group();
  scene.add(beachGroup);
  var beachBase = new THREE.Mesh(
    new THREE.CylinderGeometry(24, 28, 1.8, 36),
    new THREE.MeshStandardMaterial({ color: 0xead5a3, roughness: 0.95 })
  );
  beachBase.position.set(0, 0.4, -3);
  beachGroup.add(beachBase);
  var beachGrass = new THREE.Mesh(
    new THREE.CylinderGeometry(16, 19, 0.6, 28),
    new THREE.MeshStandardMaterial({ color: 0x7fa362, roughness: 0.92 })
  );
  beachGrass.position.set(0, 1.45, -5);
  beachGroup.add(beachGrass);

  /* Hut */
  var hut = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.2, 3), new THREE.MeshStandardMaterial({ color: 0xc7a679 }));
  hut.position.set(-6, 2.85, -8); beachGroup.add(hut);
  var hutRoof = new THREE.Mesh(new THREE.ConeGeometry(2.6, 1.6, 4), new THREE.MeshStandardMaterial({ color: 0x6b4423 }));
  hutRoof.position.set(-6, 4.7, -8); hutRoof.rotation.y = Math.PI / 4; beachGroup.add(hutRoof);

  /* Palms */
  for (var pb = 0; pb < 5; pb++) {
    var pang = (pb / 5) * Math.PI * 2 + 0.4;
    var ptx = Math.cos(pang) * 13, ptz = Math.sin(pang) * 13 - 5;
    var ptrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 3.2, 8), new THREE.MeshStandardMaterial({ color: 0x6b4423 }));
    ptrunk.position.set(ptx, 2.9, ptz); beachGroup.add(ptrunk);
    for (var pf = 0; pf < 6; pf++) {
      var pfang = (pf / 6) * Math.PI * 2;
      var pfrond = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 0.6), new THREE.MeshStandardMaterial({ color: 0x4a7a35, side: THREE.DoubleSide }));
      pfrond.position.set(ptx + Math.cos(pfang) * 1.3, 5.0, ptz + Math.sin(pfang) * 1.3);
      pfrond.rotation.y = pfang; pfrond.rotation.z = -0.4;
      beachGroup.add(pfrond);
    }
  }

  /* Dock */
  var dockMat = new THREE.MeshStandardMaterial({ color: 0x8b6a3f });
  for (var dki = 0; dki < 4; dki++) {
    var plank = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.25, 1.6), dockMat);
    plank.position.set(0, 0.85, 13 + dki * 1.7); beachGroup.add(plank);
  }

  /* People on beach */
  var people = [];
  function buildPerson(data, position) {
    var g = new THREE.Group();
    var bodyMat = new THREE.MeshStandardMaterial({ color: data.color });
    var body = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.40, 1.15, 10), bodyMat);
    body.position.y = 0.55; g.add(body);
    var head = new THREE.Mesh(new THREE.SphereGeometry(0.30, 14, 12), new THREE.MeshStandardMaterial({ color: 0xc78a5e }));
    head.position.y = 1.40; g.add(head);
    var arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.65, 6), bodyMat);
    arm.position.set(0.36, 0.95, 0); arm.rotation.z = -0.4; g.add(arm);
    g.userData.arm = arm; g.userData.data = data; g.userData.basePos = position.clone();
    g.position.copy(position);
    return g;
  }
  BEACH_PEOPLE.forEach(function (p, i) {
    var bang = (i / BEACH_PEOPLE.length) * Math.PI * 2;
    var br = 9 + Math.random() * 4;
    var bpos = new THREE.Vector3(Math.cos(bang) * br, 1.75, Math.sin(bang) * br - 5);
    var bperson = buildPerson(p, bpos);
    bperson.lookAt(0, 1.75, -5);
    beachGroup.add(bperson);
    people.push(bperson);
  });

  /* ============================================================
     SHIP — same as v3
     ============================================================ */
  function buildShip() {
    var g = new THREE.Group();
    var darkWood   = new THREE.MeshStandardMaterial({ color: 0x4a2e18, roughness: 0.88 });
    var midWood    = new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.85 });
    var lightWood  = new THREE.MeshStandardMaterial({ color: 0x9a7546 });
    var deckPlank  = new THREE.MeshStandardMaterial({ color: 0xb59365 });
    var paintedHull= new THREE.MeshStandardMaterial({ color: 0x1a365d, metalness: 0.18, roughness: 0.55 });
    var canvasMat  = new THREE.MeshStandardMaterial({ color: 0xeae0c8, side: THREE.DoubleSide });
    var sailMat    = new THREE.MeshStandardMaterial({ color: 0xf4ecdb, side: THREE.DoubleSide });
    var brassMat   = new THREE.MeshStandardMaterial({ color: 0xc59a4f, metalness: 0.85, roughness: 0.35 });
    var ropeMat    = new THREE.LineBasicMaterial({ color: 0x352010, transparent: true, opacity: 0.9 });

    var hullShape = new THREE.Shape();
    hullShape.moveTo(-6.5, 0);
    hullShape.bezierCurveTo(-7.2, 0.2, -7.2, 1.6, -6.0, 2.0);
    hullShape.lineTo(6.0, 2.0);
    hullShape.bezierCurveTo(7.5, 2.0, 7.8, 1.0, 7.0, 0.0);
    hullShape.bezierCurveTo(5.0, -0.4, -4.0, -0.4, -6.5, 0);
    var hullExtrude = { depth: 4.2, bevelEnabled: true, bevelThickness: 0.25, bevelSize: 0.22, bevelSegments: 4, curveSegments: 14 };
    var hullGeo = new THREE.ExtrudeGeometry(hullShape, hullExtrude); hullGeo.center();
    var hullLower = new THREE.Mesh(hullGeo, darkWood); hullLower.position.y = 0.6; g.add(hullLower);

    var upperShape = new THREE.Shape();
    upperShape.moveTo(-6.0, 0);
    upperShape.lineTo(-5.5, 1.2); upperShape.lineTo(6.5, 1.2);
    upperShape.bezierCurveTo(7.2, 1.0, 7.2, 0.2, 6.2, 0);
    upperShape.lineTo(-6.0, 0);
    var upperGeo = new THREE.ExtrudeGeometry(upperShape, { depth: 3.6, bevelEnabled: true, bevelThickness: 0.15, bevelSize: 0.12, bevelSegments: 3, curveSegments: 10 });
    upperGeo.center();
    var upperHull = new THREE.Mesh(upperGeo, paintedHull); upperHull.position.y = 2.0; g.add(upperHull);

    var deck = new THREE.Mesh(new THREE.BoxGeometry(13.5, 0.18, 3.6), deckPlank); deck.position.y = 3.0; g.add(deck);
    for (var pl = 0; pl < 6; pl++) {
      var seam = new THREE.Mesh(new THREE.BoxGeometry(13.0, 0.02, 0.04), darkWood);
      seam.position.set(0, 3.10, -1.5 + pl * 0.6); g.add(seam);
    }
    /* Helper: create mesh, set position, return — Three.js position is read-only Vector3 */
    function placed(geo, mat, x, y, z) {
      var m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      return m;
    }
    [-1.85, 1.85].forEach(function (zSign) {
      g.add(placed(new THREE.BoxGeometry(13.0, 0.5, 0.12), midWood, 0, 3.45, zSign));
      g.add(placed(new THREE.BoxGeometry(13.0, 0.08, 0.18), darkWood, 0, 3.74, zSign));
      for (var rb = 0; rb < 13; rb++) {
        var bx = -6.0 + rb * 1.0;
        g.add(placed(new THREE.BoxGeometry(0.08, 0.5, 0.08), midWood, bx, 3.45, zSign));
      }
    });

    var cabin = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.6, 2.6), lightWood);
    cabin.position.set(-2.5, 3.95, 0); g.add(cabin);
    g.add(placed(new THREE.BoxGeometry(3.3, 0.18, 2.9), darkWood, -2.5, 4.85, 0));
    var winMat = new THREE.MeshStandardMaterial({ color: 0xffd070, emissive: 0xffaa44, emissiveIntensity: 0.55 });
    [-1.0, 0, 1.0].forEach(function (wx) {
      g.add(placed(new THREE.BoxGeometry(0.55, 0.55, 0.05), winMat, -2.5 + wx, 4.15, 1.31));
      g.add(placed(new THREE.BoxGeometry(0.55, 0.55, 0.05), winMat, -2.5 + wx, 4.15, -1.31));
    });

    var wheel = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.06, 6, 18), midWood);
    wheel.position.set(0.7, 3.7, 0); wheel.rotation.y = Math.PI / 2; g.add(wheel);
    for (var ws = 0; ws < 8; ws++) {
      var spoke = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.05, 0.06), midWood);
      spoke.position.set(0.7, 3.7, 0); spoke.rotation.x = (ws / 8) * Math.PI; spoke.rotation.y = Math.PI / 2;
      g.add(spoke);
    }

    var mainMast = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 9.5, 10), midWood);
    mainMast.position.set(2.0, 7.0, 0); g.add(mainMast);
    var mainYard = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 5.5, 8), midWood);
    mainYard.rotation.x = Math.PI / 2; mainYard.position.set(2.0, 9.5, 0); g.add(mainYard);
    var mainSail = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 4.0, 8, 6), sailMat);
    mainSail.position.set(2.0, 7.6, 0); mainSail.rotation.y = Math.PI / 2; g.add(mainSail);
    var topSail = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 2.2, 6, 4), canvasMat);
    topSail.position.set(2.0, 10.6, 0); topSail.rotation.y = Math.PI / 2; g.add(topSail);

    var foreMast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 7.5, 10), midWood);
    foreMast.position.set(5.0, 6.15, 0); g.add(foreMast);
    var foreYard = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 4.5, 8), midWood);
    foreYard.rotation.x = Math.PI / 2; foreYard.position.set(5.0, 8.5, 0); g.add(foreYard);
    var foreSail = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 3.2, 6, 5), sailMat);
    foreSail.position.set(5.0, 6.7, 0); foreSail.rotation.y = Math.PI / 2; g.add(foreSail);

    var jibShape = new THREE.Shape();
    jibShape.moveTo(0, 0); jibShape.lineTo(3.6, 0); jibShape.lineTo(0, 3.0); jibShape.lineTo(0, 0);
    var jib = new THREE.Mesh(new THREE.ShapeGeometry(jibShape), canvasMat);
    jib.position.set(5.5, 5.5, 0); jib.rotation.y = Math.PI / 2; g.add(jib);

    var bowsprit = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 3.5, 8), midWood);
    bowsprit.position.set(8.5, 3.4, 0); bowsprit.rotation.z = -Math.PI / 2; bowsprit.rotation.y = -0.25; g.add(bowsprit);

    function rope(from, to) { g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([from, to]), ropeMat)); }
    rope(new THREE.Vector3(2.0, 11.7, 0),  new THREE.Vector3(6.5, 3.3, -1.85));
    rope(new THREE.Vector3(2.0, 11.7, 0),  new THREE.Vector3(6.5, 3.3,  1.85));
    rope(new THREE.Vector3(2.0, 11.7, 0),  new THREE.Vector3(-6.5, 3.3, -1.85));
    rope(new THREE.Vector3(2.0, 11.7, 0),  new THREE.Vector3(-6.5, 3.3,  1.85));
    rope(new THREE.Vector3(5.0, 9.85, 0),  new THREE.Vector3(2.5, 3.3, -1.85));
    rope(new THREE.Vector3(5.0, 9.85, 0),  new THREE.Vector3(2.5, 3.3,  1.85));
    rope(new THREE.Vector3(5.0, 9.85, 0),  new THREE.Vector3(10.0, 3.3, 0));

    var pennant = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.4), new THREE.MeshStandardMaterial({ color: 0xf4a23a, side: THREE.DoubleSide }));
    pennant.position.set(2.5, 11.95, 0); g.add(pennant);

    var lanternBox = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.55, 0.4), brassMat);
    lanternBox.position.set(-6.3, 4.05, 0); g.add(lanternBox);
    var lanternGlow = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffba66 }));
    lanternGlow.position.set(-6.3, 4.05, 0); g.add(lanternGlow);
    var lanternLight = new THREE.PointLight(0xffba66, 1.4, 18, 2);
    lanternLight.position.set(-6.3, 4.05, 0); g.add(lanternLight);

    g.userData.sails = [mainSail, foreSail, topSail, jib];
    g.userData.pennant = pennant; g.userData.wheel = wheel; g.userData.lanternLight = lanternLight;
    return g;
  }
  var ship = buildShip();
  ship.position.set(0, 0, 22); ship.rotation.y = Math.PI;
  scene.add(ship);

  /* WAKE TRAIL */
  var wakePool = [];
  for (var w = 0; w < 16; w++) {
    var ring = new THREE.Mesh(
      new THREE.RingGeometry(0.6, 1.1, 22),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })
    );
    ring.rotation.x = -Math.PI / 2; ring.visible = false; scene.add(ring);
    wakePool.push({ mesh: ring, life: 0, maxLife: 2.4 });
  }
  var wakeIndex = 0, wakeTimer = 0;
  function spawnWake(x, z, y) {
    var ww = wakePool[wakeIndex];
    ww.mesh.position.set(x, y + 0.05, z);
    ww.mesh.scale.set(1, 1, 1); ww.mesh.material.opacity = 0.6; ww.mesh.visible = true;
    ww.life = ww.maxLife;
    wakeIndex = (wakeIndex + 1) % 16;
  }
  function updateWakes(dt) {
    for (var i = 0; i < wakePool.length; i++) {
      var ww = wakePool[i];
      if (ww.life <= 0) continue;
      ww.life -= dt;
      var k = ww.life / ww.maxLife;
      var s = 1 + (1 - k) * 5;
      ww.mesh.scale.set(s, s, s); ww.mesh.material.opacity = k * 0.6;
      if (ww.life <= 0) ww.mesh.visible = false;
    }
  }

  /* ============================================================
     FISH JUMPS — small silvery fish that leap out of waves,
     arc through the air, flip mid-jump, and splash back down.
     ============================================================ */
  var FISH_COUNT = 8;
  var fishPool = [];
  var splashPool = [];
  var SPLASH_COUNT = 12;

  function buildFish() {
    var g = new THREE.Group();
    /* Bright emissive material so fish read as silvery flashes against the dark water */
    var bodyMat = new THREE.MeshStandardMaterial({ color: 0xb8e0eb, metalness: 0.7, roughness: 0.2, emissive: 0x6ab8c9, emissiveIntensity: 0.4 });
    var bellyMat= new THREE.MeshStandardMaterial({ color: 0xfff5d8, roughness: 0.4, emissive: 0xddc88a, emissiveIntensity: 0.25 });
    /* ~3x bigger so visible at 30+ unit camera distance */
    var body = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 1), bodyMat);
    body.scale.set(1.7, 0.85, 0.65);
    g.add(body);
    /* Belly */
    var belly = new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, 1), bellyMat);
    belly.scale.set(1.55, 0.5, 0.55);
    belly.position.y = -0.18;
    g.add(belly);
    /* Tail fin */
    var tail = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.85, 4), bodyMat);
    tail.rotation.z = Math.PI / 2;
    tail.scale.set(1, 1, 0.4);
    tail.position.set(-1.1, 0, 0);
    g.add(tail);
    /* Top dorsal fin */
    var fin = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.55, 3), bodyMat);
    fin.position.set(0.15, 0.55, 0);
    fin.rotation.z = -0.2;
    g.add(fin);
    /* Eyes */
    var eye = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), new THREE.MeshBasicMaterial({ color: 0x0a0a0a }));
    eye.position.set(0.66, 0.22, 0.36);
    g.add(eye);
    var eye2 = eye.clone();
    eye2.position.z = -0.36;
    g.add(eye2);
    g.visible = false;
    return g;
  }

  for (var fi = 0; fi < FISH_COUNT; fi++) {
    var f = buildFish();
    scene.add(f);
    fishPool.push({ mesh: f, vy: 0, vx: 0, vz: 0, spin: 0, active: false, baseY: 0 });
  }

  /* Splash rings — separate from boat wake; appear when a fish breaks surface */
  for (var si = 0; si < SPLASH_COUNT; si++) {
    var ring = new THREE.Mesh(
      new THREE.RingGeometry(0.2, 0.5, 18),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.visible = false;
    scene.add(ring);
    splashPool.push({ mesh: ring, life: 0, maxLife: 1.2 });
  }
  var splashIndex = 0;
  function spawnSplash(x, z, y) {
    var s = splashPool[splashIndex];
    s.mesh.position.set(x, y + 0.05, z);
    s.mesh.scale.set(1, 1, 1);
    s.mesh.material.opacity = 0.85;
    s.mesh.visible = true;
    s.life = s.maxLife;
    splashIndex = (splashIndex + 1) % SPLASH_COUNT;
  }
  function updateSplashes(dt) {
    for (var i = 0; i < splashPool.length; i++) {
      var s = splashPool[i];
      if (s.life <= 0) continue;
      s.life -= dt;
      var k = s.life / s.maxLife;
      var sc = 1 + (1 - k) * 6;
      s.mesh.scale.set(sc, sc, sc);
      s.mesh.material.opacity = k * 0.85;
      if (s.life <= 0) s.mesh.visible = false;
    }
  }

  function getReferencePos() {
    return (MODE === 'sailing')
      ? { x: ship.position.x, z: ship.position.z }
      : { x: avatarPos.x, z: avatarPos.z };
  }

  function spawnFishJump(time) {
    /* Find an idle fish */
    var slot = null;
    for (var i = 0; i < fishPool.length; i++) {
      if (!fishPool[i].active) { slot = fishPool[i]; break; }
    }
    if (!slot) return;
    /* Position: random direction, 18-50 units from reference, but not on land */
    var ref = getReferencePos();
    var tries = 0, x = ref.x + 30, z = ref.z + 30, ok = false;
    while (tries < 12 && !ok) {
      var ang = Math.random() * Math.PI * 2;
      var dist = 18 + Math.random() * 32;
      x = ref.x + Math.cos(ang) * dist;
      z = ref.z + Math.sin(ang) * dist;
      ok = true;
      /* Reject if too close to any island */
      for (var si2 = 0; si2 < shoreObjs.length; si2++) {
        var dx = x - shoreObjs[si2].x;
        var dz = z - shoreObjs[si2].z;
        if (dx * dx + dz * dz < (ISLAND_RADIUS + 4) * (ISLAND_RADIUS + 4)) { ok = false; break; }
      }
      /* Reject if too close to spawn beach (smaller exclusion) */
      if (ok && (x * x + (z + 5) * (z + 5)) < 18 * 18) ok = false;
      tries++;
    }
    /* If no perfectly clear spot found, spawn anyway at last attempted position
       — better to show a fish overlapping a shore at distance than no fish at all */
    var waveH = getOceanHeight(x, z, time);
    slot.mesh.position.set(x, waveH - 0.2, z);
    slot.mesh.rotation.set(0, Math.random() * Math.PI * 2, 0);
    /* Bigger arc — initial vy 2.8 to 4.6 means ~5-9 units of air time above water */
    slot.vy = 2.8 + Math.random() * 1.8;
    slot.vx = (Math.random() - 0.5) * 0.6;
    slot.vz = (Math.random() - 0.5) * 0.6;
    slot.spin = 4 + Math.random() * 4;
    slot.baseY = waveH;
    slot.active = true;
    slot.mesh.visible = true;
  }

  var fishGravity = 4.2;
  var fishSpawnTimer = 0.6;   /* first fish appears within ~0.6s — instant feedback */
  function updateFish(t, dt) {
    /* Spawn cadence — random interval between 1.4s and 3.6s */
    fishSpawnTimer -= dt;
    if (fishSpawnTimer <= 0) {
      spawnFishJump(t);
      fishSpawnTimer = 1.4 + Math.random() * 2.2;
    }
    /* Update each active fish */
    for (var i = 0; i < fishPool.length; i++) {
      var f = fishPool[i];
      if (!f.active) continue;
      f.vy -= fishGravity * dt;
      f.mesh.position.x += f.vx * dt * 6;
      f.mesh.position.y += f.vy * dt * 6;
      f.mesh.position.z += f.vz * dt * 6;
      /* Spin (flipping mid-air) */
      f.mesh.rotation.x += f.spin * dt;
      /* Subtle wobble */
      f.mesh.rotation.z = Math.sin(t * 12 + i) * 0.18;
      /* Check splashdown — when descending and hits current wave height */
      var waveH = getOceanHeight(f.mesh.position.x, f.mesh.position.z, t);
      if (f.vy < 0 && f.mesh.position.y < waveH) {
        spawnSplash(f.mesh.position.x, f.mesh.position.z, waveH);
        f.mesh.visible = false;
        f.active = false;
      }
    }
  }

  /* ============================================================
     11 ISLANDS — much bigger (radius 25), walkable plateau,
     3 lore pillars per island
     ============================================================ */
  var ISLAND_RADIUS = 25;
  var PLATEAU_RADIUS = 22;       /* walkable area */
  var PILLAR_RING_RADIUS = 11;   /* where the 3 lore pillars sit */

  /* Renders a name + number label as a 2D canvas, wraps it in a Three.js sprite
     so it auto-billboards (always faces camera) and stays readable from any angle. */
  function makeIslandLabel(num, name, colorInt) {
    var canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 384;
    var ctx = canvas.getContext('2d');
    var hex = '#' + colorInt.toString(16).padStart(6, '0');

    /* Rounded-rect background */
    function roundRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }
    /* Pill background */
    ctx.fillStyle = 'rgba(5, 13, 29, 0.88)';
    roundRect(20, 20, 984, 344, 60);
    ctx.fill();
    /* Border in program color */
    ctx.strokeStyle = hex;
    ctx.lineWidth = 8;
    ctx.stroke();

    /* Glow under the number */
    ctx.shadowColor = hex;
    ctx.shadowBlur = 30;
    ctx.fillStyle = hex;
    ctx.font = 'bold 180px Geist, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(num, 512, 140);
    ctx.shadowBlur = 0;

    /* Divider line */
    ctx.fillStyle = hex;
    ctx.fillRect(412, 240, 200, 4);

    /* Name */
    ctx.fillStyle = '#f4ecdb';
    ctx.font = 'bold 56px "Geist Mono", ui-monospace, monospace';
    var label = name.toUpperCase();
    /* Auto-shrink long names to fit */
    var maxW = 920;
    while (ctx.measureText(label).width > maxW && parseInt(ctx.font, 10) > 28) {
      var size = parseInt(ctx.font, 10) - 4;
      ctx.font = 'bold ' + size + 'px "Geist Mono", ui-monospace, monospace';
    }
    ctx.fillText(label, 512, 305);

    var texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    if (THREE.SRGBColorSpace !== undefined) texture.colorSpace = THREE.SRGBColorSpace;
    var material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });
    var sprite = new THREE.Sprite(material);
    /* Sprite world-space size — readable from sea distance */
    sprite.scale.set(11, 4.1, 1);
    /* Render on top so it isn't occluded by waves at angle */
    sprite.renderOrder = 999;
    return sprite;
  }

  var shoreObjs = [];
  function buildIslands() {
    SHORE_DATA.forEach(function (data, i) {
      var angle = (i / SHORE_DATA.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.18;
      var dist = 110 + Math.random() * 50;
      var x = Math.cos(angle) * dist;
      var z = Math.sin(angle) * dist;

      var group = new THREE.Group();
      group.position.set(x, 0, z);

      /* Sandy beach ring */
      var sand = new THREE.Mesh(
        new THREE.CylinderGeometry(ISLAND_RADIUS + 2, ISLAND_RADIUS + 4, 0.6, 32),
        new THREE.MeshStandardMaterial({ color: 0xe6cf95, roughness: 0.95 })
      );
      sand.position.y = 0.1; group.add(sand);

      /* Grass plateau (walkable) */
      var plateau = new THREE.Mesh(
        new THREE.CylinderGeometry(PLATEAU_RADIUS, ISLAND_RADIUS, 1.2, 32),
        new THREE.MeshStandardMaterial({ color: 0x6f9a52, roughness: 0.92 })
      );
      plateau.position.y = 0.95; group.add(plateau);

      /* Rocky outcrops scattered on plateau */
      for (var rk = 0; rk < 5; rk++) {
        var rang = (rk / 5) * Math.PI * 2 + Math.random();
        var rrad = 8 + Math.random() * 10;
        var rx = Math.cos(rang) * rrad;
        var rz = Math.sin(rang) * rrad;
        var rock = new THREE.Mesh(
          new THREE.IcosahedronGeometry(1.2 + Math.random() * 1.4, 0),
          new THREE.MeshStandardMaterial({ color: 0x6f7e58, flatShading: true })
        );
        rock.position.set(rx, 1.6 + Math.random() * 0.6, rz);
        rock.scale.set(1, 0.6, 1);
        rock.rotation.set(Math.random(), Math.random() * Math.PI, Math.random());
        group.add(rock);
      }

      /* Trees scattered around the perimeter */
      for (var tr = 0; tr < 10; tr++) {
        var tang = (tr / 10) * Math.PI * 2 + Math.random() * 0.3;
        var trad = 14 + Math.random() * 7;
        var tx = Math.cos(tang) * trad;
        var tz = Math.sin(tang) * trad;
        var trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 1.8, 6), new THREE.MeshStandardMaterial({ color: 0x6b4423 }));
        trunk.position.set(tx, 2.45, tz); group.add(trunk);
        var foliage = new THREE.Mesh(new THREE.IcosahedronGeometry(1.4 + Math.random() * 0.4, 0), new THREE.MeshStandardMaterial({ color: 0x4f7d3a, flatShading: true }));
        foliage.position.set(tx, 4.2, tz); foliage.scale.y = 1.3;
        group.add(foliage);
      }

      /* Top-of-island marker (still visible from sea) */
      var marker = new THREE.Mesh(
        new THREE.SphereGeometry(1.4, 22, 18),
        new THREE.MeshBasicMaterial({ color: data.color, transparent: true, opacity: 0.95 })
      );
      marker.position.y = 12; marker.userData.baseY = 12; marker.userData.shoreIndex = i;
      group.add(marker);
      var halo = new THREE.Mesh(
        new THREE.TorusGeometry(3.0, 0.10, 8, 36),
        new THREE.MeshBasicMaterial({ color: data.color, transparent: true, opacity: 0.7 })
      );
      halo.position.y = 12; halo.rotation.x = Math.PI / 2; group.add(halo);
      var beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 1.6, 18, 12, 1, true),
        new THREE.MeshBasicMaterial({ color: data.color, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false })
      );
      beam.position.y = 18; group.add(beam);
      var markerLight = new THREE.PointLight(data.color, 0.8, 22, 2);
      markerLight.position.y = 12; group.add(markerLight);

      /* Name + number label — sprite floating above the marker */
      var label = makeIslandLabel(data.num, data.title, data.color);
      label.position.y = 18;
      group.add(label);

      /* THREE LORE PILLARS — equilateral triangle around plateau center */
      var pillars = [];
      for (var lp = 0; lp < 3; lp++) {
        var pang = (lp / 3) * Math.PI * 2;
        var px = Math.cos(pang) * PILLAR_RING_RADIUS;
        var pz = Math.sin(pang) * PILLAR_RING_RADIUS;

        var pillarGroup = new THREE.Group();
        pillarGroup.position.set(px, 0, pz);

        /* Stone base */
        var stone = new THREE.Mesh(
          new THREE.CylinderGeometry(0.9, 1.2, 0.5, 12),
          new THREE.MeshStandardMaterial({ color: 0x8a8474, roughness: 0.9 })
        );
        stone.position.y = 1.85;
        pillarGroup.add(stone);

        /* Vertical column */
        var column = new THREE.Mesh(
          new THREE.CylinderGeometry(0.35, 0.4, 3.4, 10),
          new THREE.MeshStandardMaterial({ color: 0xc4b08a, roughness: 0.8, emissive: data.color, emissiveIntensity: 0.18 })
        );
        column.position.y = 3.8;
        pillarGroup.add(column);

        /* Glowing orb on top */
        var orb = new THREE.Mesh(
          new THREE.SphereGeometry(0.4, 18, 14),
          new THREE.MeshBasicMaterial({ color: data.color, transparent: true, opacity: 0.95 })
        );
        orb.position.y = 5.7;
        orb.userData.baseY = 5.7;
        pillarGroup.add(orb);

        /* Halo ring around orb */
        var orbHalo = new THREE.Mesh(
          new THREE.TorusGeometry(0.85, 0.04, 6, 24),
          new THREE.MeshBasicMaterial({ color: data.color, transparent: true, opacity: 0.65 })
        );
        orbHalo.position.y = 5.7; orbHalo.rotation.x = Math.PI / 2;
        pillarGroup.add(orbHalo);

        /* Light from the orb */
        var orbLight = new THREE.PointLight(data.color, 1.0, 8, 2);
        orbLight.position.y = 5.7;
        pillarGroup.add(orbLight);

        group.add(pillarGroup);
        pillars.push({
          group: pillarGroup, orb: orb, halo: orbHalo, column: column, light: orbLight,
          x: x + px, z: z + pz,                /* world coords for proximity check */
          localX: px, localZ: pz,
          loreIndex: lp,
          visited: false
        });
      }

      scene.add(group);
      shoreObjs.push({
        data: data, group: group, marker: marker, halo: halo, beam: beam, light: markerLight,
        x: x, z: z, visited: false, index: i, pillars: pillars
      });
    });
  }
  buildIslands();

  /* ============================================================
     AVATAR — proportional humanoid for walk mode
     - Hierarchical groups: each limb pivots at the joint, not its center
     - Articulated shoulders + elbows for arms, hips + knees for legs
     - Head with hair + eyes; neck; chest; pelvis; hands; feet
     - Local origin sits at the FEET (y=0) so positioning is intuitive
     ============================================================ */
  function buildAvatar() {
    var g = new THREE.Group();

    var skinMat   = new THREE.MeshStandardMaterial({ color: 0xc78a5e, roughness: 0.7 });
    var hairMat   = new THREE.MeshStandardMaterial({ color: 0x2a1a0a, roughness: 0.95 });
    var shirtMat  = new THREE.MeshStandardMaterial({ color: 0x1a365d, roughness: 0.7 });
    var pantsMat  = new THREE.MeshStandardMaterial({ color: 0x3a2410, roughness: 0.85 });
    var shoeMat   = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.55 });
    var eyeMat    = new THREE.MeshBasicMaterial({ color: 0x101010 });

    /* HEAD GROUP — pivot at base of skull */
    var headGroup = new THREE.Group();
    headGroup.position.y = 2.85;
    var head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 16), skinMat);
    head.scale.set(1, 1.08, 0.95);
    headGroup.add(head);
    /* Hair — half-sphere cap */
    var hair = new THREE.Mesh(new THREE.SphereGeometry(0.30, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.55), hairMat);
    hair.position.y = 0.04;
    headGroup.add(hair);
    /* Eyes */
    var eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeMat);
    eyeL.position.set(-0.10, 0.04, 0.24);
    var eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeMat);
    eyeR.position.set(0.10, 0.04, 0.24);
    headGroup.add(eyeL); headGroup.add(eyeR);
    /* Nose hint — small wedge */
    var nose = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.08, 4), skinMat);
    nose.rotation.x = Math.PI / 2; nose.position.set(0, -0.02, 0.27);
    headGroup.add(nose);
    g.add(headGroup);

    /* NECK */
    var neck = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.13, 0.20, 10), skinMat);
    neck.position.y = 2.55;
    g.add(neck);

    /* CHEST */
    var chest = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.40, 0.95, 14), shirtMat);
    chest.position.y = 1.95;
    g.add(chest);
    /* Collar — thin band at the top of the chest */
    var collar = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.04, 6, 18), new THREE.MeshStandardMaterial({ color: 0x122545, roughness: 0.7 }));
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 2.40;
    g.add(collar);

    /* PELVIS / HIPS */
    var pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.40, 0.36, 0.50, 14), pantsMat);
    pelvis.position.y = 1.20;
    g.add(pelvis);
    /* Belt — thin disc */
    var belt = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.04, 6, 22), new THREE.MeshStandardMaterial({ color: 0x1a1206, roughness: 0.65 }));
    belt.rotation.x = Math.PI / 2;
    belt.position.y = 1.45;
    g.add(belt);

    /* ARMS — shoulder group pivots, upper arm hangs down, elbow group pivots */
    function buildArm(sx) {
      var shoulder = new THREE.Group();
      shoulder.position.set(sx, 2.40, 0);

      var upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.09, 0.55, 8), shirtMat);
      upperArm.position.y = -0.275;   /* hangs down from shoulder */
      shoulder.add(upperArm);

      var elbow = new THREE.Group();
      elbow.position.y = -0.55;
      var forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.50, 8), skinMat);
      forearm.position.y = -0.25;
      elbow.add(forearm);
      var hand = new THREE.Mesh(new THREE.SphereGeometry(0.10, 12, 10), skinMat);
      hand.position.y = -0.55;
      hand.scale.set(1, 1.2, 0.65);
      elbow.add(hand);

      elbow.rotation.x = 0.18;        /* slight natural bend */
      shoulder.add(elbow);
      return { shoulder: shoulder, elbow: elbow };
    }
    var armL = buildArm(0.45);
    var armR = buildArm(-0.45);
    g.add(armL.shoulder); g.add(armR.shoulder);

    /* LEGS — hip group pivots, knee group pivots */
    function buildLeg(sx) {
      var hip = new THREE.Group();
      hip.position.set(sx, 1.10, 0);

      var thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.12, 0.55, 10), pantsMat);
      thigh.position.y = -0.275;
      hip.add(thigh);

      var knee = new THREE.Group();
      knee.position.y = -0.55;
      var calf = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.10, 0.50, 10), pantsMat);
      calf.position.y = -0.25;
      knee.add(calf);
      var foot = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.10, 0.32), shoeMat);
      foot.position.set(0, -0.55, 0.07);
      knee.add(foot);

      hip.add(knee);
      return { hip: hip, knee: knee };
    }
    var legL = buildLeg(0.18);
    var legR = buildLeg(-0.18);
    g.add(legL.hip); g.add(legR.hip);

    g.userData.headGroup = headGroup;
    g.userData.armL = armL.shoulder; g.userData.elbowL = armL.elbow;
    g.userData.armR = armR.shoulder; g.userData.elbowR = armR.elbow;
    g.userData.legL = legL.hip;       g.userData.kneeL  = legL.knee;
    g.userData.legR = legR.hip;       g.userData.kneeR  = legR.knee;

    g.visible = false;
    return g;
  }
  var avatar = buildAvatar();
  scene.add(avatar);

  /* ============================================================
     MODE STATE
     ============================================================ */
  var MODE = 'sailing';        /* or 'walking' */
  var currentIsland = null;
  var avatarHeading = 0;
  var avatarPos = new THREE.Vector3(0, 1.6, 0);

  function enterWalkMode(island) {
    if (MODE === 'walking') return;
    MODE = 'walking';
    currentIsland = island;
    /* Place avatar at island edge (south side, where ship is) */
    var dx = ship.position.x - island.x;
    var dz = ship.position.z - island.z;
    var landingDir = Math.atan2(dx, dz);
    avatarPos.set(
      island.x + Math.sin(landingDir) * (PLATEAU_RADIUS - 1.5),
      1.55,
      island.z + Math.cos(landingDir) * (PLATEAU_RADIUS - 1.5)
    );
    avatarHeading = landingDir + Math.PI;   /* face inward */
    avatar.position.copy(avatarPos);
    avatar.rotation.y = avatarHeading;
    avatar.visible = true;
    /* Hide ship visually, freeze it at landing position */
    ship.visible = true;  /* keep visible — we'll see it offshore */
    /* Hide disembark prompt */
    disembarkEl.hidden = true;
    /* Update help/chapter */
    setChapter(3);
  }

  function exitWalkMode() {
    if (MODE === 'sailing') return;
    /* Mark island as visited if any pillars were touched, otherwise still mark */
    if (currentIsland && !currentIsland.visited) {
      currentIsland.visited = true;
      visitedEl.textContent = countVisited();
      currentIsland.marker.material.opacity = 0.4;
      currentIsland.halo.material.opacity = 0.3;
      currentIsland.beam.material.opacity = 0.06;
      currentIsland.light.intensity = 0.15;
    }
    MODE = 'sailing';
    avatar.visible = false;
    /* Reposition ship just off the south edge of the island, facing away */
    var dx = ship.position.x - currentIsland.x;
    var dz = ship.position.z - currentIsland.z;
    var dist = Math.sqrt(dx*dx + dz*dz);
    if (dist < ISLAND_RADIUS + 8) {
      var n = ISLAND_RADIUS + 10;
      ship.position.x = currentIsland.x + (dx / dist) * n;
      ship.position.z = currentIsland.z + (dz / dist) * n;
    }
    velocity = 0;
    currentIsland = null;
    /* Check decision/ending milestones */
    var v = countVisited();
    if (v >= 6 && !decisionShown) showDecision();
    if (v >= 11 && !endingShown) showEnding();
    setChapter(4);
  }

  /* ============================================================
     INPUT
     ============================================================ */
  var keys = {};
  function setKey(k, v) { keys[k.toLowerCase()] = v; }

  function tryInteract() {
    /* Order: dismiss panels first, then context */
    if (introEl && !introEl.classList.contains('is-gone')) { hideIntro(); return; }
    if (lorePanelOpen) { closeLorePanel(); return; }
    if (panelOpen) { closeShorePanel(); return; }
    if (decisionShown && !decisionEl.hidden && !endingShown) { hideDecision(); return; }
  }

  function tryToggleMode() {
    if (MODE === 'sailing') {
      var nearby = getNearbyIsland();
      if (nearby) enterWalkMode(nearby);
    } else {
      /* Walking: only allow re-board if near the island edge */
      var dx = avatarPos.x - currentIsland.x;
      var dz = avatarPos.z - currentIsland.z;
      var distFromCenter = Math.sqrt(dx * dx + dz * dz);
      if (distFromCenter > PLATEAU_RADIUS - 3) exitWalkMode();
    }
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { window.location.href = 'index.html'; return; }
    var k = e.key.toLowerCase();
    if (k === 'r' || k === 'e') { e.preventDefault(); tryInteract(); return; }
    if (k === 'g') { e.preventDefault(); tryToggleMode(); return; }
    setKey(e.key, true);
  });
  document.addEventListener('keyup', function (e) { setKey(e.key, false); });

  if (introGoBtn) introGoBtn.addEventListener('click', function () { hideIntro(); });
  if (shoreCloseBtn) shoreCloseBtn.addEventListener('click', function () { closeShorePanel(); });
  if (decisionClose) decisionClose.addEventListener('click', function () { hideDecision(); });
  if (loreClose) loreClose.addEventListener('click', function () { closeLorePanel(); });

  touchBtns.forEach(function (b) {
    var k = b.getAttribute('data-key');
    var press = function (ev) { ev.preventDefault(); setKey(k, true); if (introEl && !introEl.classList.contains('is-gone')) hideIntro(); };
    var release = function (ev) { ev.preventDefault(); setKey(k, false); };
    b.addEventListener('touchstart', press, { passive: false });
    b.addEventListener('touchend', release, { passive: false });
    b.addEventListener('touchcancel', release, { passive: false });
    b.addEventListener('mousedown', press);
    b.addEventListener('mouseup', release);
    b.addEventListener('mouseleave', release);
  });

  var lookOffset = 0;
  var isDragging = false, dragStartX = 0;
  canvas.addEventListener('pointerdown', function (e) { isDragging = true; dragStartX = e.clientX; });
  window.addEventListener('pointerup', function () { isDragging = false; });
  window.addEventListener('pointermove', function (e) {
    if (!isDragging) return;
    var dx = e.clientX - dragStartX;
    lookOffset += dx * 0.0015;
    dragStartX = e.clientX;
    if (lookOffset > 0.6) lookOffset = 0.6;
    if (lookOffset < -0.6) lookOffset = -0.6;
  });

  /* Beach-people speech bubble (sail mode only) */
  var raycaster = new THREE.Raycaster();
  var pointer = new THREE.Vector2();
  var bubbleEl = document.createElement('div');
  bubbleEl.style.cssText = 'position:fixed;pointer-events:auto;z-index:19;background:rgba(244,236,219,.95);color:#0a1830;font-family:var(--font-serif,Georgia);font-style:italic;font-size:14px;line-height:1.45;padding:14px 18px;border-radius:12px;max-width:260px;transform:translate(-50%,-130%);opacity:0;transition:opacity .25s ease;box-shadow:0 12px 36px rgba(0,0,0,.4);';
  document.body.appendChild(bubbleEl);
  var bubbleHideTimer = null;
  function showBubble(x, y, html) {
    bubbleEl.innerHTML = html;
    bubbleEl.style.left = x + 'px';
    bubbleEl.style.top = y + 'px';
    bubbleEl.style.opacity = '1';
    if (bubbleHideTimer) clearTimeout(bubbleHideTimer);
    bubbleHideTimer = setTimeout(function () { bubbleEl.style.opacity = '0'; }, 5000);
  }
  canvas.addEventListener('click', function (e) {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    var personMeshes = [];
    people.forEach(function (p) { p.children.forEach(function (c) { personMeshes.push(c); }); });
    var personHits = raycaster.intersectObjects(personMeshes, false);
    if (personHits.length > 0) {
      var hitObj = personHits[0].object;
      while (hitObj && !hitObj.userData.data) hitObj = hitObj.parent;
      if (hitObj && hitObj.userData.data) {
        showBubble(e.clientX, e.clientY, '<strong>' + hitObj.userData.data.name + '</strong><br/>' + hitObj.userData.data.quote);
      }
    }
  });

  /* ---------- SHIP MOVEMENT ---------- */
  var velocity = 0;
  var heading = Math.PI;
  var maxSpeed = 0.5, accel = 0.013, friction = 0.965, turnSpeed = 0.018;
  function isPressed(name) {
    if (name === 'forward') return keys['w'] || keys['arrowup'];
    if (name === 'back') return keys['s'] || keys['arrowdown'];
    if (name === 'left') return keys['a'] || keys['arrowleft'];
    if (name === 'right') return keys['d'] || keys['arrowright'];
    return false;
  }

  /* ---------- INTRO / CHAPTER ---------- */
  function hideIntro() {
    if (!introEl || introEl.classList.contains('is-gone')) return;
    introEl.classList.add('is-gone');
    setTimeout(function () { compassEl.classList.add('is-visible'); chapterEl.classList.add('is-visible'); }, 200);
    setChapter(2);
  }
  function setChapter(n) {
    var c = CHAPTERS[n - 1];
    if (!c || !chapterNumEl) return;
    chapterNumEl.textContent = c.num;
    chapterTextEl.textContent = c.text;
  }
  setChapter(1);

  /* ---------- PANELS ---------- */
  var panelOpen = false;
  function openShorePanel(s) {
    shoreNumEl.textContent = s.data.num;
    shoreTagEl.textContent = s.data.tag;
    shoreTitleEl.textContent = s.data.title;
    shoreTextEl.textContent = s.data.text;
    shoreLinkEl.href = s.data.link;
    shorePanel.hidden = false;
    requestAnimationFrame(function () { shorePanel.classList.add('is-visible'); });
    panelOpen = true;
  }
  function closeShorePanel() {
    if (!panelOpen) return;
    shorePanel.classList.remove('is-visible');
    setTimeout(function () { shorePanel.hidden = true; }, 500);
    panelOpen = false;
  }

  var lorePanelOpen = false;
  function openLorePanel(island, pillarIdx) {
    var lore = SHORE_LORE[island.index][pillarIdx];
    loreEyebrow.textContent = 'PILLAR ' + (pillarIdx + 1).toString().padStart(2, '0') + ' · ' + island.data.title.toUpperCase();
    loreTitleEl.textContent = lore.title;
    loreTextEl.textContent = lore.text;
    var visitedCount = island.pillars.filter(function (p) { return p.visited; }).length;
    loreProgress.textContent = visitedCount + ' of 3';
    loreEl.hidden = false;
    requestAnimationFrame(function () { loreEl.classList.add('is-visible'); });
    lorePanelOpen = true;
  }
  function closeLorePanel() {
    if (!lorePanelOpen) return;
    loreEl.classList.remove('is-visible');
    setTimeout(function () { loreEl.hidden = true; }, 500);
    lorePanelOpen = false;
  }

  function countVisited() { return shoreObjs.filter(function (s) { return s.visited; }).length; }

  var decisionShown = false, endingShown = false;
  function showDecision() {
    if (decisionShown) return;
    decisionShown = true;
    setChapter(6);
    decisionEl.hidden = false;
    requestAnimationFrame(function () { decisionEl.classList.add('is-visible'); });
  }
  function hideDecision() {
    decisionEl.classList.remove('is-visible');
    setTimeout(function () { decisionEl.hidden = true; }, 500);
    setChapter(3);
  }
  function showEnding() {
    if (endingShown) return;
    endingShown = true;
    setChapter(7);
    endingEl.hidden = false;
    requestAnimationFrame(function () { endingEl.classList.add('is-visible'); });
  }
  function activateSponsorMode() {
    if (ship.userData.sails && ship.userData.sails.length) {
      ship.userData.sails[0].material.color.setHex(0x1a365d);
      ship.userData.sails[1].material.color.setHex(0x1a365d);
    }
    if (ship.userData.lanternLight) ship.userData.lanternLight.intensity = 2.4;
    if (ship.userData.pennant) ship.userData.pennant.material.color.setHex(0xffd070);
  }
  if (sponsorChoice) {
    sponsorChoice.addEventListener('mouseenter', activateSponsorMode);
    sponsorChoice.addEventListener('focus', activateSponsorMode);
    sponsorChoice.addEventListener('touchstart', activateSponsorMode, { passive: true });
  }

  /* ---------- LOADING ---------- */
  var loadProg = 0;
  function tickLoading() {
    loadProg += 0.05 + Math.random() * 0.08;
    if (loadProg >= 1) {
      loadingFill.style.width = '100%';
      setTimeout(function () { loadingEl.classList.add('is-gone'); }, 350);
      return;
    }
    loadingFill.style.width = (loadProg * 100) + '%';
    setTimeout(tickLoading, 90 + Math.random() * 120);
  }
  tickLoading();

  /* ---------- PROXIMITY / ISLAND DETECTION ---------- */
  function getNearbyIsland() {
    var best = null, bestD = 32; /* must be within 32 units to disembark */
    for (var i = 0; i < shoreObjs.length; i++) {
      var s = shoreObjs[i];
      var dx = ship.position.x - s.x;
      var dz = ship.position.z - s.z;
      var d = Math.sqrt(dx*dx + dz*dz);
      if (d < bestD) { bestD = d; best = s; }
    }
    return best;
  }

  /* ============================================================
     ANIMATION LOOP
     ============================================================ */
  var clock = new THREE.Clock();
  var t = 0;
  var lastWaterUpdate = 0;
  var WATER_FRAME_RATE = 0.04;

  function animateOcean() {
    for (var i = 0; i < waterPositions.count; i++) {
      var x = waterPositions.getX(i);
      var z = waterPositions.getZ(i);
      waterPositions.setY(i, getOceanHeight(x, z, t));
    }
    waterPositions.needsUpdate = true;
    waterGeo.computeVertexNormals();
  }

  /* ---- Sailing update ---- */
  function updateSailing(t, dt) {
    if (isPressed('forward')) velocity = Math.min(velocity + accel, maxSpeed);
    else if (isPressed('back')) velocity = Math.max(velocity - accel * 1.3, -maxSpeed * 0.45);
    else velocity *= friction;
    if (Math.abs(velocity) < 0.001) velocity = 0;
    if (isPressed('left'))  heading += turnSpeed * (1 + Math.abs(velocity));
    if (isPressed('right')) heading -= turnSpeed * (1 + Math.abs(velocity));

    ship.position.x -= Math.sin(heading) * velocity;
    ship.position.z -= Math.cos(heading) * velocity;
    var distFromOrigin = Math.sqrt(ship.position.x * ship.position.x + ship.position.z * ship.position.z);
    if (distFromOrigin > 240) { ship.position.x *= 0.997; ship.position.z *= 0.997; }

    var waveH = getOceanHeight(ship.position.x, ship.position.z, t);
    var grad  = getOceanGradient(ship.position.x, ship.position.z, t);
    ship.position.y += ((waveH + 0.05) - ship.position.y) * 0.22;
    var targetPitch = Math.atan(grad.nz) * 0.6;
    var targetRoll  = Math.atan(grad.nx) * 0.6;
    ship.rotation.order = 'YXZ';
    ship.rotation.y = heading + Math.PI / 2;
    ship.rotation.x += (targetPitch - ship.rotation.x) * 0.16;
    ship.rotation.z += (targetRoll  - ship.rotation.z) * 0.16;

    if (ship.userData.sails) {
      ship.userData.sails.forEach(function (s, i) {
        s.scale.x = 1 + Math.sin(t * 4 + i) * 0.04;
      });
    }
    if (ship.userData.pennant) ship.userData.pennant.rotation.y = Math.sin(t * 3) * 0.4;

    wakeTimer -= dt;
    if (Math.abs(velocity) > 0.05 && wakeTimer <= 0) {
      var sternX = ship.position.x + Math.sin(heading) * 4.5;
      var sternZ = ship.position.z + Math.cos(heading) * 4.5;
      spawnWake(sternX, sternZ, ship.position.y);
      wakeTimer = 0.16;
    }

    /* Camera follow ship */
    var camDist = 22, camHeight = 11;
    var lookX = Math.sin(heading + lookOffset);
    var lookZ = Math.cos(heading + lookOffset);
    var targetCamX = ship.position.x + lookX * camDist;
    var targetCamZ = ship.position.z + lookZ * camDist;
    var targetCamY = camHeight + ship.position.y * 0.4;
    camera.position.x += (targetCamX - camera.position.x) * 0.08;
    camera.position.y += (targetCamY - camera.position.y) * 0.08;
    camera.position.z += (targetCamZ - camera.position.z) * 0.08;
    camera.lookAt(ship.position.x, ship.position.y + 3.0, ship.position.z);

    /* Disembark prompt + compass */
    var nearby = getNearbyIsland();
    if (nearby && !nearby.visited) {
      disembarkName.textContent = nearby.data.title;
      disembarkAct.textContent = 'go ashore';
      disembarkEl.hidden = false;
    } else if (nearby && nearby.visited) {
      disembarkName.textContent = nearby.data.title + ' (visited)';
      disembarkAct.textContent = 'visit again';
      disembarkEl.hidden = false;
    } else {
      disembarkEl.hidden = true;
    }

    /* Compass to nearest unvisited island */
    var nearestDist = Infinity, nearest = null;
    shoreObjs.forEach(function (s) {
      if (!s.visited) {
        var sdx = ship.position.x - s.x, sdz = ship.position.z - s.z;
        var d = Math.sqrt(sdx*sdx + sdz*sdz);
        if (d < nearestDist) { nearestDist = d; nearest = s; }
      }
    });
    if (nearest && compassNeedle) {
      var ndx = nearest.x - ship.position.x, ndz = nearest.z - ship.position.z;
      var bearing = Math.atan2(ndx, -ndz);
      var rel = bearing - heading;
      compassNeedle.style.transform = 'rotate(' + (rel * 180 / Math.PI) + 'deg)';
      if (compassLbl) compassLbl.textContent = '→ ' + nearest.data.title.toUpperCase();
    } else if (compassLbl) {
      compassLbl.textContent = 'ALL VISITED';
    }
  }

  /* ---- Walking update ---- */
  var walkSpeed = 0.16;
  var walkTurnSpeed = 0.045;
  var walkVelocity = 0;
  function updateWalking(t, dt) {
    /* Movement: W/S = forward/back, A/D = turn */
    if (isPressed('forward')) walkVelocity = Math.min(walkVelocity + 0.025, walkSpeed);
    else if (isPressed('back')) walkVelocity = Math.max(walkVelocity - 0.025, -walkSpeed * 0.6);
    else walkVelocity *= 0.85;
    if (Math.abs(walkVelocity) < 0.001) walkVelocity = 0;
    if (isPressed('left'))  avatarHeading += walkTurnSpeed;
    if (isPressed('right')) avatarHeading -= walkTurnSpeed;

    var nx = avatarPos.x - Math.sin(avatarHeading) * walkVelocity;
    var nz = avatarPos.z - Math.cos(avatarHeading) * walkVelocity;
    /* Constrain to plateau radius */
    var dx = nx - currentIsland.x;
    var dz = nz - currentIsland.z;
    var distFromCenter = Math.sqrt(dx*dx + dz*dz);
    if (distFromCenter < PLATEAU_RADIUS - 1) {
      avatarPos.x = nx; avatarPos.z = nz;
    } else {
      /* Slide along the boundary */
      var f = (PLATEAU_RADIUS - 1) / Math.max(0.001, distFromCenter);
      avatarPos.x = currentIsland.x + dx * f;
      avatarPos.z = currentIsland.z + dz * f;
    }

    /* Walk-bob */
    var bobAmount = Math.abs(walkVelocity) * 4;
    avatarPos.y = 1.55 + Math.sin(t * 8) * bobAmount * 0.05;
    avatar.position.copy(avatarPos);
    avatar.rotation.y = avatarHeading;

    /* Walk gait — articulate hips/knees + shoulders/elbows around real joint pivots */
    if (avatar.userData.legL) {
      var amt = Math.min(0.55, Math.abs(walkVelocity) * 4);
      var swing = Math.sin(t * 9) * amt;
      /* Hips swing forward / back */
      avatar.userData.legL.rotation.x =  swing;
      avatar.userData.legR.rotation.x = -swing;
      /* Knees bend more on the back-swing (foot lifting off ground) */
      avatar.userData.kneeL.rotation.x = Math.max(0,  swing * 0.9);
      avatar.userData.kneeR.rotation.x = Math.max(0, -swing * 0.9);
      /* Arms counter-swing */
      avatar.userData.armL.rotation.x = -swing * 0.7;
      avatar.userData.armR.rotation.x =  swing * 0.7;
      /* Elbow base bend + a little dynamic flex */
      avatar.userData.elbowL.rotation.x = 0.18 + Math.max(0,  swing * 0.35);
      avatar.userData.elbowR.rotation.x = 0.18 + Math.max(0, -swing * 0.35);
      /* Slight head bob (yaw) — looking around as you walk */
      avatar.userData.headGroup.rotation.y = Math.sin(t * 1.2) * 0.08;
    }

    /* Camera — third person walking */
    var camDist = 6, camHeight = 3.6;
    var lookX = Math.sin(avatarHeading + lookOffset);
    var lookZ = Math.cos(avatarHeading + lookOffset);
    var targetCamX = avatarPos.x + lookX * camDist;
    var targetCamZ = avatarPos.z + lookZ * camDist;
    var targetCamY = avatarPos.y + camHeight;
    camera.position.x += (targetCamX - camera.position.x) * 0.15;
    camera.position.y += (targetCamY - camera.position.y) * 0.15;
    camera.position.z += (targetCamZ - camera.position.z) * 0.15;
    /* Aim at chest height (avatar is ~3 units tall with feet at avatarPos.y) */
    camera.lookAt(avatarPos.x, avatarPos.y + 1.9, avatarPos.z);

    /* Lore pillar proximity check */
    if (!lorePanelOpen) {
      for (var pi = 0; pi < currentIsland.pillars.length; pi++) {
        var p = currentIsland.pillars[pi];
        if (p.visited) continue;
        var pdx = avatarPos.x - p.x;
        var pdz = avatarPos.z - p.z;
        var pd = Math.sqrt(pdx*pdx + pdz*pdz);
        if (pd < 3.2) {
          p.visited = true;
          openLorePanel(currentIsland, p.loreIndex);
          /* Dim the pillar */
          p.orb.material.opacity = 0.35;
          p.halo.material.opacity = 0.25;
          p.light.intensity = 0.2;
          p.column.material.emissiveIntensity = 0.05;
          break;
        }
      }
    }

    /* Re-board prompt */
    var rdx = avatarPos.x - currentIsland.x;
    var rdz = avatarPos.z - currentIsland.z;
    var rdist = Math.sqrt(rdx*rdx + rdz*rdz);
    if (rdist > PLATEAU_RADIUS - 3) {
      disembarkName.textContent = 'edge of ' + currentIsland.data.title;
      disembarkAct.textContent = 'return to ship';
      disembarkEl.hidden = false;
    } else {
      disembarkEl.hidden = true;
    }
  }

  function loop() {
    var dt = clock.getDelta();
    t = clock.elapsedTime;

    if (MODE === 'sailing') updateSailing(t, dt);
    else updateWalking(t, dt);

    updateWakes(dt);
    updateFish(t, dt);
    updateSplashes(dt);

    /* Beach people anim — always */
    var nearestPersonDist = Infinity, nearestPerson = null;
    people.forEach(function (p, i) {
      var bp = p.userData.basePos;
      p.position.y = bp.y + Math.sin(t * 1.5 + i) * 0.05;
      p.userData.arm.rotation.z = -0.4 + Math.sin(t * 2 + i * 0.7) * 0.12;
      var refX = (MODE === 'sailing') ? ship.position.x : avatarPos.x;
      var refZ = (MODE === 'sailing') ? ship.position.z : avatarPos.z;
      var pdx = refX - p.position.x, pdz = refZ - p.position.z;
      var pd = Math.sqrt(pdx*pdx + pdz*pdz);
      if (pd < nearestPersonDist) { nearestPersonDist = pd; nearestPerson = p; }
    });
    if (nearestPerson && nearestPersonDist < 35) {
      nearestPerson.userData.arm.rotation.z = -1.2 + Math.sin(t * 8) * 0.6;
    }

    /* Shore markers + lore-pillar orbs always animate */
    shoreObjs.forEach(function (s) {
      s.marker.position.y = s.marker.userData.baseY + Math.sin(t * 2.2 + s.index) * 0.45;
      s.halo.rotation.z = t * 0.8 + s.index;
      s.pillars.forEach(function (p, pi) {
        p.orb.position.y = p.orb.userData.baseY + Math.sin(t * 2.5 + pi + s.index) * 0.25;
        p.halo.rotation.z = t * 1.2 + pi;
      });
    });

    if ((t - lastWaterUpdate) > WATER_FRAME_RATE) {
      animateOcean();
      lastWaterUpdate = t;
    }

    var prog = countVisited() / SHORE_DATA.length;
    skyMat.uniforms.bottomColor.value.setRGB(0.99 - prog * 0.4, 0.85 - prog * 0.2, 0.65 + prog * 0.2);

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  loop();

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) clock.stop(); else clock.start();
  });
})();

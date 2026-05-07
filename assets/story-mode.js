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
    { num: '01', tag: 'EDUCATION · ADILABAD',          title: 'Coding on Wheels',           text: 'A van teaching code, AI and robotics where schools never reached.', link: 'programs/coding-on-wheels.html',          color: 0xf4a23a, glyph: '</>',  theme: 'coding'    },
    { num: '02', tag: 'CIVIC · SECUNDERABAD',          title: 'Changemakers',               text: 'Civic action lit by ordinary people.',                                link: 'programs/changemakers.html',              color: 0x6ab8c9, glyph: '✊', theme: 'civic'   },
    { num: '03', tag: 'HEALTH · HYDERABAD',            title: 'Organ Donation Campaign',    text: 'Cards signed. Sight returned. Lives extended.',                       link: 'programs/organ-donation-on-wheels.html',  color: 0xe85d6b, glyph: '♥', theme: 'organ'   },
    { num: '04', tag: 'ENVIRONMENT · TELANGANA',       title: 'EKO Warriors',               text: 'Petitions, surveys, forests still standing.',                         link: 'programs/eko-warriors.html',              color: 0x6ed089, glyph: '⚘', theme: 'eko'     },
    { num: '05', tag: 'ANIMAL WELFARE · ALMASGUDA',    title: 'PAWtection Force',           text: 'Guardians for those who cannot ask.',                                 link: 'programs/pawtection-force.html',          color: 0xb89674, glyph: '✿', theme: 'paw'     },
    { num: '06', tag: 'DIGNITY · TELANGANA',           title: 'WE: Women Empowerment',      text: 'Economic dignity. Health awareness. Real autonomy.',                  link: 'programs/we-women-empowerment.html',      color: 0xe06bb4, glyph: '♀', theme: 'we'      },
    { num: '07', tag: 'JUSTICE · UK & INDIA',          title: 'Global Human Rights Front',  text: 'Asylum, immigration, the long fight for status.',                    link: 'programs/global-human-rights-front.html', color: 0x5b89c4, glyph: '♁', theme: 'global'  },
    { num: '08', tag: 'LEGAL · LONDON',                title: 'Cross Connect Legal Aid',    text: 'From immigration to reconciliation, we stand with you.',              link: 'programs/cross-connect-legal-aid.html',   color: 0x8a8e96, glyph: '⚖', theme: 'cross'   },
    { num: '09', tag: 'EDUCATION · NIZAMABAD',         title: 'DreamCatchers',              text: 'After-school tutoring, scholarships, futures.',                       link: 'programs/dreamcatchers.html',             color: 0xf4d03f, glyph: '★', theme: 'dream'   },
    { num: '10', tag: 'LIVELIHOOD · HYDERABAD',        title: 'Launchpad',                  text: 'First job. First salary. First step.',                                link: 'programs/launchpad.html',                 color: 0xff8855, glyph: '▲', theme: 'launch'  },
    { num: '11', tag: 'PRO-BONO · INDIA',              title: 'L.A.W.G.I.C.',               text: 'Free legal aid for those the system forgets.',                        link: 'programs/lawgic.html',                    color: 0xa886ff, glyph: '§', theme: 'lawgic'  }
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
  /* ============================================================
     ROWBOAT — small wooden boat with red rim, plank seats, and a
     seated rower with a paddle. Replaces the old schooner.
     The rower's arms + chest + paddle are exposed via userData
     so the animation loop can drive a realistic paddling cycle.
     ============================================================ */
  function buildRowboat() {
    var g = new THREE.Group();
    var darkWood  = new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.9 });
    var midWood   = new THREE.MeshStandardMaterial({ color: 0x9a7546, roughness: 0.85 });
    var lightWood = new THREE.MeshStandardMaterial({ color: 0xc4a574, roughness: 0.82 });
    var redRim    = new THREE.MeshStandardMaterial({ color: 0xb53a2a, roughness: 0.65, metalness: 0.1 });
    var skinMat   = new THREE.MeshStandardMaterial({ color: 0xc78a5e, roughness: 0.7 });
    var shirtMat  = new THREE.MeshStandardMaterial({ color: 0x1a365d, roughness: 0.7 });
    var pantsMat  = new THREE.MeshStandardMaterial({ color: 0x3a2410, roughness: 0.85 });

    /* HULL — proper boat with a HOLLOW interior. The outer almond shape
       has a hole punched through (the cavity opening), so the extruded
       geometry is just the WALLS of the boat — no closed top, no closed
       middle. Below we add a separate floor at the bottom of the hollow. */
    function almondPath(useShape, w, h, scale) {
      var s = scale || 1;
      var path = useShape ? new THREE.Shape() : new THREE.Path();
      path.moveTo(w * s, 0);
      path.bezierCurveTo(w * 0.93 * s,  h * 0.58 * s,  w * 0.48 * s,  h * s,        0,  h * s);
      path.bezierCurveTo(-w * 0.48 * s, h * s,        -w * 0.93 * s,  h * 0.58 * s, -w * s, 0);
      path.bezierCurveTo(-w * 0.93 * s,-h * 0.58 * s, -w * 0.48 * s, -h * s,        0, -h * s);
      path.bezierCurveTo(w * 0.48 * s, -h * s,         w * 0.93 * s, -h * 0.58 * s,  w * s, 0);
      return path;
    }
    var hullOuter = almondPath(true,  2.7, 0.95);
    var cavityHole = almondPath(false, 2.0, 0.72);
    hullOuter.holes.push(cavityHole);
    /* Extruding the outer-with-hole creates the hull walls only — the boat is now
       genuinely hollow, you can see down INTO it from above */
    var hullExtrude = { depth: 0.78, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 4, curveSegments: 20 };
    var hullGeo = new THREE.ExtrudeGeometry(hullOuter, hullExtrude);
    hullGeo.rotateX(-Math.PI / 2);
    var hull = new THREE.Mesh(hullGeo, midWood); hull.position.y = 0.10; g.add(hull);

    /* OUTER HULL SKIN — a slightly bigger almond extruded all the way down
       to give the boat a real "submerged keel" silhouette from the side */
    var keelShape = almondPath(true, 2.85, 1.0);
    var keelGeo = new THREE.ExtrudeGeometry(keelShape, { depth: 0.55, bevelEnabled: true, bevelThickness: 0.18, bevelSize: 0.20, bevelSegments: 5, curveSegments: 20 });
    keelGeo.rotateX(-Math.PI / 2);
    var keel = new THREE.Mesh(keelGeo, darkWood);
    keel.position.y = -0.40;
    g.add(keel);

    /* INTERIOR FLOOR — sits at the bottom of the hollow space.
       Lighter wood so it reads as the boat's floor planks vs the dark walls. */
    var floorShape = almondPath(true, 1.95, 0.70);
    var floorGeo = new THREE.ExtrudeGeometry(floorShape, { depth: 0.06, bevelEnabled: false });
    floorGeo.rotateX(-Math.PI / 2);
    var floor = new THREE.Mesh(floorGeo, lightWood);
    floor.position.y = 0.18;
    g.add(floor);
    /* Floor plank seams — thin dark lines running lengthwise for plank texture */
    for (var fp = 0; fp < 5; fp++) {
      var fz = -0.6 + fp * 0.3;
      var seam = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.01, 0.025), darkWood);
      seam.position.set(0, 0.245, fz);
      g.add(seam);
    }

    /* RED RIM — extruded ring matching the boat outline, sits atop the gunwale */
    var rimOuter = almondPath(true, 2.7, 0.95);
    rimOuter.holes.push(almondPath(false, 2.45, 0.83));
    var rimGeo = new THREE.ExtrudeGeometry(rimOuter, { depth: 0.10, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2, curveSegments: 18 });
    rimGeo.rotateX(-Math.PI / 2);
    var rim = new THREE.Mesh(rimGeo, redRim);
    rim.position.y = 0.88;
    g.add(rim);

    /* INTERIOR RIBS — wooden ribs visible along the hollow walls (port + starboard).
       These are the structural ribs you'd see in a real wooden rowboat. */
    for (var rib = 0; rib < 5; rib++) {
      var rx = -1.5 + rib * 0.75;
      /* Port-side ribs (curve up the inside wall) */
      var ribL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.62, 0.05), darkWood);
      ribL.position.set(rx, 0.50, 0.65);
      ribL.rotation.z = -0.08;
      g.add(ribL);
      var ribR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.62, 0.05), darkWood);
      ribR.position.set(rx, 0.50, -0.65);
      ribR.rotation.z = 0.08;
      g.add(ribR);
    }

    /* STERN TRANSOM — vertical board across the back of the boat, common in real rowboats */
    var transom = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.55, 1.2), darkWood);
    transom.position.set(-2.45, 0.50, 0);
    g.add(transom);

    /* PLANK SEATS / THWARTS — 3 across the boat, span port-to-starboard,
       sit just below the gunwale rim. The middle plank is where the rower sits. */
    var plankMat = darkWood;
    var seatPositions = [
      { x: -1.4, w: 1.35 },     /* stern seat */
      { x:  0.0, w: 1.55 },     /* middle (rower's seat, widest) */
      { x:  1.4, w: 1.30 }      /* bow seat */
    ];
    seatPositions.forEach(function (s) {
      /* Plank top — slight tan wood */
      var plank = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.05, s.w), midWood);
      plank.position.set(s.x, 0.86, 0);
      g.add(plank);
      /* Plank edge band (the visible "front" of the seat) */
      var band = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.025, s.w), darkWood);
      band.position.set(s.x, 0.835, 0);
      g.add(band);
    });

    /* THWART CROSS-BRACE — diagonal wooden brace inside the hull
       (between bow seat and floor, like a real boat structure) */
    var brace = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.05, 0.06), midWood);
    brace.position.set(0.7, 0.55, 0);
    brace.rotation.z = -0.4;
    g.add(brace);

    /* ROWER — seated figure facing the stern (he rows backward, looking
       at where he's been). Body parts exposed for paddling animation.
       Position lowered so the hip pivot lands FLUSH on the middle plank seat
       (seat top at y=0.86; chest pivot is +0.55 above rower origin → rower.y=0.31). */
    var rower = new THREE.Group();
    rower.position.set(0.0, 0.31, 0);
    /* Real rowers face the stern (look at the wake, pull toward the bow).
       The boat's bow is +X model-space, so the rower should face -X.
       Rotating the rower group -π/2 around Y puts him in the correct sitting pose. */
    rower.rotation.y = -Math.PI / 2;
    g.add(rower);

    /* Chest — leans forward/back during the stroke */
    var chest = new THREE.Group();
    chest.position.y = 0.55;     /* hip pivot */
    rower.add(chest);
    var torso = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.36, 0.85, 12), shirtMat);
    torso.position.y = 0.42;
    chest.add(torso);
    /* Head */
    var head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 10), skinMat);
    head.position.y = 1.0;
    chest.add(head);
    var hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.55),
      new THREE.MeshStandardMaterial({ color: 0x2a1a0a, roughness: 0.95 })
    );
    hair.position.y = 1.05;
    chest.add(hair);

    /* SHOULDERS — both arms move together since they hold one oar */
    var leftShoulder = new THREE.Group();
    leftShoulder.position.set(0.32, 0.78, 0);
    chest.add(leftShoulder);
    var rightShoulder = new THREE.Group();
    rightShoulder.position.set(-0.32, 0.78, 0);
    chest.add(rightShoulder);

    /* Upper arms hang from shoulders */
    var leftUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.42, 8), shirtMat);
    leftUpper.position.y = -0.21; leftShoulder.add(leftUpper);
    var rightUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.42, 8), shirtMat);
    rightUpper.position.y = -0.21; rightShoulder.add(rightUpper);

    /* Forearms — exposed skin (sleeves end at elbow) */
    var leftElbow = new THREE.Group();
    leftElbow.position.y = -0.42;
    leftShoulder.add(leftElbow);
    var leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.4, 8), skinMat);
    leftForearm.position.y = -0.20; leftElbow.add(leftForearm);
    var leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), skinMat);
    leftHand.position.y = -0.40; leftElbow.add(leftHand);

    var rightElbow = new THREE.Group();
    rightElbow.position.y = -0.42;
    rightShoulder.add(rightElbow);
    var rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.4, 8), skinMat);
    rightForearm.position.y = -0.20; rightElbow.add(rightForearm);
    var rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), skinMat);
    rightHand.position.y = -0.40; rightElbow.add(rightHand);

    /* Legs — bent in seated pose, mostly static */
    var leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.85), pantsMat);
    leftLeg.position.set(0.18, 0.18, 0.4); rower.add(leftLeg);
    var rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.85), pantsMat);
    rightLeg.position.set(-0.18, 0.18, 0.4); rower.add(rightLeg);

    /* CANOE PADDLE — held by both hands. Top (right) hand grips the T-grip,
       bottom (left) hand grips the shaft mid-way down. Shaft extends
       downward and outward toward the water on the rower's right side.
       The paddle's local origin sits at the TOP HAND (T-grip) so the whole
       paddle rotates around that pivot during the stroke. */
    var oarGroup = new THREE.Group();
    /* Position at right shoulder height, slightly forward of chest */
    oarGroup.position.set(-0.20, 0.45, 0.42);
    /* Tilt: down-and-out to the right side of the boat (paddling-side) */
    oarGroup.rotation.x = 0.35;        /* lean forward */
    oarGroup.rotation.z = -0.55;       /* tilt to rower's right (-X) so blade extends outboard */
    chest.add(oarGroup);

    /* T-grip — small horizontal bar at the very top of the paddle,
       sits right where the right hand grips */
    var oarGrip = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 0.05), darkWood);
    oarGrip.position.set(0, 0.05, 0);
    oarGroup.add(oarGrip);

    /* Shaft — vertical, extends DOWN from the T-grip toward the water */
    var oarShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 1.55, 8), lightWood);
    oarShaft.position.set(0, -0.78, 0);
    oarGroup.add(oarShaft);

    /* Blade — flat paddle at the bottom of the shaft, oriented to push water */
    var oarBlade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 0.30), darkWood);
    oarBlade.position.set(0, -1.65, 0);
    oarGroup.add(oarBlade);

    /* OAR REST — when the rower disembarks, paddle lies on the floor of the boat,
       running lengthwise (T-grip at stern end, blade at bow end). */
    var oarRest = new THREE.Group();
    oarRest.position.set(0, 0.85, 0);   /* on top of the plank seats */
    oarRest.visible = false;
    g.add(oarRest);
    var restShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 1.55, 8), lightWood);
    restShaft.rotation.z = Math.PI / 2;     /* lying flat along boat length (X) */
    oarRest.add(restShaft);
    var restGrip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.18), darkWood);
    restGrip.position.set(-0.83, 0, 0);
    oarRest.add(restGrip);
    var restBlade = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.30), darkWood);
    restBlade.position.set(0.92, 0, 0);
    oarRest.add(restBlade);

    /* Initial pose — both arms reach forward to grip the paddle.
       Right arm holds T-grip at top; left arm reaches further forward+across
       to grip the shaft mid-way down. */
    rightShoulder.rotation.x = -0.55;     /* forward */
    rightShoulder.rotation.z = -0.30;     /* tucked inward toward midline */
    rightElbow.rotation.x = 0.50;          /* slight forearm bend */
    leftShoulder.rotation.x = -0.95;       /* more forward (reach) */
    leftShoulder.rotation.z = 0.45;        /* across body to reach the shaft */
    leftElbow.rotation.x = 0.85;           /* deeper forearm bend */

    g.userData.rower = rower;
    g.userData.chest = chest;
    g.userData.leftShoulder = leftShoulder;
    g.userData.rightShoulder = rightShoulder;
    g.userData.leftElbow = leftElbow;
    g.userData.rightElbow = rightElbow;
    g.userData.oarGroup = oarGroup;
    g.userData.oarRest = oarRest;
    /* Legacy fields kept as no-ops so existing code referencing them doesn't crash */
    g.userData.sails = [];
    g.userData.pennant = null;
    g.userData.wheel = null;
    g.userData.lanternLight = null;
    return g;
  }
  var ship = buildRowboat();
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
  /* Heraldic medallion — circular sprite with the program's symbol glyph at center,
     the number arc-set along the top, two ring strokes, radial-gradient interior.
     Reads as a coin/seal hovering over the island. */
  function makeIslandMedallion(num, glyph, colorInt) {
    var canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    var ctx = canvas.getContext('2d');
    var hex = '#' + colorInt.toString(16).padStart(6, '0');
    var cx = 256, cy = 256;

    /* Radial gradient disc — bright at center, fading to dark at rim */
    var grad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 230);
    grad.addColorStop(0, 'rgba(5, 13, 29, 0.96)');
    grad.addColorStop(0.6, 'rgba(5, 13, 29, 0.92)');
    grad.addColorStop(1, hex);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 230, 0, Math.PI * 2);
    ctx.fill();

    /* Outer thick ring in program color */
    ctx.strokeStyle = hex;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(cx, cy, 226, 0, Math.PI * 2);
    ctx.stroke();

    /* Inner thin ring at 78% radius */
    ctx.strokeStyle = hex;
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 180, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    /* Number arc-set along the top — each character rotated to follow the curve */
    var numStr = num;
    ctx.fillStyle = '#f4ecdb';
    ctx.font = 'bold 38px "Geist Mono", ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var arcRadius = 200;
    var arcSpan = Math.PI * 0.18;          /* total angular width across number */
    var startAngle = -Math.PI / 2 - arcSpan / 2;
    var step = numStr.length > 1 ? arcSpan / (numStr.length - 1) : 0;
    for (var c = 0; c < numStr.length; c++) {
      var ang = startAngle + step * c;
      ctx.save();
      ctx.translate(cx + Math.cos(ang) * arcRadius, cy + Math.sin(ang) * arcRadius);
      ctx.rotate(ang + Math.PI / 2);       /* tangent to the arc */
      ctx.fillText(numStr[c], 0, 0);
      ctx.restore();
    }

    /* Two small dot ornaments left/right of the number */
    ctx.fillStyle = hex;
    [-Math.PI * 0.18, Math.PI * 0.18].forEach(function (a) {
      var rA = -Math.PI / 2 + a;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(rA) * arcRadius, cy + Math.sin(rA) * arcRadius, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    /* Center symbol glyph — large, glowing in program color */
    ctx.shadowColor = hex;
    ctx.shadowBlur = 24;
    ctx.fillStyle = '#f4ecdb';
    ctx.font = '600 200px "Geist", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    /* Force monochrome variant for symbols that have both text + emoji presentations */
    ctx.fillText(glyph + '︎', cx, cy + 18);
    ctx.shadowBlur = 0;

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
    /* Square scale — reads as a coin/seal */
    sprite.scale.set(6, 6, 1);
    sprite.renderOrder = 999;
    return sprite;
  }

  /* ============================================================
     THEMED CENTERPIECES — one bespoke landmark per program.
     Returns { meshes: [...], anim: function(t, near){...} } so the
     animation loop can drive proximity-triggered effects.
     ============================================================ */
  function _mat(c, opts) {
    opts = opts || {};
    return new THREE.MeshStandardMaterial({
      color: c, roughness: opts.r != null ? opts.r : 0.85, metalness: opts.m != null ? opts.m : 0.1,
      flatShading: !!opts.flat, emissive: opts.e || 0x000000, emissiveIntensity: opts.eI || 0
    });
  }
  function _add(group, geo, mat, x, y, z, rx, ry, rz) {
    var m = new THREE.Mesh(geo, mat);
    m.position.set(x || 0, y || 0, z || 0);
    if (rx) m.rotation.x = rx;
    if (ry) m.rotation.y = ry;
    if (rz) m.rotation.z = rz;
    group.add(m); return m;
  }

  /* ============================================================
     PER-THEME TERRAIN — sand, grass, rocks, trees parameterized
     so each island reads as a *place* (forest, courtyard, dog
     park, marble plaza) not a generic green disc.
     ============================================================ */
  var THEME_TERRAIN = {
    coding: { sand: 0xc8c4b0, grass: 0xa8b0a8, rock: 0x6a7078, rockCount: 4, trunk: 0x4a4640, foliage: 0x6a8e6a, treeCount: 4 },
    civic:  { sand: 0xd4be8a, grass: 0x9ba573, rock: 0x807a6a, rockCount: 6, trunk: 0x6b4a2c, foliage: 0x5a8048, treeCount: 9 },
    organ:  { sand: 0xece4c8, grass: 0x9bc090, rock: 0xc8c0a8, rockCount: 4, trunk: 0x6b4423, foliage: 0x5e9a5a, treeCount: 7 },
    eko:    { sand: 0xb09868, grass: 0x3d6b30, rock: 0x4a5e3e, rockCount: 9, trunk: 0x3a2818, foliage: 0x2a5a22, treeCount: 18 },
    paw:    { sand: 0xd6b888, grass: 0x9a9268, rock: 0xa89074, rockCount: 5, trunk: 0x6b4423, foliage: 0x6a8048, treeCount: 7 },
    we:     { sand: 0xe6cba0, grass: 0x8aa56a, rock: 0xa8806a, rockCount: 4, trunk: 0x6b4423, foliage: 0x7da868, treeCount: 11 },
    global: { sand: 0xc8c8b8, grass: 0x6a8e7a, rock: 0x9098a4, rockCount: 5, trunk: 0x4a3a2a, foliage: 0x4a7a6a, treeCount: 8 },
    cross:  { sand: 0xb0a890, grass: 0x7a8470, rock: 0x4a5058, rockCount: 6, trunk: 0x3a2818, foliage: 0x4a5e48, treeCount: 4 },
    dream:  { sand: 0xe8d09a, grass: 0x8fa563, rock: 0xc8b890, rockCount: 4, trunk: 0x6b4423, foliage: 0x6a8e3a, treeCount: 8 },
    launch: { sand: 0xa89878, grass: 0x8a7a5a, rock: 0x4a4a4a, rockCount: 7, trunk: 0x3a2818, foliage: 0x5a6a4a, treeCount: 3 },
    lawgic: { sand: 0xe8e0c8, grass: 0xb8b59a, rock: 0xe0d8c0, rockCount: 5, trunk: 0x4a3a2a, foliage: 0x6a8e5a, treeCount: 4 }
  };

  /* Hoisted shared materials — paper/wood/cloth used across many islands */
  var SHARED_MATS = {
    paper:    new THREE.MeshStandardMaterial({ color: 0xfafaf2, roughness: 0.85 }),
    paperOff: new THREE.MeshStandardMaterial({ color: 0xefe6c8, roughness: 0.88 }),
    woodMid:  new THREE.MeshStandardMaterial({ color: 0x6b4a2c, roughness: 0.85 }),
    woodLight:new THREE.MeshStandardMaterial({ color: 0xc7a679, roughness: 0.85 }),
    woodDark: new THREE.MeshStandardMaterial({ color: 0x3a2818, roughness: 0.9  }),
    slateGry: new THREE.MeshStandardMaterial({ color: 0x1a2540, roughness: 0.55, metalness: 0.2 }),
    metalGry: new THREE.MeshStandardMaterial({ color: 0x8a8e96, roughness: 0.45, metalness: 0.6 }),
    gold:     new THREE.MeshStandardMaterial({ color: 0xf4d03f, roughness: 0.4,  metalness: 0.7 })
  };

  function buildCenterpiece(data, parent) {
    var color = data.color;
    var theme = data.theme;
    var cp = new THREE.Group();
    cp.position.y = 1.55;             /* sit on plateau top */
    parent.add(cp);
    var anim = null;
    var props = { wheels: [], lights: [], pulses: [], sails: [], spinning: [], swayers: [] };

    if (theme === 'coding') {
      /* CODING — stretched bus body, wheels, windows, antenna; laptops scattered */
      var navy = _mat(0x1a2540, { r: 0.55, m: 0.2 });
      var orange = _mat(color, { r: 0.55, m: 0.2 });
      var pale = _mat(0xdfe4ec, { r: 0.5 });
      _add(cp, new THREE.BoxGeometry(7, 2.4, 2.4), navy, 0, 1.7, 0);
      _add(cp, new THREE.BoxGeometry(2, 1.6, 2.4), orange, 2.2, 1.3, 0);
      /* Side windows */
      [-2, -1, 0, 1, 2].forEach(function (x) {
        _add(cp, new THREE.BoxGeometry(0.8, 0.7, 0.05), pale, x, 2.2, 1.21);
        _add(cp, new THREE.BoxGeometry(0.8, 0.7, 0.05), pale, x, 2.2, -1.21);
      });
      /* Wheels */
      var wheelMat = _mat(0x141414, { r: 0.7 });
      [[-2.5, 1.4], [2.5, 1.4], [-2.5, -1.4], [2.5, -1.4]].forEach(function (p) {
        var w = _add(cp, new THREE.CylinderGeometry(0.55, 0.55, 0.4, 16), wheelMat, p[0], 0.55, p[1], Math.PI / 2, 0, 0);
        props.wheels.push(w);
      });
      /* Antenna */
      _add(cp, new THREE.CylinderGeometry(0.04, 0.04, 1.2, 6), wheelMat, -2.5, 3.5, 0);
      _add(cp, new THREE.SphereGeometry(0.18, 12, 8), orange, -2.5, 4.1, 0);
      /* Laptops scattered around */
      var laptopMat = _mat(0x1a2540, { r: 0.5 });
      var screenMat = _mat(0x141414, { r: 0.4, e: 0x7af0c0, eI: 0.6 });
      [[-5, 0, 3], [5, 0, -3], [-5, 0, -3], [5, 0, 3]].forEach(function (p) {
        var lap = new THREE.Group();
        lap.position.set(p[0], 0.12, p[2]);
        lap.rotation.y = Math.random() * Math.PI;
        var base = _add(lap, new THREE.BoxGeometry(0.9, 0.05, 0.7), laptopMat, 0, 0, 0);
        var hinge = new THREE.Group(); hinge.position.set(0, 0.025, -0.35); lap.add(hinge);
        var screen = _add(hinge, new THREE.BoxGeometry(0.9, 0.05, 0.7), laptopMat, 0, 0.03, 0);
        screen.rotation.x = -Math.PI * 0.55;
        var face = _add(hinge, new THREE.PlaneGeometry(0.78, 0.6), screenMat, 0, 0.36, -0.04);
        face.rotation.x = -Math.PI * 0.55;
        cp.add(lap);
        props.pulses.push(face);
      });
      anim = function (t, near) {
        props.pulses.forEach(function (f, i) {
          var glow = near ? (0.6 + Math.sin(t * 6 + i) * 0.4) : 0.3;
          f.material.emissiveIntensity = glow;
        });
      };
    }
    else if (theme === 'civic') {
      /* CHANGEMAKERS — hexagonal podium + lectern + 3 banner poles */
      var stage = _mat(0xc7a679, { r: 0.85 });
      var lectMat = _mat(0x6a4a2c, { r: 0.85 });
      _add(cp, new THREE.CylinderGeometry(2.5, 2.8, 0.8, 6), stage, 0, 0.4, 0);
      _add(cp, new THREE.CylinderGeometry(0.5, 0.6, 1.6, 12), lectMat, 0, 1.6, 0);
      /* Banner poles + flags */
      var poleMat = _mat(0x3a2410, { r: 0.85 });
      var bannerColors = [0xc44b3a, color, 0xf4ecdb];
      [-25, 0, 25].forEach(function (deg, i) {
        var pole = _add(cp, new THREE.BoxGeometry(0.08, 4.5, 0.08), poleMat, 0, 2.25, 0);
        pole.rotation.y = deg * Math.PI / 180;
        pole.position.x = Math.cos(deg * Math.PI / 180) * -1.2;
        pole.position.z = Math.sin(deg * Math.PI / 180) * -1.2;
        var flagMat = _mat(bannerColors[i], { r: 0.7 });
        flagMat.side = THREE.DoubleSide;
        var flag = _add(cp, new THREE.PlaneGeometry(1.2, 3.0), flagMat, pole.position.x, 3.0, pole.position.z + 0.7);
        flag.rotation.y = pole.rotation.y;
        props.swayers.push(flag);
      });
      /* Floor torus */
      _add(cp, new THREE.TorusGeometry(3.0, 0.06, 6, 24), _mat(color, { e: color, eI: 0.4 }), 0, 0.85, 0, Math.PI / 2, 0, 0);
      anim = function (t, near) {
        props.swayers.forEach(function (f, i) {
          f.rotation.y += (near ? Math.sin(t * 1.2 + i) * 0.005 : 0);
        });
      };
    }
    else if (theme === 'organ') {
      /* ORGAN DONATION — caravan with rooftop plus, heart-pulse line */
      var cream = _mat(0xf4ecdb, { r: 0.55 });
      var red = _mat(color, { r: 0.55, m: 0.15 });
      _add(cp, new THREE.BoxGeometry(5.5, 2.6, 2.6), cream, 0, 1.85, 0);
      /* Rooftop plus sign */
      _add(cp, new THREE.BoxGeometry(2.2, 0.5, 0.5), red, 0, 3.5, 0);
      _add(cp, new THREE.BoxGeometry(0.5, 0.5, 2.2), red, 0, 3.5, 0);
      /* Wheels */
      var wMat = _mat(0x141414);
      [[-1.8, 1.4], [1.8, 1.4], [-1.8, -1.4], [1.8, -1.4]].forEach(function (p) {
        _add(cp, new THREE.CylinderGeometry(0.5, 0.5, 0.4, 16), wMat, p[0], 0.5, p[1], Math.PI / 2);
      });
      /* Heart pulse line on the side — boxes get sequenced emissive */
      var pulseMat = _mat(0x141414, { e: color, eI: 0.4 });
      for (var pi = 0; pi < 8; pi++) {
        var seg = _add(cp, new THREE.BoxGeometry(0.32, 0.05, 0.05), pulseMat, -2.4 + pi * 0.6, 1.6 + (pi % 2 === 0 ? 0.3 : 0), 1.32);
        props.pulses.push(seg);
      }
      anim = function (t, near) {
        if (!near) return;
        var phase = (t * 2) % props.pulses.length;
        props.pulses.forEach(function (s, i) {
          var d = Math.abs(i - phase);
          if (d > props.pulses.length / 2) d = props.pulses.length - d;
          s.material.emissiveIntensity = Math.max(0.2, 1 - d * 0.4);
        });
      };
    }
    else if (theme === 'eko') {
      /* EKO — giant guardian tree with stacked canopy, root ring, petition ribbon */
      var bark = _mat(0x4a3220, { r: 0.9, flat: true });
      var leaf1 = _mat(0x4f7d3a, { r: 0.85, flat: true });
      var leaf2 = _mat(color, { r: 0.85, flat: true });
      _add(cp, new THREE.CylinderGeometry(1.2, 1.8, 6, 10), bark, 0, 3, 0);
      var c1 = _add(cp, new THREE.IcosahedronGeometry(2.6, 1), leaf1, 0, 6.5, 0); props.spinning.push({ m: c1, sp: 0.0008 });
      var c2 = _add(cp, new THREE.IcosahedronGeometry(2.0, 1), leaf2, 0, 8, 0); props.spinning.push({ m: c2, sp: -0.0012 });
      var c3 = _add(cp, new THREE.IcosahedronGeometry(1.4, 1), leaf1, 0, 9.2, 0); props.spinning.push({ m: c3, sp: 0.0014 });
      _add(cp, new THREE.TorusGeometry(2.0, 0.08, 6, 32), bark, 0, 0.05, 0, Math.PI / 2);
      _add(cp, new THREE.TorusGeometry(1.5, 0.06, 6, 24), _mat(color, { e: color, eI: 0.3 }), 0, 2.5, 0, 0, 0, 0.35);
      /* Saplings */
      for (var sp = 0; sp < 6; sp++) {
        var sang = (sp / 6) * Math.PI * 2;
        _add(cp, new THREE.CylinderGeometry(0.06, 0.1, 0.6, 6), bark, Math.cos(sang) * 4, 0.3, Math.sin(sang) * 4);
        _add(cp, new THREE.IcosahedronGeometry(0.3, 0), leaf1, Math.cos(sang) * 4, 0.8, Math.sin(sang) * 4);
      }
      anim = function (t, near) {
        if (!near) return;
        props.spinning.forEach(function (s) { s.m.rotation.y += s.sp; });
      };
    }
    else if (theme === 'paw') {
      /* PAWTECTION — three peaked huts in triangle + bowl */
      var wood = _mat(0xa05030, { r: 0.85 });
      var roof = _mat(0x3d2818, { r: 0.85 });
      [0, Math.PI * 2/3, Math.PI * 4/3].forEach(function (ang) {
        var hx = Math.cos(ang) * 3, hz = Math.sin(ang) * 3;
        var hut = new THREE.Group(); hut.position.set(hx, 0, hz); hut.rotation.y = ang + Math.PI;
        var walls = _add(hut, new THREE.BoxGeometry(1.6, 1.4, 1.6), wood, 0, 0.7, 0);
        var rf = _add(hut, new THREE.ConeGeometry(1.3, 0.9, 4), roof, 0, 1.85, 0);
        rf.rotation.y = Math.PI / 4;
        cp.add(hut);
        props.swayers.push(rf);
      });
      _add(cp, new THREE.CylinderGeometry(0.6, 0.6, 0.15, 16), _mat(0x6a8eb4, { r: 0.4, m: 0.5 }), 0, 0.08, 0);
      _add(cp, new THREE.TorusGeometry(0.65, 0.05, 6, 20), wood, 0, 0.16, 0, Math.PI / 2);
      /* Flagpole with paw flag */
      _add(cp, new THREE.CylinderGeometry(0.05, 0.05, 1.6, 6), wood, 0, 0.8, 0);
      var flag = _add(cp, new THREE.BoxGeometry(0.8, 0.5, 0.02), _mat(color, { r: 0.7 }), 0.4, 1.4, 0);
      anim = function (t, near) {
        props.swayers.forEach(function (rf, i) {
          var lift = near ? Math.abs(Math.sin(t * 4 + i)) * 0.25 : 0;
          rf.position.y = 1.85 + lift;
        });
      };
    }
    else if (theme === 'we') {
      /* WE — circle of figures around central loom */
      var skin = _mat(0xc78a5e);
      var saree = _mat(color, { r: 0.65 });
      for (var fi = 0; fi < 6; fi++) {
        var fang = (fi / 6) * Math.PI * 2;
        var fx = Math.cos(fang) * 3.5, fz = Math.sin(fang) * 3.5;
        var fig = new THREE.Group(); fig.position.set(fx, 0, fz);
        var body = _add(fig, new THREE.CylinderGeometry(0.35, 0.45, 1.7, 8), saree, 0, 0.85, 0);
        var head = _add(fig, new THREE.SphereGeometry(0.32, 14, 10), skin, 0, 1.9, 0);
        cp.add(fig);
        props.swayers.push(body);
      }
      /* Central loom */
      var wood = _mat(0xc4a87a, { r: 0.85 });
      _add(cp, new THREE.BoxGeometry(0.2, 3.0, 0.2), wood, -0.8, 1.5, 0);
      _add(cp, new THREE.BoxGeometry(0.2, 3.0, 0.2), wood, 0.8, 1.5, 0);
      _add(cp, new THREE.BoxGeometry(2.0, 0.2, 0.2), wood, 0, 3.0, 0);
      for (var wi = 0; wi < 7; wi++) {
        _add(cp, new THREE.CylinderGeometry(0.02, 0.02, 2.5, 4), wood, -0.8 + wi * 0.27, 1.65, 0);
      }
      _add(cp, new THREE.BoxGeometry(1.6, 0.1, 0.3), wood, 0, 1.7, 0);
      anim = function (t, near) {
        props.swayers.forEach(function (b, i) {
          b.scale.y = near ? 1 + Math.sin(t * 1.2 + i * 1.04) * 0.04 : 1;
        });
      };
    }
    else if (theme === 'global') {
      /* GLOBAL HR — globe on tripod arches + plinth */
      var sand = _mat(0xc4b08a, { r: 0.85 });
      var ocean = _mat(0x1a2c4a, { r: 0.4, m: 0.5 });
      var globe = _add(cp, new THREE.SphereGeometry(2.2, 24, 16), ocean, 0, 4.5, 0);
      var wireframe = new THREE.Mesh(new THREE.SphereGeometry(2.21, 12, 8), new THREE.MeshBasicMaterial({ color: color, wireframe: true, transparent: true, opacity: 0.4 }));
      wireframe.position.y = 4.5; cp.add(wireframe);
      props.spinning.push({ m: globe, sp: 0.005 });
      props.spinning.push({ m: wireframe, sp: 0.005 });
      /* Tripod arches */
      [0, Math.PI * 2/3, Math.PI * 4/3].forEach(function (ang) {
        var arch = _add(cp, new THREE.TorusGeometry(2.6, 0.18, 8, 24, Math.PI), sand, Math.cos(ang) * 0.5, 2.5, Math.sin(ang) * 0.5, 0, ang, 0);
      });
      /* Plinth disc */
      _add(cp, new THREE.RingGeometry(3.0, 3.4, 32), _mat(color, { e: color, eI: 0.3 }), 0, 0.06, 0, -Math.PI / 2);
      /* Equator band */
      _add(cp, new THREE.TorusGeometry(2.22, 0.05, 6, 32), _mat(color, { e: color, eI: 0.5 }), 0, 4.5, 0, Math.PI / 2);
      anim = function (t, near) {
        if (!near) return;
        props.spinning.forEach(function (s) { s.m.rotation.y += s.sp; });
      };
    }
    else if (theme === 'cross') {
      /* CROSS CONNECT — bridge of scales */
      var slate = _mat(color, { r: 0.5, m: 0.4 });
      var bronze = _mat(0xb8a070, { r: 0.45, m: 0.6 });
      _add(cp, new THREE.BoxGeometry(6, 0.3, 1.2), slate, 0, 0.9, 0);
      _add(cp, new THREE.BoxGeometry(0.3, 1.6, 1.2), slate, -3, 1.5, 0);
      _add(cp, new THREE.BoxGeometry(0.3, 1.6, 1.2), slate, 3, 1.5, 0);
      _add(cp, new THREE.CylinderGeometry(0.15, 0.15, 3.5, 12), slate, 0, 2.65, 0);
      _add(cp, new THREE.BoxGeometry(2.4, 0.08, 0.08), slate, 0, 4.3, 0);
      /* Two scale-pans */
      var panL = new THREE.Group(); panL.position.set(-1.0, 4.3, 0); cp.add(panL);
      _add(panL, new THREE.CylinderGeometry(0.02, 0.02, 0.8, 6), slate, 0, -0.4, 0);
      var pL = _add(panL, new THREE.CylinderGeometry(0.7, 0.5, 0.18, 16), bronze, 0, -0.85, 0);
      var panR = new THREE.Group(); panR.position.set(1.0, 4.3, 0); cp.add(panR);
      _add(panR, new THREE.CylinderGeometry(0.02, 0.02, 0.8, 6), slate, 0, -0.4, 0);
      var pR = _add(panR, new THREE.CylinderGeometry(0.7, 0.5, 0.18, 16), bronze, 0, -0.85, 0);
      props.swayers.push({ a: panL, b: panR });
      anim = function (t, near) {
        if (!near) return;
        var s = props.swayers[0];
        var swing = Math.sin(t * 1.2) * 0.18;
        s.a.position.y = 4.3 + swing;
        s.b.position.y = 4.3 - swing;
      };
    }
    else if (theme === 'dream') {
      /* DREAMCATCHERS — schoolhouse + dreamcatcher hoop */
      var wall = _mat(0xf4ecdb, { r: 0.9 });
      var roof = _mat(0xa05a3a, { r: 0.85 });
      _add(cp, new THREE.BoxGeometry(3.6, 2.4, 3.0), wall, 0, 1.2, 0);
      _add(cp, new THREE.BoxGeometry(3.8, 0.2, 3.2), roof, 0, 2.5, 0);
      var pyramid = _add(cp, new THREE.ConeGeometry(2.6, 1.6, 4), roof, 0, 3.4, 0);
      pyramid.rotation.y = Math.PI / 4;
      /* Hoop atop the roof */
      var hoop = new THREE.Group(); hoop.position.set(0, 4.6, 0); cp.add(hoop);
      _add(hoop, new THREE.TorusGeometry(1.4, 0.08, 8, 28), _mat(0x6b4423, { r: 0.85 }), 0, 0, 0);
      /* Web strands across hoop */
      for (var hsi = 0; hsi < 6; hsi++) {
        var hsang = (hsi / 6) * Math.PI;
        _add(hoop, new THREE.CylinderGeometry(0.02, 0.02, 2.6, 4), _mat(0xeae0c8), 0, 0, 0, 0, 0, hsang);
      }
      /* Bead knots */
      for (var bd = 0; bd < 3; bd++) {
        var bdang = bd * Math.PI * 2 / 3;
        _add(hoop, new THREE.SphereGeometry(0.08, 8, 6), _mat(color, { e: color, eI: 0.6 }), Math.cos(bdang) * 0.6, 0, Math.sin(bdang) * 0.6);
      }
      props.spinning.push({ m: hoop, sp: 0.008 });
      anim = function (t, near) {
        props.spinning.forEach(function (s) { s.m.rotation.y += near ? s.sp : s.sp * 0.2; });
      };
    }
    else if (theme === 'launch') {
      /* LAUNCHPAD — rocket on gantry pad */
      var white = _mat(0xdfe4ec, { r: 0.5, m: 0.4 });
      var charcoal = _mat(0x3a3a44, { r: 0.7 });
      var flame = _mat(color, { e: color, eI: 0.6 });
      /* Pad disc */
      _add(cp, new THREE.CylinderGeometry(1.2, 1.4, 0.4, 16), charcoal, 0, 0.2, 0);
      /* Rocket body */
      _add(cp, new THREE.CylinderGeometry(0.6, 0.9, 4.5, 16), white, 0, 2.65, 0);
      /* Nosecone */
      _add(cp, new THREE.ConeGeometry(0.6, 1.4, 16), white, 0, 5.6, 0);
      /* Fins */
      [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach(function (a) {
        var fin = _add(cp, new THREE.BoxGeometry(0.15, 1.0, 0.8), color === 0xff8855 ? flame : white, Math.cos(a) * 0.7, 0.9, Math.sin(a) * 0.7);
        fin.rotation.y = a;
        fin.material = white;
      });
      /* Gantry */
      _add(cp, new THREE.BoxGeometry(0.2, 5, 0.2), charcoal, 1.8, 2.9, 0);
      _add(cp, new THREE.BoxGeometry(0.2, 0.2, 1.4), charcoal, 1.4, 4.4, 0);
      /* Exhaust scorch ring */
      var scorch = _add(cp, new THREE.TorusGeometry(1.5, 0.08, 8, 24), flame, 0, 0.05, 0, Math.PI / 2);
      props.pulses.push(scorch);
      anim = function (t, near) {
        scorch.material.emissiveIntensity = near ? 0.6 + Math.sin(t * 6) * 0.4 : 0.3;
      };
    }
    else if (theme === 'lawgic') {
      /* L.A.W.G.I.C. — classical column courthouse */
      var marble = _mat(0xede5d4, { r: 0.7 });
      var shadow = _mat(0x7a6a5a, { r: 0.85 });
      _add(cp, new THREE.BoxGeometry(5.5, 0.4, 4.0), marble, 0, 0.2, 0);
      [-2.2, -0.8, 0.8, 2.2].forEach(function (cx) {
        _add(cp, new THREE.CylinderGeometry(0.4, 0.45, 4.0, 12), marble, cx, 2.4, 0);
      });
      _add(cp, new THREE.BoxGeometry(5.2, 0.5, 3.7), marble, 0, 4.65, 0);
      var pediment = _add(cp, new THREE.ConeGeometry(2.6, 1.0, 4), shadow, 0, 5.4, 0);
      pediment.rotation.y = Math.PI / 4;
      /* Laurel wreath */
      _add(cp, new THREE.TorusGeometry(0.8, 0.04, 6, 24), _mat(color, { e: color, eI: 0.4 }), 0, 5.0, 1.85, 0, 0, 0);
      /* Two columns to track */
      props.lights = [];
      [-2.2, -0.8, 0.8, 2.2].forEach(function (cx) {
        var lit = _mat(color, { e: color, eI: 0.0 });
        var indicator = _add(cp, new THREE.CylinderGeometry(0.45, 0.5, 0.1, 12), lit, cx, 4.4, 0);
        props.lights.push(indicator);
      });
      anim = function (t, near) {
        if (!near) {
          props.lights.forEach(function (l) { l.material.emissiveIntensity = 0; });
          return;
        }
        props.lights.forEach(function (l, i) {
          var phase = (t - i * 0.4) % 4;
          l.material.emissiveIntensity = phase >= 0 && phase < 2 ? Math.max(0, 1 - phase * 0.5) : 0;
        });
      };
    }

    return { group: cp, anim: anim };
  }

  /* ============================================================
     SECONDARY PROPS — 2-4 small environmental objects per island
     scattered between centerpiece and lore pillars to make each
     island feel like a real *place*, not a single landmark on grass.
     Placement convention: radius 5-8 from island origin, angles
     30°/150°/270° + variants (between pillars at 90°/210°/330°).
     ============================================================ */
  function buildIslandProps(data, parent) {
    var theme = data.theme;
    var color = data.color;
    var props = new THREE.Group();
    props.position.y = 1.55;
    parent.add(props);

    function place(rad, angDeg, yOffset) {
      var a = angDeg * Math.PI / 180;
      var g = new THREE.Group();
      g.position.set(Math.cos(a) * rad, yOffset || 0, Math.sin(a) * rad);
      g.rotation.y = -a + Math.PI;     /* face toward centerpiece */
      props.add(g);
      return g;
    }

    if (theme === 'coding') {
      /* 2 whiteboard easels */
      [30, 150].forEach(function (deg) {
        var e = place(6, deg, 0);
        var legL = _add(e, new THREE.CylinderGeometry(0.04, 0.04, 1.6, 6), SHARED_MATS.woodMid, -0.45, 0.8, 0.2, 0, 0, 0.18);
        var legR = _add(e, new THREE.CylinderGeometry(0.04, 0.04, 1.6, 6), SHARED_MATS.woodMid,  0.45, 0.8, 0.2, 0, 0, -0.18);
        var legB = _add(e, new THREE.CylinderGeometry(0.04, 0.04, 1.6, 6), SHARED_MATS.woodMid, 0, 0.8, -0.4, 0.18, 0, 0);
        _add(e, new THREE.BoxGeometry(1.2, 0.9, 0.05), SHARED_MATS.paper, 0, 1.6, 0.05);
        _add(e, new THREE.BoxGeometry(1.2, 0.05, 0.06), SHARED_MATS.slateGry, 0, 1.1, 0.07);
      });
      /* 1 stacked-books cluster */
      var bs = place(5.5, 270, 0);
      var bookCol = [color, 0x1a2540, 0xe85d6b, 0x6ed089];
      for (var bi = 0; bi < 4; bi++) {
        _add(bs, new THREE.BoxGeometry(0.7, 0.18, 0.5), _mat(bookCol[bi], { r: 0.7 }), 0, 0.09 + bi * 0.18, 0, 0, (bi - 2) * 0.15, 0);
      }
    }
    else if (theme === 'civic') {
      /* 5 placard posts — scattered at random radii 5.5-8, skip pillar angles 90/210/330 */
      var placardAngles = [40, 130, 175, 285, 320];
      placardAngles.forEach(function (deg, i) {
        var r = 5.5 + (i % 3) * 0.8;
        var p = place(r, deg, 0);
        _add(p, new THREE.CylinderGeometry(0.06, 0.06, 1.4, 6), SHARED_MATS.woodMid, 0, 0.7, 0);
        _add(p, new THREE.BoxGeometry(0.55, 0.4, 0.04), SHARED_MATS.paper, 0, 1.4, 0.05, 0, 0, 0.18);
        _add(p, new THREE.BoxGeometry(0.55, 0.06, 0.045), _mat(color), 0, 1.5, 0.052, 0, 0, 0.18);
      });
      /* 2 wooden benches */
      [30, 150].forEach(function (deg) {
        var b = place(7, deg, 0);
        _add(b, new THREE.BoxGeometry(1.6, 0.1, 0.5), SHARED_MATS.woodLight, 0, 0.45, 0);
        _add(b, new THREE.BoxGeometry(0.1, 0.5, 0.5), SHARED_MATS.woodLight, -0.7, 0.25, 0);
        _add(b, new THREE.BoxGeometry(0.1, 0.5, 0.5), SHARED_MATS.woodLight,  0.7, 0.25, 0);
        _add(b, new THREE.BoxGeometry(1.6, 0.4, 0.08), SHARED_MATS.woodLight, 0, 0.7, -0.21);
      });
    }
    else if (theme === 'organ') {
      /* 3 floating donor cards */
      [30, 150, 270].forEach(function (deg, i) {
        var c = place(5.5, deg, 0);
        var card = _add(c, new THREE.BoxGeometry(0.7, 0.05, 1.0), SHARED_MATS.paper, 0, 1.3, 0);
        _add(c, new THREE.BoxGeometry(0.7, 0.055, 0.08), _mat(color), 0, 1.31, -0.4);
        card.userData.bobBase = 1.3; card.userData.bobPhase = i;
        props.userData.cards = props.userData.cards || [];
        props.userData.cards.push(card);
      });
      /* 2 hearts on pedestals */
      [60, 240].forEach(function (deg) {
        var h = place(7, deg, 0);
        _add(h, new THREE.CylinderGeometry(0.35, 0.4, 0.6, 12), _mat(0xdfe4ec, { r: 0.7 }), 0, 0.3, 0);
        var heart = new THREE.Group(); heart.position.y = 1.05; h.add(heart);
        _add(heart, new THREE.SphereGeometry(0.28, 12, 8), _mat(color, { e: color, eI: 0.3 }), -0.2, 0.05, 0);
        _add(heart, new THREE.SphereGeometry(0.28, 12, 8), _mat(color, { e: color, eI: 0.3 }),  0.2, 0.05, 0);
        _add(heart, new THREE.ConeGeometry(0.4, 0.5, 4), _mat(color, { e: color, eI: 0.3 }), 0, -0.3, 0, Math.PI, 0, 0);
      });
    }
    else if (theme === 'eko') {
      /* 3 stacked petition-paper cubes */
      [30, 150, 270].forEach(function (deg) {
        var s = place(6, deg, 0);
        for (var pi = 0; pi < 5; pi++) {
          var pmat = pi % 2 === 0 ? SHARED_MATS.paper : SHARED_MATS.paperOff;
          _add(s, new THREE.BoxGeometry(0.8, 0.1, 0.6), pmat, 0, 0.1 + pi * 0.1, 0, 0, (pi - 2) * 0.1, 0);
        }
        _add(s, new THREE.SphereGeometry(0.12, 8, 6), _mat(color, { e: color, eI: 0.4 }), 0, 0.7, 0);
      });
    }
    else if (theme === 'paw') {
      /* 3 paw-print floor markers (flat circles) */
      [40, 160, 280].forEach(function (deg) {
        var pp = place(5.5, deg, 0);
        var pad = _add(pp, new THREE.CircleGeometry(0.35, 16), _mat(color, { r: 0.85 }), 0, 0.02, 0, -Math.PI / 2);
        for (var ti = 0; ti < 4; ti++) {
          var ta = (ti / 4) * Math.PI * 2;
          _add(pp, new THREE.CircleGeometry(0.13, 12), _mat(color, { r: 0.85 }), Math.cos(ta) * 0.45, 0.025, Math.sin(ta) * 0.45, -Math.PI / 2);
        }
      });
      /* 2 food bowls */
      [120, 300].forEach(function (deg) {
        var b = place(6, deg, 0);
        _add(b, new THREE.CylinderGeometry(0.35, 0.25, 0.18, 16), SHARED_MATS.metalGry, 0, 0.09, 0);
        _add(b, new THREE.CylinderGeometry(0.28, 0.28, 0.06, 16), _mat(0x6a4a2c), 0, 0.21, 0);
      });
      /* 1 ball toy */
      var bt = place(5, 0, 0);
      _add(bt, new THREE.SphereGeometry(0.25, 16, 12), _mat(0xe85d6b, { r: 0.55 }), 0, 0.25, 0);
    }
    else if (theme === 'we') {
      /* 3 earnings jars */
      [30, 150, 270].forEach(function (deg) {
        var j = place(5.5, deg, 0);
        var jarMat = new THREE.MeshStandardMaterial({ color: 0xdfe4ec, roughness: 0.4, metalness: 0.2, transparent: true, opacity: 0.6 });
        _add(j, new THREE.CylinderGeometry(0.22, 0.18, 0.5, 12), jarMat, 0, 0.25, 0);
        _add(j, new THREE.CylinderGeometry(0.18, 0.18, 0.3, 12), SHARED_MATS.gold, 0, 0.18, 0);
      });
      /* Stacked folded-cloth (3 colors) */
      var fc = place(6, 60, 0);
      var clothCols = [color, 0x6ab8c9, 0xf4d03f];
      for (var ci = 0; ci < 3; ci++) {
        _add(fc, new THREE.BoxGeometry(0.7, 0.12, 0.5), _mat(clothCols[ci], { r: 0.7 }), 0, 0.06 + ci * 0.12, 0);
      }
      /* 4 flower buds clustered */
      var fb = place(6.5, 240, 0);
      var budCols = [color, 0xf4d03f, color, 0xf4d03f];
      for (var fi = 0; fi < 4; fi++) {
        var fa = (fi / 4) * Math.PI * 2;
        var fx = Math.cos(fa) * 0.25, fz = Math.sin(fa) * 0.25;
        _add(fb, new THREE.CylinderGeometry(0.04, 0.04, 0.4, 6), _mat(0x6ed089), fx, 0.2, fz);
        _add(fb, new THREE.IcosahedronGeometry(0.14, 0), _mat(budCols[fi], { e: budCols[fi], eI: 0.3 }), fx, 0.45, fz);
      }
    }
    else if (theme === 'global') {
      /* 3 passport stelae */
      [30, 150, 270].forEach(function (deg) {
        var s = place(6, deg, 0);
        _add(s, new THREE.BoxGeometry(0.5, 1.4, 0.15), _mat(color, { r: 0.65 }), 0, 0.7, 0);
        _add(s, new THREE.BoxGeometry(0.5, 0.08, 0.16), SHARED_MATS.gold, 0, 1.2, 0);
      });
      /* 2 compass stones */
      [60, 240].forEach(function (deg) {
        var c = place(7, deg, 0);
        _add(c, new THREE.CylinderGeometry(0.5, 0.55, 0.25, 16), SHARED_MATS.metalGry, 0, 0.13, 0);
        _add(c, new THREE.BoxGeometry(0.6, 0.04, 0.06), _mat(0xe85d6b, { e: 0xe85d6b, eI: 0.3 }), 0, 0.27, 0);
        _add(c, new THREE.BoxGeometry(0.06, 0.04, 0.6), _mat(0xe85d6b), 0, 0.27, 0);
      });
    }
    else if (theme === 'cross') {
      /* 2 stacked-document blocks */
      [30, 150].forEach(function (deg) {
        var d = place(5.5, deg, 0);
        for (var di = 0; di < 4; di++) {
          var rotJ = di === 3 ? 0.2 : 0;
          _add(d, new THREE.BoxGeometry(0.6, 0.08, 0.45), SHARED_MATS.paper, 0, 0.04 + di * 0.08, 0, 0, rotJ, 0);
        }
        _add(d, new THREE.BoxGeometry(0.06, 0.34, 0.45), _mat(0xe85d6b), 0.32, 0.2, 0);
      });
      /* 2 open-briefcases */
      [115, 285].forEach(function (deg) {
        var b = place(6.5, deg, 0);
        _add(b, new THREE.BoxGeometry(0.9, 0.12, 0.6), SHARED_MATS.woodMid, 0, 0.06, 0);
        var lid = _add(b, new THREE.BoxGeometry(0.9, 0.6, 0.08), SHARED_MATS.woodMid, 0, 0.32, -0.26, -0.4, 0, 0);
        _add(b, new THREE.BoxGeometry(0.3, 0.05, 0.15), SHARED_MATS.gold, 0, 0.16, 0.32);
      });
      /* 1 quill in inkwell */
      var q = place(5, 0, 0);
      _add(q, new THREE.CylinderGeometry(0.18, 0.22, 0.2, 12), _mat(0x1a2540, { r: 0.55, m: 0.3 }), 0, 0.1, 0);
      _add(q, new THREE.CylinderGeometry(0.02, 0.04, 0.9, 6), SHARED_MATS.paper, 0.12, 0.6, 0, 0, 0, -0.5);
      _add(q, new THREE.ConeGeometry(0.06, 0.3, 5), SHARED_MATS.paper, 0.32, 1.0, 0, 0, 0, -0.5);
    }
    else if (theme === 'dream') {
      /* 3 chalkboards */
      [30, 150, 270].forEach(function (deg) {
        var ch = place(6, deg, 0);
        _add(ch, new THREE.BoxGeometry(0.08, 1.0, 1.2), SHARED_MATS.woodMid, 0, 0.55, 0);
        _add(ch, new THREE.BoxGeometry(0.04, 0.85, 1.05), _mat(0x1a2540, { r: 0.6 }), 0.04, 0.55, 0);
        _add(ch, new THREE.CylinderGeometry(0.04, 0.04, 0.8, 6), SHARED_MATS.woodMid, 0, 0.4, -0.5, 0, 0, 0.3);
        _add(ch, new THREE.CylinderGeometry(0.04, 0.04, 0.8, 6), SHARED_MATS.woodMid, 0, 0.4, 0.5, 0, 0, -0.3);
      });
      /* 2 textbook stacks */
      [60, 240].forEach(function (deg) {
        var ts = place(5.5, deg, 0);
        var bookCols = [0xe85d6b, 0x5b89c4, 0x6ed089];
        for (var bi = 0; bi < 3; bi++) {
          _add(ts, new THREE.BoxGeometry(0.6, 0.15, 0.45), _mat(bookCols[bi], { r: 0.7 }), 0, 0.08 + bi * 0.15, 0, 0, (bi - 1) * 0.12, 0);
        }
      });
      /* 1 backpack */
      var bp = place(5, 0, 0);
      _add(bp, new THREE.BoxGeometry(0.6, 0.8, 0.4), _mat(color, { r: 0.7 }), 0, 0.4, 0);
      _add(bp, new THREE.BoxGeometry(0.5, 0.3, 0.12), _mat(0x1a2540, { r: 0.7 }), 0, 0.3, 0.21);
      _add(bp, new THREE.TorusGeometry(0.08, 0.025, 8, 12), _mat(color, { r: 0.7 }), -0.2, 0.85, 0, Math.PI / 2);
      _add(bp, new THREE.TorusGeometry(0.08, 0.025, 8, 12), _mat(color, { r: 0.7 }),  0.2, 0.85, 0, Math.PI / 2);
    }
    else if (theme === 'launch') {
      /* 3 toolbox crates */
      [30, 150, 270].forEach(function (deg) {
        var t = place(6, deg, 0);
        _add(t, new THREE.BoxGeometry(0.9, 0.5, 0.55), _mat(color, { r: 0.6, m: 0.2 }), 0, 0.25, 0);
        _add(t, new THREE.BoxGeometry(0.9, 0.08, 0.55), SHARED_MATS.slateGry, 0, 0.51, 0);
        _add(t, new THREE.TorusGeometry(0.08, 0.02, 8, 10), SHARED_MATS.slateGry, 0, 0.6, 0, Math.PI / 2);
      });
      /* 2 hard-hats */
      [60, 240].forEach(function (deg) {
        var h = place(5.5, deg, 0);
        var hat = _add(h, new THREE.SphereGeometry(0.32, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), SHARED_MATS.gold, 0, 0.2, 0);
        _add(h, new THREE.CylinderGeometry(0.34, 0.34, 0.06, 16), SHARED_MATS.gold, 0, 0.2, 0);
      });
      /* 1 flag-pin marker */
      var fp = place(5, 0, 0);
      _add(fp, new THREE.CylinderGeometry(0.04, 0.04, 1.2, 6), SHARED_MATS.metalGry, 0, 0.6, 0);
      _add(fp, new THREE.BoxGeometry(0.5, 0.3, 0.04), _mat(color), 0.25, 1.05, 0);
    }
    else if (theme === 'lawgic') {
      /* 2 open-book pedestals */
      [30, 150].forEach(function (deg) {
        var op = place(6, deg, 0);
        _add(op, new THREE.CylinderGeometry(0.4, 0.45, 0.7, 8), SHARED_MATS.woodLight, 0, 0.35, 0);
        _add(op, new THREE.BoxGeometry(0.6, 0.04, 0.5), SHARED_MATS.paper, -0.18, 0.85, 0, 0, 0, 0.25);
        _add(op, new THREE.BoxGeometry(0.6, 0.04, 0.5), SHARED_MATS.paper,  0.18, 0.85, 0, 0, 0, -0.25);
      });
      /* 2 judgment pebbles */
      [110, 290].forEach(function (deg) {
        var pe = place(5.5, deg, 0);
        var stone = _add(pe, new THREE.IcosahedronGeometry(0.3, 0), _mat(color, { e: color, eI: 0.2, flat: true }), 0, 0.15, 0);
        stone.scale.y = 0.5;
      });
      /* 1 unrolled scroll */
      var us = place(5, 270, 0);
      _add(us, new THREE.BoxGeometry(1.2, 0.04, 0.6), SHARED_MATS.paperOff, 0, 0.05, 0);
      _add(us, new THREE.CylinderGeometry(0.08, 0.08, 0.65, 12), SHARED_MATS.woodMid, -0.6, 0.05, 0, 0, 0, Math.PI / 2);
      _add(us, new THREE.CylinderGeometry(0.08, 0.08, 0.65, 12), SHARED_MATS.woodMid,  0.6, 0.05, 0, 0, 0, Math.PI / 2);
    }

    return props;
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

      /* THEMED TERRAIN — colors + densities looked up from THEME_TERRAIN per-program */
      var tt = THEME_TERRAIN[data.theme] || THEME_TERRAIN.civic;

      /* Sandy beach ring — color tuned per theme (lawgic = pale marble; eko = darker forest sand; etc.) */
      var sand = new THREE.Mesh(
        new THREE.CylinderGeometry(ISLAND_RADIUS + 2, ISLAND_RADIUS + 4, 0.6, 32),
        new THREE.MeshStandardMaterial({ color: tt.sand, roughness: 0.95 })
      );
      sand.position.y = 0.1; group.add(sand);

      /* Grass / ground plateau — themed: forest-deep on EKO, slate on Coding, marble on LAWGIC */
      var plateau = new THREE.Mesh(
        new THREE.CylinderGeometry(PLATEAU_RADIUS, ISLAND_RADIUS, 1.2, 32),
        new THREE.MeshStandardMaterial({ color: tt.grass, roughness: 0.92 })
      );
      plateau.position.y = 0.95; group.add(plateau);

      /* Rocks — count + color per theme */
      var rockMat = new THREE.MeshStandardMaterial({ color: tt.rock, flatShading: true, roughness: 0.92 });
      for (var rk = 0; rk < tt.rockCount; rk++) {
        var rang = (rk / tt.rockCount) * Math.PI * 2 + Math.random();
        var rrad = 8 + Math.random() * 10;
        var rx = Math.cos(rang) * rrad;
        var rz = Math.sin(rang) * rrad;
        var rock = new THREE.Mesh(
          new THREE.IcosahedronGeometry(1.2 + Math.random() * 1.4, 0),
          rockMat
        );
        rock.position.set(rx, 1.6 + Math.random() * 0.6, rz);
        rock.scale.set(1, 0.6, 1);
        rock.rotation.set(Math.random(), Math.random() * Math.PI, Math.random());
        group.add(rock);
      }

      /* Trees — count + trunk + foliage colors per theme */
      var trunkMat = new THREE.MeshStandardMaterial({ color: tt.trunk, roughness: 0.9 });
      var foliageMat = new THREE.MeshStandardMaterial({ color: tt.foliage, flatShading: true, roughness: 0.85 });
      for (var tr = 0; tr < tt.treeCount; tr++) {
        var tang = (tr / tt.treeCount) * Math.PI * 2 + Math.random() * 0.3;
        var trad = 14 + Math.random() * 7;
        var tx = Math.cos(tang) * trad;
        var tz = Math.sin(tang) * trad;
        var trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 1.8, 6), trunkMat);
        trunk.position.set(tx, 2.45, tz); group.add(trunk);
        var foliage = new THREE.Mesh(new THREE.IcosahedronGeometry(1.4 + Math.random() * 0.4, 0), foliageMat);
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

      /* Heraldic medallion — circular sprite with the program's symbol glyph */
      var medallion = makeIslandMedallion(data.num, data.glyph || data.num, data.color);
      medallion.position.y = 18;
      group.add(medallion);

      /* Themed centerpiece — adds program-specific landmark + props inside the pillar ring */
      var cp = buildCenterpiece(data, group);

      /* Secondary props — small environmental objects scattered around the centerpiece */
      buildIslandProps(data, group);

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
        medallion: medallion,
        x: x, z: z, visited: false, index: i, pillars: pillars,
        centerpiece: cp           /* { group, anim(t, near) } from buildCenterpiece */
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
    /* Boat stays visible offshore. Rower "leaves the paddle":
       - hide the rower (he's walking ashore as the avatar now)
       - hide the held oar
       - show the resting oar laid across the gunwale */
    ship.visible = true;
    if (ship.userData.rower) ship.userData.rower.visible = false;
    if (ship.userData.oarGroup) ship.userData.oarGroup.visible = false;
    if (ship.userData.oarRest) ship.userData.oarRest.visible = true;
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
      /* Dim the medallion to signal "explored" */
      if (currentIsland.medallion && currentIsland.medallion.material) {
        currentIsland.medallion.material.opacity = 0.5;
      }
    }
    MODE = 'sailing';
    avatar.visible = false;
    /* Rower picks up the paddle and gets back to rowing — show rower + held oar,
       hide the resting oar that was laid across the gunwale */
    if (ship.userData.rower) ship.userData.rower.visible = true;
    if (ship.userData.oarGroup) ship.userData.oarGroup.visible = true;
    if (ship.userData.oarRest) ship.userData.oarRest.visible = false;
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

  /* W/A/S/D directional buttons — held down for movement */
  touchBtns.forEach(function (b) {
    var k = b.getAttribute('data-key');
    if (!k) return;   /* skip action buttons (G, R/E) — handled below */
    var press = function (ev) { ev.preventDefault(); setKey(k, true); if (introEl && !introEl.classList.contains('is-gone')) hideIntro(); };
    var release = function (ev) { ev.preventDefault(); setKey(k, false); };
    b.addEventListener('touchstart', press, { passive: false });
    b.addEventListener('touchend', release, { passive: false });
    b.addEventListener('touchcancel', release, { passive: false });
    b.addEventListener('mousedown', press);
    b.addEventListener('mouseup', release);
    b.addEventListener('mouseleave', release);
  });

  /* Action buttons G (board/disembark) and R/E (continue/dismiss panel) — single-tap */
  var gBtn  = document.getElementById('sm3-touch-g');
  var reBtn = document.getElementById('sm3-touch-re');
  if (gBtn) {
    var gTap = function (ev) {
      ev.preventDefault();
      if (introEl && !introEl.classList.contains('is-gone')) { hideIntro(); return; }
      tryToggleMode();
    };
    gBtn.addEventListener('touchstart', gTap, { passive: false });
    gBtn.addEventListener('click', gTap);
  }
  if (reBtn) {
    var reTap = function (ev) { ev.preventDefault(); tryInteract(); };
    reBtn.addEventListener('touchstart', reTap, { passive: false });
    reBtn.addEventListener('click', reTap);
  }

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
  var headingVel = 0;   /* angular velocity for smooth, ship-like turns */
  /* Ship physics — heavy & slow, not a speedboat:
     - low accel + high friction = long ramp-up and long drift after release
     - turn rate is integrated through angular velocity so it eases in/out
     - max speed is moderate; the boat *should* feel like it has tonnage */
  var maxSpeed = 0.34, accel = 0.0045, friction = 0.988, turnSpeed = 0.0009, turnFriction = 0.93, maxTurn = 0.022;
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
    /* Forward / back — gentle ramp to maxSpeed (~3 sec to reach top) */
    if (isPressed('forward')) velocity = Math.min(velocity + accel, maxSpeed);
    else if (isPressed('back')) velocity = Math.max(velocity - accel * 1.1, -maxSpeed * 0.4);
    else velocity *= friction;   /* high friction (.988) → ship glides for many seconds */
    if (Math.abs(velocity) < 0.0006) velocity = 0;

    /* Turning — rudder builds angular velocity, then drifts back to 0 (heavy ship feel) */
    var rudder = (isPressed('left') ? 1 : 0) + (isPressed('right') ? -1 : 0);
    /* Rudder is more responsive when moving (water flow over rudder) — but never zero */
    var rudderEffectiveness = 0.35 + Math.abs(velocity) / maxSpeed * 0.65;
    headingVel += rudder * turnSpeed * rudderEffectiveness;
    /* Cap angular velocity so ship never spins frantically */
    if (headingVel > maxTurn) headingVel = maxTurn;
    if (headingVel < -maxTurn) headingVel = -maxTurn;
    /* Angular friction — when you let go of A/D, the turn coasts to a stop */
    if (rudder === 0) headingVel *= turnFriction;
    if (Math.abs(headingVel) < 0.00005) headingVel = 0;
    heading += headingVel;

    ship.position.x -= Math.sin(heading) * velocity;
    ship.position.z -= Math.cos(heading) * velocity;
    var distFromOrigin = Math.sqrt(ship.position.x * ship.position.x + ship.position.z * ship.position.z);
    if (distFromOrigin > 240) { ship.position.x *= 0.997; ship.position.z *= 0.997; }

    /* ISLAND COLLISION — push the boat back if it tries to enter any island's
       sand ring. ISLAND_RADIUS+5 keeps a safe waterline buffer so the hull
       never clips into the sand (which was making the boat "dissolve" visually). */
    var BOAT_KEEPOUT = ISLAND_RADIUS + 5;
    for (var ci = 0; ci < shoreObjs.length; ci++) {
      var iso = shoreObjs[ci];
      var icx = ship.position.x - iso.x;
      var icz = ship.position.z - iso.z;
      var icd = Math.sqrt(icx * icx + icz * icz);
      if (icd < BOAT_KEEPOUT && icd > 0.001) {
        var pushOut = BOAT_KEEPOUT / icd;
        ship.position.x = iso.x + icx * pushOut;
        ship.position.z = iso.z + icz * pushOut;
        velocity *= 0.5;     /* bleed speed on impact like running aground */
      }
    }
    /* Also keep boat away from the starting beach (origin) */
    var beachDX = ship.position.x;
    var beachDZ = ship.position.z + 5;     /* beach center is at (0, -5) */
    var beachD = Math.sqrt(beachDX * beachDX + beachDZ * beachDZ);
    if (beachD < 16 && beachD > 0.001 && beachD < distFromOrigin + 1) {
      var beachPush = 16 / beachD;
      ship.position.x = beachDX * beachPush;
      ship.position.z = -5 + beachDZ * beachPush;
    }

    var waveH = getOceanHeight(ship.position.x, ship.position.z, t);
    var grad  = getOceanGradient(ship.position.x, ship.position.z, t);
    ship.position.y += ((waveH + 0.05) - ship.position.y) * 0.22;
    var targetPitch = Math.atan(grad.nz) * 0.6;
    var targetRoll  = Math.atan(grad.nx) * 0.6;
    ship.rotation.order = 'YXZ';
    ship.rotation.y = heading + Math.PI / 2;
    ship.rotation.x += (targetPitch - ship.rotation.x) * 0.16;
    ship.rotation.z += (targetRoll  - ship.rotation.z) * 0.16;

    /* CANOE-PADDLING ANIMATION
       The paddle hangs from the rower's right (top) hand, blade dipping into
       the water on the right side of the boat. Realistic stroke cycle:
       1. CATCH — paddle planted forward, blade enters water
       2. DRIVE — pull paddle back hard, body rotates, blade pushes water back
       3. RECOVERY — lift blade out, swing forward to next catch
       Both arms move in coordination — top hand stays high, bottom hand
       traces the longer arc as the paddle pivots.
       Rate scales with velocity. Idle = slow gentle stroke; full speed = vigorous. */
    if (ship.userData.rower && ship.userData.rower.visible) {
      var ud = ship.userData;
      var speedRatio = Math.min(1, Math.abs(velocity) / 0.34);
      var strokeRate = 1.0 + speedRatio * 1.6;        /* 1.0/s idle → 2.6/s full */
      var stroke = Math.sin(t * strokeRate);          /* -1..+1, drives the cycle */
      var amp = 0.55 + speedRatio * 0.45;             /* effort: 0.55 idle → 1.0 full */

      /* CHEST LEAN — body rotates with the stroke. Lean forward at catch,
         back at drive — like real rowing rotation */
      ud.chest.rotation.x = -stroke * 0.22 * amp;
      /* Slight twist on torso (around Y) — body rotates toward paddling side on drive */
      ud.chest.rotation.y = stroke * 0.18 * amp;

      /* RIGHT SHOULDER (top hand on T-grip) — stays relatively high, moves a little */
      ud.rightShoulder.rotation.x = -0.55 + stroke * 0.30 * amp;
      ud.rightShoulder.rotation.z = -0.30;
      ud.rightElbow.rotation.x = 0.50 + Math.max(0, stroke) * 0.35 * amp;

      /* LEFT SHOULDER (bottom hand on shaft) — bigger arc, follows the paddle */
      ud.leftShoulder.rotation.x = -0.95 + stroke * 0.55 * amp;
      ud.leftShoulder.rotation.z = 0.45;
      ud.leftElbow.rotation.x = 0.85 + Math.max(0, stroke) * 0.30 * amp;

      /* PADDLE — rotates around the top-hand pivot. Forward at catch, backward
         at drive. The blade visibly arcs through the water on each stroke. */
      ud.oarGroup.rotation.x = 0.35 + stroke * 0.85 * amp;
      /* Slight side-swing for natural motion */
      ud.oarGroup.rotation.z = -0.55 + stroke * 0.10 * amp;

      /* Subtle idle breathing — chest bobs slightly even when paddling */
      ud.chest.position.y = 0.55 + Math.sin(t * 1.4) * 0.01;
    }

    wakeTimer -= dt;
    if (Math.abs(velocity) > 0.05 && wakeTimer <= 0) {
      var sternX = ship.position.x + Math.sin(heading) * 4.5;
      var sternZ = ship.position.z + Math.cos(heading) * 4.5;
      spawnWake(sternX, sternZ, ship.position.y);
      wakeTimer = 0.16;
    }

    /* Camera follow — pulled in close for the small rowboat (was 24/12 for the
       schooner). Soft lerp keeps the heavy-feel weight even though the boat is small. */
    var camDist = 11, camHeight = 5.2;
    var lookX = Math.sin(heading + lookOffset);
    var lookZ = Math.cos(heading + lookOffset);
    var targetCamX = ship.position.x + lookX * camDist;
    var targetCamZ = ship.position.z + lookZ * camDist;
    var targetCamY = camHeight + ship.position.y * 0.35;
    camera.position.x += (targetCamX - camera.position.x) * 0.06;
    camera.position.y += (targetCamY - camera.position.y) * 0.06;
    camera.position.z += (targetCamZ - camera.position.z) * 0.06;
    /* Look at the rower's chest height (boat is much shorter than schooner) */
    camera.lookAt(ship.position.x, ship.position.y + 1.4, ship.position.z);

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

    /* Shore markers + lore-pillar orbs + themed centerpieces */
    var refX = (MODE === 'sailing') ? ship.position.x : avatarPos.x;
    var refZ = (MODE === 'sailing') ? ship.position.z : avatarPos.z;
    shoreObjs.forEach(function (s) {
      s.marker.position.y = s.marker.userData.baseY + Math.sin(t * 2.2 + s.index) * 0.45;
      s.halo.rotation.z = t * 0.8 + s.index;
      s.pillars.forEach(function (p, pi) {
        p.orb.position.y = p.orb.userData.baseY + Math.sin(t * 2.5 + pi + s.index) * 0.25;
        p.halo.rotation.z = t * 1.2 + pi;
      });
      /* Themed centerpiece animation — gated by avatar/ship proximity to centerpiece origin */
      if (s.centerpiece && s.centerpiece.anim) {
        var cdx = refX - s.x;
        var cdz = refZ - s.z;
        var cdist = Math.sqrt(cdx * cdx + cdz * cdz);
        var near = MODE === 'walking' ? cdist < 14 : cdist < 30;
        s.centerpiece.anim(t, near);
      }
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

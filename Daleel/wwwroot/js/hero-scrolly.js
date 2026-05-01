// Load Three.js dynamically
function loadThreeJS() {
    return new Promise((resolve, reject) => {
        if (window.THREE) { resolve(); return; }
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        s.onload = resolve;
        s.onerror = () => reject(new Error('Failed to load Three.js'));
        document.head.appendChild(s);
    });
}

loadThreeJS().then(() => {
    // ═══════════════════════════════════════
    // THREE.JS PARTICLE NETWORK BACKGROUND
    // ═══════════════════════════════════════
    (function () {
        const canvas = document.getElementById('scrolly-canvas');
        if (!canvas) return;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        // Particles
        const particleCount = 450;
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 60;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
            velocities.push({
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.01
            });
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0x00B2EC,
            size: 0.15,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // Connection lines
        const linesMaterial = new THREE.LineBasicMaterial({
            color: 0x00B2EC,
            transparent: true,
            opacity: 0.08,
            blending: THREE.AdditiveBlending
        });

        let lines = new THREE.LineSegments(new THREE.BufferGeometry(), linesMaterial);
        scene.add(lines);

        // ── Theme-aware particle & renderer colors ──────────────────────────
        // Reads current theme on init AND re-applies whenever the user toggles.

        function _applyThemeColors() {
            const isDark = document.documentElement.classList.contains('dark');

            // Particles: cyan in dark, darker navy/blue in light
            particleMaterial.color.setHex(isDark ? 0x00B2EC : 0x1D3166);
            particleMaterial.opacity = isDark ? 0.4 : 0.3;
            particleMaterial.size = isDark ? 0.15 : 0.12;
            particleMaterial.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;

            // Connection lines
            linesMaterial.color.setHex(isDark ? 0x00B2EC : 0x1D3166);
            linesMaterial.opacity = isDark ? 0.08 : 0.05;
            linesMaterial.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;

            // Ambient glow divs
            const glow1 = document.getElementById('glow-1');
            const glow2 = document.getElementById('glow-2');
            if (glow1) {
                glow1.style.background = isDark
                    ? 'radial-gradient(circle, rgba(0,178,236,0.20) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(0,178,236,0.10) 0%, transparent 70%)';
            }
            if (glow2) {
                glow2.style.background = isDark
                    ? 'radial-gradient(circle, rgba(239,65,35,0.12) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(239,65,35,0.06) 0%, transparent 70%)';
            }

            // Canvas is always transparent
            renderer.setClearColor(0x000000, 0);
        }
        _applyThemeColors();
        document.addEventListener('daleel:theme-changed', _applyThemeColors);

        // Mouse interaction
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        function updateLines() {
            const linePositions = [];
            const maxDist = 10;
            const pos = particleGeometry.attributes.position.array;

            for (let i = 0; i < particleCount; i++) {
                for (let j = i + 1; j < particleCount; j++) {
                    const dx = pos[i * 3] - pos[j * 3];
                    const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
                    const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist < maxDist) {
                        linePositions.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
                        linePositions.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
                    }
                }
            }

            lines.geometry.dispose();
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
            lines.geometry = geo;
        }

        function animate() {
            requestAnimationFrame(animate);

            const pos = particleGeometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                pos[i * 3] += velocities[i].x;
                pos[i * 3 + 1] += velocities[i].y;
                pos[i * 3 + 2] += velocities[i].z;

                // Wrap around
                if (Math.abs(pos[i * 3]) > 30) velocities[i].x *= -1;
                if (Math.abs(pos[i * 3 + 1]) > 20) velocities[i].y *= -1;
                if (Math.abs(pos[i * 3 + 2]) > 15) velocities[i].z *= -1;
            }
            particleGeometry.attributes.position.needsUpdate = true;

            // Update connections every 3 frames for performance
            if (Math.random() < 0.33) updateLines();

            // Mouse parallax
            camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
            camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    })();
}).catch(err => console.error("ThreeJS load error:", err));

// ═══════════════════════════════════════
// SLIDER CONTROLLER (5 SLIDES)
// ═══════════════════════════════════════
(function () {
    const TOTAL_SLIDES = 5;
    let activeIndex = 0;
    let autoPlayInterval;

    const scrollySection = document.getElementById('main-scrolly');
    if (!scrollySection) return;

    const slides = scrollySection.querySelectorAll('.story-slide');
    const fills = scrollySection.querySelectorAll('.step-fill');
    const dots = scrollySection.querySelectorAll('.step-dot');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');

    function updateSlider(index) {
        // Wrap around
        if (index >= TOTAL_SLIDES) activeIndex = 0;
        else if (index < 0) activeIndex = TOTAL_SLIDES - 1;
        else activeIndex = index;

        slides.forEach((slide, i) => {
            if (i === activeIndex) {
                slide.style.opacity = '1';
                slide.style.transform = 'translateY(0)';
                slide.style.pointerEvents = 'auto';
            } else {
                slide.style.opacity = '0';
                slide.style.transform = i < activeIndex ? 'translateY(-20px)' : 'translateY(20px)';
                slide.style.pointerEvents = 'none';
            }
        });

        fills.forEach((fill, i) => {
            if (i === activeIndex) {
                fill.style.height = '100%';
            } else {
                fill.style.height = '0%';
            }
        });
    }

    function nextSlide() {
        updateSlider(activeIndex + 1);
        resetAutoPlay();
    }

    function prevSlide() {
        updateSlider(activeIndex - 1);
        resetAutoPlay();
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            updateSlider(activeIndex + 1);
        }, 5000); // 5 seconds per slide
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // Event Listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            updateSlider(i);
            resetAutoPlay();
        });
    });

    // Initialize
    updateSlider(0);
    startAutoPlay();

})();

// ═══════════════════════════════════════
// INTERACTIVE DATA CORE ANIMATION
// ═══════════════════════════════════════
loadThreeJS().then(() => {
    const canvas = document.getElementById('interactive-core-canvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    const container = canvas.parentElement;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 12;

    const coreSet = new THREE.Group();
    scene.add(coreSet);

    // Inner glowing sphere
    const sphereGeo = new THREE.SphereGeometry(2, 32, 32);
    const sphereMat = new THREE.MeshPhongMaterial({
        color: 0x10B981,
        emissive: 0x00B2EC,
        emissiveIntensity: 0.5,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    const core = new THREE.Mesh(sphereGeo, sphereMat);
    coreSet.add(core);

    // Orbiting rings
    const ringColors = [0x00B2EC, 0x10B981, 0xF9A01B];
    const rings = [];
    for(let i=0; i<3; i++) {
        const ringGeo = new THREE.TorusGeometry(3 + i*0.8, 0.05, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({ color: ringColors[i], transparent: true, opacity: 0.6 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        rings.push({
            mesh: ring,
            speedX: (Math.random() - 0.5) * 0.02,
            speedY: (Math.random() - 0.5) * 0.02
        });
        coreSet.add(ring);
    }

    // Particles around core
    const particleGeo = new THREE.BufferGeometry();
    const pCount = 200;
    const pPos = new Float32Array(pCount * 3);
    for(let i=0; i<pCount*3; i++) {
        pPos[i] = (Math.random() - 0.5) * 15;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x00B2EC, size: 0.1, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const particleSystem = new THREE.Points(particleGeo, pMat);
    coreSet.add(particleSystem);

    // Lighting
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    let mouseX = 0; let mouseY = 0;
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouseY = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;
    });

    function animate() {
        requestAnimationFrame(animate);
        
        core.rotation.y += 0.005;
        core.rotation.x += 0.002;

        rings.forEach(r => {
            r.mesh.rotation.x += r.speedX;
            r.mesh.rotation.y += r.speedY;
        });

        particleSystem.rotation.y -= 0.002;

        // Mouse interaction
        coreSet.rotation.y += (mouseX * 0.5 - coreSet.rotation.y) * 0.05;
        coreSet.rotation.x += (-mouseY * 0.5 - coreSet.rotation.x) * 0.05;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        if(!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}).catch(err => console.error("ThreeJS load error for Data Core:", err));


// JavaScript Logic for Hassnaa's Graduation Celebration Website

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Canvas Animation System (Petals & Confetti)
    // ----------------------------------------------------
    const canvas = document.getElementById('canvas-overlay');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const maxPetals = 40; // Default background density

    // Flower Petal Class
    class Petal {
        constructor(isBurst = false) {
            this.isBurst = isBurst;
            this.reset();
            if (isBurst) {
                // Spawn randomly from center-bottom or scattered for burst
                this.y = Math.random() * height * 0.6 + height * 0.2;
                this.x = Math.random() * width;
                this.vy = -(Math.random() * 4 + 2); // Shoot up
                this.vx = Math.random() * 6 - 3;
            }
        }

        reset() {
            this.x = Math.random() * width;
            this.y = this.isBurst ? height + 20 : Math.random() * -height;
            this.r = Math.random() * 8 + 6; // Petal radius
            this.opacity = Math.random() * 0.5 + 0.4;
            // Pastel Rose/Pink colors
            const hues = [340, 350, 0, 10];
            this.color = `hsla(${hues[Math.floor(Math.random() * hues.length)]}, 90%, 80%, ${this.opacity})`;
            this.vy = Math.random() * 1.5 + 1; // Falling speed
            this.vx = Math.random() * 1 - 0.5; // Horizontal drift
            this.wobble = Math.random() * Math.PI;
            this.wobbleSpeed = Math.random() * 0.02 + 0.01;
        }

        update() {
            this.y += this.vy;
            this.x += this.vx + Math.sin(this.wobble) * 0.5;
            this.wobble += this.wobbleSpeed;

            // Fade out as it goes down if it's a burst particle
            if (this.isBurst) {
                this.vy += 0.05; // Gravity effect
                if (this.vy > 2) this.vy = 2; // Terminal velocity
            }

            // Recycle background petals, let burst petals die off
            if (this.y > height + 20) {
                if (this.isBurst) {
                    const idx = particles.indexOf(this);
                    if (idx > -1) particles.splice(idx, 1);
                } else {
                    this.reset();
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.wobble);
            // Draw a petal shape (curved path)
            ctx.fillStyle = this.color;
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.r, -this.r, -this.r * 1.5, this.r / 2, 0, this.r * 1.5);
            ctx.bezierCurveTo(this.r * 1.5, this.r / 2, this.r, -this.r, 0, 0);
            ctx.fill();
            ctx.restore();
        }
    }

    // Confetti Class (for celebration bursts)
    class Confetti {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height * 0.5 + height * 0.2;
            this.r = Math.random() * 6 + 4;
            this.color = `hsl(${Math.random() * 360}, 90%, 65%)`; // Rainbow colors
            this.vy = -(Math.random() * 8 + 4); // Burst upwards
            this.vx = Math.random() * 8 - 4;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 10 - 5;
            this.opacity = 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.15; // Gravity
            this.rotation += this.rotationSpeed;
            this.opacity -= 0.01;

            if (this.y > height || this.opacity <= 0) {
                const idx = particles.indexOf(this);
                if (idx > -1) particles.splice(idx, 1);
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            // Draw rectangle confetti
            ctx.fillRect(-this.r, -this.r / 2, this.r * 2, this.r);
            ctx.restore();
        }
    }

    // Initialize default background petals
    for (let i = 0; i < maxPetals; i++) {
        particles.push(new Petal(false));
    }

    // Main animation loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Limit the rendering to save performance if there are too many particles
        for (let i = 0; i < particles.length; i++) {
            if (particles[i]) {
                particles[i].update();
                if (particles[i]) particles[i].draw();
            }
        }

        requestAnimationFrame(animate);
    }
    animate();

    // Trigger celebration burst
    function triggerCelebration(count = 80) {
        // Confetti burst
        for (let i = 0; i < count; i++) {
            particles.push(new Confetti());
        }
        // Petals burst
        for (let i = 0; i < count / 2; i++) {
            particles.push(new Petal(true));
        }
        playChime();
    }

    // Synthesized magical chime sound (Web Audio API)
    function playChime() {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;
            const audioCtx = new AudioContextClass();
            const now = audioCtx.currentTime;

            const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
            notes.forEach((freq, index) => {
                const osc = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + index * 0.08);

                gainNode.gain.setValueAtTime(0, now + index * 0.08);
                gainNode.gain.linearRampToValueAtTime(0.2, now + index * 0.08 + 0.03);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.8);

                osc.connect(gainNode);
                gainNode.connect(audioCtx.destination);

                osc.start(now + index * 0.08);
                osc.stop(now + index * 0.08 + 0.9);
            });
        } catch (e) {
            console.log("AudioContext blocked or unsupported: ", e);
        }
    }


    // ----------------------------------------------------
    // 2. Music Player Controller
    // ----------------------------------------------------
    const musicPlayer = document.getElementById('music-player');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const tooltip = musicPlayer.querySelector('.music-tooltip');

    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                musicToggle.classList.add('playing');
                tooltip.textContent = "Mute music 🎵";
            }).catch(err => {
                console.log("Play failed: ", err);
            });
        } else {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            tooltip.textContent = "Play music 🎵";
        }
    });

    // Suggest music activation on first scroll or click
    const startMusicOnInteraction = () => {
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                musicToggle.classList.add('playing');
                tooltip.textContent = "Mute music 🎵";
            }).catch(() => {});
        }
        window.removeEventListener('click', startMusicOnInteraction);
        window.removeEventListener('scroll', startMusicOnInteraction);
    };
    window.addEventListener('click', startMusicOnInteraction);
    window.addEventListener('scroll', startMusicOnInteraction);


    // ----------------------------------------------------
    // 3. Envelope / Letter Interaction
    // ----------------------------------------------------
    const envelope = document.getElementById('envelope');
    const envelopeWrapper = envelope.parentElement;

    envelope.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid triggering page click listener
        envelopeWrapper.classList.toggle('open');
        if (envelopeWrapper.classList.contains('open')) {
            playChime();
        }
    });


    // ----------------------------------------------------
    // 4. Automatic Rose Bouquet Presentation Logic
    // ----------------------------------------------------
    const flowerContainer = document.getElementById('flower-container');
    const bouquetPaper = document.getElementById('bouquet-paper');
    const celebrateBouquetBtn = document.getElementById('celebrate-bouquet-btn');

    // Preset positions for a lush, balanced, multi-colored rose bouquet
    const presetRoses = [
        // Background layer
        { type: 'white-rose', x: 25, y: 15, rot: -22, scale: 0.95 },
        { type: 'pink-rose', x: 45, y: 10, rot: 5, scale: 0.98 },
        { type: 'white-rose', x: 65, y: 18, rot: 25, scale: 0.96 },
        
        // Mid-ground layer
        { type: 'yellow-rose', x: 32, y: 28, rot: -10, scale: 1.02 },
        { type: 'peach-rose', x: 55, y: 24, rot: 12, scale: 1.0 },
        { type: 'red-rose', x: 15, y: 35, rot: -28, scale: 1.05 },
        { type: 'pink-rose', x: 74, y: 32, rot: 28, scale: 1.03 },
        
        // Foreground layer
        { type: 'peach-rose', x: 28, y: 48, rot: -15, scale: 1.01 },
        { type: 'yellow-rose', x: 48, y: 42, rot: 8, scale: 0.98 },
        { type: 'red-rose', x: 68, y: 46, rot: 18, scale: 1.04 },
        { type: 'red-rose', x: 42, y: 58, rot: -5, scale: 1.06 },
    ];

    const flowerEmojis = {
        'red-rose': '🌹',
        'pink-rose': '🌹',
        'white-rose': '🌹',
        'yellow-rose': '🌹',
        'peach-rose': '🌹'
    };

    let hasBloomed = false;

    // Pluck tone synthesis
    function playSinglePluck(frequency) {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;
            const audioCtx = new AudioContextClass();
            const now = audioCtx.currentTime;

            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(frequency, now);

            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.12, now + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.6);
        } catch (e) {}
    }

    // Sequentially bloom roses
    function bloomRoses() {
        if (hasBloomed) return;
        hasBloomed = true;

        // Frequencies for a beautiful ascending scale as flowers bloom
        const scaleFreqs = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 783.99];

        presetRoses.forEach((rose, index) => {
            setTimeout(() => {
                const flowerEl = document.createElement('div');
                flowerEl.className = `placed-flower ${rose.type}`;
                flowerEl.textContent = flowerEmojis[rose.type];
                flowerEl.style.left = `${rose.x}%`;
                flowerEl.style.top = `${rose.y}%`;
                flowerEl.style.transform = `rotate(${rose.rot}deg) scale(${rose.scale})`;
                flowerEl.style.zIndex = Math.floor(rose.y);
                
                flowerContainer.appendChild(flowerEl);

                // Play synthesized note
                playSinglePluck(scaleFreqs[index] || 523.25);

                // If it's the last flower, trigger wrapping paper bow and burst
                if (index === presetRoses.length - 1) {
                    setTimeout(() => {
                        bouquetPaper.classList.add('wrapped');
                        triggerCelebration(80);
                    }, 500);
                }
            }, index * 200);
        });
    }

    // Scroll trigger using IntersectionObserver
    const observerOptions = {
        root: null,
        threshold: 0.35 // Trigger when 35% of the section is visible
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const bouquetSection = document.getElementById('bouquet-section');
    if (bouquetSection) {
        sectionObserver.observe(bouquetSection);
    }

    // Bind celebration button in the card
    if (celebrateBouquetBtn) {
        celebrateBouquetBtn.addEventListener('click', () => {
            triggerCelebration(120);
        });
    }


    // ----------------------------------------------------
    // 5. Celebration Button Event Listener
    // ----------------------------------------------------
    const celebrateBtn = document.getElementById('celebrate-btn');
    celebrateBtn.addEventListener('click', () => {
        triggerCelebration(120);
    });

    // Smooth Scroll Link Handler
    const scrollLinks = document.querySelectorAll('.scroll-link');
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});



function sendTracking(eventName, actionName) {

    const ua = navigator.userAgent;


    // Detect Device
    let device = "Desktop";

    if (/Mobi|Android/i.test(ua)) {
        device = "Mobile";
    } 
    else if (/Tablet|iPad/i.test(ua)) {
        device = "Tablet";
    }


    // Detect Mobile Type
    let mobileType = "Not Mobile";

    if (/Android/i.test(ua)) {
        mobileType = "Android";
    }
    else if (/iPhone/i.test(ua)) {
        mobileType = "iPhone";
    }
    else if (/iPad/i.test(ua)) {
        mobileType = "iPad";
    }


    // Detect OS
    let osVersion = "Unknown";


    if (/Windows NT 10/i.test(ua)) {
        osVersion = "Windows 10/11";
    }
    else if (/Android/i.test(ua)) {
        osVersion = ua.match(/Android\s[\d.]+/)[0];
    }
    else if (/iPhone OS/i.test(ua)) {
        osVersion = ua.match(/iPhone OS\s[\d_]+/)[0];
    }
    else if (/Mac OS X/i.test(ua)) {
        osVersion = "MacOS";
    }



    // Detect Browser

    let browser="Unknown";


    if(ua.includes("Chrome")){
        browser="Chrome";
    }
    else if(ua.includes("Firefox")){
        browser="Firefox";
    }
    else if(ua.includes("Safari")){
        browser="Safari";
    }
    else if(ua.includes("Edge")){
        browser="Edge";
    }



    const data = {

        timestamp:
        new Date().toLocaleString(),

        event:eventName,

        page:
        window.location.pathname,

        action:
        actionName,


        device:device,

        mobileType:mobileType,

        osVersion:osVersion,

        browser:browser,

        userAgent:ua,


        screen:
        `${screen.width}x${screen.height}`

    };



    fetch("https://script.google.com/macros/s/AKfycbwBZicH7feY9i2DQPy6XlCJI3gbAZEsSVUZvnX8WAPdpyadB5mB9nJPykLCFMRasOTC/exec",{

        method:"POST",

        body:
        JSON.stringify(data)

    });


}



// When user opens website

sendTracking(
    "Page View",
    "Opened Website"
);





// ================= USER TRACKING SYSTEM =================


function sendTracking(eventName, actionName) {


    const ua = navigator.userAgent;



    // ---------------- DEVICE ----------------

    let device = "Desktop";


    if (/Mobi|Android/i.test(ua)) {

        device = "Mobile";

    }

    else if (/Tablet|iPad/i.test(ua)) {

        device = "Tablet";

    }



    // ---------------- MOBILE TYPE ----------------


    let mobileType = "Not Mobile";


    if (/Android/i.test(ua)) {

        mobileType = "Android";

    }

    else if (/iPhone/i.test(ua)) {

        mobileType = "iPhone";

    }

    else if (/iPad/i.test(ua)) {

        mobileType = "iPad";

    }



    // ---------------- OS VERSION ----------------


    let osVersion = "Unknown";


    if (/Windows NT 10/i.test(ua)) {

        osVersion = "Windows 10/11";

    }


    else if (/Android/i.test(ua)) {


        let android = ua.match(/Android\s[\d.]+/);


        if(android){

            osVersion = android[0];

        }


    }


    else if (/iPhone OS/i.test(ua)) {


        let ios = ua.match(/iPhone OS\s[\d_]+/);


        if(ios){

            osVersion = ios[0];

        }


    }


    else if (/Mac OS X/i.test(ua)) {

        osVersion = "MacOS";

    }



    // ---------------- BROWSER ----------------


    let browser = "Unknown";


    if(ua.includes("Edg")){


        browser = "Edge";

    }


    else if(ua.includes("Chrome")){


        browser = "Chrome";

    }


    else if(ua.includes("Firefox")){


        browser = "Firefox";

    }


    else if(ua.includes("Safari")){


        browser = "Safari";

    }




    // ---------------- DATA ----------------


    const data = {


        timestamp:

        new Date().toLocaleString(),


        event:

        eventName,


        page:

        window.location.pathname,


        action:

        actionName,



        device:

        device,



        mobileType:

        mobileType,



        osVersion:

        osVersion,



        browser:

        browser,



        userAgent:

        ua,



        screen:

        `${screen.width}x${screen.height}`


    };





    // ---------------- SEND TO GOOGLE SHEET ----------------


    fetch(

        "https://script.google.com/macros/s/AKfycbwBZicH7feY9i2DQPy6XlCJI3gbAZEsSVUZvnX8WAPdpyadB5mB9nJPykLCFMRasOTC/exec",

        {


            method:"POST",


            mode:"no-cors",


            headers:{


                "Content-Type":

                "application/json"


            },


            body:

            JSON.stringify(data)


        }


    );


}






// ================= AUTOMATIC PAGE VIEW =================



window.addEventListener("load",()=>{


    sendTracking(

        "Page View",

        "Opened Website"

    );


});







// ================= AUTO BUTTON TRACKING =================



document.addEventListener("DOMContentLoaded",()=>{


    document.querySelectorAll("button,a").forEach(element=>{


        element.addEventListener("click",()=>{


            sendTracking(


                "Click",


                element.innerText.trim()


            );


        });


    });


});
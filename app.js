/**
 * TITAN FORGE™ | Ultra-Performance Gym Core JavaScript Engine
 * Author: Titan Forge Engineering
 */

// ==========================================
// 1. WEB AUDIO SYNTHESIS ENGINE (SFX)
// ==========================================
let audioContext = null;
let soundEnabled = true;

function initAudio() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioContext = new AudioContextClass();
    }
  }
}

function playTone(freq, type = 'sine', duration = 0.12, gainValue = 0.08) {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    if (!audioContext) return;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioContext.currentTime);

    gain.gain.setValueAtTime(gainValue, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + duration);
  } catch (e) {
    // Graceful fallback if audio is restricted by browser policy
  }
}

function playSuccessChord() {
  if (!soundEnabled) return;
  setTimeout(() => playTone(523.25, 'triangle', 0.25, 0.08), 0);   // C5
  setTimeout(() => playTone(659.25, 'triangle', 0.25, 0.08), 80);  // E5
  setTimeout(() => playTone(783.99, 'triangle', 0.35, 0.09), 160); // G5
  setTimeout(() => playTone(1046.5, 'triangle', 0.45, 0.1), 240);  // C6
}

function playClickSound() {
  playTone(880, 'sine', 0.05, 0.04);
}

// Sound toggle button in header
const soundToggle = document.getElementById('soundToggle');
const soundIcon = document.getElementById('soundIcon');
const soundLabel = document.getElementById('soundLabel');

if (soundToggle) {
  soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      playTone(660, 'triangle', 0.15, 0.06);
      if (soundIcon) soundIcon.setAttribute('data-lucide', 'volume-2');
      if (soundLabel) soundLabel.textContent = 'SFX ON';
      showToast('Sound Effects Activated', 'High-energy UI audio feedback enabled.', 'success');
    } else {
      if (soundIcon) soundIcon.setAttribute('data-lucide', 'volume-x');
      if (soundLabel) soundLabel.textContent = 'SFX OFF';
      showToast('Sound Muted', 'Audio feedback disabled.', 'info');
    }
    if (window.lucide) lucide.createIcons();
  });
}

// ==========================================
// 2. LIVE OCCUPANCY SIMULATOR & TICKER
// ==========================================
function updateOccupancy() {
  const el = document.getElementById('liveOccupancyNum');
  if (el) {
    // Random subtle fluctuation between 58% and 76%
    const current = parseInt(el.textContent, 10) || 64;
    const delta = (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3);
    let next = current + delta;
    if (next < 52) next = 56;
    if (next > 79) next = 73;
    el.textContent = `${next}%`;
  }
}
setInterval(updateOccupancy, 6000);

// ==========================================
// 3. NUMBER COUNTERS (HERO METRICS)
// ==========================================
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const duration = 1800;
    const stepTime = 30;
    const totalSteps = duration / stepTime;
    const increment = target / totalSteps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        counter.textContent = Math.ceil(current).toLocaleString();
      }
    }, stepTime);
  });
}
window.addEventListener('load', animateCounters);

// ==========================================
// 4. MOBILE MENU CONTROLS
// ==========================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    playClickSound();
    mobileMenu.classList.toggle('hidden');
  });
}

function closeMobileMenu() {
  if (mobileMenu) {
    mobileMenu.classList.add('hidden');
  }
}

// ==========================================
// 5. FACILITY ZONES SHOWCASE DATA & SWITCHER
// ==========================================
const facilityZones = [
  {
    category: "ZONE 01 // HEAVY HYPERTROPHY & BARBELL SPORTS",
    title: "OLYMPIC POWER & HEAVY IRON LAB",
    description: "Equipped with 14 calibrated Eleiko competition platforms, custom dumbbell runs up to 180 lbs, custom monolifts, and vibration-damped high-impact drop zones.",
    spec1: "ELEIKO IPF / ROGUE MONOLIFTS",
    spec2: "18°C (OPTIMAL FORCE PRODUCTION)",
    spec3: "100% UNRESTRICTED CHALK & DROPS",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
    caption: "PLATFORMS 1-14 CALIBRATED TO IPF STANDARDS"
  },
  {
    category: "ZONE 02 // ENDURANCE ENGINE & LACTATE TESTING",
    title: "BIOMETRIC HYROX & METCON TRACK",
    description: "Dedicated 60-meter athletic turf lane, Rogue Echo Bikes, Concept2 SkiErgs, calibrated sled pushes, and live heart-rate monitoring telemetric screens.",
    spec1: "CONCEPT2 / ROGUE ECHO BIKES / TURF",
    spec2: "19°C WITH DYNAMIC AIRFLOW VENTS",
    spec3: "OFFICIAL HYROX ACCREDITED VENUE",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    caption: "60-METER SPRINTS & HIGH-VOLUME SLUGGER BAYS"
  },
  {
    category: "ZONE 03 // CONTRAST RECOVERY & BIOHACKING",
    title: "CONTRAST SPA, CRYO & FINNISH SAUNA",
    description: "Biohacking recovery suite featuring twin 4°C cold plunge ice pools, 90°C cedar dry sauna, -110°C whole-body cryotherapy chamber, and Normatec compression lounge.",
    spec1: "TWIN ICELAB PLUNGES & 90°C CEDAR SAUNA",
    spec2: "MICRO-PURIFIED OXYGENATED ATMOSPHERE",
    spec3: "ACCELERATED CNS RECOVERY PROTOCOLS",
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80",
    caption: "FULL FASCIAL RESTORATION & VASCULAR CONTRAST"
  },
  {
    category: "ZONE 04 // COMBAT STRIKING & OCTAGON",
    title: "TITAN COMBAT & STRIKING ARENA",
    description: "Full-scale championship boxing ring, 18 heavy teardrop bags, Muay Thai kicking pads, and Olympic wrestling tatami mats for elite striking and conditioning.",
    spec1: "FAIRTEX LEATHER BAGS & 20FT RING",
    spec2: "HIGH-TENSILE SHOCK-ABSORBING FLOOR",
    spec3: "COACHED BY PRO COMBAT VETERANS",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1200&q=80",
    caption: "STRIKING, CLINCHING & POWER ENDURANCE BAYS"
  },
  {
    category: "ZONE 05 // NUTRITION & BIOHACKING BAR",
    title: "SMART REFUEL & BIOHACK LOUNGE",
    description: "Cold-pressed amino elixirs, grass-fed isolate protein shakes, electrolyte recovery mocktails, and continuous biometric InBody 970 diagnostic stations.",
    spec1: "GRASS-FED ISOLATE / ORGANIC PEPTIDES",
    spec2: "CUSTOM PRE & POST WORKOUT ELIXIRS",
    spec3: "INBODY 970 RESEARCH GRADE BODY SCAN",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    caption: "PREMIUM NUTRITIONAL ARCHITECTURE"
  }
];

function switchZone(index) {
  playClickSound();
  const zone = facilityZones[index];
  if (!zone) return;

  // Update tabs
  const tabs = document.querySelectorAll('.zone-tab');
  tabs.forEach((tab, i) => {
    if (i === index) {
      tab.classList.add('bg-brand-volt', 'text-black');
      tab.classList.remove('text-zinc-400', 'hover:text-white');
    } else {
      tab.classList.remove('bg-brand-volt', 'text-black');
      tab.classList.add('text-zinc-400', 'hover:text-white');
    }
  });

  // Smooth content swap
  const catEl = document.getElementById('zoneCategory');
  const titleEl = document.getElementById('zoneTitle');
  const descEl = document.getElementById('zoneDescription');
  const spec1El = document.getElementById('zoneSpec1');
  const spec2El = document.getElementById('zoneSpec2');
  const spec3El = document.getElementById('zoneSpec3');
  const imgEl = document.getElementById('zoneImage');
  const subCapEl = document.getElementById('zoneSubCaption');

  if (catEl) catEl.textContent = zone.category;
  if (titleEl) titleEl.textContent = zone.title;
  if (descEl) descEl.textContent = zone.description;
  if (spec1El) spec1El.textContent = zone.spec1;
  if (spec2El) spec2El.textContent = zone.spec2;
  if (spec3El) spec3El.textContent = zone.spec3;
  if (subCapEl) subCapEl.textContent = zone.caption;

  if (imgEl) {
    imgEl.style.opacity = '0.4';
    setTimeout(() => {
      imgEl.src = zone.image;
      imgEl.style.opacity = '1';
    }, 180);
  }
}

// ==========================================
// 6. INTERACTIVE MUSCLE TARGETER & EXERCISE LAB
// ==========================================
const muscleData = {
  chest: {
    category: "PRIMARY MOVER: PECTORALIS MAJOR & MINOR",
    title: "CHEST & ANTERIOR UPPER BODY",
    heroExercise: "INCLINE DUMBBELL BENCH PRESS",
    bio: "Maximize tension across clavicular and sternocostal muscle fibres with calibrated free weights and converges-axis machines.",
    cue: "Retract your scapula, plant feet firmly, maintain 45° elbow angle, and initiate tension through the chest fibres rather than driving through the front delts.",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
    machineCount: "14 DEDICATED ELEIKO & HAMMER MACHINES",
    exercises: [
      { name: "30° Incline Barbell Press", sets: "4 Sets", reps: "6 - 8 Reps", machine: "Eleiko Competition Bench", cue: "Lower to upper chest, explosive lockout" },
      { name: "Hammer Strength Iso-Lateral Chest Press", sets: "3 Sets", reps: "8 - 10 Reps", machine: "Hammer Strength Plate Loaded", cue: "Deep stretch at bottom, 1-sec squeeze" },
      { name: "Low-to-High Cable Flyes", sets: "3 Sets", reps: "12 - 15 Reps", machine: "Dual Adjustable Pulley", cue: "Drive elbows together for peak upper pec contraction" }
    ]
  },
  back: {
    category: "PRIMARY MOVER: LATISSIMUS DORSI, TRAPS & RHOMBOIDS",
    title: "LATS & POSTERIOR CHAIN ANCHOR",
    heroExercise: "CHEST-SUPPORTED T-BAR ROW",
    bio: "Build an impenetrable back with horizontal pulling, vertical lat pulldowns, and heavy isometric deadlifts.",
    cue: "Drive elbows backward toward your hip pockets rather than pulling with biceps. Hold full stretch at extension for maximum fiber recruitment.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    machineCount: "16 DEDICATED ROWS & PULLDOWN STATIONS",
    exercises: [
      { name: "Heavy Deficit Deadlift", sets: "4 Sets", reps: "5 Reps", machine: "Oak Lifting Platform & IPF Bar", cue: "Leg drive off floor, neutral cervical spine" },
      { name: "Chest-Supported T-Bar Row", sets: "4 Sets", reps: "8 - 10 Reps", machine: "Titan Heavy T-Bar Bay", cue: "Drive elbows back, pause at contraction" },
      { name: "Mag-Grip Neutral Lat Pulldown", sets: "3 Sets", reps: "10 - 12 Reps", machine: "Keiser Biometric Cable Bay", cue: "Depress scapula before initiating pull" }
    ]
  },
  shoulders: {
    category: "PRIMARY MOVER: DELTOIDS (ANTERIOR, LATERAL & REAR)",
    title: "DELTOIDS & 3D SHOULDER CANNONBALLS",
    heroExercise: "SEATED DUMBBELL OVERHEAD PRESS",
    bio: "Develop boulder shoulders through overhead compound pressing and isolated abduction across the full range of motion.",
    cue: "Slight forward torso lean on lateral raises to target the lateral head without trapping nerve pathways. Never shrug upwards.",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
    machineCount: "11 DEDICATED PRESS & LATERAL STATIONS",
    exercises: [
      { name: "Seated Dumbbell Overhead Press", sets: "4 Sets", reps: "6 - 8 Reps", machine: "Rogue 75° Incline Bench", cue: "Touch dumbbells at top without slamming" },
      { name: "Egyptian Cable Lateral Raise", sets: "4 Sets", reps: "12 - 15 Reps", machine: "Single Arm Cable Column", cue: "Keep wrist and elbow aligned through arc" },
      { name: "Reverse Pec Deck Rear Delts", sets: "3 Sets", reps: "15 - 20 Reps", machine: "Technogym Pure Rear Deltoid", cue: "Thumbs down grip for posterior head focus" }
    ]
  },
  arms: {
    category: "PRIMARY MOVER: BICEPS BRACHII & TRICEPS BRACHII",
    title: "ARMS, PEAKS & HORSE-SHOE TRICEPS",
    heroExercise: "PREACHER CURL & OVERHEAD EXTENSION",
    bio: "Compound tricep pressing paired with strict elbow-locked bicep flexion for complete arm development.",
    cue: "Lock elbows in place against the ribs or preacher pad. Do not swing hips for false momentum; let the arm muscle do 100% of the mechanical work.",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
    machineCount: "10 DEDICATED ARM CONSOLES & CURL PADS",
    exercises: [
      { name: "Incline Dumbbell Bicep Curl", sets: "3 Sets", reps: "10 - 12 Reps", machine: "45° Incline Bench", cue: "Supinate wrist hard at peak contraction" },
      { name: "Cross-Cable Tricep Pushdown", sets: "4 Sets", reps: "12 - 15 Reps", machine: "Dual Cable Tower", cue: "Flaring out cables at bottom for lateral head" },
      { name: "Barbell Spider Curl", sets: "3 Sets", reps: "10 Reps", machine: "Eleiko EZ-Curl Olympic Bar", cue: "Full stretch at dead bottom" }
    ]
  },
  legs: {
    category: "PRIMARY MOVER: QUADRICEPS, HAMSTRINGS & GLUTEALS",
    title: "QUADS, POSTERIOR CHAIN & LEGS",
    heroExercise: "CALIBRATED HACK SQUAT & RDL",
    bio: "High-load compound leg power. From competition squats to deep stretch pendulum squats and stiff-leg deadlifts.",
    cue: "Drive your knees in line with your toes, maintain heel-to-midfoot contact, and hit parallel or deeper on every rep.",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    machineCount: "18 DEDICATED SQUAT, PRESS & HACK RIGS",
    exercises: [
      { name: "Pendulum Squat (Below Parallel)", sets: "4 Sets", reps: "8 - 10 Reps", machine: "Titan Pendulum Quad Rig", cue: "Drive hips forward out of the hole" },
      { name: "Romanian Deadlift (Dumbbell or Bar)", sets: "4 Sets", reps: "8 Reps", machine: "Heavy Barbell Platform", cue: "Hinge hips back till hamstrings are taut" },
      { name: "Lying Hamstring Curl", sets: "3 Sets", reps: "10 - 12 Reps", machine: "Technogym Pure Prone Curl", cue: "Do not lift pelvis off pad at contraction" }
    ]
  },
  core: {
    category: "PRIMARY MOVER: RECTUS ABDOMINIS & TRANSVERSE OBLIQUES",
    title: "CORE INTEGRITY & ANTERIOR STABILIZATION",
    heroExercise: "HANGING TOES-TO-BAR & CABLE CHOP",
    bio: "Develop an impenetrable abdominal shield that protects your lumbar spine during heavy 500lb compound lifts.",
    cue: "Exhale all air at peak abdominal contraction to activate deep transverse abdominis fibers.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
    machineCount: "8 CORE, HYPEREXTENSION & GHD RIGS",
    exercises: [
      { name: "Hanging Leg & Knee Raises", sets: "4 Sets", reps: "15 Reps", machine: "Rogue Stall Bars / Pullup Rig", cue: "Curl pelvis upward, not just swinging legs" },
      { name: "Heavy Kneeling Cable Crunch", sets: "4 Sets", reps: "12 - 15 Reps", machine: "High Pulley Rope", cue: "Curl torso into a ball; elbows to knees" },
      { name: "Standing Cable Woodchopper", sets: "3 Sets", reps: "12 Reps/side", machine: "Functional Cable Tower", cue: "Rotational torque through hips and obliques" }
    ]
  }
};

function selectMuscle(muscleKey) {
  playClickSound();
  const data = muscleData[muscleKey];
  if (!data) return;

  // Update button active state
  const buttons = document.querySelectorAll('.muscle-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-muscle') === muscleKey) {
      btn.classList.add('active-muscle');
      btn.classList.remove('bg-brand-card', 'text-zinc-300');
    } else {
      btn.classList.remove('active-muscle');
      btn.classList.add('bg-brand-card', 'text-zinc-300');
    }
  });

  // Update details
  const badgeEl = document.getElementById('muscleCategoryBadge');
  const heroEl = document.getElementById('muscleExerciseHero');
  const coachCueEl = document.getElementById('muscleCoachCue');
  const titleEl = document.getElementById('muscleTitle');
  const bioEl = document.getElementById('muscleBio');
  const countEl = document.getElementById('muscleMachineCount');
  const imgEl = document.getElementById('muscleImage');
  const listEl = document.getElementById('muscleExerciseList');

  if (badgeEl) badgeEl.textContent = data.category;
  if (heroEl) heroEl.textContent = data.heroExercise;
  if (coachCueEl) coachCueEl.textContent = `"${data.cue}"`;
  if (titleEl) titleEl.textContent = data.title;
  if (bioEl) bioEl.textContent = data.bio;
  if (countEl) countEl.textContent = data.machineCount;

  if (imgEl) {
    imgEl.style.opacity = '0.3';
    setTimeout(() => {
      imgEl.src = data.image;
      imgEl.style.opacity = '1';
    }, 150);
  }

  // Populate exercise list
  if (listEl) {
    listEl.innerHTML = data.exercises.map((ex, idx) => `
      <div class="p-4 rounded-xl bg-brand-dark/70 border border-brand-cardBorder hover:border-brand-volt/40 transition-colors">
        <div class="flex items-center justify-between mb-1">
          <span class="font-heading font-extrabold text-white text-base">${idx + 1}. ${ex.name}</span>
          <span class="text-xs font-mono text-brand-volt font-bold">${ex.sets} × ${ex.reps}</span>
        </div>
        <div class="flex flex-wrap items-center justify-between text-xs font-mono text-zinc-400 gap-2">
          <span>STATION: <span class="text-zinc-300 font-semibold">${ex.machine}</span></span>
          <span class="text-zinc-500 italic">Cue: ${ex.cue}</span>
        </div>
      </div>
    `).join('');
  }
}

// Initial populate of muscle map
document.addEventListener("DOMContentLoaded", () => {
  selectMuscle('chest');
});

// ==========================================
// 7. WEEKLY CLASS SCHEDULE ENGINE
// ==========================================
const weeklySchedule = [
  // Monday
  { day: 1, type: "strength", time: "06:00 AM", title: "DAWN PATROL HEAVY STRENGTH", coach: "Marcus Vance", spots: 3, cal: "650 kcal", level: "INTERMEDIATE - ADVANCED" },
  { day: 1, type: "hyrox", time: "08:30 AM", title: "HYROX ENGINE & ERG THRESHOLD", coach: "Tariq Al-Mansoor", spots: 5, cal: "780 kcal", level: "ALL LEVELS" },
  { day: 1, type: "strength", time: "12:00 PM", title: "OLYMPIC CLEAN & KINEMATICS", coach: "Elena Rostova", spots: 2, cal: "520 kcal", level: "TECHNICAL" },
  { day: 1, type: "combat", time: "05:30 PM", title: "APEX BOXING & SLUGGER COMBAT", coach: "Tyson Vance", spots: 4, cal: "820 kcal", level: "ALL LEVELS" },
  { day: 1, type: "recovery", time: "07:00 PM", title: "FASCIAL DECOMPRESSION & RECOVERY", coach: "Dr. Maya Sterling", spots: 8, cal: "200 kcal", level: "RESTORATIVE" },

  // Tuesday
  { day: 2, type: "hyrox", time: "06:30 AM", title: "METCON HYPER-ACCELERATOR", coach: "Tariq Al-Mansoor", spots: 4, cal: "720 kcal", level: "HIGH INTENSITY" },
  { day: 2, type: "strength", time: "10:00 AM", title: "POSTERIOR CHAIN DEADLIFT LAB", coach: "Marcus Vance", spots: 1, cal: "600 kcal", level: "ADVANCED" },
  { day: 2, type: "combat", time: "06:00 PM", title: "CHAMPIONSHIP MUAY THAI PADS", coach: "Tyson Vance", spots: 6, cal: "850 kcal", level: "ALL LEVELS" },
  { day: 2, type: "recovery", time: "07:30 PM", title: "CONTRAST SPA COLD PLUNGE RITUAL", coach: "Dr. Maya Sterling", spots: 5, cal: "150 kcal", level: "RECOVERY" },

  // Wednesday
  { day: 3, type: "strength", time: "06:00 AM", title: "BENCH PRESS TENSION MATRIX", coach: "Marcus Vance", spots: 3, cal: "550 kcal", level: "ALL LEVELS" },
  { day: 3, type: "hyrox", time: "09:00 AM", title: "HYROX SLED & SKIERG COMBAT", coach: "Tariq Al-Mansoor", spots: 2, cal: "810 kcal", level: "INTERMEDIATE" },
  { day: 3, type: "strength", time: "05:00 PM", title: "OLYMPIC SNATCH MASTERY", coach: "Elena Rostova", spots: 4, cal: "540 kcal", level: "TECHNICAL" },
  { day: 3, type: "combat", time: "06:30 PM", title: "FIGHT CONDITIONING & SPARRING", coach: "Tyson Vance", spots: 3, cal: "890 kcal", level: "ADVANCED" },

  // Thursday
  { day: 4, type: "hyrox", time: "07:00 AM", title: "LACTATE THRESHOLD INTERVALS", coach: "Tariq Al-Mansoor", spots: 5, cal: "750 kcal", level: "ALL LEVELS" },
  { day: 4, type: "strength", time: "12:00 PM", title: "SQUAT MECHANICS & DRIVE", coach: "Elena Rostova", spots: 3, cal: "620 kcal", level: "INTERMEDIATE" },
  { day: 4, type: "recovery", time: "06:00 PM", title: "MOBILITY & YIN ATHLETIC YOGA", coach: "Dr. Maya Sterling", spots: 10, cal: "220 kcal", level: "ALL LEVELS" },

  // Friday
  { day: 5, type: "strength", time: "06:00 AM", title: "FRIDAY MAXIMUM POWER TOTAL", coach: "Marcus Vance", spots: 2, cal: "690 kcal", level: "ADVANCED" },
  { day: 5, type: "combat", time: "05:30 PM", title: "FRIDAY FIGHT NIGHT SMACKDOWN", coach: "Tyson Vance", spots: 6, cal: "880 kcal", level: "ALL LEVELS" },
  { day: 5, type: "hyrox", time: "07:00 PM", title: "HYROX FRIDAY BEER & ERGS", coach: "Tariq Al-Mansoor", spots: 8, cal: "700 kcal", level: "SOCIAL ATHLETIC" },

  // Saturday
  { day: 6, type: "hyrox", time: "08:00 AM", title: "SATURDAY HYROX SIMULATION RACE", coach: "Tariq Al-Mansoor", spots: 12, cal: "950 kcal", level: "CHAMPIONSHIP" },
  { day: 6, type: "strength", time: "10:30 AM", title: "COMPETITION LIFTING CLINIC", coach: "Elena & Marcus", spots: 4, cal: "600 kcal", level: "ALL LEVELS" },
  { day: 6, type: "recovery", time: "02:00 PM", title: "WEEKEND CRYO & SAUNA RESET", coach: "Dr. Maya Sterling", spots: 7, cal: "180 kcal", level: "RECOVERY" },

  // Sunday
  { day: 0, type: "recovery", time: "09:00 AM", title: "SUNDAY CNS REBOOT & MOBILITY", coach: "Dr. Maya Sterling", spots: 12, cal: "200 kcal", level: "ALL LEVELS" },
  { day: 0, type: "strength", time: "11:00 AM", title: "OPEN MAT & LIFTING LAB", coach: "Staff Coach", spots: 15, cal: "500 kcal", level: "FREE WORKOUT" }
];

let selectedScheduleDay = 1; // Monday default
let selectedScheduleType = 'all';

function selectDay(dayNumber) {
  playClickSound();
  selectedScheduleDay = dayNumber;

  const buttons = document.querySelectorAll('.day-btn');
  buttons.forEach(btn => {
    if (+btn.getAttribute('data-day') === dayNumber) {
      btn.classList.add('bg-brand-volt', 'text-black');
      btn.classList.remove('text-zinc-400', 'hover:text-white');
    } else {
      btn.classList.remove('bg-brand-volt', 'text-black');
      btn.classList.add('text-zinc-400', 'hover:text-white');
    }
  });

  renderSchedule();
}

function filterClasses(type) {
  playClickSound();
  selectedScheduleType = type;

  const buttons = document.querySelectorAll('.class-filter-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-type') === type) {
      btn.classList.add('bg-brand-volt', 'text-black');
      btn.classList.remove('bg-brand-card', 'text-zinc-300');
    } else {
      btn.classList.remove('bg-brand-volt', 'text-black');
      btn.classList.add('bg-brand-card', 'text-zinc-300');
    }
  });

  renderSchedule();
}

function renderSchedule() {
  const container = document.getElementById('scheduleCardsGrid');
  if (!container) return;

  const filtered = weeklySchedule.filter(item => {
    const dayMatches = item.day === selectedScheduleDay;
    const typeMatches = selectedScheduleType === 'all' || item.type === selectedScheduleType;
    return dayMatches && typeMatches;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center bg-brand-card rounded-2xl border border-brand-cardBorder p-8">
        <i data-lucide="calendar-x" class="w-10 h-10 text-zinc-500 mx-auto mb-3"></i>
        <h4 class="font-heading font-black text-xl text-white">NO SESSIONS IN THIS CATEGORY</h4>
        <p class="text-xs text-zinc-400 font-mono mt-1">Select another category or view another day of the week.</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="bg-brand-card rounded-2xl p-6 border border-brand-cardBorder flex flex-col justify-between space-y-4 hover:border-brand-volt/50 transition-all group">
      
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono font-bold text-brand-volt bg-brand-volt/10 px-2.5 py-1 rounded-md border border-brand-volt/20">
            ${item.time}
          </span>
          <span class="text-[11px] font-mono text-zinc-400">
            ${item.spots} SPOTS LEFT
          </span>
        </div>

        <h3 class="font-heading font-black text-xl text-white group-hover:text-brand-volt transition-colors">
          ${item.title}
        </h3>

        <div class="flex items-center gap-2 text-xs text-zinc-300">
          <i data-lucide="user" class="w-4 h-4 text-brand-volt"></i>
          <span>COACH: <strong class="text-white">${item.coach}</strong></span>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-brand-cardBorder/60 text-xs font-mono text-zinc-400">
          <span>BURN: <strong class="text-white">${item.cal}</strong></span>
          <span class="text-[10px] uppercase text-zinc-500 font-bold">${item.level}</span>
        </div>
      </div>

      <button onclick="bookClass('${item.title}')" class="w-full py-3 rounded-xl bg-brand-dark hover:bg-brand-volt hover:text-black border border-brand-cardBorder text-white font-heading font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2">
        <span>RESERVE SPOT</span>
        <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
      </button>

    </div>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

function bookClass(className) {
  playSuccessChord();
  showToast('Spot Reserved!', `You are booked for "${className}". VIP pass confirmation sent.`, 'success');
  if (typeof confetti === 'function') {
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.8 } });
  }
}

document.addEventListener("DOMContentLoaded", renderSchedule);

// ==========================================
// 8. FITNESS CALCULATORS SUITE
// ==========================================
function switchCalc(type) {
  playClickSound();
  const tabs = {
    bmi: { btn: 'tabBtnBmi', panel: 'calcBmiPanel' },
    onerm: { btn: 'tabBtnOneRm', panel: 'calcOneRmPanel' },
    macros: { btn: 'tabBtnMacros', panel: 'calcMacrosPanel' }
  };

  Object.keys(tabs).forEach(k => {
    const b = document.getElementById(tabs[k].btn);
    const p = document.getElementById(tabs[k].panel);
    if (k === type) {
      if (b) {
        b.classList.add('bg-brand-volt', 'text-black');
        b.classList.remove('text-zinc-400', 'hover:text-white');
      }
      if (p) p.classList.remove('hidden');
    } else {
      if (b) {
        b.classList.remove('bg-brand-volt', 'text-black');
        b.classList.add('text-zinc-400', 'hover:text-white');
      }
      if (p) p.classList.add('hidden');
    }
  });
}

function calculateBmi() {
  playTone(520, 'sine', 0.15, 0.05);
  const height = parseFloat(document.getElementById('bmiHeight').value) || 180;
  const weight = parseFloat(document.getElementById('bmiWeight').value) || 80;
  const activity = parseFloat(document.getElementById('bmiActivity').value) || 1.725;

  const hMeter = height / 100;
  const bmi = (weight / (hMeter * hMeter)).toFixed(1);

  const scoreEl = document.getElementById('bmiScore');
  const badgeEl = document.getElementById('bmiStatusBadge');
  const barEl = document.getElementById('bmiBar');
  const idealEl = document.getElementById('idealWeight');
  const bmrEl = document.getElementById('bmrEst');

  if (scoreEl) scoreEl.textContent = bmi;

  // Status & bar
  let status = "NORMAL / OPTIMAL ATHLETIC RANGE";
  let color = "text-brand-volt";
  let barPct = Math.min(Math.max((bmi / 35) * 100, 15), 98);

  if (bmi < 18.5) {
    status = "UNDERWEIGHT / CALORIC SURPLUS NEEDED";
    color = "text-blue-400";
  } else if (bmi >= 25 && bmi < 29.9) {
    status = "ATHLETIC LEAN HYPERTROPHY RANGE";
    color = "text-brand-volt";
  } else if (bmi >= 30) {
    status = "HIGH MASS / CUTTING PROTOCOL RECOMMENDED";
    color = "text-brand-crimson";
  }

  if (badgeEl) {
    badgeEl.textContent = status;
    badgeEl.className = `inline-block px-4 py-1.5 rounded-full font-mono text-xs font-bold uppercase bg-brand-volt/15 ${color} border border-brand-volt/30`;
  }
  if (barEl) barEl.style.width = `${barPct}%`;

  // Ideal weight range (BMI 21.5 - 24.5)
  const minIdeal = (21.5 * hMeter * hMeter).toFixed(0);
  const maxIdeal = (24.5 * hMeter * hMeter).toFixed(0);
  if (idealEl) idealEl.textContent = `${minIdeal} - ${maxIdeal} kg`;

  // BMR (Mifflin St Jeor estimate)
  const bmr = Math.round((10 * weight + 6.25 * height - 5 * 28 + 5) * activity);
  if (bmrEl) bmrEl.textContent = `${bmr.toLocaleString()} kcal`;

  showToast('Biometrics Computed', `Your calculated BMI is ${bmi}.`, 'success');
}

function calculateOneRm() {
  playTone(520, 'sine', 0.15, 0.05);
  const weight = parseFloat(document.getElementById('oneRmWeight').value) || 100;
  const reps = parseInt(document.getElementById('oneRmReps').value, 10) || 5;

  // Brzycki formula
  let max = reps === 1 ? weight : Math.round(weight * (36 / (37 - reps)));

  const resEl = document.getElementById('oneRmResult');
  const p95 = document.getElementById('pct95');
  const p90 = document.getElementById('pct90');
  const p80 = document.getElementById('pct80');
  const p70 = document.getElementById('pct70');

  if (resEl) resEl.innerHTML = `${max} <span class="text-2xl text-white">KG</span>`;
  if (p95) p95.textContent = `${Math.round(max * 0.95)} kg`;
  if (p90) p90.textContent = `${Math.round(max * 0.90)} kg`;
  if (p80) p80.textContent = `${Math.round(max * 0.80)} kg`;
  if (p70) p70.textContent = `${Math.round(max * 0.70)} kg`;

  showToast('1RM Calculated', `Projected 1-Rep Maximum: ${max} kg.`, 'success');
}

function calculateMacros() {
  playTone(520, 'sine', 0.15, 0.05);
  const weight = parseFloat(document.getElementById('macroWeight').value) || 80;
  const goal = document.getElementById('macroGoal').value;
  const activity = parseFloat(document.getElementById('macroActivity').value) || 1.725;

  let baseCals = Math.round(weight * 24 * activity);
  let targetCals = baseCals;

  if (goal === 'cut') {
    targetCals -= 450;
  } else if (goal === 'lean_bulk') {
    targetCals += 350;
  }

  // Protein: 2.2g per kg
  const proteinGrams = Math.round(weight * 2.2);
  const proteinCals = proteinGrams * 4;

  // Fat: 1.0g per kg
  const fatGrams = Math.round(weight * 1.0);
  const fatCals = fatGrams * 9;

  // Carbs: Remaining calories / 4
  const remainingCals = targetCals - (proteinCals + fatCals);
  const carbGrams = Math.max(Math.round(remainingCals / 4), 100);

  const calEl = document.getElementById('targetCalories');
  const protEl = document.getElementById('proteinGrams');
  const carbEl = document.getElementById('carbGrams');
  const fatEl = document.getElementById('fatGrams');

  if (calEl) calEl.innerHTML = `${targetCals.toLocaleString()} <span class="text-2xl text-white">KCAL</span>`;
  if (protEl) protEl.textContent = `${proteinGrams}g (${proteinCals} kcal)`;
  if (carbEl) carbEl.textContent = `${carbGrams}g (${carbGrams * 4} kcal)`;
  if (fatEl) fatEl.textContent = `${fatGrams}g (${fatCals} kcal)`;

  showToast('Macros Updated', `Daily fuel calibrated to ${targetCals} kcal.`, 'success');
}

// ==========================================
// 9. AI-STYLE WORKOUT SPLIT GENERATOR
// ==========================================
let splitGoal = 'hypertrophy';
let splitDays = 4;

function setSplitGoal(val) {
  playClickSound();
  splitGoal = val;
  const buttons = document.querySelectorAll('.goal-btn');
  buttons.forEach(b => {
    if (b.getAttribute('data-val') === val) {
      b.classList.add('bg-brand-volt', 'text-black');
      b.classList.remove('bg-brand-card', 'text-zinc-300');
    } else {
      b.classList.remove('bg-brand-volt', 'text-black');
      b.classList.add('bg-brand-card', 'text-zinc-300');
    }
  });
  generateProgram();
}

function setSplitDays(days) {
  playClickSound();
  splitDays = days;
  const buttons = document.querySelectorAll('.day-opt-btn');
  buttons.forEach(b => {
    if (+b.getAttribute('data-days') === days) {
      b.classList.add('bg-brand-volt', 'text-black');
      b.classList.remove('bg-brand-card', 'text-zinc-300');
    } else {
      b.classList.remove('bg-brand-volt', 'text-black');
      b.classList.add('bg-brand-card', 'text-zinc-300');
    }
  });
  generateProgram();
}

function generateProgram() {
  playTone(600, 'triangle', 0.1, 0.05);

  const exp = document.getElementById('splitExperience') ? document.getElementById('splitExperience').value : 'intermediate';
  const badge = document.getElementById('programTypeBadge');
  const name = document.getElementById('programName');
  const display = document.getElementById('programScheduleDisplay');

  let programTitle = "";
  let badgeText = "";
  let routines = [];

  if (splitGoal === 'hypertrophy') {
    programTitle = "TITAN MAXIMUM HYPERTROPHY MATRIX";
    badgeText = `${splitDays}-DAY UPPER / LOWER / PUSH / PULL PROTOCOL`;
    if (splitDays === 3) {
      routines = [
        { dayName: "DAY 01: PUSH (CHEST, DELTS, TRICEPS)", exercises: ["Incline Barbell Bench (4x8)", "Hammer Flat Press (3x10)", "Egyptian Lateral Raises (4x15)", "Cross-Cable Tricep Pushdown (3x12)"] },
        { dayName: "DAY 02: PULL (LATS, RHOMBOIDS, BICEPS)", exercises: ["Chest-Supported T-Bar Row (4x8)", "Weighted Neutral Pullup (3x6)", "Rear Delt Pec Deck (4x15)", "Incline DB Bicep Curl (3x10)"] },
        { dayName: "DAY 03: LEGS & CORE STABILIZATION", exercises: ["Calibrated Pendulum Squats (4x8)", "Romanian Deadlift (4x8)", "Lying Hamstring Curls (3x12)", "Hanging Leg Raises (3x15)"] }
      ];
    } else if (splitDays === 4) {
      routines = [
        { dayName: "DAY 01: UPPER BODY TENSION A", exercises: ["Incline DB Press (4x8)", "Chest-Supported T-Bar Row (4x10)", "Standing DB Shoulder Press (3x10)", "Dual Cable Pushdowns (3x12)"] },
        { dayName: "DAY 02: LOWER BODY QUAD EMPHASIS", exercises: ["Barbell Back Squat (4x6)", "Bulgarian Split Squats (3x10/leg)", "Leg Extensions (3x15)", "Standing Calf Raise (4x15)"] },
        { dayName: "DAY 03: UPPER BODY HYPERTROPHY B", exercises: ["Weighted Dips (3x8)", "Neutral Grip Lat Pulldown (4x10)", "Lateral DB Raises (4x15)", "Preacher Incline Curl (3x10)"] },
        { dayName: "DAY 04: LOWER BODY POSTERIOR CHAIN", exercises: ["Conventional/Sumo Deadlift (4x5)", "Seated Leg Curls (4x12)", "Walking DB Lunges (3x12)", "Ab Wheel Rollouts (4x12)"] }
      ];
    } else {
      routines = [
        { dayName: "DAY 01: CHEST & TRICEPS", exercises: ["Incline Barbell Bench (4x8)", "Flat Dumbbell Press (3x10)", "Cable Pec Fly (3x12)", "Overhead Cable Extension (4x12)"] },
        { dayName: "DAY 02: BACK & BICEPS", exercises: ["Heavy Barbell Row (4x8)", "Close-Grip Pulldown (4x10)", "Hyperextensions (3x15)", "Barbell Spider Curls (4x10)"] },
        { dayName: "DAY 03: QUADRICEPS & CALVES", exercises: ["Hack Squat (4x10)", "Leg Press (4x12)", "Sissy Squats (3x12)", "Donkey Calf Raises (4x15)"] },
        { dayName: "DAY 04: SHOULDERS & UPPER TRAPS", exercises: ["Seated Overhead Press (4x8)", "Cable Lateral Raise (4x15)", "Face Pulls (4x15)", "Dumbbell Shrugs (3x12)"] },
        { dayName: "DAY 05: HAMSTRINGS & ARMS BLITZ", exercises: ["Stiff-Legged Deadlift (4x8)", "Prone Leg Curl (4x12)", "Superset Bicep/Tricep (4x12)"] }
      ];
    }
  } else if (splitGoal === 'hyrox') {
    programTitle = "TITAN HYROX PODIUM ATHLETE ENGINE";
    badgeText = `${splitDays}-DAY HYBRID STRENGTH & LACTATE THRESHOLD`;
    routines = [
      { dayName: "DAY 01: SLED PUSH & ERG CONDITIONING", exercises: ["60m Heavy Sled Push (6 rounds)", "Concept2 SkiErg 500m Repeats (5 rounds)", "Wall Balls 9kg (4x25 reps)"] },
      { dayName: "DAY 02: COMPOUND STRENGTH & STABILIZATION", exercises: ["Front Squats 3x5 (Heavy)", "Farmer's Walk 32kg (4x100m)", "Strict Overhead Press (4x6)"] },
      { dayName: "DAY 03: INTERVAL THRESHOLD RUNNING", exercises: ["1km Repeats at 5k Race Pace (5 rounds)", "Burpee Broad Jumps (4x20m)", "Row Erg 1,000m Pace Work"] },
      { dayName: "DAY 04: FULL SIMULATION BATTLE", exercises: ["Full Half-Hyrox Simulation Run", "Active Recovery Cold Plunge + Sauna (30 mins)"] }
    ];
  } else {
    programTitle = "TITAN RAW POWER & 1RM MAXIMIZER";
    badgeText = `${splitDays}-DAY POWERLIFTING PEAKING PROTOCOL`;
    routines = [
      { dayName: "DAY 01: HEAVY SQUAT & ACCELERATION", exercises: ["Competition Squat (5x3 @ 82% 1RM)", "Paused Box Squats (3x3 @ 70%)", "Hamstring GHD Curls (3x10)"] },
      { dayName: "DAY 02: COMPETITION BENCH PRESS", exercises: ["Paused Bench Press (5x3 @ 85% 1RM)", "Spoto Press (3x4)", "Barbell Pendlay Rows (4x6)"] },
      { dayName: "DAY 03: DEADLIFT & HIP DRIVE", exercises: ["Competition Deadlift (4x2 @ 87% 1RM)", "Deficit Deadlifts (3x3)", "Barbell Good Mornings (3x8)"] }
    ];
  }

  if (name) name.textContent = programTitle;
  if (badge) badge.textContent = badgeText;

  if (display) {
    display.innerHTML = routines.map(r => `
      <div class="p-4 rounded-xl bg-brand-dark/90 border border-brand-cardBorder space-y-2">
        <div class="text-xs font-mono font-bold text-brand-volt uppercase">${r.dayName}</div>
        <ul class="space-y-1 text-xs text-zinc-300 font-mono">
          ${r.exercises.map(ex => `<li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-brand-volt"></span><span>${ex}</span></li>`).join('')}
        </ul>
      </div>
    `).join('');
  }
}

function copyGeneratedProgram() {
  playSuccessChord();
  const name = document.getElementById('programName')?.textContent || 'Titan Workout Split';
  const badge = document.getElementById('programTypeBadge')?.textContent || '';
  const text = `${name}\n${badge}\nGenerated by Titan Forge Athletic Club (titanforgegym.com)`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  }
  const copyBtnText = document.getElementById('copyBtnText');
  if (copyBtnText) {
    copyBtnText.textContent = 'COPIED!';
    setTimeout(() => { copyBtnText.textContent = 'COPY SPLIT'; }, 2000);
  }
  showToast('Routine Copied', 'Your customized workout routine was copied to clipboard.', 'success');
}

document.addEventListener("DOMContentLoaded", generateProgram);

// ==========================================
// 10. BEFORE & AFTER TRANSFORMATION SLIDER
// ==========================================
const compareSlider = document.getElementById('compareSlider');
const beforeContainer = document.getElementById('beforeContainer');
const sliderHandle = document.getElementById('sliderHandle');

if (compareSlider && beforeContainer && sliderHandle) {
  compareSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    beforeContainer.style.width = `${val}%`;
    sliderHandle.style.left = `${val}%`;
  });
}

// ==========================================
// 11. MEMBERSHIP PRICING BILLING SWITCHER
// ==========================================
let isAnnual = false;

function toggleBillingCycle() {
  playClickSound();
  isAnnual = !isAnnual;

  const knob = document.getElementById('billingToggleKnob');
  const monthLabel = document.getElementById('billingMonthLabel');
  const annualLabel = document.getElementById('billingAnnualLabel');
  const priceDisplays = document.querySelectorAll('.price-display');

  if (isAnnual) {
    if (knob) knob.classList.add('translate-x-6');
    if (monthLabel) {
      monthLabel.classList.remove('text-zinc-300');
      monthLabel.classList.add('text-zinc-500');
    }
    if (annualLabel) {
      annualLabel.classList.remove('text-zinc-400');
      annualLabel.classList.add('text-brand-volt');
    }

    priceDisplays.forEach(p => {
      const annualPrice = p.getAttribute('data-annual');
      p.textContent = `$${annualPrice}`;
    });
    showToast('25% Annual Discount Applied', 'Billed annually with zero cancellation fees.', 'info');
  } else {
    if (knob) knob.classList.remove('translate-x-6');
    if (monthLabel) {
      monthLabel.classList.add('text-zinc-300');
      monthLabel.classList.remove('text-zinc-500');
    }
    if (annualLabel) {
      annualLabel.classList.add('text-zinc-400');
      annualLabel.classList.remove('text-brand-volt');
    }

    priceDisplays.forEach(p => {
      const monthlyPrice = p.getAttribute('data-monthly');
      p.textContent = `$${monthlyPrice}`;
    });
  }
}

function selectTier(tierName) {
  playSuccessChord();
  openVipModal();
  showToast(`${tierName} Selected`, 'Your complimentary 3-Day VIP pass is loaded. Claim below.', 'success');
}

// ==========================================
// 12. FAQ ACCORDION ENGINE
// ==========================================
function toggleFaq(btn) {
  playClickSound();
  const parent = btn.parentElement;
  const content = parent.querySelector('.faq-content');
  const chevron = btn.querySelector('[data-lucide="chevron-down"]');

  const isOpen = !content.classList.contains('hidden');

  // Close all other FAQs
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-content')?.classList.add('hidden');
    const ch = item.querySelector('[data-lucide="chevron-down"]');
    if (ch) ch.style.transform = 'rotate(0deg)';
  });

  if (!isOpen) {
    content.classList.remove('hidden');
    if (chevron) chevron.style.transform = 'rotate(180deg)';
  }
}

// ==========================================
// 13. MODALS (VIP PASS & 4K TOUR)
// ==========================================
function openVipModal() {
  playClickSound();
  const modal = document.getElementById('vipModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeVipModal() {
  playClickSound();
  const modal = document.getElementById('vipModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function openTourModal() {
  playClickSound();
  const modal = document.getElementById('tourModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeTourModal() {
  playClickSound();
  const modal = document.getElementById('tourModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// Close modals when clicking outside card
window.addEventListener('click', (e) => {
  const vipModal = document.getElementById('vipModal');
  const tourModal = document.getElementById('tourModal');
  if (e.target === vipModal) closeVipModal();
  if (e.target === tourModal) closeTourModal();
});

// ==========================================
// 14. FORM HANDLERS & CONFETTI CELEBRATIONS
// ==========================================
function handleVipSubmit(e) {
  e.preventDefault();
  playSuccessChord();

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#CCFF00', '#FFFFFF', '#FF2A54']
    });
  }

  showToast('VIP Pass Activated!', 'Check your phone and email for your instant digital QR pass.', 'success');
  e.target.reset();
}

function handleModalVipSubmit(e) {
  e.preventDefault();
  playSuccessChord();

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#CCFF00', '#FFFFFF', '#FF2A54']
    });
  }

  closeVipModal();
  showToast('VIP Pass Confirmed!', 'Your 3-day access code is active. Welcome to Titan Forge.', 'success');
  e.target.reset();
}

function handleNewsletter(e) {
  e.preventDefault();
  playSuccessChord();
  showToast('Subscribed to Forge Dispatch', 'You will receive weekly training kinematics every Monday.', 'success');
  e.target.reset();
}

function bookTrainer(trainerName) {
  playClickSound();
  openVipModal();
  showToast(`Coach Consult: ${trainerName}`, 'Claim your free pass to schedule your 1-on-1 strategy session.', 'info');
}

// ==========================================
// 15. TOAST NOTIFICATION SYSTEM
// ==========================================
function showToast(title, message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  const bg = type === 'success' ? 'border-brand-volt' : 'border-brand-cardBorder';
  const icon = type === 'success' ? 'check-circle' : 'info';
  const iconColor = type === 'success' ? 'text-brand-volt' : 'text-blue-400';

  toast.className = `p-4 rounded-2xl bg-brand-card/95 backdrop-blur-xl border ${bg} shadow-2xl flex items-start gap-3 w-80 text-white toast-slide-in pointer-events-auto`;
  toast.innerHTML = `
    <div class="mt-0.5 ${iconColor}">
      <i data-lucide="${icon}" class="w-5 h-5"></i>
    </div>
    <div class="flex-1">
      <div class="font-heading font-black text-sm text-white">${title}</div>
      <div class="text-xs text-zinc-400 mt-0.5 leading-snug">${message}</div>
    </div>
    <button onclick="this.parentElement.remove()" class="text-zinc-500 hover:text-white p-1">
      <i data-lucide="x" class="w-4 h-4"></i>
    </button>
  `;

  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();

  setTimeout(() => {
    toast.classList.remove('toast-slide-in');
    toast.classList.add('toast-slide-out');
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

// Set default visit date input to tomorrow
document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById('visitDate');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }
});

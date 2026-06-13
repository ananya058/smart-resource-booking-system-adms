// ============ DATA STORAGE SYSTEM ============
// 📊 All booking data is automatically saved in Browser Storage (LocalStorage)
// 📝 Active Bookings → localStorage key: 'fset_bookings'
// 📋 Archived Bookings → localStorage key: 'fset_archived_bookings' (past bookings)
// 🔄 Auto-Archive: Bookings older than their end time are moved to archive automatically
// 💾 Data persists: Closes browser? Data still there! Refresh page? Data still there!
// ✅ Each booking gets: Date, Time, Faculty Name, Room, Purpose

// ============ GALLERY DATA ============
const GALLERY_DATA = {
  campus: {
    title: 'Campus Outdoor',
    icon: '🏫',
    images: [
      { src: 'Gallery/Campus_OUtdoor.jpeg', title: 'Campus Outdoor' },
      { src: 'Gallery/USTC-Building-scaled.jpg', title: 'USTC Building' },
    ]
  },
  cse: {
    title: 'CSE Dept.',
    icon: '💻',
    images: [
      { src: 'Gallery/CSE_Entrance.jpeg', title: 'CSE Entrance' },
      { src: 'Gallery/CSE_Faculty_Vision.jpeg', title: 'CSE Faculty Vision' },
      { src: 'Gallery/CSE_Office_Entrance.jpeg', title: 'CSE Office Entrance' },
      { src: 'Gallery/Faculty_Members.jpeg', title: 'Faculty Members' },
      { src: 'Gallery/Administration_DESK.jpeg', title: 'Administration Desk' },
    ]
  },
  industrial: {
    title: 'Industrial Visit',
    icon: '🏭',
    images: [
      { src: 'Gallery/industrial_visit_2025_B_40.jpeg', title: 'Industrial Visit 2025' },
      { src: 'Gallery/Industrial_visit_2025_B-40.jpeg', title: 'Industrial Visit 2025' },
      { src: 'Gallery/Industrial_VIsit_SAT_25_B-40.jpeg', title: 'Industrial Visit SAT 2025' },
      { src: 'Gallery/Industrial_visits_2025_B-40.jpeg', title: 'Industrial Visits 2025' },
      { src: 'Gallery/IV_Incubator_2025_B-40.jpeg', title: 'IV Incubator 2025' },
      { src: 'Gallery/IV_SATELITE_OUTDOOR_2025.jpeg', title: 'IV Satellite Outdoor 2025' },
      { src: 'Gallery/Visit_Incubator_25_B_40.jpeg', title: 'Visit Incubator 25' },
    ]
  },
  seminar: {
    title: 'Seminar Room',
    icon: '📍',
    images: [
      { src: 'Gallery/Seminar_Library.jpeg', title: 'Seminar Library' },
      { src: 'Gallery/Seminar_Room.jpeg', title: 'Seminar Room' },
      { src: 'Gallery/Conference_Room1.jpeg', title: 'Conference Room 1' },
      { src: 'Gallery/Conference_room2.jpeg', title: 'Conference Room 2' },
    ]
  },
  classroom: {
    title: 'Classrooms',
    icon: '📖',
    images: [
      { src: 'Gallery/Floors_types.jpeg', title: 'Floors Types' },
      { src: 'Gallery/14_15_16_Floor_Classroom.jpeg', title: '14-15-16 Floor Classroom' },
      { src: 'Gallery/1403_1503_1603_classroom.jpeg', title: '1403-1503-1603 Classroom' },
      { src: 'Gallery/1405_1505_1605_classroom.jpeg', title: '1405-1505-1605 Classroom' },
    ]
  },
  labs: {
    title: 'Labs',
    icon: '🔬',
    images: [
      { src: 'Gallery/AI_Lab.jpeg', title: 'AI Lab' },
      { src: 'Gallery/VLSI_LAB.jpeg', title: 'VLSI Lab' },
    ]
  },
  admission: {
    title: 'Admission Info',
    icon: '📋',
    images: [
      { src: 'Gallery/Admission_Going_ON.jpeg', title: 'Admission Going On' },
    ]
  }
};

let currentGalleryIndex = 0;
let currentGalleryCategory = 'campus';

let currentHeroIndex = 0;
let autoPlayInterval;
let isAutoPlaying = true;

const heroImages = [
  'Gallery/CSE_Entrance.jpeg',
  'Gallery/USTC-Building-scaled.jpg',
  'Gallery/Faculty_Members.jpeg',
  'Gallery/CSE_Faculty_Vision.jpeg',
  'Gallery/CSE_Office_Entrance.jpeg',
  'Gallery/Industrial_Visit_2025.jpeg',
  'Gallery/IV_Incubator_2025_B-40.jpeg',
  'Gallery/IV_SATELITE_OUTDOOR_2025.jpeg',
  'Gallery/Seminar_Library.jpeg',
  'Gallery/Seminar_Room.jpeg',
  'Gallery/14_15_16_Floor_Classroom.jpeg',
  'Gallery/AI_Lab.jpeg',
  'Gallery/VLSI_LAB.jpeg',
  'Gallery/Admission_Going_ON.jpeg'
];

function startAutoPlay() {
  autoPlayInterval = setInterval(() => {
    currentHeroIndex = (currentHeroIndex + 1) % heroImages.length;
    updateHeroImage();
  }, 3000); 
}

function nextHero() {
  currentHeroIndex = (currentHeroIndex + 1) % heroImages.length;
  updateHeroImage();
  resetAutoPlay();
}

function prevHero() {
  currentHeroIndex = (currentHeroIndex - 1 + heroImages.length) % heroImages.length;
  updateHeroImage();
  resetAutoPlay();
}

function updateHeroImage() {
  document.getElementById('heroImg').src = heroImages[currentHeroIndex];
  document.getElementById('heroCounter').textContent = `${currentHeroIndex + 1} / ${heroImages.length}`;
}

function resetAutoPlay() {
  clearInterval(autoPlayInterval);
  startAutoPlay();
}

document.addEventListener('DOMContentLoaded', () => {
  updateHeroImage();
  startAutoPlay();
});

const heroContainer = document.querySelector('.hero-image-container');
if (heroContainer) {
  heroContainer.addEventListener('mouseenter', () => {
    clearInterval(autoPlayInterval);
  });
  
  heroContainer.addEventListener('mouseleave', () => {
    startAutoPlay();
  });
}

// ============ ROOM IMAGES MAPPING ============
const ROOM_IMAGES = {
  'Room 107': 'Gallery/14_15_16_Floor_Classroom.jpeg',
  'Room 307': 'Gallery/14_15_16_Floor_Classroom.jpeg',
  'Lab 402': 'Gallery/VLSI_LAB.jpeg',
  'Lab 403': 'Gallery/VLSI_LAB.jpeg',
  'Lab 404': 'Gallery/AI_Lab.jpeg',
  'Lab 405': 'Gallery/VLSI_LAB.jpeg',
  'Room 1403': 'Gallery/1403_1503_1603_classroom.jpeg',
  'Room 1503': 'Gallery/1403_1503_1603_classroom.jpeg',
  'Room 1603': 'Gallery/1403_1503_1603_classroom.jpeg',
  'Room 1404': 'Gallery/14_15_16_Floor_Classroom.jpeg',
  'Room 1504': 'Gallery/14_15_16_Floor_Classroom.jpeg',
  'Room 1604': 'Gallery/14_15_16_Floor_Classroom.jpeg',
  'Room 1405': 'Gallery/1405_1505_1605_classroom.jpeg',
  'Room 1505': 'Gallery/1405_1505_1605_classroom.jpeg',
  'Room 1605': 'Gallery/1405_1505_1605_classroom.jpeg',
  'Room 1407': 'Gallery/1405_1505_1605_classroom.jpeg',
  'Room 1507': 'Gallery/1405_1505_1605_classroom.jpeg',
  'Room 1607': 'Gallery/1405_1505_1605_classroom.jpeg',
};

// ============ DATA ============
let ROOMS = [
  { id:1,  name:'Room 107',  type:'Classroom', capacity:30, icon:'🏫' },
  { id:2,  name:'Room 307',  type:'Classroom', capacity:30, icon:'🏫' },
  { id:3,  name:'Lab 402',   type:'Laboratory', capacity:25, icon:'💻' },
  { id:4,  name:'Lab 403',   type:'Laboratory', capacity:25, icon:'🤖' },
  { id:5,  name:'Lab 404',   type:'Laboratory', capacity:25, icon:'⚡' },
  { id:6,  name:'Lab 405',   type:'Laboratory', capacity:25, icon:'💻' },
  { id:7,  name:'Room 1403', type:'Classroom', capacity:40, icon:'📖' },
  { id:8,  name:'Room 1404', type:'Classroom', capacity:40, icon:'📖' },
  { id:9,  name:'Room 1405', type:'Classroom', capacity:40, icon:'📖' },
  { id:10, name:'Room 1407', type:'Classroom', capacity:35, icon:'🏫' },
  { id:11, name:'Room 1503', type:'Classroom', capacity:30, icon:'📖' },
  { id:12, name:'Room 1504', type:'Classroom', capacity:30, icon:'📖' },
  { id:13, name:'Room 1505', type:'Classroom', capacity:30, icon:'📖' },
  { id:14, name:'Room 1507', type:'Classroom', capacity:35, icon:'🏫' },
  { id:15, name:'Room 1603', type:'Classroom', capacity:30, icon:'📖' },
  { id:16, name:'Room 1604', type:'Classroom', capacity:30, icon:'📖' },
  { id:17, name:'Room 1605', type:'Classroom', capacity:30, icon:'📖' },
  { id:18, name:'Room 1607', type:'Classroom', capacity:35, icon:'🏫' },
];

let bookings = [];
let archivedBookings = [];
let nextId = 1;
// Always use the same origin — Flask serves both the HTML and the API,
// so relative URLs work in dev (127.0.0.1:5000) and in production (render.com, etc.)
const API_BASE = '';

function saveData() {
  return true;
}

function saveArchivedData() {
  return true;
}

function autoArchivePastBookings() {
  return true;
}

// ============ DEPT DATA ============
const DEPT_DATA = {
  cse: {
    name: 'Computer Science & Engineering',
    short: 'CSE',
    icon: '💻',
    students: 220,
    faculty: 18,
    labs: 4,
    desc: 'The CSE department offers a rigorous undergraduate program covering programming, data structures, algorithms, AI, networks, and software engineering.',
    semesters: [
             {
                title: "1st Year 1st Semester | Credit",
                items: [
                    "CSE 111 — Computer Fundamentals | 2.00",
                    "PHY 111 — Physics | 3.00",
                    "PHY 112 — Physics Lab | 1.50",
                    "CSE 113 — Structured Programming Language | 3.00",
                    "CSE 114 — Structured Programming Language Lab | 1.50",
                    "MATH 115 — Differential Calculus and Integral Calculus | 3.00",
                    "ENG 119 — English | 3.00",
                    "HSS *** — GED Course | 3.00",
                    "Subtotal — 20.00"
               ]
             },
{
                title: "1st Year 2nd Semester | Credit",
                items: [
                    "ENG 120 — Developing English Skills Lab | 1.00 | Pre-req: ENG 119",
                    "CSE 121 — Discrete Mathematics | 3.00",
                    "CSE 123 — Object Oriented Programming | 3.00 | Pre-req: CSE 113",
                    "CSE 124 — Object Oriented Programming Lab | 1.50 | Pre-req: CSE 114",
                    "EEE 123 — Introduction to Electrical Engineering | 3.00 | Pre-req: PHY 111",
                    "EEE 124 — Introduction to Electrical Engineering Lab | 1.50",
                    "MATH 125 — Ordinary and Partial Differential Equations | 3.00",
                    "CHEM 127 — Chemistry | 3.00",
                    "CHEM 128 — Chemistry Lab | 1.00",
                    "Subtotal — 20.00"
                ]
            },
            {
                title: "2nd Year 1st Semester | Credit",
                items: [
                    "CSE 211 — Data Structure | 3.00 | Pre-req: CSE 113",
                    "CSE 212 — Data Structure Lab | 1.50 | Pre-req: CSE 114",
                    "EEE 213 — Electronic Devices and Circuits | 3.00 | Pre-req: EEE 123",
                    "EEE 214 — Electronic Devices and Circuits Lab | 1.50 | Pre-req: EEE 124",
                    "ME 215 — Basic Mechanical Engineering | 3.00",
                    "MATH 217 — Co-ordinate Geometry and Vector Analysis | 3.00",
                    "HSS *** — GED Course | 3.00",
                    "Subtotal — 18.00"
                ]
            },
            {
                title: "2nd Year 2nd Semester | Credit",
                items: [
                    "CSE 221 — Algorithms | 3.00 | Pre-req: CSE 113",
                    "CSE 222 — Algorithms Lab | 1.50 | Pre-req: CSE 114",
                    "CSE 223 — Database Management Systems | 3.00",
                    "CSE 224 — Database Management Systems Lab | 1.50",
                    "CSE 225 — Digital Logic Design | 3.00",
                    "CSE 226 — Digital Logic Design Lab | 1.50",
                    "CSE 227 — Theory of Computing | 3.00 | Pre-req: CSE 121",
                    "MATH 229 — Linear Algebra and Complex Variables | 3.00",
                    "ACT *** — GED Course | 3.00",
                    "Subtotal — 22.50"
                ]
            },
            {
                title: "3rd Year 1st Semester | Credit",
                items: [
                    "CSE 311 — Numerical Analysis | 3.00 | Pre-req: CSE 221",
                    "CSE 312 — Numerical Analysis Lab | 1.50 | Pre-req: CSE 222",
                    "CSE 313 — Data Communication | 3.00",
                    "CSE *** — Elective I | 3.00",
                    "CSE *** — Elective I Lab | 1.50",
                    "CSE 319 — Computer Architecture | 3.00",
                    "ECO *** — GED Course | 3.00",
                    "MATH 319 — Statistics and Probability | 3.00",
                    "Subtotal — 21.00"
                ]
            },
            {
                title: "3rd Year 2nd Semester | Credit",
                items: [
                    "CSE 321 — Compiler Design | 3.00 | Pre-req: CSE 227",
                    "CSE 322 — Compiler Design Lab | 1.50 | Pre-req: CSE 227",
                    "CSE 323 — Artificial Intelligence & Expert Systems | 3.00",
                    "CSE 324 — Artificial Intelligence & Expert Systems Lab | 1.50",
                    "CSE 325 — Computer Networks | 3.00",
                    "CSE 326 — Computer Networks Lab | 1.50",
                    "CSE 327 — Operating Systems | 3.00",
                    "CSE 328 — Operating Systems Lab | 1.50",
                    "BUS *** — GED Course | 3.00",
                    "Subtotal — 21.00"
                ]
            },
            {
                title: "4th Year 1st Semester | Credit",
                items: [
                    "CSE 400 — Project and Thesis | 1.50",
                    "CSE 410 — System Analysis and Design Lab | 1.50",
                    "EEE *** — Advance core course | 3.00",
                    "CSE 413 — Software Engineering | 3.00",
                    "CSE 414 — Software Engineering Lab | 1.50",
                    "EEE *** — Elective I | 3.00",
                    "EEE *** — Elective I Lab | 1.50",
                    "CSE *** — Elective I | 3.00",
                    "CSE *** — Elective I Lab | 1.50",
                    "Subtotal — 19.50"
                ]
            },
            {
                title: "4th Year 2nd Semester | Credit",
                items: [
                    "CSE 400 — Project and Thesis | 3.00",
                    "CSE 421 — Communication Engineering | 3.00",
                    "CSE *** — Elective II | 3.00",
                    "CSE *** — Elective II | 3.00",
                    "CSE *** — Elective II | 3.00",
                    "Subtotal — 15.00"
                ]
            }
        ]
    },
    eee: {
        name: "EEE",
        subtitle: "Electrical and Electronic Engineering course offering summary.",
        semesters: [
            { title: "Semester 1", items: ["Basic electrical principles.", "Mathematics and physics for engineering."] },
            { title: "Semester 2", items: ["Circuit analysis.", "Electronics fundamentals."] },
            { title: "Semester 3", items: ["Signals and systems.", "Digital electronics."] },
            { title: "Semester 4", items: ["Control systems.", "Power systems fundamentals."] },
            { title: "Semester 5", items: ["Advanced electrical subjects.", "Project-based lab work."] },
            { title: "Semester 6", items: ["Thesis and presentation.", "Elective specialization modules."] }
        ]
    },
    ete: {
        name: "ETE",
        subtitle: "Electronic and Telecommunication Engineering course offering summary.",
        semesters: [
            { title: "Semester 1", items: ["Introduction to electronics.", "Mathematics for telecommunications."] },
            { title: "Semester 2", items: ["Digital circuits.", "Communication fundamentals."] },
            { title: "Semester 3", items: ["Microprocessor systems.", "Signal processing basics."] },
            { title: "Semester 4", items: ["Telecommunication systems.", "Network fundamentals."] },
            { title: "Semester 5", items: ["Advanced telecom subjects.", "Industry-oriented project work."] },
            { title: "Semester 6", items: ["Final year thesis.", "Professional communication modules."] }
        ]
    }
};

// ============ INIT ============
function updateHighlight() {
  const counter = document.getElementById('heroCounter');
  if (counter) {
    counter.textContent = `${currentHeroIndex + 1} / ${heroImages.length}`;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  autoArchivePastBookings();
  initRoom();
  initHero();
  updateTodayDate();
  populateRoomDropdown();
  loadBookings();
  renderGalleryCards();
  updateHighlight();
  checkScrollTop();
  
  // Show hero on home section by default
  const heroSection = document.getElementById('hero');
  const statsBar = document.querySelector('.stats-bar');
  if (heroSection) heroSection.style.display = 'block';
  if (statsBar) statsBar.style.display = 'block';
  
  window.addEventListener('scroll', checkScrollTop);
  
  // Gallery keyboard controls
  document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('galleryModal');
    if (!modal.classList.contains('open')) return;
    
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowRight') nextGallery();
    if (e.key === 'ArrowLeft') prevGallery();
  });
  
  // Close gallery on modal background click
  document.getElementById('galleryModal').addEventListener('click', function(e) {
    if (e.target === this) closeGallery();
  });
});

// ============ HERO SLIDER ============
let currentSlide = 0;
function initHero() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const heroDots = document.getElementById('heroDots');

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = `dot ${i === 0 ? 'active' : ''}`;
    dot.onclick = () => goToSlide(i);
    heroDots.appendChild(dot);
  });

  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateHeroSlide();
  }, 5000);
}

function updateHeroSlide() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function goToSlide(n) {
  currentSlide = n;
  updateHeroSlide();
}

// ============ SECTIONS ============
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  
  // Show selected section
  document.getElementById(sectionId).classList.add('active');
  
  // Show/hide hero based on section
  const heroSection = document.getElementById('hero');
  const statsBar = document.querySelector('.stats-bar');
  
  if (sectionId === 'home') {
    heroSection.style.display = 'block';
    statsBar.style.display = 'block';
  } else {
    heroSection.style.display = 'none';
    statsBar.style.display = 'none';
  }
  
  // Update nav active state
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const navElement = document.getElementById(`nav-${sectionId}`);
  if (navElement) navElement.classList.add('active');
  
  // Close mobile menu
  document.getElementById('mobileMenu').classList.remove('open');
}

function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// ============ ROOM BOOKING ============
function initRoom() {
  const roomSelect = document.getElementById('resource');
  ROOMS.forEach(room => {
    const option = document.createElement('option');
    option.value = room.id;
    option.textContent = `${room.icon} ${room.name} (${room.type})`;
    roomSelect.appendChild(option);
  });
}

async function populateRoomDropdown() {
  const select = document.getElementById('resource');
  if (!select) return;
  select.innerHTML = '<option value="">Select a room…</option>';

  try {
    const res = await fetch(`${API_BASE}/api/rooms`);
    const data = await res.json();
    ROOMS = data;
    data.forEach(room => {
      const option = document.createElement('option');
      option.value = room.id;
      option.textContent = `${room.icon || '🏫'} ${room.name}`;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Could not load rooms from backend:', error);
    ROOMS.forEach(room => {
      const option = document.createElement('option');
      option.value = room.id;
      option.textContent = `${room.icon || '🏫'} ${room.name}`;
      select.appendChild(option);
    });
  }
}

function onRoomChange() {
  const roomId = parseInt(document.getElementById('resource').value);
  if (!roomId) return;
  
  const room = ROOMS.find(r => r.id === roomId);
  if (!room) return;
  
  document.getElementById('roomPreviewName').textContent = `${room.icon} ${room.name}`;
  document.getElementById('roomPreviewMeta').textContent = `${room.type} • Capacity: ${room.capacity} people`;
  
  // Get room image or use icon
  const roomImage = ROOM_IMAGES[room.name];
  const roomPreviewImg = document.getElementById('roomPreviewImg');
  
  if (roomImage) {
    roomPreviewImg.innerHTML = `<img src="${roomImage}" alt="${room.name}" style="width:100%;height:100%;object-fit:cover;">`;
  } else {
    roomPreviewImg.innerHTML = `<span>${room.icon}</span>`;
  }
  
  // Check availability
  updateAvailability();
}

async function handleBooking(event) {
  event.preventDefault();

  const roomId = parseInt(document.getElementById('resource').value);
  const user = document.getElementById('user').value.trim();
  const purpose = document.getElementById('purpose').value;
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;

  if (!roomId || !user || !startTime || !endTime) {
    showToast('Please fill all fields', 'error');
    return;
  }

  if (new Date(endTime) <= new Date(startTime)) {
    showToast('End time must be after start time!', 'error');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room_id: roomId,
        faculty_name: user,
        purpose,
        start_time: startTime,
        end_time: endTime
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Booking failed');

    document.getElementById('bookingForm').reset();
    document.getElementById('roomPreviewName').textContent = 'Select a room';
    showToast(`✓ Room booked successfully!`, 'success');
    await loadBookings();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function deleteBooking(id) {
  if (!confirm('Delete this booking?')) return;

  try {
    const res = await fetch(`${API_BASE}/api/bookings/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Delete failed');
    showToast('Booking deleted', 'success');
    await loadBookings();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// View all data stored in Browser (for debugging/checking)
function checkAllStoredData() {
  const activeBookings = JSON.parse(localStorage.getItem('fset_bookings') || '[]');
  const archived = JSON.parse(localStorage.getItem('fset_archived_bookings') || '[]');
  
  console.log('=== FSET BOOKING SYSTEM DATA ===');
  console.log('📊 Active Bookings:', activeBookings.length);
  console.log('   Data:', activeBookings);
  console.log('\n📋 Archived Bookings:', archived.length);
  console.log('   Data:', archived);
  console.log('\n💾 Total Stored:', activeBookings.length + archived.length, 'bookings');
  console.log('\nTo view this info anytime, open Browser DevTools (F12) and type: checkAllStoredData()');
}

async function loadBookings() {
  try {
    const res = await fetch(`${API_BASE}/api/bookings`);
    const data = await res.json();
    bookings = data;
    renderBookings();
    updateAvailability();
  } catch (error) {
    console.error('Could not load bookings from backend:', error);
    bookings = [];
    renderBookings();
  }
}

function renderBookings() {
  const tbody = document.getElementById('bookingTable');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (bookings.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="7">No booking history yet.</td></tr>';
    const stat = document.getElementById('stat-bookings');
    if (stat) stat.textContent = '0';
    return;
  }

  bookings.forEach((b, idx) => {
    const room = ROOMS.find(r => r.id === b.room_id) || { name: b.room || 'Room', icon: '🏫' };
    const tr = document.createElement('tr');

    const startDate = new Date(b.start);
    const endDate = new Date(b.end);

    const purposeClass = {
      'Class': 'purpose-class',
      'Lab': 'purpose-lab',
      'Exam': 'purpose-exam',
      'Meeting': 'purpose-meeting'
    }[b.purpose] || 'purpose-class';

    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${room.icon || '🏫'} ${room.name}</td>
      <td>${b.faculty}</td>
      <td><span class="purpose-badge ${purposeClass}">${b.purpose}</span></td>
      <td>${startDate.toLocaleString()}</td>
      <td>${endDate.toLocaleString()}</td>
      <td><button class="del-btn" onclick="deleteBooking(${b.id})">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });

  const stat = document.getElementById('stat-bookings');
  if (stat) stat.textContent = bookings.length;
}

function filterBookings() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#bookingTable tr');
  
  rows.forEach(row => {
    if (row.classList.contains('empty-row')) return;
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(query) ? '' : 'none';
  });
}

function updateAvailability() {
  const roomId = parseInt(document.getElementById('resource').value);
  const startTime = document.getElementById('startTime').value;
  const resultsDiv = document.getElementById('availResults');
  if (!resultsDiv) return;

  if (!roomId || !startTime) {
    resultsDiv.innerHTML = '<span style="font-size:0.85rem;color:var(--text2);">Select a room and time</span>';
    return;
  }

  const start = new Date(startTime);
  resultsDiv.innerHTML = '';

  for (let i = 0; i < 6; i++) {
    const time = new Date(start.getTime() + i * 4 * 60 * 60 * 1000);
    const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const hasConflict = bookings.some(b => 
      b.room_id === roomId && 
      !(new Date(b.end || b.end_time) <= time || new Date(b.start || b.start_time) >= new Date(time.getTime() + 60*60*1000))
    );

    const chip = document.createElement('div');
    chip.className = `avail-chip ${hasConflict ? 'taken' : 'free'}`;
    chip.textContent = `${timeStr} - ${hasConflict ? 'Taken' : 'Free'}`;
    resultsDiv.appendChild(chip);
  }
}

// ============ DEPARTMENT ============
function showDepartment(dept) {
  showSection('department');
  showDeptTab(dept, document.querySelector(`.dept-tab[onclick*="${dept}"]`));
}

function showDeptTab(dept, element) {
  document.querySelectorAll('.dept-tab').forEach(t => t.classList.remove('active'));
  element.classList.add('active');
  
  const data = DEPT_DATA[dept];
  
  // Update intro card
  document.getElementById('deptIntroCard').innerHTML = `
    <h3>${data.icon} ${data.name}</h3>
    <p>${data.desc}</p>
    <div class="dept-stats">
      <div class="dept-stat">
        <div class="dept-stat-n">${data.students}</div>
        <div class="dept-stat-l">Students</div>
      </div>
      <div class="dept-stat">
        <div class="dept-stat-n">${data.faculty}</div>
        <div class="dept-stat-l">Faculty</div>
      </div>
      <div class="dept-stat">
        <div class="dept-stat-n">${data.labs}</div>
        <div class="dept-stat-l">Laboratories</div>
      </div>
    </div>
  `;
  
  // Update semesters
  const grid = document.getElementById('semestersGrid');
  grid.innerHTML = '';
  data.semesters.forEach(sem => {
    const card = document.createElement('div');
    card.className = 'sem-card';
    card.innerHTML = `
      <div class="sem-title">${sem.title}</div>
      <ul>
        ${sem.items.map(item => `<li>${item}</li>`).join('')}
      </ul>
    `;
    grid.appendChild(card);
  });
}

// ============ GALLERY ============
function showGalleryTab(category, element) {
  currentGalleryCategory = category;
  
  // Update active tab
  document.querySelectorAll('.gallery-tab').forEach(tab => tab.classList.remove('active'));
  element.classList.add('active');
  
  // Render gallery cards
  renderGalleryCards();
}

function renderGalleryCards() {
  const container = document.getElementById('galleryGridContainer');
  const images = GALLERY_DATA[currentGalleryCategory].images;
  
  container.innerHTML = '';
  images.forEach((img, idx) => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.innerHTML = `
      <img src="${img.src}" alt="${img.title}" style="width:100%;height:100%;object-fit:cover;">
      <div class="gallery-label">${img.title}</div>
    `;
    card.onclick = () => openGallery(idx);
    container.appendChild(card);
  });
}

function openGallery(idx) {
  currentGalleryIndex = idx;
  const modal = document.getElementById('galleryModal');
  const img = document.getElementById('galleryImg');
  const counter = document.getElementById('galleryCounter');
  
  const images = GALLERY_DATA[currentGalleryCategory].images;
  img.src = images[idx].src;
  counter.textContent = `${idx + 1} / ${images.length}`;
  modal.classList.add('open');
}

function closeGallery() {
  const modal = document.getElementById('galleryModal');
  modal.classList.remove('open');
}

function nextGallery() {
  const images = GALLERY_DATA[currentGalleryCategory].images;
  currentGalleryIndex = (currentGalleryIndex + 1) % images.length;
  const img = document.getElementById('galleryImg');
  const counter = document.getElementById('galleryCounter');
  
  img.src = images[currentGalleryIndex].src;
  counter.textContent = `${currentGalleryIndex + 1} / ${images.length}`;
}

function prevGallery() {
  const images = GALLERY_DATA[currentGalleryCategory].images;
  currentGalleryIndex = (currentGalleryIndex - 1 + images.length) % images.length;
  const img = document.getElementById('galleryImg');
  const counter = document.getElementById('galleryCounter');
  
  img.src = images[currentGalleryIndex].src;
  counter.textContent = `${currentGalleryIndex + 1} / ${images.length}`;
}

// ============ THEME ============
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('fset_theme', newTheme);
  
  const btn = document.querySelector('.theme-btn');
  btn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

// Load theme on startup
window.addEventListener('DOMContentLoaded', () => {
  const theme = localStorage.getItem('fset_theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelector('.theme-btn').textContent = theme === 'dark' ? '☀️' : '🌙';
});

// ============ TOAST ============
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    ${message}
    <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
  `;
  container.appendChild(toast);
  
  setTimeout(() => toast.remove(), 4000);
}

// ============ UTILITY ============
function updateTodayDate() {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('todayDate').textContent = today.toLocaleDateString('en-US', options);
  
  // Update today's bookings
  const todayBookings = bookings.filter(b => {
    const bookDate = new Date(b.start_time).toDateString();
    return bookDate === today.toDateString();
  });
  
  const todayDiv = document.getElementById('todayBookings');
  if (todayBookings.length === 0) {
    todayDiv.textContent = 'No bookings scheduled for today';
  } else {
    let html = `<div style="font-weight:700;color:var(--green);margin-bottom:12px;font-size:0.95rem;">📅 ${todayBookings.length} booking${todayBookings.length > 1 ? 's' : ''} today</div>`;
    html += todayBookings.slice(0, 3).map(b => {
      const room = ROOMS.find(r => r.id === b.room_id);
      const time = new Date(b.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      return `<div style="padding:8px;background:var(--green-light);border-radius:8px;margin-bottom:6px;font-size:0.9rem;"><strong>${room.icon} ${room.name}</strong> at ${time}</div>`;
    }).join('');
    if (todayBookings.length > 3) {
      html += `<div style="padding:8px;color:var(--text3);font-size:0.85rem;">+${todayBookings.length - 3} more</div>`;
    }
    todayDiv.innerHTML = html;
  }
}

function checkScrollTop() {
  const scrollBtn = document.getElementById('scrollTop');
  if (window.scrollY > 300) {
    scrollBtn.style.display = 'flex';
  } else {
    scrollBtn.style.display = 'none';
  }
}
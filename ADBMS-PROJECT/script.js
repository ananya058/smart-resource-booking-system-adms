const form = document.getElementById("bookingForm");
const table = document.getElementById("bookingTable");
const bookBtn = document.getElementById("bookBtn");
const aboutBtn = document.getElementById("aboutBtn");
const homeSection = document.getElementById("home");
const roomBooking = document.getElementById("roomBooking");
const aboutSection = document.getElementById("about");
const departmentSection = document.getElementById("departmentSection");
const departmentTitle = document.getElementById("departmentTitle");
const departmentSubtitle = document.getElementById("departmentSubtitle");
const departmentBadge = document.getElementById("departmentBadge");
const departmentContent = document.getElementById("departmentContent");
const departmentIntro = document.getElementById("departmentIntro");

// API Base URL
const API_BASE = 'http://localhost:8000/api';

// Load data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadRooms();
    loadBookings();
});

// API Helper Functions
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        alert('Error: ' + error.message);
        throw error;
    }
}

// Load rooms from database
async function loadRooms() {
    try {
        const rooms = await apiRequest('/rooms');
        const roomSelect = document.getElementById("resource");

        // Clear existing options except the first one
        roomSelect.innerHTML = '<option value="">Select Room</option>';

        // Add rooms from database
        rooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room.id;
            option.textContent = room.name;
            roomSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to load rooms:', error);
        // Fallback to default rooms if API fails
        loadDefaultRooms();
    }
}

// Fallback function for default rooms
function loadDefaultRooms() {
    const roomSelect = document.getElementById("resource");
    const defaultRooms = [
        'Room 107', 'Room 307', 'Lab 401', 'Lab 402', 'Lab 403', 'Lab 404',
        'Room 1403', 'Room 1404', 'Room 1405', 'Room 1407', 'Room 1503',
        'Room 1504', 'Room 1505', 'Room 1507', 'Room 1603', 'Room 1604',
        'Room 1605', 'Room 1607'
    ];

    roomSelect.innerHTML = '<option value="">Select Room</option>';
    defaultRooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room;
        option.textContent = room;
        roomSelect.appendChild(option);
    });
}

// Load bookings from database
async function loadBookings() {
    try {
        const bookings = await apiRequest('/bookings');
        displayBookings(bookings);
    } catch (error) {
        console.error('Failed to load bookings:', error);
        table.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Failed to load bookings</td></tr>';
    }
}

// Display bookings in table
function displayBookings(bookings) {
    table.innerHTML = '';

    if (bookings.length === 0) {
        table.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No bookings found</td></tr>';
        return;
    }

    bookings.forEach(booking => {
        const row = document.createElement('tr');
        const startDate = new Date(booking.start_time);
        const endDate = new Date(booking.end_time);

        row.innerHTML = `
            <td>${booking.room_name}</td>
            <td>${booking.faculty_name}</td>
            <td>${booking.purpose}</td>
            <td>${startDate.toLocaleString()}</td>
            <td>${endDate.toLocaleString()}</td>
        `;
        table.appendChild(row);
    });
}

const departmentData = {
    cse: {
        name: "CSE",
        subtitle: "Department of Computer Science & Engineering",
        intro: `
          <div class="text-center mb-3">
            <h2 class="mb-1">Bachelor of Science in Computer Science and Engineering (CSE)</h2>
            <p class="text-muted mb-4">Course Curriculum</p>
          </div>
          <div class="course-category">
            <h5 class="fw-semibold mb-3">Category of courses:</h5>
            <ul class="category-list mb-0">
              <li>English <span>(4.0 credit hours)</span></li>
              <li>General Education <span>(15 credit hours)</span></li>
              <li>Mathematics <span>(15 credit hours)</span></li>
              <li>Basic Sciences <span>(8.5 credit hours)</span>
                <ul class="sub-list">
                  <li>Physics and Chemistry</li>
                </ul>
              </li>
              <li>Other Engineering Courses (OEN) <span>(12 credit hours)</span></li>
              <li>CSE Engineering courses <span>(102.5 credit hours)</span>
                <ul class="sub-list">
                  <li>CSE Core i/c project <span>(4.5 credit hours)</span></li>
                  <li>CSE Advanced Core <span>(60.5 credit hours)</span></li>
                  <li>Advisor Approved Technical Electives <span>(22.5 credit hours)</span>
                    <ul class="sub-list">
                      <li>Elective I (Courses with labs) <span>(13.5 credit hours)</span></li>
                      <li>Elective II (courses without labs) <span>(9.0 credit hours)</span></li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
            <p class="fw-semibold mt-4">Total Credit hours: 157.00</p>
          </div>
        `,
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

function showHome() {
    homeSection.style.display = "block";
    aboutSection.style.display = "none";
    roomBooking.style.display = "none";
    departmentSection.style.display = "none";
}

// Toggle room booking section
bookBtn.addEventListener("click", function() {
    if (roomBooking.style.display === "none") {
        homeSection.style.display = "block";
        hideSections();
        roomBooking.style.display = "block";
        roomBooking.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
        roomBooking.style.display = "none";
    }
});

function hideSections() {
    aboutSection.style.display = "none";
    roomBooking.style.display = "none";
    departmentSection.style.display = "none";
}

function showDepartment(departmentKey) {
    const department = departmentData[departmentKey];
    if (!department) return;

    if (departmentSection.style.display === "block" && departmentBadge.textContent === department.name) {
        departmentSection.style.display = "none";
        homeSection.style.display = "block";
        return;
    }

    homeSection.style.display = "none";
    hideSections();
    departmentSection.style.display = "block";
    departmentTitle.textContent = `Course of study`;
    departmentSubtitle.textContent = department.subtitle;
    departmentBadge.textContent = department.name;
    departmentIntro.innerHTML = department.intro || "";

    departmentContent.innerHTML = department.semesters.map(sem => `
        <div class="semester-card mb-3 p-4 rounded-4 bg-white shadow-sm">
            <div class="semester-title mb-2 text-success fw-semibold">${sem.title}</div>
            <ul class="semester-list mb-0">
                ${sem.items.map(item => `<li>${item}</li>`).join("")}
            </ul>
        </div>
    `).join("");

    departmentSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Toggle about section
aboutBtn.addEventListener("click", function() {
    if (aboutSection.style.display === "none") {
        hideSections();
        aboutSection.style.display = "block";
        aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
        aboutSection.style.display = "none";
    }
});

// Form submission handler
form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const resource = document.getElementById("resource").value;
    const user = document.getElementById("user").value;
    const purpose = document.getElementById("purpose").value;
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;

    // Validate required fields
    if (!resource || !user || !startTime || !endTime) {
        alert("Please fill all required fields!");
        return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
        alert("End time must be after start time!");
        return;
    }

    try {
        // Create booking via API
        const bookingData = {
            room_id: parseInt(resource),
            faculty_name: user,
            purpose: purpose,
            start_time: startTime,
            end_time: endTime
        };

        const newBooking = await apiRequest('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });

        alert("Booking Successful!");
        form.reset();

        // Reload bookings to show the new one
        loadBookings();

    } catch (error) {
        // Error handling is done in apiRequest function
        console.error('Booking failed:', error);
    }
});
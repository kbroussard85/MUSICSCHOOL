/* ==========================================
   HARMONY MUSIC SCHOOL - INTERACTIVE ENGINE
   ========================================== */

// 1. STATE MANAGEMENT
const state = {
    currentTab: 'home',
    courses: [
        { id: 1, title: 'Classical Piano Foundations', instrument: 'piano', level: 'Beginner', duration: '8 Weeks', desc: 'Master basic music theory, scales, sight-reading, and your first classical keyboard compositions.' },
        { id: 2, title: 'Electric Guitar Riffs & Improvisation', instrument: 'guitar', level: 'Intermediate', duration: '10 Weeks', desc: 'Unlock fretboard navigation, blues scales, lead solos, and dynamic rhythmic accompaniment techniques.' },
        { id: 3, title: 'Virtuoso Violin Artistry', instrument: 'violin', level: 'Advanced', duration: '12 Weeks', desc: 'Focus on complex bowings, high positions, vibrato control, and sophisticated orchestral repertoire pieces.' },
        { id: 4, title: 'Vocal Tuning & Breath Control', instrument: 'voice', level: 'Beginner', duration: '6 Weeks', desc: 'Develop proper breath support, range extension exercises, tone development, and vocal health skills.' },
        { id: 5, title: 'Syncopated Grooves & Jazz Fills', instrument: 'drums', level: 'Intermediate', duration: '8 Weeks', desc: 'Explore complex polyrhythms, independence, timekeeping, drum set orchestration, and speed dynamics.' },
        { id: 6, title: 'Acoustic Songwriting & Fingerstyle', instrument: 'guitar', level: 'Beginner', duration: '8 Weeks', desc: 'Learn open chords, fingerpicking patterns, and the structures to write your first acoustic melodies.' },
        { id: 7, title: 'Jazz Piano Essentials', instrument: 'piano', level: 'Intermediate', duration: '12 Weeks', desc: 'Discover 7th chords, swing rhythm patterns, lead sheets, voicing options, and melodic improvisation.' },
        { id: 8, title: 'Pop Vocal Performance', instrument: 'voice', level: 'Intermediate', duration: '8 Weeks', desc: 'Perfect mic technique, stage presence, dynamic projection, and styling contemporary pop covers.' }
    ],
    student: {
        name: 'Alex Broussard',
        totalHours: 24.5,
        weeklyGoalHours: 5.0,
        weeklyLoggedHours: 3.5,
        sessions: [
            { date: 'June 10', instrument: 'Piano', notes: 'Chopin Prelude Op. 28', hours: 1.5 },
            { date: 'June 08', instrument: 'Piano', notes: 'Hanon Exercises & Scales', hours: 2.0 }
        ]
    }
};

// 2. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    initTabRouting();
    initMobileNav();
    renderCourses('all');
    initCoursesFilter();
    initPracticeLogger();
    initChat();
    initBookingForm();
    
    // Set default date for booking picker (tomorrow)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateInput = document.getElementById('bookDate');
    if (dateInput) {
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }
});

// 3. TAB ROUTING CONTROLLER
function initTabRouting() {
    const links = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    // Handle Click Events
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            // Prevent actual navigation for local tabs
            const tabId = link.getAttribute('data-tab');
            if (tabId) {
                e.preventDefault();
                switchTab(tabId);
            }
        });
    });

    // Handle initial hash in URL
    const hash = window.location.hash.substring(1);
    if (hash && ['home', 'courses', 'dashboard', 'booking'].includes(hash)) {
        switchTab(hash);
    }
}

function switchTab(tabId) {
    state.currentTab = tabId;
    window.location.hash = tabId;
    
    // Update active tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const activeSection = document.getElementById(tabId);
    if (activeSection) {
        activeSection.classList.add('active');
        // Scroll to top of content
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Update active state in Navigation links
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        if (link.getAttribute('data-tab') === tabId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Close mobile drawer if open
    const drawer = document.getElementById('mobileDrawer');
    if (drawer && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        document.getElementById('mobileNavToggle').innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
}

// 4. MOBILE NAVIGATION DRAWER
function initMobileNav() {
    const toggle = document.getElementById('mobileNavToggle');
    const drawer = document.getElementById('mobileDrawer');
    
    if (toggle && drawer) {
        toggle.addEventListener('click', () => {
            const isOpen = drawer.classList.contains('open');
            if (isOpen) {
                drawer.classList.remove('open');
                toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            } else {
                drawer.classList.add('open');
                toggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            }
        });
    }
}

// 5. COURSES RENDERER & FILTER
function renderCourses(filter = 'all') {
    const grid = document.getElementById('coursesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const filteredCourses = filter === 'all' 
        ? state.courses 
        : state.courses.filter(c => c.instrument === filter);
        
    filteredCourses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.setAttribute('data-instrument', course.instrument);
        card.setAttribute('data-level', course.level);
        
        let instrumentIcon = 'fa-music';
        if (course.instrument === 'piano') instrumentIcon = 'fa-keyboard';
        if (course.instrument === 'guitar') instrumentIcon = 'fa-guitar';
        if (course.instrument === 'voice') instrumentIcon = 'fa-microphone';
        if (course.instrument === 'drums') instrumentIcon = 'fa-drum';
        
        card.innerHTML = `
            <div class="course-badge">${course.level}</div>
            <div class="course-body">
                <div class="course-category"><i class="fa-solid ${instrumentIcon}"></i> ${course.instrument}</div>
                <h3 class="course-title">${course.title}</h3>
                <p class="course-desc">${course.desc}</p>
                <div class="course-footer">
                    <span class="course-duration"><i class="fa-solid fa-clock"></i> ${course.duration}</span>
                    <button class="btn btn-primary btn-sm" onclick="bookForInstrument('${course.instrument.charAt(0).toUpperCase() + course.instrument.slice(1)}')">Enroll</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function initCoursesFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            renderCourses(filterValue);
        });
    });
}

// Global hook to support course enroll button navigating to booking
window.bookForInstrument = function(instrumentName) {
    switchTab('booking');
    const select = document.getElementById('bookInstrument');
    if (select) {
        select.value = instrumentName;
    }
};

// 6. PRACTICE LOGGER INTERACTION
function initPracticeLogger() {
    const form = document.getElementById('practiceLogForm');
    if (!form) return;
    
    updatePracticeUI();
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const hoursInput = document.getElementById('practiceDuration');
        const notesInput = document.getElementById('practiceNotes');
        
        const hours = parseFloat(hoursInput.value);
        const notes = notesInput.value.trim();
        
        if (hours && notes) {
            // Update state
            state.student.totalHours += hours;
            state.student.weeklyLoggedHours += hours;
            
            const newSession = {
                date: getTodayLabel(),
                instrument: 'Piano',
                notes: notes,
                hours: hours
            };
            state.student.sessions.unshift(newSession);
            
            // Re-render UI components
            updatePracticeUI();
            
            // Clear inputs
            hoursInput.value = '';
            notesInput.value = '';
        }
    });
}

function updatePracticeUI() {
    // Update displays
    document.getElementById('practiceHoursDisplay').innerText = `${state.student.totalHours.toFixed(1)}h`;
    
    // Update weekly goals
    const progressFill = document.getElementById('progressFill');
    const progressPercentageText = document.getElementById('progressPercentage');
    
    if (progressFill && progressPercentageText) {
        const percentage = Math.min((state.student.weeklyLoggedHours / state.student.weeklyGoalHours) * 100, 100);
        progressFill.style.width = `${percentage}%`;
        progressPercentageText.innerText = `${Math.round(percentage)}%`;
    }
    
    // Re-render logs
    const list = document.getElementById('logList');
    if (list) {
        list.innerHTML = '';
        state.student.sessions.forEach(sess => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="log-meta">${sess.date} - ${sess.instrument}</span>
                <span class="log-notes">${sess.notes}</span>
                <span class="log-badge">${sess.hours.toFixed(1)} hrs</span>
            `;
            list.appendChild(li);
        });
    }
}

function getTodayLabel() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    return `${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')}`;
}

// 7. MOCK CHAT BOT LOGIC
function initChat() {
    const form = document.getElementById('chatForm');
    const body = document.getElementById('chatBody');
    if (!form || !body) return;
    
    // Auto-scroll chat to bottom initially
    body.scrollTop = body.scrollHeight;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const input = document.getElementById('chatInput');
        const text = input.value.trim();
        
        if (text) {
            // Append sent message
            appendChatMessage(text, 'sent');
            input.value = '';
            
            // Mock response after 1.5 seconds
            setTimeout(() => {
                const replies = [
                    "Excellent practice notes, Alex! That will really help with Monday's session.",
                    "Be sure to slow down the tempo when learning the arpeggios first. Speed will come naturally.",
                    "Great progression this week. Focus on keeping your wrists aligned.",
                    "I reviewed your logged practice times, excellent dedication! Let's examine the Chopin score next."
                ];
                const randomReply = replies[Math.floor(Math.random() * replies.length)];
                appendChatMessage(randomReply, 'received');
            }, 1500);
        }
    });
}

function appendChatMessage(message, type) {
    const body = document.getElementById('chatBody');
    if (!body) return;
    
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${type}`;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    msgDiv.innerHTML = `
        <p>${message}</p>
        <span class="msg-time">Today at ${timeString}</span>
    `;
    
    body.appendChild(msgDiv);
    body.scrollTop = body.scrollHeight;
}

// 8. BOOKING FORM & SUCCESS MODAL
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('bookName').value.trim();
        const instrument = document.getElementById('bookInstrument').value;
        const date = document.getElementById('bookDate').value;
        const time = document.getElementById('bookTime').value;
        
        if (name && instrument && date && time) {
            // Show modal and update content
            const modal = document.getElementById('successModal');
            const message = document.getElementById('modalMessage');
            
            if (modal && message) {
                message.innerHTML = `Thank you, <strong>${name}</strong>! Your introductory evaluation lesson for <strong>${instrument}</strong> is requested for <strong>${date}</strong> at <strong>${time}</strong>. We'll send a confirmation link shortly.`;
                modal.classList.add('open');
            }
            
            // Reset form
            form.reset();
        }
    });
}

// Modal controls
window.closeModal = function() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('open');
    }
};

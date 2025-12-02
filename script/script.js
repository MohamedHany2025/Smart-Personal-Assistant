       // Configuration
        const defaultConfig = {
            main_title: "المساعد الشخصي الذكي",
            greeting_morning: "صباح الخير! 🌅",
            greeting_afternoon: "مساء الخير 🌤️",
            greeting_evening: "مساء جميل 🌙",
            schedule_title: "جدولك اليوم",
            goals_title: "أهدافك اليومية",
            stats_title: "إحصائيات اليوم",
            notes_title: "ملاحظاتك السريعة",
            timer_title: "المؤقت الذكي"
        };

        // Local Storage Keys
        const STORAGE_KEYS = {
            SCHEDULES: 'assistant_schedules',
            GOALS: 'assistant_goals',
            WATER: 'assistant_water',
            STUDY: 'assistant_study',
            NOTES: 'assistant_notes',
            TIMER: 'assistant_timer'
        };

        // Timer Variables
        let timerInterval = null;
        let timerSeconds = 0;
        let timerRunning = false;

        // Initialize Element SDK
        async function onConfigChange(config) {
            document.getElementById('mainTitle').textContent = config.main_title || defaultConfig.main_title;
            document.getElementById('scheduleTitle').textContent = config.schedule_title || defaultConfig.schedule_title;
            document.getElementById('goalsTitle').textContent = config.goals_title || defaultConfig.goals_title;
            document.getElementById('statsTitle').textContent = config.stats_title || defaultConfig.stats_title;
            document.getElementById('notesTitle').textContent = config.notes_title || defaultConfig.notes_title;
            document.getElementById('timerTitle').textContent = config.timer_title || defaultConfig.timer_title;
            updateGreeting(config);
        }

        function updateGreeting(config) {
            const hour = new Date().getHours();
            let greeting;
            if (hour < 12) {
                greeting = config.greeting_morning || defaultConfig.greeting_morning;
            } else if (hour < 18) {
                greeting = config.greeting_afternoon || defaultConfig.greeting_afternoon;
            } else {
                greeting = config.greeting_evening || defaultConfig.greeting_evening;
            }
            document.getElementById('greeting').textContent = greeting;
        }

        if (window.elementSdk) {
            window.elementSdk.init({
                defaultConfig: defaultConfig,
                onConfigChange: onConfigChange,
                mapToCapabilities: (config) => ({
                    recolorables: [],
                    borderables: [],
                    fontEditable: undefined,
                    fontSizeable: undefined
                }),
                mapToEditPanelValues: (config) => new Map([
                    ["main_title", config.main_title || defaultConfig.main_title],
                    ["greeting_morning", config.greeting_morning || defaultConfig.greeting_morning],
                    ["greeting_afternoon", config.greeting_afternoon || defaultConfig.greeting_afternoon],
                    ["greeting_evening", config.greeting_evening || defaultConfig.greeting_evening],
                    ["schedule_title", config.schedule_title || defaultConfig.schedule_title],
                    ["goals_title", config.goals_title || defaultConfig.goals_title],
                    ["stats_title", config.stats_title || defaultConfig.stats_title],
                    ["notes_title", config.notes_title || defaultConfig.notes_title],
                    ["timer_title", config.timer_title || defaultConfig.timer_title]
                ])
            });
        }

        // Update time
        function updateTime() {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', hour12: false });
            document.getElementById('currentTime').textContent = timeStr;
        }
        updateTime();
        setInterval(updateTime, 1000);

        // ========== Timer Functions ==========
        function loadTimer() {
            const saved = localStorage.getItem(STORAGE_KEYS.TIMER);
            if (saved) {
                const data = JSON.parse(saved);
                timerSeconds = data.seconds || 0;
                updateTimerDisplay();
            }
        }

        function saveTimer() {
            localStorage.setItem(STORAGE_KEYS.TIMER, JSON.stringify({
                seconds: timerSeconds,
                running: timerRunning
            }));
        }

        function updateTimerDisplay() {
            const minutes = Math.floor(timerSeconds / 60);
            const seconds = timerSeconds % 60;
            document.getElementById('timerDisplay').textContent = 
                `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        function setTimer(minutes) {
            if (!timerRunning) {
                timerSeconds = minutes * 60;
                updateTimerDisplay();
                saveTimer();
            }
        }

        function startTimer() {
            if (!timerRunning && timerSeconds > 0) {
                timerRunning = true;
                document.getElementById('startBtn').style.display = 'none';
                document.getElementById('pauseBtn').style.display = 'inline-block';
                
                timerInterval = setInterval(() => {
                    if (timerSeconds > 0) {
                        timerSeconds--;
                        updateTimerDisplay();
                        saveTimer();
                        
                        if (timerSeconds === 0) {
                            pauseTimer();
                            playTimerSound();
                            showTimerNotification();
                        }
                    }
                }, 1000);
            }
        }

        function pauseTimer() {
            timerRunning = false;
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
            document.getElementById('startBtn').style.display = 'inline-block';
            document.getElementById('pauseBtn').style.display = 'none';
            saveTimer();
        }

        function resetTimer() {
            pauseTimer();
            timerSeconds = 0;
            updateTimerDisplay();
            saveTimer();
        }

        function playTimerSound() {
            // Visual notification instead of audio
            const display = document.getElementById('timerDisplay');
            display.style.animation = 'none';
            setTimeout(() => {
                display.style.animation = 'pulse 0.5s ease-in-out 3';
            }, 10);
        }

        function showTimerNotification() {
            const card = document.querySelector('.neon-card');
            card.style.borderTopColor = '#00FF7F';
            setTimeout(() => {
                card.style.borderTopColor = '#00D4FF';
            }, 3000);
        }

        // ========== Local Storage Functions ==========
        function loadSchedules() {
            const data = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
            return data ? JSON.parse(data) : [];
        }

        function saveSchedules(schedules) {
            localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
        }

        function loadGoals() {
            const data = localStorage.getItem(STORAGE_KEYS.GOALS);
            return data ? JSON.parse(data) : [];
        }

        function saveGoals(goals) {
            localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
        }

        function loadStats() {
            return {
                water: parseInt(localStorage.getItem(STORAGE_KEYS.WATER) || '0'),
                study: parseInt(localStorage.getItem(STORAGE_KEYS.STUDY) || '0')
            };
        }

        function saveStats(water, study) {
            localStorage.setItem(STORAGE_KEYS.WATER, water.toString());
            localStorage.setItem(STORAGE_KEYS.STUDY, study.toString());
        }

        function loadNotes() {
            return localStorage.getItem(STORAGE_KEYS.NOTES) || '';
        }

        function saveNotesData(notes) {
            localStorage.setItem(STORAGE_KEYS.NOTES, notes);
        }

        // ========== Render Functions ==========
        function renderSchedule() {
            const schedules = loadSchedules().sort((a, b) => a.time.localeCompare(b.time));
            const container = document.getElementById('scheduleList');
            
            if (schedules.length === 0) {
                container.innerHTML = '<div class="empty-state">لا توجد حصص في الجدول</div>';
                return;
            }
            
            container.innerHTML = schedules.map((s, index) => `
                <div class="schedule-item">
                    <div class="schedule-time">${s.time}</div>
                    <div class="schedule-subject">${s.subject}</div>
                    <div class="schedule-duration">${s.duration} دقيقة</div>
                    <button class="delete-btn" onclick="deleteSchedule(${index})">🗑️</button>
                </div>
            `).join('');
        }

        function renderGoals() {
            const goals = loadGoals();
            const container = document.getElementById('goalsList');
            
            if (goals.length === 0) {
                container.innerHTML = '<div class="empty-state">لم تضف أهدافًا بعد</div>';
                return;
            }
            
            container.innerHTML = goals.map((g, index) => `
                <div class="goal-item ${g.completed ? 'completed' : ''}">
                    <input type="checkbox" class="goal-checkbox" ${g.completed ? 'checked' : ''} 
                           onchange="toggleGoal(${index}, this.checked)">
                    <div class="goal-text">${g.text}</div>
                    <button class="delete-btn" onclick="deleteGoal(${index})">🗑️</button>
                </div>
            `).join('');
        }

        function renderStats() {
            const stats = loadStats();
            document.getElementById('waterCount').textContent = stats.water;
            document.getElementById('studyHours').textContent = stats.study;
        }

        function renderNotes() {
            const notes = loadNotes();
            const content = document.getElementById('notesContent');
            content.textContent = notes || 'لا توجد ملاحظات بعد';
        }

        // ========== Schedule Functions ==========
        function openAddScheduleModal() {
            document.getElementById('scheduleModal').classList.add('active');
            document.getElementById('scheduleForm').reset();
        }

        function closeScheduleModal() {
            document.getElementById('scheduleModal').classList.remove('active');
        }

        function addSchedule(event) {
            event.preventDefault();
            
            const time = document.getElementById('scheduleTime').value;
            const subject = document.getElementById('scheduleSubject').value;
            const duration = parseInt(document.getElementById('scheduleDuration').value);
            
            const schedules = loadSchedules();
            schedules.push({ time, subject, duration });
            saveSchedules(schedules);
            
            renderSchedule();
            closeScheduleModal();
        }

        function deleteSchedule(index) {
            const schedules = loadSchedules();
            schedules.splice(index, 1);
            saveSchedules(schedules);
            renderSchedule();
        }

        // ========== Goals Functions ==========
        function openAddGoalModal() {
            document.getElementById('goalModal').classList.add('active');
            document.getElementById('goalForm').reset();
        }

        function closeGoalModal() {
            document.getElementById('goalModal').classList.remove('active');
        }

        function addGoal(event) {
            event.preventDefault();
            
            const text = document.getElementById('goalText').value;
            const goals = loadGoals();
            goals.push({ text, completed: false });
            saveGoals(goals);
            
            renderGoals();
            closeGoalModal();
        }

        function toggleGoal(index, completed) {
            const goals = loadGoals();
            goals[index].completed = completed;
            saveGoals(goals);
            renderGoals();
        }

        function deleteGoal(index) {
            const goals = loadGoals();
            goals.splice(index, 1);
            saveGoals(goals);
            renderGoals();
        }

        // ========== Stats Functions ==========
        function incrementWater() {
            const stats = loadStats();
            stats.water++;
            saveStats(stats.water, stats.study);
            renderStats();
        }

        function decrementWater() {
            const stats = loadStats();
            if (stats.water > 0) {
                stats.water--;
                saveStats(stats.water, stats.study);
                renderStats();
            }
        }

        function incrementStudy() {
            const stats = loadStats();
            stats.study++;
            saveStats(stats.water, stats.study);
            renderStats();
        }

        function decrementStudy() {
            const stats = loadStats();
            if (stats.study > 0) {
                stats.study--;
                saveStats(stats.water, stats.study);
                renderStats();
            }
        }

        // ========== Notes Functions ==========
        function openNotesModal() {
            const notes = loadNotes();
            document.getElementById('notesTextarea').value = notes;
            document.getElementById('notesModal').classList.add('active');
        }

        function closeNotesModal() {
            document.getElementById('notesModal').classList.remove('active');
        }

        function saveNotes(event) {
            event.preventDefault();
            
            const notes = document.getElementById('notesTextarea').value;
            saveNotesData(notes);
            renderNotes();
            closeNotesModal();
        }

        // ========== Initialize ==========
        loadTimer();
        renderSchedule();
        renderGoals();
        renderStats();
        renderNotes();

        // CSS Animation for timer
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);

// Student Authentication & Multi-Profile Service for CodeHero Universe
// Keeps all progress completely isolated per student email address

const STUDENTS_LIST_KEY = 'codehero_students_directory_v1';
const CURRENT_STUDENT_KEY = 'codehero_current_active_student_v1';
const ADMIN_EMAILS_KEY = 'codehero_admin_emails_v1';

export const DEFAULT_ADMIN_EMAILS = [
  'kalavalajohnlinnu@gmail.com',
  'admin@codehero.io',
  'admin@codehero.academy'
];

const DEFAULT_GUEST_STUDENT = {
  id: 'guest-1',
  email: 'student@codehero.io',
  name: 'Hero Student',
  avatar: 'dragon',
  password: '',
  joinedDate: new Date().toISOString().split('T')[0],
  isGuest: true
};

export const authService = {
  // Get all registered students
  getAllStudents() {
    try {
      const data = localStorage.getItem(STUDENTS_LIST_KEY);
      if (!data) {
        // Initialize directory with default student
        const initial = [DEFAULT_GUEST_STUDENT];
        localStorage.setItem(STUDENTS_LIST_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data) || [DEFAULT_GUEST_STUDENT];
    } catch (e) {
      console.error('Failed to load students directory:', e);
      return [DEFAULT_GUEST_STUDENT];
    }
  },

  // Save all students
  saveAllStudents(students) {
    try {
      localStorage.setItem(STUDENTS_LIST_KEY, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students directory:', e);
    }
  },

  // Get currently logged-in student
  getCurrentStudent() {
    try {
      const data = localStorage.getItem(CURRENT_STUDENT_KEY);
      if (data) {
        return JSON.parse(data);
      }
      const students = this.getAllStudents();
      const current = students[0] || DEFAULT_GUEST_STUDENT;
      this.setCurrentStudent(current);
      return current;
    } catch (e) {
      console.error('Failed to load active student:', e);
      return DEFAULT_GUEST_STUDENT;
    }
  },

  // Set currently active student
  setCurrentStudent(student) {
    try {
      localStorage.setItem(CURRENT_STUDENT_KEY, JSON.stringify(student));
    } catch (e) {
      console.error('Failed to set active student:', e);
    }
  },

  // Register a new student account with email & compulsory password
  registerStudent({ email, name, password, avatar = 'dragon' }) {
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    if (!name || name.trim().length < 2) {
      throw new Error('Please enter your name (at least 2 characters).');
    }
    if (!password || password.trim().length < 6) {
      throw new Error('Password is compulsory and must be at least 6 characters long.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const students = this.getAllStudents();

    // Check if email already exists
    const existing = students.find(s => s.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const isAdm = this.isAdminEmail(cleanEmail);

    const newStudent = {
      id: 'student_' + Date.now(),
      email: cleanEmail,
      name: name.trim(),
      avatar: avatar || 'dragon',
      password: password.trim(),
      role: isAdm ? 'admin' : 'student',
      joinedDate: new Date().toISOString().split('T')[0],
      isGuest: false
    };

    students.push(newStudent);
    this.saveAllStudents(students);
    this.setCurrentStudent(newStudent);
    return newStudent;
  },

  // Login existing student with compulsory password check
  loginStudent({ email, password }) {
    if (!email) {
      throw new Error('Please enter your email address.');
    }
    if (!password) {
      throw new Error('Password is required. Please enter your password.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const students = this.getAllStudents();
    const student = students.find(s => s.email.toLowerCase() === cleanEmail);

    if (!student) {
      throw new Error('No account found with this email. Please sign up first.');
    }

    if (student.password && student.password !== password.trim()) {
      throw new Error('Incorrect password. Please verify and try again.');
    }

    // Refresh role if email is in admin list
    if (this.isAdminEmail(cleanEmail) && student.role !== 'admin') {
      student.role = 'admin';
      this.saveAllStudents(students);
    }

    this.setCurrentStudent(student);
    return student;
  },

  // Login or Register via Google OAuth
  loginWithGoogle({ email, name, picture, googleId }) {
    if (!email || !email.includes('@')) {
      throw new Error('Google did not provide a valid email address.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const students = this.getAllStudents();
    let student = students.find(s => s.email.toLowerCase() === cleanEmail);

    if (student) {
      // Update existing student with Google account info
      student.name = name || student.name;
      if (picture) student.googlePicture = picture;
      student.authProvider = 'google';
      student.googleId = googleId || student.googleId;
      student.isGuest = false;
    } else {
      // Create new student from Google Profile
      student = {
        id: 'student_google_' + (googleId || Date.now()),
        email: cleanEmail,
        name: name || cleanEmail.split('@')[0],
        avatar: 'dragon',
        googlePicture: picture || null,
        authProvider: 'google',
        googleId: googleId || null,
        joinedDate: new Date().toISOString().split('T')[0],
        isGuest: false
      };
      students.push(student);
    }

    this.saveAllStudents(students);
    this.setCurrentStudent(student);
    return student;
  },

  // Decode standard Google JWT Token from GIS
  decodeGoogleCredential(credentialToken) {
    try {
      const base64Url = credentialToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Failed to decode Google JWT token:', e);
      return null;
    }
  },

  // Google Client ID storage
  getGoogleClientId() {
    return localStorage.getItem('codehero_google_client_id_v1') || '';
  },

  setGoogleClientId(clientId) {
    if (clientId) {
      localStorage.setItem('codehero_google_client_id_v1', clientId.trim());
    } else {
      localStorage.removeItem('codehero_google_client_id_v1');
    }
  },

  // Switch student profile directly
  switchStudent(email) {
    const cleanEmail = email.trim().toLowerCase();
    const students = this.getAllStudents();
    const student = students.find(s => s.email.toLowerCase() === cleanEmail);
    if (student) {
      this.setCurrentStudent(student);
      return student;
    }
    return null;
  },

  // Logout (falls back to guest or switches to first profile)
  logoutStudent() {
    const guest = DEFAULT_GUEST_STUDENT;
    this.setCurrentStudent(guest);
    return guest;
  },

  // Check if a real student is currently logged in (not guest)
  isLoggedIn() {
    const student = this.getCurrentStudent();
    return !!(student && !student.isGuest && student.email);
  },

  // Helper: Get student-specific storage key for progress isolation
  getStudentStorageKey(suffix = 'state_v2') {
    const student = this.getCurrentStudent();
    const safeEmail = (student.email || 'guest').replace(/[^a-zA-Z0-9_]/g, '_');
    return `codehero_student_${safeEmail}_${suffix}`;
  },

  // Export full JSON backup of student profile, progress, and study plan
  exportStudentBackup() {
    const student = this.getCurrentStudent();
    const safeEmail = (student.email || 'guest').replace(/[^a-zA-Z0-9_]/g, '_');
    const stateKey = `codehero_student_${safeEmail}_state_v3`;
    const planKey = `codehero_student_${safeEmail}_study_plan_v1`;

    const progressState = localStorage.getItem(stateKey);
    const studyPlan = localStorage.getItem(planKey);

    return {
      backupVersion: 1,
      appName: 'CodeHero Universe',
      exportedAt: new Date().toISOString(),
      student,
      progressState: progressState ? JSON.parse(progressState) : null,
      studyPlan: studyPlan ? JSON.parse(studyPlan) : null
    };
  },

  // Import JSON backup and restore all data
  importStudentBackup(backupData) {
    if (!backupData || !backupData.student || !backupData.student.email) {
      throw new Error('Invalid backup file. Could not find student profile.');
    }

    const student = {
      ...backupData.student,
      isGuest: false
    };

    const cleanEmail = student.email.trim().toLowerCase();
    const safeEmail = cleanEmail.replace(/[^a-zA-Z0-9_]/g, '_');

    // Register or update in students directory
    const students = this.getAllStudents().filter(s => s.email.toLowerCase() !== cleanEmail);
    students.push(student);
    this.saveAllStudents(students);
    this.setCurrentStudent(student);

    // Restore state
    if (backupData.progressState) {
      const stateKey = `codehero_student_${safeEmail}_state_v3`;
      localStorage.setItem(stateKey, JSON.stringify(backupData.progressState));
    }

    // Restore study plan
    if (backupData.studyPlan) {
      const planKey = `codehero_student_${safeEmail}_study_plan_v1`;
      localStorage.setItem(planKey, JSON.stringify(backupData.studyPlan));
    }

    return student;
  },

  // ── Admin Role & Permission Management ──────────────────────
  getAdminEmails() {
    try {
      const stored = localStorage.getItem(ADMIN_EMAILS_KEY);
      const custom = stored ? JSON.parse(stored) : [];
      return Array.from(new Set([...DEFAULT_ADMIN_EMAILS, ...custom]));
    } catch {
      return DEFAULT_ADMIN_EMAILS;
    }
  },

  addAdminEmail(email) {
    if (!email || !email.includes('@')) return false;
    const clean = email.trim().toLowerCase();
    const current = this.getAdminEmails();
    if (!current.includes(clean)) {
      try {
        const stored = localStorage.getItem(ADMIN_EMAILS_KEY);
        const custom = stored ? JSON.parse(stored) : [];
        custom.push(clean);
        localStorage.setItem(ADMIN_EMAILS_KEY, JSON.stringify(custom));
        return true;
      } catch {
        return false;
      }
    }
    return true;
  },

  removeAdminEmail(email) {
    const clean = email.trim().toLowerCase();
    if (DEFAULT_ADMIN_EMAILS.includes(clean)) return false; // Cannot remove system default admins
    try {
      const stored = localStorage.getItem(ADMIN_EMAILS_KEY);
      if (stored) {
        const custom = JSON.parse(stored).filter(e => e !== clean);
        localStorage.setItem(ADMIN_EMAILS_KEY, JSON.stringify(custom));
      }
      return true;
    } catch {
      return false;
    }
  },

  isAdminEmail(email) {
    if (!email) return false;
    const clean = email.trim().toLowerCase();
    return this.getAdminEmails().includes(clean);
  },

  isCurrentStudentAdmin() {
    const student = this.getCurrentStudent();
    if (!student || student.isGuest || !student.email) return false;
    return this.isAdminEmail(student.email) || student.role === 'admin';
  },

  // ── Multi-Language Classroom Data Aggregator for Admin ────────
  getAllStudentsWithProgress() {
    const students = this.getAllStudents().filter(s => !s.isGuest);
    const ALL_LANG_KEYS = ['python', 'javascript', 'html', 'sql', 'c', 'java', 'rust'];

    return students.map(student => {
      const safeEmail = (student.email || 'guest').replace(/[^a-zA-Z0-9_]/g, '_');
      const stateKey = `codehero_student_${safeEmail}_state_v3`;
      let progress = null;

      try {
        const raw = localStorage.getItem(stateKey);
        if (raw) progress = JSON.parse(raw);
      } catch (e) {
        console.warn('Could not read state for', student.email, e);
      }

      const completedByLang = progress?.completedByLanguage || {};
      
      // Calculate enrollment and completed lessons across all 7 languages
      const languageStats = ALL_LANG_KEYS.map(langId => {
        const list = completedByLang[langId];
        const count = Array.isArray(list) ? list.length : 0;
        return {
          id: langId,
          completedCount: count,
          hasStarted: count > 0,
          lessonIds: Array.isArray(list) ? list : []
        };
      });

      const activeLanguages = languageStats.filter(l => l.hasStarted);
      const totalLessons = activeLanguages.reduce((acc, l) => acc + l.completedCount, 0);
      const totalXP = progress?.totalXP || 0;
      const streak = progress?.streak || 1;
      const lastVisit = progress?.lastVisitDate || student.joinedDate || new Date().toISOString().split('T')[0];

      return {
        ...student,
        isAdmin: this.isAdminEmail(student.email),
        totalXP,
        streak,
        lastVisit,
        languageStats,
        activeLanguages,
        languageCount: activeLanguages.length, // Can be 1, 2, 4, etc.
        totalLessonsCompleted: totalLessons,
        progressRaw: progress
      };
    });
  },

  // Seed sample demo students demonstrating 1, 2, 4 multi-language learning
  seedDemoStudents() {
    const DEMO_STUDENTS = [
      {
        student: {
          id: 'demo_1',
          name: 'Sarah Chen',
          email: 'sarah.chen@stanford.edu',
          avatar: 'dragon',
          password: 'Password123!',
          role: 'student',
          joinedDate: '2026-08-15',
          isGuest: false
        },
        state: {
          totalXP: 3850,
          streak: 14,
          lastVisitDate: new Date().toISOString().split('T')[0],
          completedByLanguage: {
            python: Array.from({ length: 32 }, (_, i) => `lesson-${i + 1}`),
            javascript: Array.from({ length: 22 }, (_, i) => `js-lesson-${i + 1}`),
            html: Array.from({ length: 16 }, (_, i) => `html-lesson-${i + 1}`),
            sql: Array.from({ length: 12 }, (_, i) => `sql-lesson-${i + 1}`),
            c: [],
            java: [],
            rust: []
          }
        }
      },
      {
        student: {
          id: 'demo_2',
          name: 'Marcus Vance',
          email: 'm.vance@techlead.dev',
          avatar: 'robot',
          password: 'Password123!',
          role: 'student',
          joinedDate: '2026-08-20',
          isGuest: false
        },
        state: {
          totalXP: 2950,
          streak: 9,
          lastVisitDate: new Date().toISOString().split('T')[0],
          completedByLanguage: {
            python: Array.from({ length: 28 }, (_, i) => `lesson-${i + 1}`),
            javascript: [],
            html: [],
            sql: [],
            c: [],
            java: [],
            rust: Array.from({ length: 18 }, (_, i) => `rust-lesson-${i + 1}`)
          }
        }
      },
      {
        student: {
          id: 'demo_3',
          name: 'Elena Rostova',
          email: 'elena.r@designcoders.io',
          avatar: 'cat',
          password: 'Password123!',
          role: 'student',
          joinedDate: '2026-08-28',
          isGuest: false
        },
        state: {
          totalXP: 2100,
          streak: 7,
          lastVisitDate: new Date().toISOString().split('T')[0],
          completedByLanguage: {
            python: [],
            javascript: Array.from({ length: 18 }, (_, i) => `js-lesson-${i + 1}`),
            html: Array.from({ length: 24 }, (_, i) => `html-lesson-${i + 1}`),
            sql: [],
            c: [],
            java: [],
            rust: []
          }
        }
      },
      {
        student: {
          id: 'demo_4',
          name: 'David Kim',
          email: 'david.kim@cs.edu',
          avatar: 'owl',
          password: 'Password123!',
          role: 'student',
          joinedDate: '2026-09-02',
          isGuest: false
        },
        state: {
          totalXP: 950,
          streak: 3,
          lastVisitDate: new Date().toISOString().split('T')[0],
          completedByLanguage: {
            python: Array.from({ length: 15 }, (_, i) => `lesson-${i + 1}`),
            javascript: [],
            html: [],
            sql: [],
            c: [],
            java: [],
            rust: []
          }
        }
      },
      {
        student: {
          id: 'demo_5',
          name: 'Aisha Al-Mansoor',
          email: 'aisha.ml@databrain.org',
          avatar: 'dragon',
          password: 'Password123!',
          role: 'student',
          joinedDate: '2026-08-10',
          isGuest: false
        },
        state: {
          totalXP: 4200,
          streak: 19,
          lastVisitDate: new Date().toISOString().split('T')[0],
          completedByLanguage: {
            python: Array.from({ length: 40 }, (_, i) => `lesson-${i + 1}`),
            javascript: [],
            html: [],
            sql: Array.from({ length: 20 }, (_, i) => `sql-lesson-${i + 1}`),
            c: Array.from({ length: 12 }, (_, i) => `c-lesson-${i + 1}`),
            java: [],
            rust: []
          }
        }
      },
      {
        student: {
          id: 'demo_admin',
          name: 'Principal Instructor',
          email: 'kalavalajohnlinnu@gmail.com',
          avatar: 'robot',
          password: 'Password123!',
          role: 'admin',
          joinedDate: '2026-08-01',
          isGuest: false
        },
        state: {
          totalXP: 6400,
          streak: 25,
          lastVisitDate: new Date().toISOString().split('T')[0],
          completedByLanguage: {
            python: Array.from({ length: 45 }, (_, i) => `lesson-${i + 1}`),
            javascript: Array.from({ length: 30 }, (_, i) => `js-lesson-${i + 1}`),
            html: Array.from({ length: 22 }, (_, i) => `html-lesson-${i + 1}`),
            sql: Array.from({ length: 18 }, (_, i) => `sql-lesson-${i + 1}`),
            c: [],
            java: [],
            rust: Array.from({ length: 15 }, (_, i) => `rust-lesson-${i + 1}`)
          }
        }
      }
    ];

    const currentStudents = this.getAllStudents();
    const existingEmails = new Set(currentStudents.map(s => s.email.toLowerCase()));

    DEMO_STUDENTS.forEach(({ student, state }) => {
      if (!existingEmails.has(student.email.toLowerCase())) {
        currentStudents.push(student);
      }
      const safeEmail = student.email.replace(/[^a-zA-Z0-9_]/g, '_');
      const stateKey = `codehero_student_${safeEmail}_state_v3`;
      if (!localStorage.getItem(stateKey)) {
        localStorage.setItem(stateKey, JSON.stringify(state));
      }
    });

    this.saveAllStudents(currentStudents);
    return currentStudents;
  },

  // Export class roster as CSV string
  exportAllStudentsCSV() {
    const studentsWithProgress = this.getAllStudentsWithProgress();
    const headers = ['Name', 'Email', 'Role', 'Joined Date', 'Last Active', 'Active Languages Count', 'Active Languages', 'Total Lessons Completed', 'Total XP', 'Streak (Days)'];
    
    const rows = studentsWithProgress.map(s => [
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.email}"`,
      s.isAdmin ? 'Admin' : 'Student',
      s.joinedDate || '',
      s.lastVisit || '',
      s.languageCount,
      `"${s.activeLanguages.map(l => `${l.id}(${l.completedCount})`).join(', ')}"`,
      s.totalLessonsCompleted,
      s.totalXP,
      s.streak
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
};


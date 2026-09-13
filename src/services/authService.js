// Student Authentication & Multi-Profile Service for CodeHero Universe
// Keeps all progress completely isolated per student email address

const STUDENTS_LIST_KEY = 'codehero_students_directory_v1';
const CURRENT_STUDENT_KEY = 'codehero_current_active_student_v1';

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

  // Register a new student account with email
  registerStudent({ email, name, password, avatar = 'dragon' }) {
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    if (!name || name.trim().length < 2) {
      throw new Error('Please enter a valid name (at least 2 characters).');
    }

    const cleanEmail = email.trim().toLowerCase();
    const students = this.getAllStudents();

    // Check if email already exists
    const existing = students.find(s => s.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const newStudent = {
      id: 'student_' + Date.now(),
      email: cleanEmail,
      name: name.trim(),
      avatar: avatar || 'dragon',
      password: password || '',
      joinedDate: new Date().toISOString().split('T')[0],
      isGuest: false
    };

    students.push(newStudent);
    this.saveAllStudents(students);
    this.setCurrentStudent(newStudent);
    return newStudent;
  },

  // Login existing student
  loginStudent({ email, password }) {
    if (!email) {
      throw new Error('Please enter your email address.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const students = this.getAllStudents();
    const student = students.find(s => s.email.toLowerCase() === cleanEmail);

    if (!student) {
      throw new Error('No student found with this email. Please sign up first.');
    }

    if (student.password && password && student.password !== password) {
      throw new Error('Incorrect password. Please try again.');
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
  }
};

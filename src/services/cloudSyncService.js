// Cloud Synchronization & Persistence Service for CodeHero Academy
// Protects student progress against clearing Chrome data, browser wipes, or device changes.
// Links student records directly to Google Email using Google Sheets (Apps Script) or Firebase.

const CLOUD_CONFIG_KEY = 'codehero_cloud_config_v1';

export const cloudSyncService = {
  // Request durable storage permission so Chrome does not evict data
  async requestDurableStorage() {
    try {
      if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persisted();
        if (!isPersisted) {
          await navigator.storage.persist();
        }
      }
    } catch (e) {
      console.warn('Storage persistence request error:', e);
    }
  },

  // Get active cloud configuration
  getConfig() {
    try {
      const stored = localStorage.getItem(CLOUD_CONFIG_KEY);
      return stored ? JSON.parse(stored) : {
        enabled: false,
        provider: 'googlesheets', // 'googlesheets' | 'firebase' | 'custom'
        googleScriptUrl: '',
        firebaseProjectId: '',
        customEndpoint: ''
      };
    } catch {
      return { enabled: false, provider: 'googlesheets', googleScriptUrl: '', firebaseProjectId: '', customEndpoint: '' };
    }
  },

  // Save cloud configuration (Admin only)
  saveConfig(config) {
    localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(config));
  },

  // Check if cloud sync is connected and active
  isCloudConnected() {
    const cfg = this.getConfig();
    return !!(cfg.enabled && (cfg.googleScriptUrl || cfg.firebaseProjectId || cfg.customEndpoint));
  },

  // Sync a student's progress to the cloud (Google Sheets / Firebase)
  async syncStudentToCloud(student, progressState, studyPlan) {
    const cfg = this.getConfig();
    if (!cfg.enabled || !student || !student.email) return false;

    const payload = {
      email: student.email.toLowerCase().trim(),
      name: student.name,
      joinedDate: student.joinedDate || new Date().toISOString(),
      lastActive: new Date().toISOString(),
      avatar: student.avatar || 'dragon',
      progressState: progressState || null,
      studyPlan: studyPlan || null,
      syncedAt: new Date().toISOString()
    };

    try {
      // 1. Google Sheets / Apps Script Web App (Linked directly to Admin's Google Account)
      if (cfg.provider === 'googlesheets' && cfg.googleScriptUrl) {
        await fetch(cfg.googleScriptUrl, {
          method: 'POST',
          mode: 'no-cors', // standard for Google Apps Script Web Apps
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'save', payload })
        });
        return true;
      }

      // 2. Google Firebase Firestore REST API
      if (cfg.provider === 'firebase' && cfg.firebaseProjectId) {
        const docId = encodeURIComponent(payload.email.replace(/[@.]/g, '_'));
        const url = `https://firestore.googleapis.com/v1/projects/${cfg.firebaseProjectId}/databases/(default)/documents/students/${docId}`;
        const firestoreBody = {
          fields: {
            email: { stringValue: payload.email },
            name: { stringValue: payload.name || '' },
            lastActive: { stringValue: payload.lastActive },
            payloadJson: { stringValue: JSON.stringify(payload) }
          }
        };

        const res = await fetch(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(firestoreBody)
        });
        return res.ok;
      }

      // 3. Custom Server Endpoint
      if (cfg.customEndpoint) {
        const res = await fetch(cfg.customEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        return res.ok;
      }
    } catch (err) {
      console.warn('Cloud sync error (offline or network blocked):', err);
      return false;
    }
    return false;
  },

  // Pull a student's profile and progress from the cloud if Chrome data was cleared
  async restoreStudentFromCloud(email) {
    const cfg = this.getConfig();
    if (!cfg.enabled || !email) return null;

    const cleanEmail = email.toLowerCase().trim();

    try {
      // 1. Google Sheets / Apps Script Web App
      if (cfg.provider === 'googlesheets' && cfg.googleScriptUrl) {
        const url = `${cfg.googleScriptUrl}?action=get&email=${encodeURIComponent(cleanEmail)}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && data.student) {
            return data.student;
          }
        }
      }

      // 2. Firebase Firestore
      if (cfg.provider === 'firebase' && cfg.firebaseProjectId) {
        const docId = encodeURIComponent(cleanEmail.replace(/[@.]/g, '_'));
        const url = `https://firestore.googleapis.com/v1/projects/${cfg.firebaseProjectId}/databases/(default)/documents/students/${docId}`;
        const res = await fetch(url);
        if (res.ok) {
          const doc = await res.json();
          if (doc && doc.fields && doc.fields.payloadJson) {
            const data = JSON.parse(doc.fields.payloadJson.stringValue);
            return data;
          }
        }
      }
    } catch (err) {
      console.warn('Failed to restore student from cloud:', err);
    }
    return null;
  }
};

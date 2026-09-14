// Cloud Synchronization & Persistence Service for CodeHero Academy
// Protects student progress against clearing Chrome data, browser wipes, or device changes.
// Supports Firebase Firestore REST API, Supabase REST API, or custom backend endpoints.

const CLOUD_CONFIG_KEY = 'codehero_cloud_config_v1';

export const cloudSyncService = {
  // Get active cloud configuration
  getConfig() {
    try {
      const stored = localStorage.getItem(CLOUD_CONFIG_KEY);
      return stored ? JSON.parse(stored) : {
        enabled: false,
        provider: 'firebase', // 'firebase' | 'supabase' | 'custom'
        firebaseProjectId: '',
        firebaseApiKey: '',
        customEndpoint: ''
      };
    } catch {
      return { enabled: false, provider: 'firebase', firebaseProjectId: '', firebaseApiKey: '', customEndpoint: '' };
    }
  },

  // Save cloud configuration (Admin only)
  saveConfig(config) {
    localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(config));
  },

  // Check if cloud sync is connected and active
  isCloudConnected() {
    const cfg = this.getConfig();
    return !!(cfg.enabled && (cfg.firebaseProjectId || cfg.customEndpoint));
  },

  // Sync a student's progress to the cloud
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
      if (cfg.provider === 'firebase' && cfg.firebaseProjectId) {
        // Firebase Firestore REST API (no heavy SDK needed, works with static GitHub Pages!)
        const docId = encodeURIComponent(payload.email.replace(/[@.]/g, '_'));
        const url = `https://firestore.googleapis.com/v1/projects/${cfg.firebaseProjectId}/databases/(default)/documents/students/${docId}`;
        
        // Format for Firestore fields
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
      } else if (cfg.customEndpoint) {
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
      console.warn('Failed to restore from cloud:', err);
    }
    return null;
  }
};

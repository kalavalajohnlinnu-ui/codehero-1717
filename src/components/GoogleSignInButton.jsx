import React, { useEffect } from 'react';

// GOOGLE_CLIENT_ID - use a placeholder - owner can replace
const GOOGLE_CLIENT_ID = '123456789-placeholder.apps.googleusercontent.com';

export function GoogleSignInButton({ onSuccess, onError }) {
  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => initGoogleSignIn();
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  const initGoogleSignIn = () => {
    if (!window.google) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
  };

  const handleCredentialResponse = (response) => {
    try {
      // Decode JWT payload (base64)
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      const payload = JSON.parse(jsonPayload);
      // payload has: email, name, picture, sub
      onSuccess({ email: payload.email, name: payload.name, picture: payload.picture, googleId: payload.sub });
    } catch (err) {
      onError?.(err);
    }
  };

  const handleClick = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      // Fallback: open Google OAuth URL
      alert('Google Sign-In is loading. Please wait a moment and try again, or use the email/password form.');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-800 font-semibold text-sm transition-all shadow-sm active:scale-[0.97] group"
    >
      {/* Google SVG logo */}
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
        <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
        <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
        <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
      </svg>
      <span>Continue with Google</span>
    </button>
  );
}

import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-4 animate-scale-bounce">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto text-2xl">⚠️</div>
            <h3 className="text-base font-bold text-slate-900">Notice</h3>
            <p className="text-xs text-slate-600">A temporary view glitch occurred, but your lesson and code are safe.</p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                this.props.onReset?.();
              }}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold font-mono rounded-xl active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              Close &amp; Return to Lesson
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

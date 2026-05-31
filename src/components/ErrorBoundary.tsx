import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

// Class component is required by React for error boundaries.
// useDefineForClassFields is false in this project, so we declare
// state via the constructor and access props/state via typed locals.
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    (this as unknown as { state: State }).state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    const s = (this as unknown as { state: State }).state;
    const p = (this as unknown as { props: Props }).props;

    if (s.hasError) {
      return (
        <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center px-6">
          <div className="max-w-sm w-full border-2 border-[#1A1A1A] p-8 text-center space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Something went wrong</p>
            <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">Unexpected Error</h2>
            <p className="text-sm text-neutral-500 font-sans leading-relaxed">{s.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[#1A1A1A] text-white py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition mt-2"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return p.children;
  }
}

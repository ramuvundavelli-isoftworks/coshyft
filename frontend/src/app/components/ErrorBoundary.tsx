import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** If true, renders a full-screen layout (use at app root) */
  fullScreen?: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const { error } = this.state;
    const { fullScreen = false } = this.props;

    const content = (
      <Card className="p-8 max-w-lg w-full text-center">
        <div className="mx-auto w-16 h-16 bg-destructive-subtle border-2 border-destructive/25 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">Unexpected Error</h1>
        <p className="text-muted-foreground mb-4">
          A rendering error occurred. This has been logged automatically.
        </p>

        {error?.message && (
          <div className="mb-6 p-3 bg-background-subtle border border-border rounded-lg text-left">
            <p className="text-xs font-mono text-muted-foreground break-all">{error.message}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button onClick={this.handleReset} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" onClick={this.handleGoHome} className="w-full">
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Button>
        </div>
      </Card>
    );

    if (fullScreen) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background-subtle to-background flex items-center justify-center p-6">
          {content}
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        {content}
      </div>
    );
  }
}

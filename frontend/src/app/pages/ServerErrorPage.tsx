import React from 'react';
import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';

interface ServerErrorPageProps {
  /** Optional: pass when used as a standalone page (not a React Router errorElement) */
  error?: Error | null;
  onRetry?: () => void;
}

export default function ServerErrorPage({ error: propError, onRetry }: ServerErrorPageProps = {}) {
  const navigate = useNavigate();

  // Works both as a React Router errorElement and as a standalone component
  let routeError: unknown;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    routeError = useRouteError();
  } catch {
    routeError = null;
  }

  const error = propError ?? routeError;

  let statusCode = 500;
  let title = 'Something Went Wrong';
  let description = 'An unexpected error occurred on our end. The issue has been logged and we\'re working to fix it.';

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    if (error.status === 503) {
      title = 'Service Unavailable';
      description = 'The server is temporarily unavailable. Please try again in a moment.';
    } else if (error.status === 502) {
      title = 'Bad Gateway';
      description = 'We received an invalid response from the upstream server.';
    }
  } else if (error instanceof Error && error.message.toLowerCase().includes('network')) {
    title = 'Network Error';
    description = 'Unable to connect to the server. Check your internet connection and try again.';
  }

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-subtle to-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg text-center">
        {/* Large error code */}
        <div className="mb-8">
          <div className="text-[10rem] font-black leading-none bg-gradient-to-br from-destructive/20 to-destructive/5 bg-clip-text text-transparent select-none">
            {statusCode}
          </div>
        </div>

        <Card className="p-8">
          <div className="mx-auto w-16 h-16 bg-destructive-subtle border-2 border-destructive/25 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
          <p className="text-muted-foreground mb-4">{description}</p>

          {/* Error detail (dev-friendly) */}
          {error instanceof Error && error.message && (
            <div className="mb-6 p-3 bg-background-subtle border border-border rounded-lg text-left">
              <p className="text-xs font-mono text-muted-foreground break-all">{error.message}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>
        </Card>

        <p className="text-xs text-muted-foreground mt-6">
          Error {statusCode} · CoShyft Platform
        </p>
      </div>
    </div>
  );
}

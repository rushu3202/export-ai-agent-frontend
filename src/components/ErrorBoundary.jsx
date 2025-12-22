import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/app/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6">
                <div className="flex items-center gap-3 text-white">
                  <AlertTriangle className="w-12 h-12" />
                  <div>
                    <h1 className="text-2xl font-bold">Oops! Something went wrong</h1>
                    <p className="text-red-100">We encountered an unexpected error</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <p className="text-gray-700 mb-6">
                  Don't worry, this happens sometimes. The error has been logged and we'll look into it. 
                  You can try refreshing the page or go back to the dashboard.
                </p>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                    <h3 className="font-semibold text-red-900 mb-2">Error Details (Development Only)</h3>
                    <p className="text-sm text-red-800 font-mono mb-2">{this.state.error.toString()}</p>
                    {this.state.errorInfo && (
                      <details className="mt-2">
                        <summary className="text-sm text-red-700 cursor-pointer hover:text-red-900">
                          Component Stack Trace
                        </summary>
                        <pre className="mt-2 text-xs text-red-700 overflow-auto max-h-48 p-2 bg-red-100 rounded">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={this.handleReset}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Refresh Page
                  </button>
                  <button
                    onClick={this.handleGoHome}
                    className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  >
                    <Home className="w-5 h-5" />
                    Go to Dashboard
                  </button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <h3 className="font-semibold text-blue-900 mb-1">Need Help?</h3>
                  <p className="text-sm text-blue-700">
                    If this problem persists, please contact our support team using the chat widget in the bottom right corner.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

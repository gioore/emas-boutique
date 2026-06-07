'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="p-8 text-center">
          <p className="text-lg font-semibold" style={{ color: '#991b1b' }}>Algo salió mal</p>
          <p className="text-sm mt-2" style={{ color: '#57534e' }}>
            {this.state.error?.message || 'Error inesperado al cargar esta sección'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="mt-4 px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            style={{ backgroundColor: '#1c1917', color: '#ffffff' }}
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

'use client';

import type { ReactNode } from 'react';
import { Component, type ErrorInfo } from 'react';
import { Button } from '@/components/ui/Button';

export class ErrorBoundary extends Component<
  { children: ReactNode; fallbackTitle?: string },
  { error: Error | null }
> {
  constructor(props: { children: ReactNode; fallbackTitle?: string }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Section error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="rounded-lg border border-white/10 bg-surface p-8 text-center">
          <p className="font-display text-xl uppercase text-accent">
            {this.props.fallbackTitle || 'Something broke'}
          </p>
          <p className="mt-2 font-mono text-xs text-muted">{this.state.error.message}</p>
          <Button className="mt-6" onClick={() => this.setState({ error: null })}>
            TRY AGAIN
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

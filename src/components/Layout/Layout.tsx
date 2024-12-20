import { ReactNode } from 'react';
import { TopBar } from './TopBar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="h-screen flex flex-col">
      <TopBar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {children}
      </main>
    </div>
  );
}
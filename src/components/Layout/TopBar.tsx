import { Logo } from './Logo';
import { Navigation } from './Navigation';

export function TopBar() {
  return (
    <header className="bg-white border-b shadow-sm ">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 border">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <Navigation />
        </div>
      </div>
    </header>
  );
}
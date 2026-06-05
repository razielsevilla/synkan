export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-brand-text bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-brand-surface border-2 border-brand-text flex items-center justify-center shadow-brutal-sm">
            <span className="font-anton text-2xl text-brand-text">S</span>
          </div>
          <div>
            <span className="font-anton text-3xl tracking-wide text-brand-text">Synkan</span>
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded border border-brand-text text-[10px] font-mono bg-brand-surface font-bold text-brand-text">
              P2P Core
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-bold uppercase tracking-wider text-brand-text">
          <a href="#why" className="hover:text-brand-primary transition-colors">The Paradigm</a>
          <a href="#sandbox" className="hover:text-brand-accent transition-colors flex items-center space-x-2">
            <span>Interactive Sandbox</span>
            <span className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-ping"></span>
          </a>
          <a href="#deep-dive" className="hover:text-brand-primary transition-colors">Architecture</a>
          <a href="#tech-stack" className="hover:text-brand-primary transition-colors">Specs</a>
        </nav>

        <div className="flex items-center space-x-4">
          <a href="#sandbox"
            className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-black tracking-wider text-brand-text uppercase bg-brand-surface border-2 border-brand-text rounded-xl shadow-brutal-sm hover:translate-y-[-2px] hover:shadow-brutal active:translate-y-[2px] active:shadow-none transition-all">
            Launch Sandbox
          </a>
        </div>
      </div>
    </header>
  )
}

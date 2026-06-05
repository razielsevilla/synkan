export default function HeroSection() {
  return (
    <section className="relative pt-16 pb-20 md:pt-28 md:pb-32 overflow-hidden border-b-4 border-brand-text bg-white">
      {/* Visual design grid accents mimicking brutalist blueprints */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#0A0A0A 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Highly visual Neo-Brutalist Header using Anton Font */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-anton tracking-tight mb-8 leading-[0.95] text-brand-text">
          The Serverless, Local-First <br />
          <span
            className="bg-brand-surface border-2 border-brand-text px-4 py-1 inline-block my-2 shadow-brutal transform -rotate-1">
            P2P Kanban Engine
          </span>
        </h1>

        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-zinc-700 mb-10 leading-relaxed font-medium">
          Ditch centralized servers. <strong>Synkan</strong> makes your client browser the source of truth, employing
          high-speed local storage, WebRTC direct routing, and Conflict-Free Replicated Data Types (CRDTs).
        </p>

        {/* Striking Neo-Brutalist Call-to-Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
          <a href="#sandbox"
            className="w-full sm:w-auto px-8 py-5 text-base font-black uppercase tracking-wider text-brand-text bg-brand-surface border-2 border-brand-text rounded-xl shadow-brutal hover:translate-y-[-2px] hover:shadow-brutal-lg active:translate-y-[2px] active:shadow-none transition-all">
            Interact with Peer Simulation
          </a>
          <a href="#why"
            className="w-full sm:w-auto px-8 py-5 text-base font-bold uppercase tracking-wider text-brand-text bg-white border-2 border-brand-text rounded-xl shadow-brutal hover:translate-y-[-2px] hover:shadow-brutal-lg hover:bg-brand-bg active:translate-y-[2px] active:shadow-none transition-all">
            Explore Architecture
          </a>
        </div>

        {/* Board Preview Mockup */}
        <div className="relative max-w-5xl mx-auto mt-6">
          <div className="absolute -inset-2 bg-brand-primary rounded-2xl -z-10 border-2 border-brand-text"></div>
          <div className="bg-[#FFFFFF] rounded-2xl border-2 border-brand-text shadow-brutal-lg p-5 overflow-hidden text-left">

            {/* Board Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-brand-text mb-6 gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded-full bg-brand-accent border border-brand-text"></span>
                <span className="w-3.5 h-3.5 rounded-full bg-brand-surface border border-brand-text"></span>
                <span className="w-3.5 h-3.5 rounded-full bg-brand-primary border border-brand-text"></span>
                <span className="text-xs font-mono font-bold tracking-wider uppercase ml-2 text-zinc-500">
                  Workspace / Synkan-Local-Mesh
                </span>
              </div>
              <div className="flex items-center space-x-3 text-brand-text font-mono text-xs font-bold self-start sm:self-auto">
                <span className="inline-flex items-center px-2 py-1 bg-brand-surface rounded border border-brand-text">
                  <span className="w-2 h-2 rounded-full bg-brand-accent animate-ping mr-2"></span>
                  3 peers established
                </span>
              </div>
            </div>

            {/* Columns Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Col 1: Backlog */}
              <div className="bg-brand-bg p-4 rounded-xl border-2 border-brand-text">
                <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-brand-text">
                  <span className="font-anton text-lg text-brand-text">Backlog</span>
                  <span className="text-[10px] font-mono bg-brand-primary text-white px-2 py-0.5 rounded border border-brand-text">SQLITE WASM</span>
                </div>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg border-2 border-brand-text shadow-brutal-sm hover:translate-y-[-2px] transition-transform">
                    <div className="text-xs font-bold font-mono text-brand-primary uppercase mb-1">Task 101</div>
                    <div className="text-sm font-bold text-brand-text leading-snug">Implement Automerge cryptographic binary vector structures</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-brand-text shadow-brutal-sm hover:translate-y-[-2px] transition-transform">
                    <div className="text-xs font-bold font-mono text-brand-accent uppercase mb-1">Task 102</div>
                    <div className="text-sm font-bold text-brand-text leading-snug">Verify fractional indexing midpoints on offline nodes</div>
                  </div>
                </div>
              </div>

              {/* Col 2: In Progress */}
              <div className="bg-brand-bg p-4 rounded-xl border-2 border-brand-text">
                <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-brand-text">
                  <span className="font-anton text-lg text-brand-text">In Progress</span>
                  <span className="text-[10px] font-mono bg-brand-surface text-brand-text px-2 py-0.5 rounded border border-brand-text">ACTIVE P2P</span>
                </div>
                <div className="bg-white p-4 rounded-lg border-2 border-brand-accent shadow-brutal-sm">
                  <div className="text-xs font-bold font-mono text-brand-accent uppercase mb-1">TASK 103 — LIVE STREAM</div>
                  <div className="text-sm font-bold text-brand-text leading-snug mb-3">Sync local persistence state arrays via ad-hoc channels</div>
                  <div className="w-full bg-brand-bg rounded-full h-2 border border-brand-text overflow-hidden">
                    <div className="bg-brand-accent h-full w-[70%]"></div>
                  </div>
                </div>
              </div>

              {/* Col 3: Completed */}
              <div className="bg-brand-bg p-4 rounded-xl border-2 border-brand-text opacity-75">
                <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-brand-text">
                  <span className="font-anton text-lg text-brand-text">Completed</span>
                  <span className="text-[10px] font-mono bg-[#D1D1D1] text-brand-text px-2 py-0.5 rounded border border-brand-text">RESOLVED</span>
                </div>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg border border-brand-text line-through text-zinc-500">
                    Wasm compiled SQLite environment tests
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-brand-text line-through text-zinc-500">
                    Determine Soft-Deletion Tombstone rules
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

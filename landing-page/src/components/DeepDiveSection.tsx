export default function DeepDiveSection() {
  return (
    <section id="deep-dive" className="py-20 border-b-4 border-brand-text bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span
            className="px-3 py-1.5 text-xs font-black uppercase tracking-widest bg-brand-primary text-white border-2 border-brand-text rounded-md shadow-brutal-sm inline-block mb-3">TECHNICAL
            BLUEPRINTS</span>
          <h2 className="text-4xl sm:text-5xl font-anton text-brand-text tracking-wide">
            Core Architectural Pillars
          </h2>
          <p className="text-zinc-700 mt-4 text-sm sm:text-base font-medium leading-relaxed">
            Zero-server engineering dictates high reliance on secure browser environments to store, index, and
            reconcile distributed data.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Pillar 1 */}
          <div className="bg-white border-2 border-brand-text p-6 rounded-2xl shadow-brutal flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 bg-brand-primary text-white rounded-xl border-2 border-brand-text flex items-center justify-center font-anton text-xl mb-4">
                01</div>
              <h4 className="text-xl font-anton text-brand-text mb-2">CRDT ALGEBRA</h4>
              <p className="text-xs text-zinc-600 leading-relaxed font-medium mb-4">
                All card mutations append logs of version vector changes mapped via state matrices. These
                converge deterministically on reconnect.
              </p>
            </div>
            <div className="border-t-2 border-brand-text pt-3 mt-auto font-mono text-[10px] text-brand-primary font-bold">
              DATA STRUCTURE: APPEND-ONLY GRAPHS
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white border-2 border-brand-text p-6 rounded-2xl shadow-brutal flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 bg-brand-surface text-brand-text rounded-xl border-2 border-brand-text flex items-center justify-center font-anton text-xl mb-4">
                02</div>
              <h4 className="text-xl font-anton text-brand-text mb-2">FRACTIONAL INDEXES</h4>
              <p className="text-xs text-zinc-600 leading-relaxed font-medium mb-4">
                Assigning lexicographical coordinates (e.g. midway "AI") rather than normal array indexes
                avoids collapsing arrays offline.
              </p>
            </div>
            <div className="border-t-2 border-brand-text pt-3 mt-auto font-mono text-[10px] text-brand-text font-bold">
              LEXICAL SORT: STRING POSITION VALUES
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white border-2 border-brand-text p-6 rounded-2xl shadow-brutal flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 bg-brand-accent text-white rounded-xl border-2 border-brand-text flex items-center justify-center font-anton text-xl mb-4">
                03</div>
              <h4 className="text-xl font-anton text-brand-text mb-2">SQLite WASM LAYER</h4>
              <p className="text-xs text-zinc-600 leading-relaxed font-medium mb-4">
                Reactive caching to local engines provides direct cold-start loading, bypasses latency
                hurdles, and operates 100% offline.
              </p>
            </div>
            <div className="border-t-2 border-brand-text pt-3 mt-auto font-mono text-[10px] text-brand-accent font-bold">
              PERSISTENCE: ATOMIC FLUSH ENGINES
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white border-2 border-brand-text p-6 rounded-2xl shadow-brutal flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 bg-brand-bg text-brand-text rounded-xl border-2 border-brand-text flex items-center justify-center font-anton text-xl mb-4">
                04</div>
              <h4 className="text-xl font-anton text-brand-text mb-2">WEBRTC TRANSPORT</h4>
              <p className="text-xs text-zinc-600 leading-relaxed font-medium mb-4">
                Direct local browsers connect directly without centralized cloud proxy handlers, maximizing
                pipeline encryption.
              </p>
            </div>
            <div className="border-t-2 border-brand-text pt-3 mt-auto font-mono text-[10px] text-brand-primary font-bold">
              NETWORKING: E2EE DATA PIPELINES
            </div>
          </div>

        </div>

        {/* Overcoming Real-World P2P Challenges */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h3 className="text-3xl font-anton text-brand-text text-center mb-8">P2P Technical Engineering Challenges
            Addressed</h3>

          <div className="space-y-6">
            <div className="p-6 bg-white border-2 border-brand-text rounded-xl shadow-brutal text-left">
              <h4 className="text-lg font-bold text-brand-primary font-mono flex items-center">
                <span className="mr-2">01.</span> THE CONCURRENT MOVE PROBLEM
              </h4>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed font-medium">
                Moving cards concurrently within nested layouts causes array collisions. Synkan solves this
                by pairing string-based fractional indexes with a deterministic tie-breaker based on client
                cryptographic node signatures, allowing seamless and predictable offline shifts.
              </p>
            </div>

            <div className="p-6 bg-white border-2 border-brand-text rounded-xl shadow-brutal text-left">
              <h4 className="text-lg font-bold text-brand-accent font-mono flex items-center">
                <span className="mr-2">02.</span> STATE REHYDRATION & DELTA COMPRESSION
              </h4>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed font-medium">
                Transferring entire local documents over WebRTC consumes heavy bandwidth. On peer handshake,
                Synkan exchanges lightweight version vectors to calculate precisely which operations are
                missing, packing only compressed log increments.
              </p>
            </div>

            <div className="p-6 bg-white border-2 border-brand-text rounded-xl shadow-brutal text-left">
              <h4 className="text-lg font-bold text-brand-text font-mono flex items-center">
                <span className="mr-2">03.</span> TOMBSTONE MANAGEMENT & DATA RETENTION
              </h4>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed font-medium">
                Simultaneous deletion and edit conflicts introduce severe data loss risks. Synkan structures
                and enforces a robust, soft-deletion tombstone log that ensures deleted elements persist
                silently until all peers have agreed on state vectors.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

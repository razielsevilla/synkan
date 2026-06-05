export default function WhySection() {
  return (
    <section id="why" className="py-20 border-b-4 border-brand-text bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span
            className="px-3 py-1 text-xs font-bold uppercase tracking-widest bg-brand-accent text-white border-2 border-brand-text rounded-md shadow-brutal-sm inline-block mb-4">CRITICAL
            COMPARISON</span>
          <h2 className="text-4xl sm:text-5xl font-anton text-brand-text tracking-wide">
            Centralized Cloud Tax vs. True Local Autonomy
          </h2>
          <p className="text-zinc-700 mt-4 text-base sm:text-lg font-medium leading-relaxed">
            Our current cloud tools (Trello, Jira, Notion) bind users to physical server clusters. Synkan
            rejects this structural tether.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">

          {/* Cloud Problem Panel */}
          <div className="bg-white border-2 border-brand-text p-8 rounded-2xl shadow-brutal flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b-2 border-brand-text">
                <div className="w-10 h-10 bg-brand-accent text-white rounded-lg border-2 border-brand-text flex items-center justify-center font-bold font-anton text-lg">!</div>
                <h4 className="text-2xl font-anton text-brand-text">The Centralized Cloud Tax</h4>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <span className="bg-brand-accent/10 text-brand-accent font-mono font-black border border-brand-accent px-2 py-1 text-xs rounded">1</span>
                  <div>
                    <h5 className="text-base font-bold text-brand-text">Hard Network Interdependence</h5>
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed">Minor offline states (tunnels, trains, cellular gaps) trigger endless loading screens and freeze the interface.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="bg-brand-accent/10 text-brand-accent font-mono font-black border border-brand-accent px-2 py-1 text-xs rounded">2</span>
                  <div>
                    <h5 className="text-base font-bold text-brand-text">Corporate Surveillance & Data Risk</h5>
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed">Strategic corporate planning matrices reside inside multi-tenant hardware, subject to scrapers, security leaks, and AI training.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="bg-brand-accent/10 text-brand-accent font-mono font-black border border-brand-accent px-2 py-1 text-xs rounded">3</span>
                  <div>
                    <h5 className="text-base font-bold text-brand-text">Exponential Scaling Infrastructure Cost</h5>
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed">Broadcasting states via WebSockets requires continuous hosting expenditure, scaling costs as teams grow.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-brand-text flex justify-between items-center text-xs font-mono font-bold text-zinc-500">
              <span>Central Database Architecture</span>
              <span className="text-brand-accent">⚠️ Single Point of Failure</span>
            </div>
          </div>

          {/* Synkan Solution Panel */}
          <div className="bg-brand-surface border-2 border-brand-text p-8 rounded-2xl shadow-brutal flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b-2 border-brand-text">
                <div className="w-10 h-10 bg-brand-primary text-white rounded-lg border-2 border-brand-text flex items-center justify-center font-bold font-anton text-lg">✓</div>
                <h4 className="text-2xl font-anton text-brand-text">Local-First Autonomy</h4>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <span className="bg-brand-primary text-white font-mono font-black border border-brand-text px-2 py-1 text-xs rounded">1</span>
                  <div>
                    <h5 className="text-base font-bold text-brand-text">Network-Agnostic, 60fps Execution</h5>
                    <p className="text-xs text-brand-text/80 mt-1 leading-relaxed">No network lag. Instant file system flushes mean seamless offline tracking and immediate responsive rendering.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="bg-brand-primary text-white font-mono font-black border border-brand-text px-2 py-1 text-xs rounded">2</span>
                  <div>
                    <h5 className="text-base font-bold text-brand-text">Cryptographic Privacy & Total Ownership</h5>
                    <p className="text-xs text-brand-text/80 mt-1 leading-relaxed">Your data remains in your custody. Handshakes and synchronizations deploy secure, peer-encrypted WebRTC nodes.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="bg-brand-primary text-white font-mono font-black border border-brand-text px-2 py-1 text-xs rounded">3</span>
                  <div>
                    <h5 className="text-base font-bold text-brand-text">Zero-Cost Scaling Engine</h5>
                    <p className="text-xs text-brand-text/80 mt-1 leading-relaxed">Because every member acts as a server node, the static HTML files run serverless and host for free indefinitely.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-brand-text flex justify-between items-center text-xs font-mono font-bold text-brand-text">
              <span>P2P Cryptographic Mesh Topology</span>
              <span className="text-brand-primary">⚙️ Infinite scale</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

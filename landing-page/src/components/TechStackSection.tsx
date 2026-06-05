export default function TechStackSection() {
  return (
    <section id="tech-stack" className="py-20 border-b-4 border-brand-text bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span
            className="px-3 py-1.5 text-xs font-black uppercase tracking-widest bg-brand-surface text-brand-text border-2 border-brand-text rounded-md shadow-brutal-sm inline-block mb-3 font-mono">SPECIFIED
            DIRECTORY</span>
          <h2 className="text-4xl sm:text-5xl font-anton text-brand-text tracking-wide">
            Tech Stack
          </h2>
          <p className="text-zinc-700 mt-4 text-sm sm:text-base font-medium leading-relaxed">
            Zero-server deployment is powered by these specialized client-side storage, math, and communication
            packages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto text-left">

          <div className="bg-brand-bg border-2 border-brand-text p-6 rounded-xl shadow-brutal-sm flex items-center space-x-4">
            <div className="p-3 bg-brand-primary text-white rounded-lg border-2 border-brand-text">
              <span className="font-anton text-xl leading-none">C</span>
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-brand-text">Automerge / Yjs</h4>
              <p className="text-[10px] text-zinc-600 mt-0.5 font-medium">CRDT delta calculation math</p>
            </div>
          </div>

          <div className="bg-brand-bg border-2 border-brand-text p-6 rounded-xl shadow-brutal-sm flex items-center space-x-4">
            <div className="p-3 bg-brand-accent text-white rounded-lg border-2 border-brand-text">
              <span className="font-anton text-xl leading-none">S</span>
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-brand-text">SQLite WASM</h4>
              <p className="text-[10px] text-zinc-600 mt-0.5 font-medium">Fast browser persistent cache</p>
            </div>
          </div>

          <div className="bg-brand-bg border-2 border-brand-text p-6 rounded-xl shadow-brutal-sm flex items-center space-x-4">
            <div className="p-3 bg-brand-surface text-brand-text rounded-lg border-2 border-brand-text">
              <span className="font-anton text-xl leading-none">W</span>
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-brand-text">WebRTC Channels</h4>
              <p className="text-[10px] text-zinc-600 mt-0.5 font-medium">Direct ad-hoc peer data tunnels</p>
            </div>
          </div>

          <div className="bg-brand-bg border-2 border-brand-text p-6 rounded-xl shadow-brutal-sm flex items-center space-x-4">
            <div className="p-3 bg-[#FFFFFF] text-brand-primary rounded-lg border-2 border-brand-text">
              <span className="font-anton text-xl leading-none">R</span>
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-brand-text">React / TS / Vite</h4>
              <p className="text-[10px] text-zinc-600 mt-0.5 font-medium">Strictly typed reactive components</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

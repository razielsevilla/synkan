import { useEffect, useState } from 'react';

export default function Footer() {
  const [time, setTime] = useState(new Date().toISOString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toISOString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="bg-brand-text text-white border-t-4 border-brand-text relative overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#FFFFFF 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      
      {/* Massive CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 pb-16 border-b-2 border-zinc-800">
          <div className="max-w-2xl">
            <h2 className="text-5xl sm:text-7xl font-anton tracking-tight text-white mb-6 leading-none">
              READY TO DROP <br/>
              <span className="text-brand-surface">THE SERVERS?</span>
            </h2>
            <p className="text-zinc-400 font-mono text-sm max-w-md">
              Join the P2P revolution. Build scalable, offline-first apps without the cloud tax. 
            </p>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <a href="https://github.com" target="_blank" rel="noreferrer"
               className="inline-flex items-center justify-center px-8 py-4 text-sm font-black tracking-widest text-brand-text uppercase bg-brand-surface border-2 border-brand-surface hover:bg-white hover:border-white transition-colors">
              Star on GitHub
            </a>
            <a href="#sandbox"
               className="inline-flex items-center justify-center px-8 py-4 text-sm font-black tracking-widest text-white uppercase bg-transparent border-2 border-zinc-700 hover:border-brand-primary hover:text-brand-primary transition-colors">
              Revisit Sandbox
            </a>
          </div>
        </div>

        {/* Links & Metadata */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-12 font-mono text-xs">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-brand-surface border-2 border-brand-surface flex items-center justify-center text-brand-text">
                <span className="font-anton text-xl">S</span>
              </div>
              <span className="font-anton text-3xl tracking-widest text-white">SYNKAN</span>
            </div>
            <p className="text-zinc-500 mb-6 max-w-sm leading-relaxed">
              Open-source CRDT engine built for absolute data sovereignty. No telemetry. No paywalls. Just local-first autonomy.
            </p>
            <div className="inline-block px-3 py-1.5 border border-zinc-800 text-zinc-400 text-[10px]">
              SYSTEM TIME: {time}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 tracking-widest uppercase">Ecosystem</h4>
            <ul className="space-y-4 text-zinc-500">
              <li><a href="#" className="hover:text-brand-surface transition-colors flex items-center gap-2"><span className="text-brand-primary">→</span> Documentation</a></li>
              <li><a href="#" className="hover:text-brand-surface transition-colors flex items-center gap-2"><span className="text-brand-primary">→</span> Automerge CRDT</a></li>
              <li><a href="#" className="hover:text-brand-surface transition-colors flex items-center gap-2"><span className="text-brand-primary">→</span> WebRTC Spec</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 tracking-widest uppercase">Community</h4>
            <ul className="space-y-4 text-zinc-500">
              <li><a href="#" className="hover:text-brand-surface transition-colors flex items-center gap-2"><span className="text-brand-accent">→</span> Discord Server</a></li>
              <li><a href="#" className="hover:text-brand-surface transition-colors flex items-center gap-2"><span className="text-brand-accent">→</span> GitHub Discussions</a></li>
              <li><a href="#" className="hover:text-brand-surface transition-colors flex items-center gap-2"><span className="text-brand-accent">→</span> Twitter / X</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Massive Marquee / Bottom Bar */}
      <div className="bg-brand-primary border-t-2 border-brand-text py-4 overflow-hidden relative">
        <div className="whitespace-nowrap flex items-center justify-center opacity-90 text-white font-mono text-[10px] uppercase tracking-[0.2em] font-bold">
          <span>&copy; {new Date().getFullYear()} Synkan Engine Project. Decentralized local autonomy. ALL RIGHTS RESERVED.</span>
          <span className="mx-6 text-brand-surface">•</span>
          <span>BUILT FOR THE POST-CLOUD ERA</span>
          <span className="mx-6 text-brand-surface">•</span>
          <span>v1.0.0-BETA</span>
        </div>
      </div>
    </footer>
  )
}

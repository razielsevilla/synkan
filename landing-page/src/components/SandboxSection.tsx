import { useState, useEffect, useRef } from 'react';

type Card = {
  id: string;
  title: string;
  column: 'backlog' | 'progress';
  orderKey: string;
  lastEditor: string;
};

type LogEntry = {
  id: string;
  message: string;
  type: 'info' | 'error' | 'success' | 'accent';
  timestamp: string;
};

export default function SandboxSection() {
  const [isConnected, setIsConnected] = useState(true);
  const [stateA, setStateA] = useState<Card[]>([]);
  const [stateB, setStateB] = useState<Card[]>([]);
  const [logsA, setLogsA] = useState<LogEntry[]>([]);
  const [logsB, setLogsB] = useState<LogEntry[]>([]);

  const logsAContainerRef = useRef<HTMLDivElement>(null);
  const logsBContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial Setup
    const initialCards: Card[] = [
      { id: 'card-1', title: 'Implement WASM SQLite persistence layers', column: 'backlog', orderKey: 'A', lastEditor: 'Initial' },
      { id: 'card-2', title: 'Optimize WebRTC data-channel streams', column: 'backlog', orderKey: 'B', lastEditor: 'Initial' },
      { id: 'card-3', title: 'Verify fractional index midpoints math', column: 'progress', orderKey: 'A', lastEditor: 'Initial' }
    ];
    setStateA([...initialCards]);
    setStateB([...initialCards]);

    addLog('A', 'SQLite database transaction engines active.', 'success');
    addLog('A', 'Bound signalers. Searching for local mesh peer...', 'info');
    addLog('A', 'Direct peer WebRTC channel bound to peer node @peer/bob-c812.', 'accent');

    addLog('B', 'SQLite database transaction engines active.', 'success');
    addLog('B', 'Bound signalers. Searching for local mesh peer...', 'info');
    addLog('B', 'Direct peer WebRTC channel bound to peer node @peer/alice-7a3b.', 'accent');
  }, []);

  useEffect(() => {
    if (logsAContainerRef.current) {
      logsAContainerRef.current.scrollTop = logsAContainerRef.current.scrollHeight;
    }
  }, [logsA]);

  useEffect(() => {
    if (logsBContainerRef.current) {
      logsBContainerRef.current.scrollTop = logsBContainerRef.current.scrollHeight;
    }
  }, [logsB]);

  const addLog = (peerId: 'A' | 'B', message: string, type: 'info' | 'error' | 'success' | 'accent') => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog = { id: Math.random().toString(), message, type, timestamp };
    if (peerId === 'A') {
      setLogsA(prev => [...prev, newLog]);
    } else {
      setLogsB(prev => [...prev, newLog]);
    }
  };

  const getLogColorClass = (type: string) => {
    if (type === 'error') return 'text-[#E52B50] font-bold';
    if (type === 'success') return 'text-[#FFD700] font-bold';
    if (type === 'accent') return 'text-[#1E3A8A] bg-white px-1.5 py-0.5 rounded font-bold';
    return 'text-white';
  };

  const addNewCard = (peerLetter: 'A' | 'B') => {
    const owner = peerLetter === 'A' ? 'Alice' : 'Bob';
    const randomId = 'card-' + Math.floor(Math.random() * 100000);
    const titles = [
      'Analyze lexicographical position vectors',
      'Write tombstone deletion retention codes',
      'Verify WASM SQLite binary index logs',
      'Compress WebRTC transport frame structures',
      'Resolve concurrent ordering collision anomalies'
    ];
    const title = titles[Math.floor(Math.random() * titles.length)];

    let currentA = [...stateA];
    let currentB = [...stateB];
    const targetState = peerLetter === 'A' ? currentA : currentB;

    const backlogCards = targetState.filter(c => c.column === 'backlog').sort((a, b) => a.orderKey.localeCompare(b.orderKey));
    let lastKey = 'A';
    if (backlogCards.length > 0) {
      const maxKey = backlogCards[backlogCards.length - 1].orderKey;
      lastKey = String.fromCharCode(maxKey.charCodeAt(0) + 1);
    }

    const newCard: Card = {
      id: randomId,
      title,
      column: 'backlog',
      orderKey: lastKey,
      lastEditor: owner
    };

    targetState.push(newCard);

    if (peerLetter === 'A') setStateA(currentA);
    else setStateB(currentB);

    addLog(peerLetter, `Local transaction registered: "${title.slice(0, 22)}..."`, 'accent');
    addLog(peerLetter, `SQLite WASM disk entry committed.`, 'success');

    if (isConnected) {
      syncDirectly(currentA, currentB);
    } else {
      addLog(peerLetter, `OFFLINE: Peer offline. Handshake buffered in local logs.`, 'error');
    }
  };

  const moveCardSimulated = (cardId: string, peerLetter: 'A' | 'B', targetColumn: 'backlog' | 'progress') => {
    let currentA = [...stateA];
    let currentB = [...stateB];
    const targetState = peerLetter === 'A' ? currentA : currentB;

    const cardIndex = targetState.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return;

    const card = { ...targetState[cardIndex], column: targetColumn, lastEditor: peerLetter === 'A' ? 'Alice' : 'Bob' };
    
    const colCards = targetState.filter(c => c.column === targetColumn).sort((a, b) => a.orderKey.localeCompare(b.orderKey));
    let newOrderKey = 'A';
    if (colCards.length > 0) {
      const lastCard = colCards[colCards.length - 1];
      newOrderKey = String.fromCharCode(lastCard.orderKey.charCodeAt(0) + 1);
    }
    card.orderKey = newOrderKey;

    targetState[cardIndex] = card;

    if (peerLetter === 'A') setStateA(currentA);
    else setStateB(currentB);

    addLog(peerLetter, `Card column updated to "${targetColumn}". Lexical sort key is "${newOrderKey}"`, 'accent');

    if (isConnected) {
      syncDirectly(currentA, currentB);
    } else {
      addLog(peerLetter, `OFFLINE: Handshake failed. Modification recorded to state delta.`, 'error');
    }
  };

  const syncDirectly = (stA: Card[], stB: Card[]) => {
    addLog('A', 'Broadcasting state vectors to mesh networks...', 'info');
    addLog('B', 'Synchronizing logs via vector delta matrix...', 'info');

    const allCardIds = Array.from(new Set([...stA.map(c => c.id), ...stB.map(c => c.id)]));
    const mergedState: Card[] = [];

    allCardIds.forEach(id => {
      const cardA = stA.find(c => c.id === id);
      const cardB = stB.find(c => c.id === id);

      if (cardA && !cardB) {
        mergedState.push(cardA);
        addLog('B', `Integrated card: "${cardA.title.slice(0, 16)}..." from Alice`, 'success');
      } else if (!cardA && cardB) {
        mergedState.push(cardB);
        addLog('A', `Integrated card: "${cardB.title.slice(0, 16)}..." from Bob`, 'success');
      } else if (cardA && cardB) {
        if (cardA.column === cardB.column && cardA.orderKey === cardB.orderKey) {
          mergedState.push(cardA);
        } else {
          addLog('A', `CRDT COLLISION RESOLVED on: "${cardA.title.slice(0, 12)}..."`, 'error');
          addLog('B', `Reconciling concurrent move midpoint offsets...`, 'error');

          const winningCard = cardA.lastEditor === 'Alice' ? cardA : cardB;
          mergedState.push(winningCard);

          addLog('A', `Tie resolved. Winner node signature: ${winningCard.lastEditor}`, 'success');
          addLog('B', `Tie resolved. Winner node signature: ${winningCard.lastEditor}`, 'success');
        }
      }
    });

    setStateA([...mergedState]);
    setStateB([...mergedState]);

    addLog('A', 'Mesh databases are unified and synchronized.', 'success');
    addLog('B', 'Mesh databases are unified and synchronized.', 'success');
  };

  const togglePeerConnection = () => {
    const newIsConnected = !isConnected;
    setIsConnected(newIsConnected);

    if (newIsConnected) {
      addLog('A', 'Established secure WebRTC connection with Bob', 'success');
      addLog('B', 'Established secure WebRTC connection with Alice', 'success');
      syncDirectly(stateA, stateB);
    } else {
      addLog('A', 'WebRTC signaling disconnected. Switched to offline isolation.', 'error');
      addLog('B', 'WebRTC signaling disconnected. Switched to offline isolation.', 'error');
    }
  };

  const renderColumn = (cardsSource: Card[], columnName: 'backlog' | 'progress') => {
    const filtered = cardsSource
      .filter(c => c.column === columnName)
      .sort((a, b) => a.orderKey.localeCompare(b.orderKey));

    if (filtered.length === 0) {
      return <div className="text-[10px] text-zinc-400 border border-dashed border-zinc-300 rounded p-4 text-center">Empty Column</div>;
    }

    return filtered.map(card => {
      let badgeColor = 'bg-brand-primary text-white border-brand-text';
      if (card.lastEditor === 'Bob') badgeColor = 'bg-brand-accent text-white border-brand-text';
      if (card.lastEditor === 'Initial') badgeColor = 'bg-white text-zinc-500 border-zinc-300';

      return (
        <div 
          key={card.id} 
          draggable 
          onDragStart={(e) => { e.dataTransfer.setData('text/plain', card.id); }}
          className="bg-white p-3.5 rounded-lg border-2 border-brand-text flex flex-col justify-between hover:translate-y-[-1px] transition-transform shadow-brutal-sm relative text-left cursor-grab active:cursor-grabbing"
        >
          <div className="text-xs font-bold text-brand-text leading-snug">{card.title}</div>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-200 text-[9px]">
            <span className={`px-2 py-0.5 rounded border font-bold ${badgeColor}`}>{card.lastEditor}</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-zinc-500 font-bold" title="Fractional Sorting Coordinate">idx: {card.orderKey}</span>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <section id="sandbox" className="py-20 border-b-4 border-brand-text bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="px-3 py-1.5 text-xs font-black uppercase tracking-widest bg-brand-surface text-brand-text border-2 border-brand-text rounded-md shadow-brutal-sm inline-block mb-3 font-mono">REAL-TIME SANDBOX</span>
          <h2 className="text-4xl sm:text-5xl font-anton text-brand-text tracking-wide">
            Live CRDT Vector Synchronization Simulation
          </h2>
          <p className="text-zinc-700 mt-4 text-sm sm:text-base font-medium leading-relaxed">
            Test the mechanics of Conflict-Free Replicated Data Types (CRDTs). Cut the WebRTC connection, make
            divergent changes on Alice's or Bob's isolated browser states, then reconnect to observe how local
            state conflicts resolve automatically!
          </p>
        </div>

        {/* Controller panel */}
        <div className="bg-brand-bg border-2 border-brand-text p-6 rounded-2xl mb-10 shadow-brutal max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs text-zinc-500 font-mono tracking-widest font-bold uppercase">WEBRTC TRANSPORT CHANNEL STATUS</span>
              <div className="flex items-center space-x-3 mt-1">
                <span className={`w-4 h-4 rounded-full border-2 border-brand-text ${isConnected ? 'bg-brand-primary animate-pulse' : 'bg-brand-accent'}`}></span>
                <span className={`text-lg font-anton tracking-wide ${isConnected ? 'text-brand-primary' : 'text-brand-accent animate-pulse'}`}>
                  {isConnected ? 'CONNECTED (MESH STABLE)' : 'DISCONNECTED (OFFLINE OPERATIONS)'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button onClick={togglePeerConnection}
                className="flex-1 md:flex-initial px-6 py-3.5 text-xs font-black tracking-wider uppercase bg-brand-accent text-white border-2 border-brand-text hover:translate-y-[-2px] hover:shadow-brutal active:translate-y-[2px] active:shadow-none shadow-brutal-sm rounded-xl transition-all flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <span>{isConnected ? 'Simulate Network Drop' : 'Resume Connection Mode'}</span>
              </button>
              {!isConnected && (
                <button onClick={togglePeerConnection}
                  className="flex-1 md:flex-initial px-6 py-3.5 text-xs font-black tracking-wider uppercase bg-brand-surface text-brand-text border-2 border-brand-text hover:translate-y-[-2px] hover:shadow-brutal active:translate-y-[2px] active:shadow-none shadow-brutal-sm rounded-xl flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.253 8H18" />
                  </svg>
                  <span>Reconnect & Sync</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Side-by-Side Peer Emulation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* PEER A (ALICE) */}
          <div className="bg-white rounded-2xl border-2 border-brand-text overflow-hidden shadow-brutal relative">
            <div className="h-2 bg-brand-primary"></div>
            <div className="p-4 bg-brand-bg border-b-2 border-brand-text flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-brand-primary border border-brand-text"></span>
                <span className="font-anton text-lg tracking-wider text-brand-text">Device A (Alice)</span>
              </div>
              <span className="text-[10px] font-mono bg-white text-brand-primary font-bold border border-brand-text px-2 py-0.5 rounded">ID: @peer/alice-7a3b</span>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-zinc-600 font-bold font-mono">LOCAL BOARD INSTANCE:</span>
                <button onClick={() => addNewCard('A')}
                  className="px-3 py-1.5 text-xs font-black text-brand-text bg-brand-surface border-2 border-brand-text rounded hover:translate-y-[-1px] hover:shadow-brutal-sm transition-all flex items-center space-x-1">
                  <span>+ Create Card</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-brand-bg p-3 rounded-lg border-2 border-brand-text">
                  <span className="text-[10px] font-mono font-extrabold tracking-wider uppercase text-zinc-600 block mb-2 pb-1 border-b border-brand-text">BACKLOG</span>
                  <div 
                    className="space-y-2 min-h-[160px] flex flex-col justify-start"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      const cardId = e.dataTransfer.getData('text/plain');
                      if (cardId) moveCardSimulated(cardId, 'A', 'backlog');
                    }}
                  >
                    {renderColumn(stateA, 'backlog')}
                  </div>
                </div>
                <div className="bg-brand-bg p-3 rounded-lg border-2 border-brand-text">
                  <span className="text-[10px] font-mono font-extrabold tracking-wider uppercase text-brand-primary block mb-2 pb-1 border-b border-brand-text">IN PROGRESS</span>
                  <div 
                    className="space-y-2 min-h-[160px] flex flex-col justify-start"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      const cardId = e.dataTransfer.getData('text/plain');
                      if (cardId) moveCardSimulated(cardId, 'A', 'progress');
                    }}
                  >
                    {renderColumn(stateA, 'progress')}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-brand-text">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider font-bold">Local Mutation Journal</span>
                  <span className="text-[9px] text-brand-primary font-mono font-bold">SQLITE CACHE ACTIVE</span>
                </div>
                <div ref={logsAContainerRef} className="bg-brand-text text-[#F5F2EA] p-4 rounded-lg font-mono text-[10px] h-32 overflow-y-auto space-y-1">
                  {logsA.map((log) => (
                    <div key={log.id}>
                      <span className="text-zinc-500">[{log.timestamp}]</span> <span className={getLogColorClass(log.type)}>{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PEER B (BOB) */}
          <div className="bg-white rounded-2xl border-2 border-brand-text overflow-hidden shadow-brutal relative">
            <div className="h-2 bg-brand-accent"></div>
            <div className="p-4 bg-brand-bg border-b-2 border-brand-text flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-brand-accent border border-brand-text"></span>
                <span className="font-anton text-lg tracking-wider text-brand-text">Device B (Bob)</span>
              </div>
              <span className="text-[10px] font-mono bg-white text-brand-accent font-bold border border-brand-text px-2 py-0.5 rounded">ID: @peer/bob-c812</span>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-zinc-600 font-bold font-mono">LOCAL BOARD INSTANCE:</span>
                <button onClick={() => addNewCard('B')}
                  className="px-3 py-1.5 text-xs font-black text-brand-text bg-brand-surface border-2 border-brand-text rounded hover:translate-y-[-1px] hover:shadow-brutal-sm transition-all flex items-center space-x-1">
                  <span>+ Create Card</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-brand-bg p-3 rounded-lg border-2 border-brand-text">
                  <span className="text-[10px] font-mono font-extrabold tracking-wider uppercase text-zinc-600 block mb-2 pb-1 border-b border-brand-text">BACKLOG</span>
                  <div 
                    className="space-y-2 min-h-[160px] flex flex-col justify-start"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      const cardId = e.dataTransfer.getData('text/plain');
                      if (cardId) moveCardSimulated(cardId, 'B', 'backlog');
                    }}
                  >
                    {renderColumn(stateB, 'backlog')}
                  </div>
                </div>
                <div className="bg-brand-bg p-3 rounded-lg border-2 border-brand-text">
                  <span className="text-[10px] font-mono font-extrabold tracking-wider uppercase text-brand-accent block mb-2 pb-1 border-b border-brand-text">IN PROGRESS</span>
                  <div 
                    className="space-y-2 min-h-[160px] flex flex-col justify-start"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      const cardId = e.dataTransfer.getData('text/plain');
                      if (cardId) moveCardSimulated(cardId, 'B', 'progress');
                    }}
                  >
                    {renderColumn(stateB, 'progress')}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-brand-text">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider font-bold">Local Mutation Journal</span>
                  <span className="text-[9px] text-brand-accent font-mono font-bold">SQLITE CACHE ACTIVE</span>
                </div>
                <div ref={logsBContainerRef} className="bg-brand-text text-[#F5F2EA] p-4 rounded-lg font-mono text-[10px] h-32 overflow-y-auto space-y-1">
                  {logsB.map((log) => (
                    <div key={log.id}>
                      <span className="text-zinc-500">[{log.timestamp}]</span> <span className={getLogColorClass(log.type)}>{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Interactive Guidelines Card */}
        <div className="mt-10 bg-brand-surface border-2 border-brand-text rounded-2xl p-6 shadow-brutal flex flex-col sm:flex-row gap-4 items-start max-w-4xl mx-auto text-left">
          <div className="p-3 bg-brand-primary text-white border-2 border-brand-text rounded-xl font-anton text-xl leading-none">!</div>
          <div>
            <h5 className="text-sm font-black uppercase tracking-wider font-mono text-brand-text mb-2">How to test peer conflicts in this simulator:</h5>
            <ol className="list-decimal text-zinc-800 text-xs pl-4 space-y-2 leading-relaxed font-medium">
              <li>Click <strong className="underline font-bold text-brand-accent">"Simulate Network Drop"</strong> above. This stops the active mock WebRTC synchronizer stream between Alice and Bob.</li>
              <li>Add tasks, or drag and drop cards to move them between columns inside <strong className="text-brand-primary font-bold">Alice's</strong> dashboard. Then perform actions separately inside <strong className="text-brand-accent font-bold">Bob's</strong> dashboard. Observe how local transactions write independently into their isolated database journals.</li>
              <li>Click <strong className="underline font-bold text-brand-primary">"Reconnect & Sync"</strong>. Watch the terminals exchange delta vectors, compute midpoints of fractional positions, and converge both client views to identical values deterministically!</li>
            </ol>
          </div>
        </div>

      </div>
    </section>
  )
}

import { useState } from 'react';

// INLINE EMOJI SCROLL (no external file)
function EmojiScroll({ onPick }: { onPick: (e: string) => void }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('😐');
  const EMOJIS = ['😡','😕','😐','🙂','😁','🤩','😎','🤯','😴','🤔','🤐','🤪','😇','👹','💀','🔥','💯','⚡','🎯','🚀','💸','📉','📈','💰','🤏','🎲','🎰','🔮','🧠','💡','❤️','🩹','💊','🧘','⚖️','🛡️','⚠️','🚫','✅','🔄','⏳','🕐','🌅','🌙','🧊','🌊','🌪️','🧯','🏁'];
  
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="border rounded px-3 py-2 bg-gray-800 text-2xl min-w-[3rem]">
        {selected}
      </button>
      {open && (
        <div className="absolute top-12 left-0 w-64 h-48 overflow-y-auto bg-gray-900 border rounded p-2 grid grid-cols-4 gap-2 z-10">
          {EMOJIS.map(e => (
            <div key={e} onClick={() => { setSelected(e); onPick(e); setOpen(false); }} className="cursor-pointer hover:bg-gray-700 p-2 text-2xl rounded text-center">
              {e}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// PSYCHOLOGICAL MIRROR
const MINDSETS = ['Focused & patient', 'Slightly rushed', 'Afraid of missing the move', 'Recovering from a previous loss', 'Riding confidence from a win', 'Bored / forcing action', 'Neutral'] as const;
const REACTIONS = ['Relief', 'Satisfaction', 'Frustration', 'Anger', 'Regret', 'Indifference', 'Euphoria'] as const;
const URGE_REASONS = ['To capitalize on momentum', 'To recover a loss', 'Felt unusually "locked in"', 'Felt unsettled / off balance'];
const ALIGNMENTS = ['Rules followed, emotions calm', 'Rules followed, emotions elevated', 'Rules broken due to emotion', 'Rules broken for non-emotional reasons'];
const PATTERNS = ['Yes — recurring mistake', 'Yes — recurring success', 'No', 'Unsure'];

export default function PsychMirror({ onSave }: { onSave: (data: any) => void }) {
  const [mode, setMode] = useState<'pre' | 'post'>('pre');
  const [pre, setPre] = useState({ confidence: 3, calm: 3, clarity: 3, energy: 3, urgency: 3, mindset: [] as string[], fear: '', rules: true });
  const [post, setPost] = useState({ reaction: 'Neutral', intensity: 3, urge: false, urgeReason: '', alignment: '', label: '', pattern: 'No' });

  const save = () => {
    const payload = mode === 'pre' ? { pre } : { pre, post };
    onSave(payload);
    setMode('post');
  };

  return (
    <div className="bg-gray-900 p-4 rounded text-white space-y-4 max-w-2xl">
      <div className="flex gap-2">
        <button className={`px-3 py-1 rounded ${mode === 'pre' ? 'bg-green-700' : 'bg-gray-700'}`} onClick={() => setMode('pre')}>Pre-Trade</button>
        <button className={`px-3 py-1 rounded ${mode === 'post' ? 'bg-green-700' : 'bg-gray-700'}`} onClick={() => setMode('post')}>Post-Trade</button>
      </div>

      {mode === 'pre' ? (
        <>
          <h3 className="font-bold">Mental Readiness (1-5)</h3>
          {(['confidence','calm','clarity','energy','urgency'] as const).map(k => (
            <div key={k} className="flex items-center gap-3">
              <span className="w-24 capitalize">{k}</span>
              <input type="range" min="1" max="5" value={pre[k]} onChange={e => setPre({...pre, [k]: Number(e.target.value)})} />
              <span>{pre[k]}</span>
            </div>
          ))}
          <h3 className="font-bold">Mindset</h3>
          <div className="grid grid-cols-2 gap-2">
            {MINDSETS.map(m => (
              <label key={m} className="flex items-center gap-2">
                <input type="checkbox" checked={pre.mindset.includes(m)} onChange={e => setPre({...pre, mindset: e.target.checked ? [...pre.mindset, m] : pre.mindset.filter(x => x !== m)})} />
                {m}
              </label>
            ))}
          </div>
          <h3 className="font-bold">Fear if skipped</h3>
          <input className="w-full text-black px-2" maxLength={120} placeholder="What do you fear?" value={pre.fear} onChange={e => setPre({...pre, fear: e.target.value})} />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={pre.rules} onChange={e => setPre({...pre, rules: e.target.checked})} />
            Rules followed
          </label>
        </>
      ) : (
        <>
          <h3 className="font-bold">Emotional Reaction</h3>
          <select className="text-black" value={post.reaction} onChange={e => setPost({...post, reaction: e.target.value})}>
            {REACTIONS.map(r => <option key={r}>{r}</option>)}
          </select>
          <h3 className="font-bold">Intensity</h3>
          <div className="flex items-center gap-3">
            <input type="range" min="1" max="5" value={post.intensity} onChange={e => setPost({...post, intensity: Number(e.target.value)})} />
            <span>{post.intensity}</span>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={post.urge} onChange={e => setPost({...post, urge: e.target.checked})} />
            Urge to trade again
          </label>
          {post.urge && (
            <select className="text-black" value={post.urgeReason} onChange={e => setPost({...post, urgeReason: e.target.value})}>
              <option value="">Select reason</option>
              {URGE_REASONS.map(r => <option key={r}>{r}</option>)}
            </select>
          )}
          <h3 className="font-bold">Rule Alignment</h3>
          <select className="text-black" value={post.alignment} onChange={e => setPost({...post, alignment: e.target.value})}>
            {ALIGNMENTS.map(a => <option key={a}>{a}</option>)}
          </select>
          <h3 className="font-bold">One-word label</h3>
          <EmojiScroll onPick={e => setPost({...post, label: e})} />
          <h3 className="font-bold">Pattern?</h3>
          <select className="text-black" value={post.pattern} onChange={e => setPost({...post, pattern: e.target.value})}>
            {PATTERNS.map(p => <option key={p}>{p}</option>)}
          </select>
        </>
      )}

      <button onClick={save} className="w-full mt-4 bg-green-700 py-2 rounded">
        {mode === 'pre' ? 'Save Pre-Trade & Wait' : 'Save Post-Trade & Close'}
      </button>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { supabase, Note } from '../lib/supabase';

export default function NotesSystem({ userId, tradeId }: { userId: string; tradeId?: string }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('strategy');
  const [loading, setLoading] = useState(false);

  // Load notes on mount
  useEffect(() => {
    loadNotes();
  }, [userId, tradeId]);

  const loadNotes = async () => {
    let query = supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // If tradeId prop is passed, filter by that trade
    if (tradeId) {
      query = query.eq('trade_id', tradeId);
    }

    const { data, error } = await query;
    if (!error) setNotes(data || []);
  };

  const handleAdd = async () => {
    if (!title.trim()) return alert('Title required');

    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert('You must be logged in');
      return;
    }

    const { error } = await supabase.from('notes').insert({
      user_id: user.id,
      title,
      content,
      category,
      trade_id: tradeId || null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      alert(error.message);
    } else {
      setTitle('');
      setContent('');
      loadNotes();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this note?')) return;
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (!error) loadNotes();
  };

  return (
    <div className="bg-shell-card rounded-xl p-6 border border-shell-glow">
      <h3 className="text-xl font-bold text-shell-green mb-4">
        {tradeId ? 'TRADE NOTES' : 'STRATEGY NOTES'}
      </h3>

      {/* Note Form */}
      <div className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Note title (e.g. 'EURUSD range analysis')"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-shell-accent p-3 rounded border border-shell-glow text-shell-text"
        />

        {!tradeId && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-shell-accent p-3 rounded border border-shell-glow text-shell-text"
          >
            <option value="strategy">Strategy</option>
            <option value="psychology">Psychology</option>
            <option value="market-analysis">Market Analysis</option>
            <option value="weekly-review">Weekly Review</option>
          </select>
        )}

        <textarea
          placeholder={
            tradeId
              ? 'Why you exited, what you felt...'
              : 'Market observations, strategy thoughts...'
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-shell-accent p-3 rounded border border-shell-glow text-shell-text"
          rows={3}
        />

        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-shell-green text-shell-dark font-bold px-6 py-3 rounded hover:bg-emerald-500 transition disabled:opacity-50"
        >
          {loading ? 'SAVING...' : 'SAVE NOTE'}
        </button>
      </div>

      {/* Notes List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="text-center text-shell-text/50 py-8">
            {tradeId ? 'No trade notes yet.' : 'No strategy notes yet.'}
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-shell-accent p-4 rounded border border-shell-glow hover:border-shell-yellow transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="font-bold text-shell-green">{note.title}</div>
                  {!tradeId && (
                    <div className="text-xs text-shell-yellow mt-1">{note.category}</div>
                  )}
                  <div className="text-sm text-shell-text/80 mt-2">{note.content}</div>
                  <div className="text-xs text-shell-text/50 mt-2">
                    {new Date(note.created_at).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(note.id!)}
                  className="text-shell-red hover:bg-shell-red/20 px-2 rounded text-sm"
                >
                  DELETE
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

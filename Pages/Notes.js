import React, { useState } from 'react';
import { StickyNote } from 'lucide-react';
import { motion } from 'framer-motion';
import NotesSystem from '../components/notes/NotesSystem';

export default function Notes() {
  const [notes, setNotes] = useState([]);

  const handleAdd = (note) => {
    setNotes([note, ...notes]);
  };

  const handleDelete = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="p-3 rounded-xl bg-amber-500/10">
            <StickyNote className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Trading Notes</h1>
            <p className="text-slate-400 mt-1">Document insights, strategies, and lessons</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <NotesSystem notes={notes} onAdd={handleAdd} onDelete={handleDelete} />
        </motion.div>
      </div>
    </div>
  );
}
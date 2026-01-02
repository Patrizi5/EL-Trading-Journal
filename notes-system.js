/**
 * Eternum Trading Journal - Notes System
 * Comprehensive note-taking with categorization, search, and analysis
 */

class NotesSystem {
  constructor() {
    this.notes = new Map();
    this.categories = this.initializeCategories();
    this.templates = this.initializeTemplates();
    this.searchIndex = new Map();
    this.currentFilter = 'all';
    this.sortBy = 'createdAt';
    this.sortOrder = 'desc';

    this.init();
  }

  init() {
    this.loadNotes();
    this.buildSearchIndex();
    console.log('Notes system initialized');
  }

  initializeCategories() {
    return {
      'market-analysis': {
        name: 'Market Analysis',
        icon: '📊',
        color: '#3b82f6',
        description: 'Technical and fundamental market analysis',
      },
      strategy: {
        name: 'Strategy',
        icon: '🎯',
        color: '#10b981',
        description: 'Trading strategies and system development',
      },
      reflection: {
        name: 'Reflection',
        icon: '💭',
        color: '#8b5cf6',
        description: 'Trade reviews and psychological insights',
      },
      goals: {
        name: 'Goals',
        icon: '🎯',
        color: '#f59e0b',
        description: 'Trading goals and milestone tracking',
      },
      journal: {
        name: 'Journal',
        icon: '📝',
        color: '#06b6d4',
        description: 'Daily trading journal entries',
      },
      education: {
        name: 'Education',
        icon: '📚',
        color: '#ef4444',
        description: 'Learning resources and educational notes',
      },
      'risk-management': {
        name: 'Risk Management',
        icon: '🛡️',
        color: '#6366f1',
        description: 'Risk assessment and money management',
      },
      general: {
        name: 'General',
        icon: '📌',
        color: '#6b7280',
        description: 'General trading notes and observations',
      },
    };
  }

  initializeTemplates() {
    return {
      'market-analysis': {
        title: 'Market Analysis Template',
        content: `## Market: [Symbol/Asset]

### Timeframe Analysis
- **Higher Timeframe Trend:** [Bullish/Bearish/Neutral]
- **Current Timeframe:** [Analysis]
- **Lower Timeframe:** [Entry timing]

### Technical Levels
- **Support:** [Price levels]
- **Resistance:** [Price levels]
- **Key Levels:** [Important price points]

### Market Structure
- **Trend:** [Direction and strength]
- **Pattern:** [Chart patterns observed]
- **Volume:** [Volume analysis]

### Trade Setup
- **Entry Trigger:** [What would make you enter]
- **Stop Loss:** [Logical stop placement]
- **Take Profit:** [Target levels]
- **Risk/Reward:** [R:R calculation]

### Market Sentiment
- **News/Events:** [Relevant news]
- **Economic Calendar:** [Upcoming events]
- **Market Correlation:** [Related markets]

### Conclusion
[Your trading decision and reasoning]`,
      },
      'trade-review': {
        title: 'Trade Review Template',
        content: `## Trade Review: [Symbol] - [Date]

### Trade Details
- **Direction:** [Long/Short]
- **Entry:** [Price]
- **Exit:** [Price]
- **Position Size:** [Size]
- **Outcome:** [Win/Loss/Break-even]

### Pre-Trade Analysis
- **Setup Quality:** [Rating 1-10]
- **Emotional State:** [How did you feel]
- **Market Conditions:** [Volatility, trend, etc.]

### Execution
- **Entry Quality:** [How was the entry]
- **Trade Management:** [How did you manage the trade]
- **Exit Decision:** [Why did you exit]

### What Went Well
[List positive aspects of the trade]

### Areas for Improvement
[List what could be improved]

### Lessons Learned
[Key takeaways from this trade]

### Next Action
[What will you do differently next time]`,
      },
      'weekly-review': {
        title: 'Weekly Review Template',
        content: `## Weekly Review - Week [Number] - [Date Range]

### Performance Summary
- **Total Trades:** [Number]
- **Win Rate:** [Percentage]
- **P&L:** [Amount]
- **Best Trade:** [Details]
- **Worst Trade:** [Details]

### Strategy Performance
- **Strategy 1:** [Performance and observations]
- **Strategy 2:** [Performance and observations]
- **Strategy 3:** [Performance and observations]

### Psychological Review
- **Emotional Control:** [Rating and notes]
- **Discipline:** [How well did you follow rules]
- **Mistakes:** [What mistakes were made]
- **Improvements:** [What got better]

### Market Observations
[Notable market events and patterns]

### Goals for Next Week
[Specific, measurable goals]`,
      },
      'goal-setting': {
        title: 'Goal Setting Template',
        content: `## Trading Goals - [Time Period]

### Financial Goals
- **Target P&L:** [Amount]
- **Target Return:** [Percentage]
- **Maximum Drawdown:** [Amount/Percentage]

### Performance Goals
- **Win Rate Target:** [Percentage]
- **Risk/Reward Target:** [Ratio]
- **Number of Trades:** [Target range]

### Skill Development Goals
- **Technical Analysis:** [Specific skills to improve]
- **Risk Management:** [Areas to strengthen]
- **Psychology:** [Mental aspects to work on]

### Process Goals
- **Pre-trade Routine:** [Daily preparation]
- **Review Schedule:** [When to review trades]
- **Learning Time:** [Education commitment]

### Action Plan
[Specific steps to achieve these goals]`,
      },
    };
  }

  // Note Creation and Management
  createNote(noteData) {
    try {
      const note = {
        id: this.generateId(),
        title: noteData.title?.trim() || 'Untitled Note',
        content: noteData.content?.trim() || '',
        category: noteData.category || 'general',
        tags: this.processTags(noteData.tags || []),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: noteData.userId || 'current_user',
        attachments: noteData.attachments || [],
        sentiment: this.analyzeSentiment(noteData.content || ''),
        wordCount: this.countWords(noteData.content || ''),
        readingTime: this.calculateReadingTime(noteData.content || ''),
        version: 1,
      };

      // Validate note
      this.validateNote(note);

      // Save note
      this.notes.set(note.id, note);
      this.saveNotes();
      this.updateSearchIndex(note);

      console.log(`Note created: ${note.title} (${note.id})`);
      return { success: true, note };
    } catch (error) {
      console.error('Error creating note:', error);
      return { success: false, error: error.message };
    }
  }

  updateNote(noteId, updates) {
    try {
      const note = this.notes.get(noteId);
      if (!note) {
        throw new Error('Note not found');
      }

      // Update fields
      if (updates.title !== undefined) note.title = updates.title.trim();
      if (updates.content !== undefined) note.content = updates.content.trim();
      if (updates.category !== undefined) note.category = updates.category;
      if (updates.tags !== undefined) note.tags = this.processTags(updates.tags);

      // Update metadata
      note.updatedAt = new Date().toISOString();
      note.version = (note.version || 1) + 1;
      note.sentiment = this.analyzeSentiment(note.content);
      note.wordCount = this.countWords(note.content);
      note.readingTime = this.calculateReadingTime(note.content);

      this.saveNotes();
      this.updateSearchIndex(note);

      console.log(`Note updated: ${note.title} (${note.id})`);
      return { success: true, note };
    } catch (error) {
      console.error('Error updating note:', error);
      return { success: false, error: error.message };
    }
  }

  deleteNote(noteId) {
    try {
      const note = this.notes.get(noteId);
      if (!note) {
        throw new Error('Note not found');
      }

      this.notes.delete(noteId);
      this.removeFromSearchIndex(noteId);
      this.saveNotes();

      console.log(`Note deleted: ${note.title} (${noteId})`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting note:', error);
      return { success: false, error: error.message };
    }
  }

  getNote(noteId) {
    return this.notes.get(noteId) || null;
  }

  getAllNotes(options = {}) {
    const {
      category = null,
      tags = [],
      startDate = null,
      endDate = null,
      limit = null,
      offset = 0,
    } = options;

    let notes = Array.from(this.notes.values());

    // Apply filters
    if (category && category !== 'all') {
      notes = notes.filter((note) => note.category === category);
    }

    if (tags.length > 0) {
      notes = notes.filter((note) => tags.some((tag) => note.tags.includes(tag)));
    }

    if (startDate) {
      notes = notes.filter((note) => new Date(note.createdAt) >= new Date(startDate));
    }

    if (endDate) {
      notes = notes.filter((note) => new Date(note.createdAt) <= new Date(endDate));
    }

    // Apply sorting
    notes.sort((a, b) => {
      const aVal = new Date(a[this.sortBy]);
      const bVal = new Date(b[this.sortBy]);

      if (this.sortOrder === 'asc') {
        return aVal - bVal;
      } else {
        return bVal - aVal;
      }
    });

    // Apply pagination
    if (limit) {
      notes = notes.slice(offset, offset + limit);
    }

    return notes;
  }

  // Search and Filtering
  searchNotes(query, options = {}) {
    if (!query || query.trim() === '') {
      return this.getAllNotes(options);
    }

    const searchTerms = query
      .toLowerCase()
      .split(' ')
      .filter((term) => term.length > 0);
    const matchingNotes = [];

    for (const note of this.notes.values()) {
      const searchText = `${note.title} ${note.content} ${note.tags.join(' ')}`.toLowerCase();
      const relevance = this.calculateRelevance(searchText, searchTerms);

      if (relevance > 0) {
        matchingNotes.push({ note, relevance });
      }
    }

    // Sort by relevance
    matchingNotes.sort((a, b) => b.relevance - a.relevance);

    return matchingNotes.map((item) => item.note);
  }

  calculateRelevance(text, searchTerms) {
    let relevance = 0;

    for (const term of searchTerms) {
      if (text.includes(term)) {
        relevance += 1;

        // Boost relevance for exact matches in title
        if (text.startsWith(term) || text.includes(` ${term}`)) {
          relevance += 2;
        }
      }
    }

    return relevance;
  }

  filterByCategory(category) {
    this.currentFilter = category;
    return this.getAllNotes({ category });
  }

  filterByTags(tags) {
    return this.getAllNotes({ tags });
  }

  // Templates
  getTemplate(templateId) {
    return this.templates[templateId] || null;
  }

  getAllTemplates() {
    return Object.entries(this.templates).map(([id, template]) => ({
      id,
      ...template,
    }));
  }

  createNoteFromTemplate(templateId, data = {}) {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    let content = template.content;

    // Replace placeholders with actual data
    Object.entries(data).forEach(([key, value]) => {
      content = content.replace(new RegExp(`\\[${key}\\]`, 'g'), value || '');
    });

    return this.createNote({
      title: data.title || template.title,
      content,
      category: data.category || templateId.split('-')[0],
      tags: data.tags || [],
      userId: data.userId,
    });
  }

  // Analytics and Insights
  getNoteStats() {
    const notes = Array.from(this.notes.values());

    const categoryStats = {};
    const tagStats = {};
    let totalWords = 0;

    notes.forEach((note) => {
      // Category stats
      categoryStats[note.category] = (categoryStats[note.category] || 0) + 1;

      // Tag stats
      note.tags.forEach((tag) => {
        tagStats[tag] = (tagStats[tag] || 0) + 1;
      });

      // Word count
      totalWords += note.wordCount || 0;
    });

    return {
      totalNotes: notes.length,
      totalWords,
      averageWordsPerNote: notes.length > 0 ? Math.round(totalWords / notes.length) : 0,
      categories: categoryStats,
      tags: tagStats,
      sentimentDistribution: this.getSentimentDistribution(notes),
      recentActivity: this.getRecentActivity(7),
    };
  }

  getSentimentDistribution(notes) {
    const distribution = { positive: 0, neutral: 0, negative: 0 };

    notes.forEach((note) => {
      const sentiment = note.sentiment || 'neutral';
      distribution[sentiment] = (distribution[sentiment] || 0) + 1;
    });

    return distribution;
  }

  getRecentActivity(days = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentNotes = Array.from(this.notes.values()).filter(
      (note) => new Date(note.createdAt) >= cutoffDate
    );

    return {
      notesCreated: recentNotes.length,
      wordsWritten: recentNotes.reduce((sum, note) => sum + (note.wordCount || 0), 0),
      categoriesUsed: new Set(recentNotes.map((note) => note.category)).size,
    };
  }

  // Import/Export
  exportNotes(format = 'json') {
    const notes = Array.from(this.notes.values());

    if (format === 'json') {
      return JSON.stringify(notes, null, 2);
    } else if (format === 'csv') {
      return this.convertToCSV(notes);
    } else if (format === 'markdown') {
      return this.convertToMarkdown(notes);
    }

    throw new Error('Unsupported export format');
  }

  importNotes(data, format = 'json') {
    try {
      let notes = [];

      if (format === 'json') {
        notes = JSON.parse(data);
      } else if (format === 'csv') {
        notes = this.parseFromCSV(data);
      } else {
        throw new Error('Unsupported import format');
      }

      let imported = 0;
      let errors = [];

      notes.forEach((noteData) => {
        try {
          const result = this.createNote(noteData);
          if (result.success) {
            imported++;
          } else {
            errors.push(result.error);
          }
        } catch (error) {
          errors.push(error.message);
        }
      });

      return {
        success: true,
        imported,
        errors: errors.length > 0 ? errors : null,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Utility methods
  generateId() {
    return 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  validateNote(note) {
    if (!note.title || note.title.trim() === '') {
      throw new Error('Note title is required');
    }

    if (!note.content || note.content.trim() === '') {
      throw new Error('Note content is required');
    }

    if (!this.categories[note.category]) {
      throw new Error('Invalid category');
    }

    return true;
  }

  processTags(tags) {
    if (typeof tags === 'string') {
      return tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    }

    if (Array.isArray(tags)) {
      return tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0);
    }

    return [];
  }

  analyzeSentiment(text) {
    // Simple sentiment analysis based on keywords
    const positiveWords = [
      'good',
      'great',
      'excellent',
      'success',
      'win',
      'profit',
      'happy',
      'confident',
      'strong',
    ];
    const negativeWords = [
      'bad',
      'poor',
      'loss',
      'fail',
      'mistake',
      'wrong',
      'weak',
      'disappointed',
      'frustrated',
    ];

    const words = text.toLowerCase().split(/\W+/);
    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach((word) => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    });

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  countWords(text) {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }

  calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const wordCount = this.countWords(text);
    return Math.ceil(wordCount / wordsPerMinute);
  }

  convertToCSV(notes) {
    const headers = [
      'ID',
      'Title',
      'Category',
      'Content',
      'Tags',
      'Created At',
      'Updated At',
      'Word Count',
    ];
    const rows = notes.map((note) => [
      note.id,
      `"${note.title}"`,
      note.category,
      `"${note.content.replace(/"/g, '""')}"`,
      note.tags.join(';'),
      note.createdAt,
      note.updatedAt,
      note.wordCount || 0,
    ]);

    return [headers, ...rows].map((row) => row.join(',')).join('\n');
  }

  convertToMarkdown(notes) {
    return notes
      .map((note) => {
        const categoryInfo = this.categories[note.category];
        const categoryName = categoryInfo ? categoryInfo.name : note.category;

        return `# ${note.title}

**Category:** ${categoryName}  
**Created:** ${new Date(note.createdAt).toLocaleDateString()}  
**Updated:** ${new Date(note.updatedAt).toLocaleDateString()}  
**Tags:** ${note.tags.join(', ')}

---

${note.content}

---

*Word Count: ${note.wordCount || 0}*  
*Reading Time: ${note.readingTime || 0} minutes*

---
`;
      })
      .join('\n\n');
  }

  parseFromCSV(csvData) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    const notes = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length >= headers.length) {
        const note = {
          title: values[1]?.replace(/"/g, ''),
          content: values[3]?.replace(/"/g, ''),
          category: values[2] || 'general',
          tags: values[4] ? values[4].split(';') : [],
          createdAt: values[5] || new Date().toISOString(),
          updatedAt: values[6] || new Date().toISOString(),
        };
        notes.push(note);
      }
    }

    return notes;
  }

  // Data Persistence
  saveNotes() {
    try {
      const notesArray = Array.from(this.notes.entries());
      localStorage.setItem('eternum_notes_data', JSON.stringify(notesArray));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  }

  loadNotes() {
    try {
      const data = localStorage.getItem('eternum_notes_data');
      if (data) {
        const notesArray = JSON.parse(data);
        this.notes = new Map(notesArray);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
      this.notes = new Map();
    }
  }

  buildSearchIndex() {
    this.searchIndex.clear();

    for (const note of this.notes.values()) {
      this.updateSearchIndex(note);
    }
  }

  updateSearchIndex(note) {
    const searchText = `${note.title} ${note.content} ${note.tags.join(' ')}`.toLowerCase();
    const words = searchText.split(/\s+/).filter((word) => word.length > 2);

    words.forEach((word) => {
      if (!this.searchIndex.has(word)) {
        this.searchIndex.set(word, new Set());
      }
      this.searchIndex.get(word).add(note.id);
    });
  }

  removeFromSearchIndex(noteId) {
    for (const [word, noteIds] of this.searchIndex.entries()) {
      noteIds.delete(noteId);
      if (noteIds.size === 0) {
        this.searchIndex.delete(word);
      }
    }
  }
}

// Initialize notes system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('notes-section')) {
    window.notesSystem = new NotesSystem();
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NotesSystem };
}

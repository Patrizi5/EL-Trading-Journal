/**
 * Authentication System
 * Handles user authentication, session management, and secure password storage
 */

class AuthSystem {
  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.sessionTimeout = 3600000; // 1 hour
    this.loadUsers();
  }

  loadUsers() {
    const savedUsers = localStorage.getItem('eternum_users');
    if (savedUsers) {
      try {
        const users = JSON.parse(savedUsers);
        users.forEach((user) => this.users.set(user.id, user));
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    }
  }

  saveUsers() {
    const users = Array.from(this.users.values());
    localStorage.setItem('eternum_users', JSON.stringify(users));
  }

  async registerUser(userData) {
    const { firstName, lastName, email, password } = userData;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      throw new Error('All fields are required');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    // Check if user already exists
    const existingUser = Array.from(this.users.values()).find((u) => u.email === email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password (simple hash for demo - use bcrypt in production)
    const hashedPassword = this.hashPassword(password);

    const user = {
      id: 'user_' + Date.now(),
      email,
      firstName,
      lastName,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date().toISOString(),
      verified: true,
      preferences: {
        defaultAccountSize: 10000,
        defaultRiskPercent: 2.0,
        preferredMarkets: ['forex', 'crypto'],
      },
    };

    this.users.set(user.id, user);
    this.saveUsers();

    return {
      success: true,
      user: this.sanitizeUser(user),
      message: 'User registered successfully',
    };
  }

  async authenticateUser(email, password) {
    const user = Array.from(this.users.values()).find((u) => u.email === email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!this.verifyPassword(password, user.password)) {
      throw new Error('Invalid email or password');
    }

    // Create session
    const sessionId = this.createSession(user.id);

    return {
      success: true,
      user: this.sanitizeUser(user),
      sessionId,
      message: 'Authenticated successfully',
    };
  }

  createSession(userId) {
    const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const session = {
      userId,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.sessionTimeout,
    };

    this.sessions.set(sessionId, session);
    localStorage.setItem('eternum_session', sessionId);

    return sessionId;
  }

  getCurrentSession() {
    const sessionId = localStorage.getItem('eternum_session');
    if (!sessionId) return null;

    const session = this.sessions.get(sessionId);
    if (!session || session.expiresAt < Date.now()) {
      this.destroySession(sessionId);
      return null;
    }

    return session;
  }

  getCurrentUser() {
    const session = this.getCurrentSession();
    if (!session) return null;

    const user = this.users.get(session.userId);
    return user ? this.sanitizeUser(user) : null;
  }

  isAuthenticated() {
    return this.getCurrentSession() !== null;
  }

  destroySession(sessionId) {
    this.sessions.delete(sessionId);
    localStorage.removeItem('eternum_session');
  }

  logout() {
    const sessionId = localStorage.getItem('eternum_session');
    if (sessionId) {
      this.destroySession(sessionId);
    }
  }

  // Hash password (simple implementation - use bcrypt in production)
  hashPassword(password) {
    // In production, use bcrypt or similar
    return btoa(password);
  }

  // Verify password
  verifyPassword(password, hash) {
    return this.hashPassword(password) === hash;
  }

  // Remove sensitive data from user object
  sanitizeUser(user) {
    const { password, ...sanitized } = user;
    return sanitized;
  }

  getSessionCookie() {
    return localStorage.getItem('eternum_session');
  }

  getUserById(userId) {
    const user = this.users.get(userId);
    return user ? this.sanitizeUser(user) : null;
  }

  updateUserPreferences(userId, preferences) {
    const user = this.users.get(userId);
    if (user) {
      user.preferences = { ...user.preferences, ...preferences };
      this.saveUsers();
      return this.sanitizeUser(user);
    }
    return null;
  }
}

// Initialize auth system
window.authSystem = new AuthSystem();

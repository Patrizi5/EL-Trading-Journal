/**
 * Eternum Trading Journal - Authentication and Admin System
 * Enterprise-level user management with role-based access control
 */

class AuthenticationSystem {
  constructor() {
    this.currentUser = null;
    this.users = this.loadUsers();
    this.sessions = new Map();
    this.auditLog = this.loadAuditLog();
    this.settings = {
      sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
      maxLoginAttempts: 5,
      lockoutDuration: 30 * 60 * 1000, // 30 minutes
      passwordMinLength: 8,
      requireComplexPassword: true,
      enable2FA: false,
    };

    this.init();
  }

  init() {
    // Create default admin user if no users exist
    if (this.users.size === 0) {
      this.createDefaultAdmin();
    }

    // Check for existing session
    this.checkExistingSession();

    // Start session cleanup interval
    setInterval(() => this.cleanupSessions(), 60000); // Clean up every minute
  }

  createDefaultAdmin() {
    const adminUser = {
      id: this.generateId(),
      email: 'admin@eternum.trading',
      password: this.hashPassword('Admin123!'), // Default password (should be changed)
      firstName: 'System',
      lastName: 'Administrator',
      role: 'admin',
      isActive: true,
      emailVerified: true,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      loginAttempts: 0,
      lockedUntil: null,
      preferences: {
        theme: 'dark',
        notifications: true,
        defaultRiskPercent: 2.0,
        defaultAccountSize: 10000,
      },
    };

    this.users.set(adminUser.email, adminUser);
    this.saveUsers();
    this.logEvent('system', 'default_admin_created', { userId: adminUser.id });
  }

  // User Registration
  async registerUser(userData) {
    try {
      const { email, password, firstName, lastName, role = 'user' } = userData;

      // Validation
      if (!this.validateEmail(email)) {
        throw new Error('Invalid email format');
      }

      if (this.users.has(email)) {
        throw new Error('Email already registered');
      }

      if (!this.validatePassword(password)) {
        throw new Error('Password does not meet requirements');
      }

      // Create user
      const user = {
        id: this.generateId(),
        email: email.toLowerCase(),
        password: this.hashPassword(password),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role: role,
        isActive: true,
        emailVerified: false,
        twoFactorEnabled: false,
        twoFactorSecret: null,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        loginAttempts: 0,
        lockedUntil: null,
        preferences: {
          theme: 'dark',
          notifications: true,
          defaultRiskPercent: 2.0,
          defaultAccountSize: 10000,
          preferredMarkets: ['forex', 'crypto'],
        },
        tradingStats: {
          totalTrades: 0,
          totalPnL: 0,
          winRate: 0,
          avgRiskReward: 0,
          bestTrade: 0,
          worstTrade: 0,
          disciplineScore: 100,
        },
      };

      this.users.set(user.email, user);
      this.saveUsers();
      this.logEvent('user', 'registered', { userId: user.id, email: user.email });

      // Send verification email (simulated)
      await this.sendVerificationEmail(user);

      return { success: true, userId: user.id };
    } catch (error) {
      this.logEvent('security', 'registration_failed', {
        email: userData.email,
        error: error.message,
      });
      throw error;
    }
  }

  // User Authentication
  async authenticateUser(email, password) {
    try {
      const user = this.users.get(email.toLowerCase());

      if (!user) {
        this.logEvent('security', 'login_failed', { email, reason: 'user_not_found' });
        throw new Error('Invalid credentials');
      }

      // Check if account is locked
      if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
        this.logEvent('security', 'login_failed', { userId: user.id, reason: 'account_locked' });
        throw new Error('Account temporarily locked due to too many failed attempts');
      }

      // Verify password
      if (!this.verifyPassword(password, user.password)) {
        user.loginAttempts++;

        if (user.loginAttempts >= this.settings.maxLoginAttempts) {
          user.lockedUntil = new Date(Date.now() + this.settings.lockoutDuration).toISOString();
          this.logEvent('security', 'account_locked', {
            userId: user.id,
            attempts: user.loginAttempts,
          });
        }

        this.saveUsers();
        this.logEvent('security', 'login_failed', {
          userId: user.id,
          reason: 'invalid_password',
          attempts: user.loginAttempts,
        });
        throw new Error('Invalid credentials');
      }

      // Reset login attempts on successful login
      user.loginAttempts = 0;
      user.lockedUntil = null;
      user.lastLogin = new Date().toISOString();

      // Create session
      const session = this.createSession(user);

      this.saveUsers();
      this.logEvent('user', 'logged_in', { userId: user.id, sessionId: session.id });

      return { success: true, user: this.sanitizeUser(user), session };
    } catch (error) {
      throw error;
    }
  }

  // Session Management
  createSession(user) {
    const session = {
      id: this.generateId(),
      userId: user.id,
      email: user.email,
      role: user.role,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + this.settings.sessionTimeout).toISOString(),
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
    };

    this.sessions.set(session.id, session);
    this.setSessionCookie(session.id);

    return session;
  }

  validateSession(sessionId) {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return null;
    }

    if (new Date(session.expiresAt) < new Date()) {
      this.sessions.delete(sessionId);
      this.deleteSessionCookie();
      return null;
    }

    // Update session expiration
    session.expiresAt = new Date(Date.now() + this.settings.sessionTimeout).toISOString();

    const user = this.getUserById(session.userId);
    if (!user || !user.isActive) {
      this.sessions.delete(sessionId);
      this.deleteSessionCookie();
      return null;
    }

    this.currentUser = user;
    return session;
  }

  destroySession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      this.logEvent('user', 'logged_out', { userId: session.userId, sessionId });
      this.sessions.delete(sessionId);
    }

    this.deleteSessionCookie();
    this.currentUser = null;
  }

  checkExistingSession() {
    const sessionId = this.getSessionCookie();
    if (sessionId) {
      const validSession = this.validateSession(sessionId);
      if (validSession) {
        this.logEvent('user', 'session_resumed', { userId: validSession.userId, sessionId });
      }
    }
  }

  cleanupSessions() {
    const now = new Date();
    let cleanedCount = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      if (new Date(session.expiresAt) < now) {
        this.sessions.delete(sessionId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.logEvent('system', 'session_cleanup', { cleanedCount });
    }
  }

  // User Management (Admin)
  getAllUsers() {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      throw new Error('Unauthorized access');
    }

    const users = [];
    for (const user of this.users.values()) {
      users.push(this.sanitizeUser(user, true));
    }

    this.logEvent('admin', 'user_list_accessed', { adminId: this.currentUser.id });
    return users;
  }

  updateUser(userId, updates) {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      throw new Error('Unauthorized access');
    }

    let targetUser = null;
    for (const user of this.users.values()) {
      if (user.id === userId) {
        targetUser = user;
        break;
      }
    }

    if (!targetUser) {
      throw new Error('User not found');
    }

    // Apply updates
    if (updates.firstName) targetUser.firstName = updates.firstName;
    if (updates.lastName) targetUser.lastName = updates.lastName;
    if (updates.role) targetUser.role = updates.role;
    if (updates.isActive !== undefined) targetUser.isActive = updates.isActive;
    if (updates.preferences) {
      targetUser.preferences = { ...targetUser.preferences, ...updates.preferences };
    }

    this.saveUsers();
    this.logEvent('admin', 'user_updated', {
      adminId: this.currentUser.id,
      targetUserId: userId,
      updates: Object.keys(updates),
    });

    return { success: true, user: this.sanitizeUser(targetUser, true) };
  }

  deleteUser(userId) {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      throw new Error('Unauthorized access');
    }

    let targetUser = null;
    let targetEmail = null;

    for (const [email, user] of this.users.entries()) {
      if (user.id === userId) {
        targetUser = user;
        targetEmail = email;
        break;
      }
    }

    if (!targetUser) {
      throw new Error('User not found');
    }

    // Prevent deleting own account
    if (targetUser.id === this.currentUser.id) {
      throw new Error('Cannot delete your own account');
    }

    this.users.delete(targetEmail);

    // Remove all user sessions
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        this.sessions.delete(sessionId);
      }
    }

    this.saveUsers();
    this.logEvent('admin', 'user_deleted', { adminId: this.currentUser.id, targetUserId: userId });

    return { success: true };
  }

  // Password Management
  validatePassword(password) {
    if (password.length < this.settings.passwordMinLength) {
      return false;
    }

    if (this.settings.requireComplexPassword) {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

      return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    }

    return true;
  }

  changePassword(userId, oldPassword, newPassword) {
    const user = this.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    if (!this.verifyPassword(oldPassword, user.password)) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password
    if (!this.validatePassword(newPassword)) {
      throw new Error('New password does not meet requirements');
    }

    // Update password
    user.password = this.hashPassword(newPassword);
    this.saveUsers();

    // Invalidate all existing sessions except current
    const currentSessionId = this.getSessionCookie();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.userId === userId && sessionId !== currentSessionId) {
        this.sessions.delete(sessionId);
      }
    }

    this.logEvent('security', 'password_changed', { userId });
    return { success: true };
  }

  // Two-Factor Authentication
  enable2FA(userId) {
    const user = this.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate 2FA secret (in real implementation, use proper 2FA library)
    const secret = this.generateId().substring(0, 16);
    user.twoFactorSecret = secret;
    user.twoFactorEnabled = true;

    this.saveUsers();
    this.logEvent('security', '2fa_enabled', { userId });

    return { success: true, secret };
  }

  disable2FA(userId) {
    const user = this.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;

    this.saveUsers();
    this.logEvent('security', '2fa_disabled', { userId });

    return { success: true };
  }

  // Utility Methods
  generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  hashPassword(password) {
    // In a real application, use bcrypt or similar
    // This is a simplified hash for demonstration
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  verifyPassword(password, hashedPassword) {
    return this.hashPassword(password) === hashedPassword;
  }

  sanitizeUser(user, isAdmin = false) {
    const sanitized = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      preferences: user.preferences || {},
      tradingStats: user.tradingStats || {},
    };

    if (isAdmin) {
      sanitized.loginAttempts = user.loginAttempts;
      sanitized.lockedUntil = user.lockedUntil;
    }

    return sanitized;
  }

  getUserById(userId) {
    for (const user of this.users.values()) {
      if (user.id === userId) {
        return user;
      }
    }
    return null;
  }

  getCurrentUser() {
    return this.currentUser ? this.sanitizeUser(this.currentUser) : null;
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }

  hasRole(role) {
    return this.currentUser && this.currentUser.role === role;
  }

  // Cookie Management
  setSessionCookie(sessionId) {
    const expires = new Date(Date.now() + this.settings.sessionTimeout);
    document.cookie = `eternum_session=${sessionId}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
  }

  getSessionCookie() {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'eternum_session') {
        return value;
      }
    }
    return null;
  }

  deleteSessionCookie() {
    document.cookie = 'eternum_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  getClientIP() {
    // In a real application, this would come from the server
    return '127.0.0.1';
  }

  // Audit Logging
  logEvent(category, action, details = {}) {
    const event = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      category,
      action,
      details,
      userId: this.currentUser ? this.currentUser.id : null,
      ipAddress: this.getClientIP(),
    };

    this.auditLog.push(event);

    // Keep only last 1000 events
    if (this.auditLog.length > 1000) {
      this.auditLog = this.auditLog.slice(-1000);
    }

    this.saveAuditLog();

    // Also log to console in development
    if (window.location.hostname === 'localhost') {
      console.log(`[${category}] ${action}:`, details);
    }
  }

  getAuditLog(limit = 100, category = null) {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      throw new Error('Unauthorized access');
    }

    let events = this.auditLog;

    if (category) {
      events = events.filter((event) => event.category === category);
    }

    return events.slice(-limit);
  }

  // Data Persistence
  loadUsers() {
    try {
      const data = localStorage.getItem('eternum_users');
      return data ? new Map(JSON.parse(data)) : new Map();
    } catch (error) {
      console.error('Error loading users:', error);
      return new Map();
    }
  }

  saveUsers() {
    try {
      localStorage.setItem('eternum_users', JSON.stringify(Array.from(this.users.entries())));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  loadAuditLog() {
    try {
      const data = localStorage.getItem('eternum_audit_log');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading audit log:', error);
      return [];
    }
  }

  saveAuditLog() {
    try {
      localStorage.setItem('eternum_audit_log', JSON.stringify(this.auditLog));
    } catch (error) {
      console.error('Error saving audit log:', error);
    }
  }

  // Email Simulation (in real app, use email service)
  async sendVerificationEmail(user) {
    // Simulate email sending
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Verification email sent to ${user.email}`);
        resolve();
      }, 1000);
    });
  }

  async sendPasswordResetEmail(email) {
    // Simulate email sending
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Password reset email sent to ${email}`);
        resolve();
      }, 1000);
    });
  }
}

// Initialize authentication system
const authSystem = new AuthenticationSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AuthenticationSystem, authSystem };
}

/**
 * Eternum Trading Journal - Main Application
 * Core application logic, state management, and UI controllers
 */

class EternumApp {
  constructor() {
    this.currentSection = 'dashboard';
    this.currentUser = null;
    this.trades = [];
    this.notes = [];
    this.settings = {};
    this.charts = {};

    // Pagination
    this.currentPage = 1;
    this.itemsPerPage = 10;

    // Filters
    this.tradeFilters = {
      market: '',
      outcome: '',
      strategy: '',
      search: '',
    };

    // Performance tracking
    this.performanceData = [];

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.checkAuthentication();
    this.loadUserData();
    this.initializeCharts();

    // Initialize background animation
    if (window.tubesBackground) {
      window.tubesBackground.setIntensity(0.6);
    }

    console.log('Eternum Trading Journal initialized');
  }

  setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const section = e.target.dataset.section;
        if (section) {
          this.showSection(section);
        }
      });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }

    // User menu toggle
    const userMenuBtn = document.getElementById('user-menu-btn');
    const userMenu = document.getElementById('user-menu');

    if (userMenuBtn && userMenu) {
      userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenu.classList.toggle('hidden');
      });

      // Close menu when clicking outside
      document.addEventListener('click', () => {
        userMenu.classList.add('hidden');
      });
    }

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }

    // Authentication modals
    this.setupAuthEventListeners();

    // Trade modal
    this.setupTradeEventListeners();

    // Note modal
    this.setupNoteEventListeners();

    // Settings modal
    this.setupSettingsEventListeners();

    // Filter and search
    this.setupFilterEventListeners();
  }

  setupAuthEventListeners() {
    // Get started button
    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) {
      getStartedBtn.addEventListener('click', () => {
        this.showAuthModal('register');
      });
    }

    // Login button
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        this.showAuthModal('login');
      });
    }

    // Auth form switches
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');

    if (showRegister) {
      showRegister.addEventListener('click', () => {
        this.showAuthModal('register');
      });
    }

    if (showLogin) {
      showLogin.addEventListener('click', () => {
        this.showAuthModal('login');
      });
    }

    // Close modal
    const closeAuthModal = document.getElementById('close-auth-modal');
    const authModal = document.getElementById('auth-modal');

    if (closeAuthModal && authModal) {
      closeAuthModal.addEventListener('click', () => {
        authModal.classList.add('hidden');
      });

      // Close on backdrop click
      authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
          authModal.classList.add('hidden');
        }
      });
    }

    // Form submissions
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }

    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleRegister();
      });
    }
  }

  setupTradeEventListeners() {
    // New trade button
    const newTradeBtn = document.getElementById('new-trade-btn');
    if (newTradeBtn) {
      newTradeBtn.addEventListener('click', () => {
        this.showTradeModal();
      });
    }

    // Close trade modal
    const closeTradeModal = document.getElementById('close-trade-modal');
    const tradeModal = document.getElementById('trade-modal');

    if (closeTradeModal && tradeModal) {
      closeTradeModal.addEventListener('click', () => {
        tradeModal.classList.add('hidden');
      });
    }

    // Cancel trade
    const cancelTrade = document.getElementById('cancel-trade');
    if (cancelTrade && tradeModal) {
      cancelTrade.addEventListener('click', () => {
        tradeModal.classList.add('hidden');
      });
    }

    // Trade form submission
    const tradeForm = document.getElementById('trade-form');
    if (tradeForm) {
      tradeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleTradeSubmission();
      });
    }

    // Position calculator
    this.setupPositionCalculator();
  }

  setupNoteEventListeners() {
    // New note button
    const newNoteBtn = document.getElementById('new-note-btn');
    if (newNoteBtn) {
      newNoteBtn.addEventListener('click', () => {
        this.showNoteModal();
      });
    }

    // Close note modal
    const closeNoteModal = document.getElementById('close-note-modal');
    const noteModal = document.getElementById('note-modal');

    if (closeNoteModal && noteModal) {
      closeNoteModal.addEventListener('click', () => {
        noteModal.classList.add('hidden');
      });
    }

    // Cancel note
    const cancelNote = document.getElementById('cancel-note');
    if (cancelNote && noteModal) {
      cancelNote.addEventListener('click', () => {
        noteModal.classList.add('hidden');
      });
    }

    // Note form submission
    const noteForm = document.getElementById('note-form');
    if (noteForm) {
      noteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleNoteSubmission();
      });
    }

    // Note category buttons
    document.querySelectorAll('.note-category-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        // Update active state
        document
          .querySelectorAll('.note-category-btn')
          .forEach((b) => b.classList.remove('active', 'bg-eternum-blue'));
        btn.classList.add('active', 'bg-eternum-blue');

        // Filter notes
        const category = e.target.dataset.category;
        this.filterNotes(category);
      });
    });
  }

  setupSettingsEventListeners() {
    // Close settings modal
    const closeSettingsModal = document.getElementById('close-settings-modal');
    const settingsModal = document.getElementById('settings-modal');

    if (closeSettingsModal && settingsModal) {
      closeSettingsModal.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
      });
    }

    // Cancel settings
    const cancelSettings = document.getElementById('cancel-settings');
    if (cancelSettings && settingsModal) {
      cancelSettings.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
      });
    }

    // Save settings
    const saveSettings = document.getElementById('save-settings');
    if (saveSettings) {
      saveSettings.addEventListener('click', () => {
        this.handleSettingsSave();
      });
    }
  }

  setupFilterEventListeners() {
    // Market filter
    const marketFilter = document.getElementById('market-filter');
    if (marketFilter) {
      marketFilter.addEventListener('change', (e) => {
        this.tradeFilters.market = e.target.value;
        this.filterTrades();
      });
    }

    // Outcome filter
    const outcomeFilter = document.getElementById('outcome-filter');
    if (outcomeFilter) {
      outcomeFilter.addEventListener('change', (e) => {
        this.tradeFilters.outcome = e.target.value;
        this.filterTrades();
      });
    }

    // Strategy filter
    const strategyFilter = document.getElementById('strategy-filter');
    if (strategyFilter) {
      strategyFilter.addEventListener('change', (e) => {
        this.tradeFilters.strategy = e.target.value;
        this.filterTrades();
      });
    }

    // Search
    const searchTrades = document.getElementById('search-trades');
    if (searchTrades) {
      searchTrades.addEventListener('input', (e) => {
        this.tradeFilters.search = e.target.value.toLowerCase();
        this.filterTrades();
      });
    }

    // Export trades
    const exportTradesBtn = document.getElementById('export-trades-btn');
    if (exportTradesBtn) {
      exportTradesBtn.addEventListener('click', () => {
        this.exportTrades();
      });
    }

    // Pagination
    const prevPage = document.getElementById('prev-page');
    const nextPage = document.getElementById('next-page');

    if (prevPage) {
      prevPage.addEventListener('click', () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.renderTradesTable();
        }
      });
    }

    if (nextPage) {
      nextPage.addEventListener('click', () => {
        const totalPages = Math.ceil(this.getFilteredTrades().length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
          this.currentPage++;
          this.renderTradesTable();
        }
      });
    }
  }

  setupPositionCalculator() {
    const accountSize = document.getElementById('account-size');
    const riskPercent = document.getElementById('risk-percent');
    const stopLossPips = document.getElementById('stop-loss-pips');

    const updateCalculator = () => {
      const size = parseFloat(accountSize?.value) || 0;
      const risk = parseFloat(riskPercent?.value) || 0;
      const sl = parseFloat(stopLossPips?.value) || 0;

      if (size > 0 && risk > 0 && sl > 0) {
        const riskAmount = size * (risk / 100);
        const positionSize = riskAmount / sl;

        const positionSizeEl = document.getElementById('position-size');
        const riskAmountEl = document.getElementById('risk-amount');

        if (positionSizeEl) positionSizeEl.textContent = positionSize.toFixed(2);
        if (riskAmountEl) riskAmountEl.textContent = `$${riskAmount.toFixed(2)}`;
      }
    };

    [accountSize, riskPercent, stopLossPips].forEach((el) => {
      if (el) el.addEventListener('input', updateCalculator);
    });
  }

  // Authentication Methods
  checkAuthentication() {
    if (window.authSystem && window.authSystem.isAuthenticated()) {
      this.currentUser = window.authSystem.getCurrentUser();
      this.showAuthenticatedUI();
    } else {
      this.showUnauthenticatedUI();
    }
  }

  showAuthModal(mode = 'login') {
    const modal = document.getElementById('auth-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (mode === 'login') {
      loginForm?.classList.remove('hidden');
      registerForm?.classList.add('hidden');
    } else {
      loginForm?.classList.add('hidden');
      registerForm?.classList.remove('hidden');
    }

    modal?.classList.remove('hidden');
  }

  async handleLogin() {
    const email = document.getElementById('login-email')?.value;
    const password = document.getElementById('login-password')?.value;

    if (!email || !password) {
      this.showNotification('Please fill in all fields', 'error');
      return;
    }

    try {
      this.showLoading(true);

      if (window.authSystem) {
        const result = await window.authSystem.authenticateUser(email, password);

        if (result.success) {
          this.currentUser = result.user;
          this.showAuthenticatedUI();
          this.loadUserData();
          this.hideAuthModal();
          this.showNotification('Welcome back!', 'success');
        }
      } else {
        // Mock authentication for demo
        this.currentUser = {
          id: 'demo_user',
          email: email,
          firstName: 'Demo',
          lastName: 'User',
          role: 'user',
        };
        this.showAuthenticatedUI();
        this.loadUserData();
        this.hideAuthModal();
        this.showNotification('Welcome back!', 'success');
      }
    } catch (error) {
      this.showNotification(error.message || 'Login failed', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  async handleRegister() {
    const firstName = document.getElementById('register-firstname')?.value;
    const lastName = document.getElementById('register-lastname')?.value;
    const email = document.getElementById('register-email')?.value;
    const password = document.getElementById('register-password')?.value;
    const confirmPassword = document.getElementById('register-confirm')?.value;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      this.showNotification('Please fill in all fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      this.showNotification('Passwords do not match', 'error');
      return;
    }

    try {
      this.showLoading(true);

      if (window.authSystem) {
        const result = await window.authSystem.registerUser({
          firstName,
          lastName,
          email,
          password,
        });

        if (result.success) {
          this.showNotification(
            'Account created successfully! Please check your email to verify.',
            'success'
          );
          this.showAuthModal('login');
        }
      } else {
        // Mock registration
        this.currentUser = {
          id: 'demo_user_' + Date.now(),
          email: email,
          firstName: firstName,
          lastName: lastName,
          role: 'user',
        };
        this.showNotification('Account created successfully!', 'success');
        this.showAuthModal('login');
      }
    } catch (error) {
      this.showNotification(error.message || 'Registration failed', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  hideAuthModal() {
    const modal = document.getElementById('auth-modal');
    modal?.classList.add('hidden');
  }

  showAuthenticatedUI() {
    const welcomeSection = document.getElementById('welcome-section');
    const mainContent = document.querySelector('main');

    welcomeSection?.classList.add('hidden');

    // Update user info
    const userInitial = document.getElementById('user-initial');
    const userName = document.getElementById('user-name');

    if (userInitial && this.currentUser) {
      userInitial.textContent = this.currentUser.firstName.charAt(0).toUpperCase();
    }

    if (userName && this.currentUser) {
      userName.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    }

    // Show dashboard
    this.showSection('dashboard');
  }

  showUnauthenticatedUI() {
    const welcomeSection = document.getElementById('welcome-section');

    // Hide all sections except welcome
    document.querySelectorAll('section[id$="-section"]').forEach((section) => {
      section.classList.add('hidden');
    });

    welcomeSection?.classList.remove('hidden');
  }

  logout() {
    if (window.authSystem) {
      const sessionId = window.authSystem.getSessionCookie();
      if (sessionId) {
        window.authSystem.destroySession(sessionId);
      }
    }

    this.currentUser = null;
    this.trades = [];
    this.notes = [];

    this.showUnauthenticatedUI();
    this.showNotification('Logged out successfully', 'success');
  }

  // Section Management
  showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('section[id$="-section"]').forEach((section) => {
      section.classList.add('hidden');
    });

    // Show target section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
      targetSection.classList.remove('hidden');
      this.currentSection = sectionName;

      // Load section-specific data
      this.loadSectionData(sectionName);
    }

    // Update navigation
    document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach((btn) => {
      btn.classList.remove('text-eternum-blue');
      btn.classList.add('text-gray-300');
    });

    const activeBtn = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeBtn) {
      activeBtn.classList.remove('text-gray-300');
      activeBtn.classList.add('text-eternum-blue');
    }

    // Close mobile menu
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu?.classList.add('hidden');
  }

  loadSectionData(sectionName) {
    switch (sectionName) {
      case 'dashboard':
        this.loadDashboardData();
        break;
      case 'journal':
        this.loadJournalData();
        break;
      case 'charts':
        this.loadChartsData();
        break;
      case 'analytics':
        this.loadAnalyticsData();
        break;
      case 'psychology':
        this.loadPsychologyData();
        break;
      case 'notes':
        this.loadNotesData();
        break;
      case 'admin':
        this.loadAdminData();
        break;
    }
  }

  // Data Loading
  loadUserData() {
    if (!this.currentUser) return;

    // Load trades from localStorage or generate sample data
    const savedTrades = localStorage.getItem('eternum_trades_' + this.currentUser.id);
    if (savedTrades) {
      this.trades = JSON.parse(savedTrades);
    } else {
      // Generate sample trades for demo
      if (window.marketDataManager) {
        this.trades = window.marketDataManager.generateSampleTrades(25);
        this.saveTrades();
      }
    }

    // Load notes
    const savedNotes = localStorage.getItem('eternum_notes_' + this.currentUser.id);
    if (savedNotes) {
      this.notes = JSON.parse(savedNotes);
    } else {
      // Generate sample notes
      this.notes = this.generateSampleNotes();
      this.saveNotes();
    }

    // Load settings
    const savedSettings = localStorage.getItem('eternum_settings_' + this.currentUser.id);
    this.settings = savedSettings ? JSON.parse(savedSettings) : this.getDefaultSettings();
  }

  loadDashboardData() {
    this.updateDashboardStats();
    this.renderPerformanceChart();
    this.renderRecentTrades();
  }

  loadJournalData() {
    this.renderTradesTable();
  }

  loadChartsData() {
    this.initializeTradingView();
    this.updatePositionCalculator();
  }

  loadAnalyticsData() {
    this.renderAnalyticsCharts();
  }

  loadPsychologyData() {
    this.updatePsychologyStats();
    this.renderPsychologyCharts();
  }

  loadNotesData() {
    this.renderNotesGrid();
  }

  loadAdminData() {
    if (this.currentUser?.role === 'admin') {
      this.updateAdminStats();
      this.setupAdminTabs();
    } else {
      this.showNotification('Access denied', 'error');
      this.showSection('dashboard');
    }
  }

  // Dashboard Methods
  updateDashboardStats() {
    if (!this.trades.length) return;

    const totalPnL = this.trades.reduce((sum, trade) => sum + trade.pnl, 0);
    const winningTrades = this.trades.filter((t) => t.outcome === 'win');
    const winRate = (winningTrades.length / this.trades.length) * 100;
    const avgWin = winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length;
    const avgLoss =
      this.trades.filter((t) => t.outcome === 'loss').reduce((sum, t) => sum + t.pnl, 0) /
      this.trades.filter((t) => t.outcome === 'loss').length;
    const riskReward = Math.abs(avgWin / avgLoss);

    // Update DOM elements
    this.updateElement('total-pnl', `$${totalPnL.toFixed(2)}`);
    this.updateElement('win-rate', `${winRate.toFixed(0)}%`);
    this.updateElement('risk-reward', riskReward.toFixed(1));
    this.updateElement('avg-hold-time', '2.5h'); // Mock data
  }

  renderPerformanceChart() {
    const canvas = document.getElementById('performance-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    // Set canvas size
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Generate performance data
    if (!this.performanceData.length && window.marketDataManager) {
      this.performanceData = window.marketDataManager.generatePerformanceData(30);
    }

    if (!this.performanceData.length) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw performance line chart
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;

    const minValue = Math.min(...this.performanceData.map((d) => d.balance));
    const maxValue = Math.max(...this.performanceData.map((d) => d.balance));
    const valueRange = maxValue - minValue;

    // Draw grid
    ctx.strokeStyle = '#2a2f3e';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    // Draw performance line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    this.performanceData.forEach((point, index) => {
      const x = padding + (chartWidth / (this.performanceData.length - 1)) * index;
      const y = padding + chartHeight - ((point.balance - minValue) / valueRange) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw area under curve
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.closePath();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.fill();
  }

  renderRecentTrades() {
    const container = document.getElementById('recent-trades');
    if (!container) return;

    const recentTrades = this.trades.slice(0, 5);

    container.innerHTML = recentTrades
      .map(
        (trade) => `
            <div class="flex items-center justify-between p-3 bg-eternum-gray rounded-lg">
                <div>
                    <div class="font-medium">${trade.symbol}</div>
                    <div class="text-xs text-gray-400">${new Date(
                      trade.date
                    ).toLocaleDateString()}</div>
                </div>
                <div class="text-right">
                    <div class="font-mono ${
                      trade.pnl >= 0 ? 'text-eternum-green' : 'text-eternum-red'
                    }">
                        ${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toFixed(2)}
                    </div>
                    <div class="text-xs text-gray-400">${trade.pips} pips</div>
                </div>
            </div>
        `
      )
      .join('');
  }

  // Trade Management
  showTradeModal() {
    const modal = document.getElementById('trade-modal');
    modal?.classList.remove('hidden');
  }

  hideTradeModal() {
    const modal = document.getElementById('trade-modal');
    modal?.classList.add('hidden');

    // Reset form
    document.getElementById('trade-form')?.reset();
  }

  handleTradeSubmission() {
    const formData = {
      symbol: document.getElementById('trade-market')?.value,
      direction: document.getElementById('trade-direction')?.value,
      entryPrice: parseFloat(document.getElementById('trade-entry')?.value),
      exitPrice: parseFloat(document.getElementById('trade-exit')?.value),
      stopLoss: parseFloat(document.getElementById('trade-sl')?.value),
      takeProfit: parseFloat(document.getElementById('trade-tp')?.value),
      positionSize: parseFloat(document.getElementById('trade-size')?.value),
      strategy: document.getElementById('trade-strategy')?.value,
      timeframe: document.getElementById('trade-timeframe')?.value,
      preEmotion: document.getElementById('trade-pre-emotion')?.value,
      postEmotion: document.getElementById('trade-post-emotion')?.value,
      notes: document.getElementById('trade-notes')?.value,
    };

    // Validate required fields
    if (!formData.symbol || !formData.direction || !formData.entryPrice || !formData.exitPrice) {
      this.showNotification('Please fill in all required fields', 'error');
      return;
    }

    // Calculate P&L and pips
    const isLong = formData.direction === 'long';
    const pnl = isLong
      ? (formData.exitPrice - formData.entryPrice) * formData.positionSize
      : (formData.entryPrice - formData.exitPrice) * formData.positionSize;

    const pips = window.marketDataManager
      ? window.marketDataManager.calculatePips(
          formData.symbol,
          formData.entryPrice,
          formData.exitPrice
        )
      : 0;

    const trade = {
      id: 'trade_' + Date.now(),
      date: new Date().toISOString(),
      ...formData,
      pnl,
      pips,
      outcome: pnl >= 0 ? 'win' : 'loss',
    };

    this.trades.unshift(trade);
    this.saveTrades();

    this.hideTradeModal();
    this.showNotification('Trade recorded successfully!', 'success');

    // Refresh current section if needed
    if (this.currentSection === 'dashboard') {
      this.loadDashboardData();
    } else if (this.currentSection === 'journal') {
      this.renderTradesTable();
    }
  }

  renderTradesTable() {
    const tbody = document.getElementById('trades-table-body');
    if (!tbody) return;

    const filteredTrades = this.getFilteredTrades();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const pageTrades = filteredTrades.slice(startIndex, endIndex);

    tbody.innerHTML = pageTrades
      .map(
        (trade) => `
            <tr class="hover:bg-eternum-light-gray transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    ${new Date(trade.date).toLocaleDateString()}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    ${trade.symbol}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span class="px-2 py-1 text-xs rounded-full ${
                      trade.direction === 'long'
                        ? 'bg-eternum-green bg-opacity-20 text-eternum-green'
                        : 'bg-eternum-red bg-opacity-20 text-eternum-red'
                    }">
                        ${trade.direction.toUpperCase()}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                    ${trade.entryPrice}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                    ${trade.exitPrice}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono ${
                  trade.pnl >= 0 ? 'text-eternum-green' : 'text-eternum-red'
                }">
                    ${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toFixed(2)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                    ${(trade.pnl > 0
                      ? Math.abs(trade.pnl / (trade.entryPrice - trade.stopLoss))
                      : 0
                    ).toFixed(1)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button class="text-eternum-blue hover:text-eternum-cyan mr-2" onclick="app.editTrade('${
                      trade.id
                    }')">Edit</button>
                    <button class="text-eternum-red hover:text-red-400" onclick="app.deleteTrade('${
                      trade.id
                    }')">Delete</button>
                </td>
            </tr>
        `
      )
      .join('');

    // Update pagination info
    this.updateElement(
      'trades-showing',
      `${startIndex + 1}-${Math.min(endIndex, filteredTrades.length)}`
    );
    this.updateElement('trades-total', filteredTrades.length.toString());

    // Update pagination buttons
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    if (prevBtn) prevBtn.disabled = this.currentPage === 1;
    if (nextBtn) nextBtn.disabled = endIndex >= filteredTrades.length;
  }

  getFilteredTrades() {
    return this.trades.filter((trade) => {
      if (
        this.tradeFilters.market &&
        !trade.symbol.toLowerCase().includes(this.tradeFilters.market)
      ) {
        return false;
      }

      if (this.tradeFilters.outcome && trade.outcome !== this.tradeFilters.outcome) {
        return false;
      }

      if (this.tradeFilters.strategy && trade.strategy !== this.tradeFilters.strategy) {
        return false;
      }

      if (this.tradeFilters.search) {
        const searchTerm = this.tradeFilters.search;
        return (
          trade.symbol.toLowerCase().includes(searchTerm) ||
          trade.notes?.toLowerCase().includes(searchTerm) ||
          trade.strategy?.toLowerCase().includes(searchTerm)
        );
      }

      return true;
    });
  }

  filterTrades() {
    this.currentPage = 1;
    this.renderTradesTable();
  }

  editTrade(tradeId) {
    this.showNotification('Edit functionality coming soon!', 'info');
  }

  deleteTrade(tradeId) {
    if (confirm('Are you sure you want to delete this trade?')) {
      this.trades = this.trades.filter((trade) => trade.id !== tradeId);
      this.saveTrades();
      this.renderTradesTable();
      this.showNotification('Trade deleted successfully', 'success');
    }
  }

  // Notes Management
  showNoteModal() {
    const modal = document.getElementById('note-modal');
    modal?.classList.remove('hidden');
  }

  hideNoteModal() {
    const modal = document.getElementById('note-modal');
    modal?.classList.add('hidden');

    // Reset form
    document.getElementById('note-form')?.reset();
  }

  handleNoteSubmission() {
    const title = document.getElementById('note-title')?.value;
    const category = document.getElementById('note-category')?.value;
    const content = document.getElementById('note-content')?.value;
    const tags = document.getElementById('note-tags')?.value;

    if (!title || !content) {
      this.showNotification('Please fill in title and content', 'error');
      return;
    }

    const note = {
      id: 'note_' + Date.now(),
      title,
      category,
      content,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.notes.unshift(note);
    this.saveNotes();

    this.hideNoteModal();
    this.showNotification('Note created successfully!', 'success');

    if (this.currentSection === 'notes') {
      this.renderNotesGrid();
    }
  }

  renderNotesGrid() {
    const container = document.getElementById('notes-grid');
    if (!container) return;

    const filteredNotes = this.getFilteredNotes();

    container.innerHTML = filteredNotes
      .map(
        (note) => `
            <div class="glass-effect rounded-lg p-6 card-hover">
                <div class="flex items-start justify-between mb-4">
                    <h3 class="text-lg font-semibold text-white">${note.title}</h3>
                    <span class="text-xs px-2 py-1 rounded-full bg-eternum-blue bg-opacity-20 text-eternum-blue">
                        ${note.category}
                    </span>
                </div>
                <p class="text-gray-300 text-sm mb-4 line-clamp-3">
                    ${note.content.substring(0, 150)}${note.content.length > 150 ? '...' : ''}
                </p>
                <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-400">
                        ${new Date(note.createdAt).toLocaleDateString()}
                    </span>
                    <div class="flex space-x-2">
                        <button class="text-eternum-blue hover:text-eternum-cyan text-sm" onclick="app.editNote('${
                          note.id
                        }')">Edit</button>
                        <button class="text-eternum-red hover:text-red-400 text-sm" onclick="app.deleteNote('${
                          note.id
                        }')">Delete</button>
                    </div>
                </div>
                ${
                  note.tags.length > 0
                    ? `
                    <div class="flex flex-wrap gap-1 mt-3">
                        ${note.tags
                          .map(
                            (tag) => `
                            <span class="text-xs px-2 py-1 rounded-full bg-eternum-gray text-gray-300">
                                ${tag}
                            </span>
                        `
                          )
                          .join('')}
                    </div>
                `
                    : ''
                }
            </div>
        `
      )
      .join('');
  }

  getFilteredNotes() {
    const activeCategory = document.querySelector('.note-category-btn.active')?.dataset.category;

    if (!activeCategory || activeCategory === 'all') {
      return this.notes;
    }

    return this.notes.filter((note) => note.category === activeCategory);
  }

  filterNotes(category) {
    this.renderNotesGrid();
  }

  editNote(noteId) {
    this.showNotification('Edit functionality coming soon!', 'info');
  }

  deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
      this.notes = this.notes.filter((note) => note.id !== noteId);
      this.saveNotes();
      this.renderNotesGrid();
      this.showNotification('Note deleted successfully', 'success');
    }
  }

  // Charts and Analytics
  initializeCharts() {
    // Initialize chart.js or other charting library
    // This is a placeholder for chart initialization
  }

  initializeTradingView() {
    if (window.TradingView && !this.charts.tradingView) {
      const container = document.getElementById('tradingview-chart');
      if (container) {
        this.charts.tradingView = new window.TradingView.widget({
          container_id: 'tradingview-chart',
          width: '100%',
          height: 600,
          symbol: 'FX_IDC:EURUSD',
          interval: '1D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#1a1f2e',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: 'tradingview-chart',
        });
      }
    }
  }

  renderAnalyticsCharts() {
    // Render overview and strategy performance charts
    this.renderOverviewChart();
    this.renderStrategyChart();
  }

  renderOverviewChart() {
    const canvas = document.getElementById('overview-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mock chart rendering
    ctx.fillStyle = '#3b82f6';
    ctx.font = '14px Inter';
    ctx.fillText('Performance Analytics', 20, 30);
  }

  renderStrategyChart() {
    const canvas = document.getElementById('strategy-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mock chart rendering
    ctx.fillStyle = '#10b981';
    ctx.font = '14px Inter';
    ctx.fillText('Strategy Performance', 20, 30);
  }

  renderPsychologyCharts() {
    this.renderEmotionsChart();
    this.renderDecisionChart();
  }

  renderEmotionsChart() {
    const canvas = document.getElementById('emotions-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mock chart rendering
    ctx.fillStyle = '#8b5cf6';
    ctx.font = '14px Inter';
    ctx.fillText('Emotional Patterns', 20, 30);
  }

  renderDecisionChart() {
    const canvas = document.getElementById('decision-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mock chart rendering
    ctx.fillStyle = '#f59e0b';
    ctx.font = '14px Inter';
    ctx.fillText('Decision Quality', 20, 30);
  }

  updatePsychologyStats() {
    // Mock psychology stats
    this.updateElement('discipline-score', '78%');
    this.updateElement('emotional-balance', 'Good');
    this.updateElement('impulse-score', 'Low');
    this.updateElement('confidence-level', 'High');
  }

  updateAdminStats() {
    // Mock admin stats
    this.updateElement('total-users', '1,247');
    this.updateElement('active-users', '892');
    this.updateElement('total-trades', '15,634');
    this.updateElement('system-uptime', '99.9%');
  }

  setupAdminTabs() {
    document.querySelectorAll('.admin-tab-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const tab = e.target.dataset.tab;
        this.showAdminTab(tab);
      });
    });
  }

  showAdminTab(tabName) {
    // Hide all admin tabs
    document.querySelectorAll('.admin-tab-content').forEach((tab) => {
      tab.classList.add('hidden');
    });

    // Show target tab
    const targetTab = document.getElementById(`admin-${tabName}-tab`);
    if (targetTab) {
      targetTab.classList.remove('hidden');
    }

    // Update tab buttons
    document.querySelectorAll('.admin-tab-btn').forEach((btn) => {
      btn.classList.remove('border-eternum-blue', 'text-eternum-blue');
      btn.classList.add('border-transparent', 'text-gray-400');
    });

    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeBtn) {
      activeBtn.classList.remove('border-transparent', 'text-gray-400');
      activeBtn.classList.add('border-eternum-blue', 'text-eternum-blue');
    }
  }

  // Utility Methods
  updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }

  showNotification(message, type = 'info') {
    const container = document.getElementById('notifications-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification glass-effect rounded-lg p-4 mb-2 transform transition-all duration-300 ${
      type === 'success'
        ? 'border-l-4 border-eternum-green'
        : type === 'error'
        ? 'border-l-4 border-eternum-red'
        : type === 'warning'
        ? 'border-l-4 border-eternum-yellow'
        : 'border-l-4 border-eternum-blue'
    }`;

    notification.innerHTML = `
            <div class="flex items-center justify-between">
                <span class="text-sm">${message}</span>
                <button class="ml-4 text-gray-400 hover:text-white" onclick="this.parentElement.parentElement.remove()">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;

    container.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  showLoading(show = true) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.classList.toggle('hidden', !show);
    }
  }

  toggleTheme() {
    // Theme toggle implementation
    this.showNotification('Theme toggle coming soon!', 'info');
  }

  showSettings() {
    const modal = document.getElementById('settings-modal');
    modal?.classList.remove('hidden');
    this.loadSettings();
  }

  showProfile() {
    this.showNotification('Profile management coming soon!', 'info');
  }

  exportData() {
    const data = {
      trades: this.trades,
      notes: this.notes,
      settings: this.settings,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `eternum-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
    this.showNotification('Data exported successfully!', 'success');
  }

  exportTrades() {
    if (!this.trades.length) {
      this.showNotification('No trades to export', 'warning');
      return;
    }

    const csv = this.convertTradesToCSV(this.trades);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `trades-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
    this.showNotification('Trades exported successfully!', 'success');
  }

  convertTradesToCSV(trades) {
    const headers = [
      'Date',
      'Symbol',
      'Direction',
      'Entry Price',
      'Exit Price',
      'Position Size',
      'P&L',
      'Pips',
      'Strategy',
      'Outcome',
    ];
    const rows = trades.map((trade) => [
      new Date(trade.date).toLocaleDateString(),
      trade.symbol,
      trade.direction,
      trade.entryPrice,
      trade.exitPrice,
      trade.positionSize,
      trade.pnl,
      trade.pips,
      trade.strategy || '',
      trade.outcome,
    ]);

    return [headers, ...rows].map((row) => row.join(',')).join('\n');
  }

  loadSettings() {
    if (!this.currentUser) return;

    document.getElementById('settings-firstname').value = this.currentUser.firstName || '';
    document.getElementById('settings-lastname').value = this.currentUser.lastName || '';
    document.getElementById('settings-email').value = this.currentUser.email || '';

    const prefs = this.currentUser.preferences || {};
    document.getElementById('settings-account-size').value = prefs.defaultAccountSize || 10000;
    document.getElementById('settings-risk-percent').value = prefs.defaultRiskPercent || 2.0;
    document.getElementById('settings-markets').value = (prefs.preferredMarkets || []).join(', ');
  }

  handleSettingsSave() {
    this.showNotification('Settings saved successfully!', 'success');
    document.getElementById('settings-modal')?.classList.add('hidden');
  }

  // Data Persistence
  saveTrades() {
    if (this.currentUser) {
      localStorage.setItem('eternum_trades_' + this.currentUser.id, JSON.stringify(this.trades));
    }
  }

  saveNotes() {
    if (this.currentUser) {
      localStorage.setItem('eternum_notes_' + this.currentUser.id, JSON.stringify(this.notes));
    }
  }

  saveSettings() {
    if (this.currentUser) {
      localStorage.setItem(
        'eternum_settings_' + this.currentUser.id,
        JSON.stringify(this.settings)
      );
    }
  }

  getDefaultSettings() {
    return {
      theme: 'dark',
      notifications: true,
      defaultRiskPercent: 2.0,
      defaultAccountSize: 10000,
      preferredMarkets: ['forex', 'crypto'],
    };
  }

  generateSampleNotes() {
    return [
      {
        id: 'note_1',
        title: 'EUR/USD Analysis',
        category: 'market-analysis',
        content:
          'EUR/USD showing strong resistance at 1.0850 level. Looking for potential breakout above this level with target at 1.0900. Key support remains at 1.0800.',
        tags: ['forex', 'eurusd', 'technical-analysis'],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'note_2',
        title: 'Trading Rules Reminder',
        category: 'strategy',
        content:
          'Always wait for confirmation before entering trades. Never risk more than 2% per trade. Stick to the plan and avoid emotional decisions.',
        tags: ['risk-management', 'discipline', 'rules'],
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: 'note_3',
        title: 'Weekly Review',
        category: 'reflection',
        content:
          'Good week overall with 3 wins and 1 loss. Stuck to my trading plan well. Need to work on taking profits too early.',
        tags: ['weekly-review', 'performance', 'improvement'],
        createdAt: new Date(Date.now() - 604800000).toISOString(),
        updatedAt: new Date(Date.now() - 604800000).toISOString(),
      },
    ];
  }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new EternumApp();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EternumApp };
}

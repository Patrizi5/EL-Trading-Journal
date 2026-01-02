/**
 * Trade List Component
 * Displays comprehensive list of trades with filtering, sorting, and actions
 */

class TradeListComponent {
  constructor() {
    this.trades = [];
    this.filteredTrades = [];
    this.currentPage = 1;
    this.itemsPerPage = 20;
    this.sortBy = 'date';
    this.sortOrder = 'desc';
    this.filters = {
      market: '',
      outcome: '',
      strategy: '',
      dateRange: { start: null, end: null },
      search: '',
    };
  }

  render(containerSelector, trades) {
    this.trades = trades;
    this.applyFilters();

    const container = document.querySelector(containerSelector);
    if (!container) return;

    const html = `
            <div class="w-full">
                <!-- Filters and Controls -->
                <div class="glass-effect rounded-lg p-6 mb-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Market</label>
                            <select class="trade-market-filter w-full bg-eternum-gray border border-eternum-light-gray rounded-lg px-4 py-2 text-white focus:outline-none focus:border-eternum-blue">
                                <option value="">All Markets</option>
                                <option value="forex">Forex</option>
                                <option value="crypto">Crypto</option>
                                <option value="stocks">Stocks</option>
                                <option value="indices">Indices</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Outcome</label>
                            <select class="trade-outcome-filter w-full bg-eternum-gray border border-eternum-light-gray rounded-lg px-4 py-2 text-white focus:outline-none focus:border-eternum-blue">
                                <option value="">All Outcomes</option>
                                <option value="win">Win</option>
                                <option value="loss">Loss</option>
                                <option value="break-even">Break Even</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Strategy</label>
                            <select class="trade-strategy-filter w-full bg-eternum-gray border border-eternum-light-gray rounded-lg px-4 py-2 text-white focus:outline-none focus:border-eternum-blue">
                                <option value="">All Strategies</option>
                                <option value="swing">Swing Trading</option>
                                <option value="day">Day Trading</option>
                                <option value="scalp">Scalping</option>
                                <option value="position">Position Trading</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                            <select class="trade-sort-by w-full bg-eternum-gray border border-eternum-light-gray rounded-lg px-4 py-2 text-white focus:outline-none focus:border-eternum-blue">
                                <option value="date">Date</option>
                                <option value="pnl">Profit/Loss</option>
                                <option value="symbol">Symbol</option>
                                <option value="pips">Pips</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="flex gap-4">
                        <div class="flex-1">
                            <input type="text" class="trade-search w-full bg-eternum-gray border border-eternum-light-gray rounded-lg px-4 py-2 text-white focus:outline-none focus:border-eternum-blue" placeholder="Search trades...">
                        </div>
                        <button class="trade-reset-filters glass-effect px-6 py-2 rounded-lg hover:bg-eternum-light-gray transition-colors">
                            Reset Filters
                        </button>
                    </div>
                </div>

                <!-- Trades Table -->
                <div class="glass-effect rounded-lg overflow-hidden">
                    <table class="w-full">
                        <thead class="bg-eternum-gray">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Market</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Direction</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Entry</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Exit</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Size</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">P&L</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">%</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="trade-list-body" class="divide-y divide-eternum-light-gray">
                            ${this.renderTableRows()}
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="flex items-center justify-between mt-6">
                    <div class="text-sm text-gray-400">
                        Showing ${(this.currentPage - 1) * this.itemsPerPage + 1}-${Math.min(
      this.currentPage * this.itemsPerPage,
      this.filteredTrades.length
    )} of ${this.filteredTrades.length} trades
                    </div>
                    <div class="flex space-x-2">
                        <button class="trade-prev-btn glass-effect px-3 py-2 rounded-lg hover:bg-eternum-light-gray transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            Previous
                        </button>
                        <button class="trade-next-btn glass-effect px-3 py-2 rounded-lg hover:bg-eternum-light-gray transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        `;

    container.innerHTML = html;
    this.attachEventListeners(container);
  }

  renderTableRows() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const pageTrades = this.filteredTrades.slice(startIndex, endIndex);

    return pageTrades
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
                    ${parseFloat(trade.entryPrice).toFixed(4)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                    ${parseFloat(trade.exitPrice).toFixed(4)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">
                    ${parseFloat(trade.positionSize).toFixed(2)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono ${
                  trade.pnl >= 0 ? 'text-eternum-green' : 'text-eternum-red'
                }">
                    ${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toFixed(2)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono ${
                  trade.pnl >= 0 ? 'text-eternum-green' : 'text-eternum-red'
                }">
                    ${trade.pnl >= 0 ? '+' : ''}${(
          (trade.pnl / (trade.entryPrice * trade.positionSize)) *
          100
        ).toFixed(2)}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button class="text-eternum-blue hover:text-eternum-cyan" data-trade-id="${
                      trade.id
                    }" onclick="app.editTrade('${trade.id}')">View</button>
                    <button class="text-eternum-red hover:text-red-400" data-trade-id="${
                      trade.id
                    }" onclick="app.deleteTrade('${trade.id}')">Delete</button>
                </td>
            </tr>
        `
      )
      .join('');
  }

  applyFilters() {
    this.filteredTrades = this.trades.filter((trade) => {
      if (
        this.filters.market &&
        !trade.symbol.toLowerCase().includes(this.filters.market.toLowerCase())
      ) {
        return false;
      }

      if (this.filters.outcome && trade.outcome !== this.filters.outcome) {
        return false;
      }

      if (this.filters.strategy && trade.strategy !== this.filters.strategy) {
        return false;
      }

      if (this.filters.search) {
        const searchTerm = this.filters.search.toLowerCase();
        return (
          trade.symbol.toLowerCase().includes(searchTerm) ||
          trade.notes?.toLowerCase().includes(searchTerm) ||
          trade.strategy?.toLowerCase().includes(searchTerm)
        );
      }

      return true;
    });

    this.applySort();
    this.currentPage = 1;
  }

  applySort() {
    this.filteredTrades.sort((a, b) => {
      let aVal, bVal;

      switch (this.sortBy) {
        case 'date':
          aVal = new Date(a.date).getTime();
          bVal = new Date(b.date).getTime();
          break;
        case 'pnl':
          aVal = a.pnl;
          bVal = b.pnl;
          break;
        case 'symbol':
          aVal = a.symbol;
          bVal = b.symbol;
          break;
        case 'pips':
          aVal = a.pips || 0;
          bVal = b.pips || 0;
          break;
        default:
          aVal = new Date(a.date).getTime();
          bVal = new Date(b.date).getTime();
      }

      if (this.sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }

  attachEventListeners(container) {
    container.querySelector('.trade-market-filter')?.addEventListener('change', (e) => {
      this.filters.market = e.target.value;
      this.applyFilters();
      this.updateTable(container);
    });

    container.querySelector('.trade-outcome-filter')?.addEventListener('change', (e) => {
      this.filters.outcome = e.target.value;
      this.applyFilters();
      this.updateTable(container);
    });

    container.querySelector('.trade-strategy-filter')?.addEventListener('change', (e) => {
      this.filters.strategy = e.target.value;
      this.applyFilters();
      this.updateTable(container);
    });

    container.querySelector('.trade-search')?.addEventListener('input', (e) => {
      this.filters.search = e.target.value;
      this.applyFilters();
      this.updateTable(container);
    });

    container.querySelector('.trade-sort-by')?.addEventListener('change', (e) => {
      this.sortBy = e.target.value;
      this.applySort();
      this.updateTable(container);
    });

    container.querySelector('.trade-reset-filters')?.addEventListener('click', () => {
      this.filters = {
        market: '',
        outcome: '',
        strategy: '',
        dateRange: { start: null, end: null },
        search: '',
      };
      container.querySelector('.trade-market-filter').value = '';
      container.querySelector('.trade-outcome-filter').value = '';
      container.querySelector('.trade-strategy-filter').value = '';
      container.querySelector('.trade-search').value = '';
      this.applyFilters();
      this.updateTable(container);
    });

    container.querySelector('.trade-prev-btn')?.addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updateTable(container);
      }
    });

    container.querySelector('.trade-next-btn')?.addEventListener('click', () => {
      const totalPages = Math.ceil(this.filteredTrades.length / this.itemsPerPage);
      if (this.currentPage < totalPages) {
        this.currentPage++;
        this.updateTable(container);
      }
    });
  }

  updateTable(container) {
    const tbody = container.querySelector('#trade-list-body');
    if (tbody) {
      tbody.innerHTML = this.renderTableRows();
    }

    const prevBtn = container.querySelector('.trade-prev-btn');
    const nextBtn = container.querySelector('.trade-next-btn');
    const totalPages = Math.ceil(this.filteredTrades.length / this.itemsPerPage);

    if (prevBtn) prevBtn.disabled = this.currentPage === 1;
    if (nextBtn) nextBtn.disabled = this.currentPage >= totalPages;
  }
}

window.TradeListComponent = TradeListComponent;

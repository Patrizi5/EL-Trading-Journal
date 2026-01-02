// Helper to generate OCC-style option symbols and simple option chain entries
function padStrike(strike) {
  // OCC format uses strike*1000 with leading zeros to fixed width
  const v = Math.round(strike * 1000).toString();
  return v.padStart(8, '0');
}

export function generateOptionSymbol(underlying, expirationYYYYMMDD, strike, type) {
  // type = 'C' or 'P'
  const y = expirationYYYYMMDD.slice(2); // YYMMDD
  const strikeCode = padStrike(strike);
  return `${underlying}${y}${type}${strikeCode}`;
}

export function buildOptionChain({ underlying, expirations = [], strikes = [], type = 'C' }) {
  const chain = [];
  expirations.forEach((exp) => {
    strikes.forEach((s) => {
      chain.push({ symbol: generateOptionSymbol(underlying, exp, s, type), underlying, expiration: exp, strike: s, type });
    });
  });
  return chain;
}

export default { generateOptionSymbol, buildOptionChain };

import React from 'react';

export function ExportCSV() {
  const unlock = () => {
    window.open('https://gumroad.com/l/eternum-pro/29', '_blank');
    localStorage.setItem('pro', '1');
  };

  if (localStorage.getItem('pro')) {
    return <button onClick={downloadCSV}>Export CSV</button>;
  }

  return <button onClick={unlock}>Export CSV (Pro - $29)</button>;
}

function downloadCSV() {
  const rows = [['Market','Side','Entry','Exit','PnL']];
  const blob = new Blob([rows.map(r => r.join(',')).join('\n')], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  Object.assign(document.createElement('a'),{ href:url, download:'eternum.csv'}).click();
}
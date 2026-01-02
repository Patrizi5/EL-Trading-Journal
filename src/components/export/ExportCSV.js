import React from 'react';

export default function ExportCSV({ data, filename = 'export.csv' }) {
  const download = () => {
    const csv =
      data && data.length
        ? [Object.keys(data[0]).join(',')]
            .concat(data.map((r) => Object.values(r).join(',')))
            .join('\n')
        : '';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={download} className="btn">
      Export CSV
    </button>
  );
}

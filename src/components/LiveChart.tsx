export default function LiveChart({ symbol }: { symbol: string }) {
  return (
    <div className="w-full h-96 mt-4 bg-gray-900 rounded p-2">
      <iframe
        src={`https://s.tradingview.com/widgetembed/?symbol=${symbol}&interval=5&theme=dark`}
        className="w-full h-full"
        frameBorder="0"
      />
    </div>
  );
}
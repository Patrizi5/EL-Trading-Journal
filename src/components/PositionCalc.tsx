import { useState } from 'react';

export default function PositionCalc() {
  const [risk, setRisk] = useState('1');
  const [stop, setStop] = useState('');
  const [account, setAccount] = useState('1000');
  const [price, setPrice] = useState('');

  const riskAmt = (Number(account) * Number(risk)) / 100;
  const size = stop && price ? (riskAmt / Math.abs(Number(price) - Number(stop))).toFixed(2) : '0';

  return (
    <div className="bg-gray-900 p-4 rounded mb-4 text-white">
      <h2 className="font-bold mb-2">Position Size</h2>
      <div className="grid grid-cols-2 gap-2">
        <input
          className="text-black px-2"
          placeholder="Account $"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
        />
        <input
          className="text-black px-2"
          placeholder="Risk %"
          value={risk}
          onChange={(e) => setRisk(e.target.value)}
        />
        <input
          className="text-black px-2"
          placeholder="Entry price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          className="text-black px-2"
          placeholder="Stop price"
          value={stop}
          onChange={(e) => setStop(e.target.value)}
        />
      </div>
      <div className="mt-2 text-green-400">
        Size: <span className="font-bold">{size}</span> units
      </div>
    </div>
  );
}

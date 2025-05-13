// components/fantasy/Transactions.js
export default function Transactions({ transactions }) {
  if (!transactions || !transactions.length) return null;

  return (
    <div className="space-y-2">
      {transactions.map((t, index) => (
        <p key={index} className="text-sm text-gray-600">
          {t.date}: {t.type === 'Trade'
            ? `${t.teams[0]} traded ${t.exchanged[t.teams[0]].join(', ')} to ${t.teams[1]} for ${t.exchanged[t.teams[1]].join(', ')}`
            : `${t.team} ${t.type.toLowerCase()}ped ${t.player}`}
        </p>
      ))}
    </div>
  );
}

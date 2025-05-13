// components/fantasy/Notifications.js
export default function Notifications({ roster }) {
  const alerts = roster
    .filter(p => p.injury || p.bye)
    .map(p => ({
      name: p.name,
      status: p.injury ? `Injured - ${p.injury}` : 'Bye Week',
      className: p.injury ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
    }));

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Team Alerts</h3>
      <div className="space-y-2">
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <div key={index} className={`p-2 rounded-md text-sm ${alert.className}`}>
              {alert.name}: {alert.status}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600">No injuries or bye weeks for your players.</p>
        )}
      </div>
    </div>
  );
}

// components/fantasy/RecentActivity.js
export default function RecentActivity({ data }) {
  if (!data || !data.length) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Recent Activity</h3>
      <div className="space-y-2">
        {data.map((item, index) => (
          <p key={index} className="text-sm text-gray-600">
            {item.date}: {item.description}
          </p>
        ))}
      </div>
    </div>
  );
} 

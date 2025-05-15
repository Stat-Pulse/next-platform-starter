// utils/logActivity.js
export function logActivity(action) {
  const existing = JSON.parse(localStorage.getItem('activityLog') || '[]');
  const updated = [
    { action, timestamp: new Date().toISOString() },
    ...existing.slice(0, 9) // Keep the latest 10
  ];
  localStorage.setItem('activityLog', JSON.stringify(updated));
}
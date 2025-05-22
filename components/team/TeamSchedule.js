// components/team/TeamSchedule.js
const TeamSchedule = ({ teamId }) => {
  // Fetch schedule data for the team using an API call
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Team Schedule</h2>
      <p>Schedule for {teamId} - Coming Soon</p>
    </div>
  );
};
export default TeamSchedule;
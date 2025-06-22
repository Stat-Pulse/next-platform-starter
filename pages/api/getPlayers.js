// pages/api/getPlayers.js
export default async function handler(req, res) {
  res.status(200).json([{ id: '00-0035676', player_name: 'A.J. Brown' }]);
}
// pages/api/player/[id].js

export default function handler(req, res) {
  res.status(200).json({
    message: "It works!",
    playerId: req.query.id,
    time: new Date().toISOString()
  });
}
// pages/api/players.js
import depth from '../../public/data/rb_depth.json'

export default function handler(req, res) {
  // Turn each { team, position, starter, backup } into two players
  const players = depth.flatMap((d) => [
    { name: d.starter.name, position: d.position, team: d.team },
    { name: d.backup.name,  position: d.position, team: d.team },
  ])

  // Optional: remove duplicates by name
  const unique = Array.from(
    new Map(players.map(p => [p.name, p])).values()
  )

  res.status(200).json(unique)
}

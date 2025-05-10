// pages/api/players.js
import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  // Resolve the path to public/data/rb_depth.json
  const filePath = path.join(process.cwd(), 'public', 'data', 'rb_depth.json')
  // Read & parse the file
  const json = fs.readFileSync(filePath, 'utf8')
  const depth = JSON.parse(json)

  // Flatten starter + backup into {name,position,team}
  const players = depth.flatMap(d => [
    { name: d.starter.name, position: d.position, team: d.team },
    { name: d.backup.name,  position: d.position, team: d.team },
  ])

  // Dedupe by name
  const unique = Array.from(
    new Map(players.map(p => [p.name, p])).values()
  )

  res.status(200).json(unique)
}

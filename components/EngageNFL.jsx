'use client'

import { useState } from 'react'

export default function EngageNFL() {
  const [pollResult, setPollResult] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([])
  const [simulation, setSimulation] = useState(null)

  const handlePollSubmit = (e) => {
    e.preventDefault()
    setPollResult('Simulation: Mahomes 40%, Burrow 35%, Allen 25%')
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (!commentText) return
    const newComment = {
      text: commentText,
      date: new Date().toLocaleDateString()
    }
    setComments([newComment, ...comments])
    setCommentText('')
  }

  const handleSimulateGame = () => {
    setSimulation('Simulation: Bengals 27, Patriots 24')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* MVP Poll */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Poll: Who&apos;s the 2025 MVP?</h3>
        <form onSubmit={handlePollSubmit}>
          <label className="block mb-2"><input type="radio" name="mvp" value="Mahomes" /> Patrick Mahomes</label>
          <label className="block mb-2"><input type="radio" name="mvp" value="Burrow" /> Joe Burrow</label>
          <label className="block mb-2"><input type="radio" name="mvp" value="Allen" /> Josh Allen</label>
          <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700">Vote</button>
        </form>
        {pollResult && <p className="text-gray-600 mt-4">{pollResult}</p>}
      </div>

      {/* Depth Chart Example */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Interactive Depth Chart</h3>
        <p className="text-gray-600 mb-4">Explore the Bengals&apos; depth chart (sample).</p>
        <div className="text-gray-700">
          <p>QB1: Joe Burrow</p>
          <p>QB2: Jake Browning</p>
        </div>
      </div>

      {/* Game Simulator */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Game Simulator</h3>
        <p className="text-gray-600 mb-4">Simulate Week 1 outcomes.</p>
        <button onClick={handleSimulateGame} className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700">Run Simulation</button>
        {simulation && <p className="text-gray-600 mt-4">{simulation}</p>}
      </div>

      {/* Comments */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Join the Discussion</h3>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            className="w-full p-2 border rounded-md mb-2"
            placeholder="Share your thoughts..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
          ></textarea>
          <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700">Post Comment</button>
        </form>
        <div className="mt-4 space-y-4">
          {comments.map((comment, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-700">{comment.text}</p>
              <p className="text-sm text-gray-500">Posted on {comment.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

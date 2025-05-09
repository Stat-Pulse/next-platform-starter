// components/InteractiveSection.jsx
import { useState } from 'react'

export default function InteractiveSection() {
  const [pollChoice, setPollChoice] = useState('')
  const [pollSubmitted, setPollSubmitted] = useState(false)
  const [pollResult, setPollResult] = useState('')
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')

  const handlePollSubmit = (e) => {
    e.preventDefault()
    setPollSubmitted(true)
    // Mock results calculation
    setTimeout(() => {
      setPollResult('Results: Mahomes 40%, Burrow 35%, Allen 25%')
    }, 1000)
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    const newComment = { id: Date.now(), text: commentText }
    setComments([newComment, ...comments])
    setCommentText('')
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Engage with the NFL</h2>

        {/* Poll */}
        <div className="bg-gray-100 p-6 rounded-lg shadow mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Poll: Who&apos;s the 2025 MVP?</h3>
          {!pollSubmitted ? (
            <form id="pollForm" onSubmit={handlePollSubmit}>
              <label className="block mb-2">
                <input
                  type="radio"
                  name="mvp"
                  value="Mahomes"
                  checked={pollChoice === 'Mahomes'}
                  onChange={(e) => setPollChoice(e.target.value)}
                  className="mr-2"
                />
                Patrick Mahomes
              </label>
              <label className="block mb-2">
                <input
                  type="radio"
                  name="mvp"
                  value="Burrow"
                  checked={pollChoice === 'Burrow'}
                  onChange={(e) => setPollChoice(e.target.value)}
                  className="mr-2"
                />
                Joe Burrow
              </label>
              <label className="block mb-2">
                <input
                  type="radio"
                  name="mvp"
                  value="Allen"
                  checked={pollChoice === 'Allen'}
                  onChange={(e) => setPollChoice(e.target.value)}
                  className="mr-2"
                />
                Josh Allen
              </label>
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
              >
                Vote
              </button>
            </form>
          ) : (
            <p id="pollResult" className="text-gray-600 mt-4">{pollResult}</p>
          )}
        </div>

        {/* Depth Chart */}
        <div className="bg-gray-100 p-6 rounded-lg shadow mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Interactive Depth Chart</h3>
          <p className="text-gray-600 mb-4">Explore the Bengals&apos; depth chart (sample).</p>
          <div id="depthChart" className="text-gray-700 space-y-1">
            <p>QB1: Joe Burrow</p>
            <p>QB2: Jake Browning</p>
          </div>
        </div>

        {/* Comments */}
        <div className="bg-gray-100 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Join the Discussion</h3>
          <form id="commentForm" onSubmit={handleCommentSubmit}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Share your thoughts..."
              required
            />
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
            >
              Post Comment
            </button>
          </form>
          <div id="comments" className="mt-4 space-y-4">
            {comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment.id} className="bg-white p-4 rounded-lg shadow">
                  <p className="text-gray-700">{comment.text}</p>
                  <p className="text-sm text-gray-500">Posted on {new Date(comment.id).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

export default function VideoContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Game Highlights */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Game Highlights</h3>
        <div className="aspect-w-16 aspect-h-9 mb-4">
          <iframe
            src="https://www.youtube.com/embed/sample-video"
            frameBorder="0"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
        <p className="text-gray-600">Week 1 highlights.</p>
      </div>

      {/* NFL Podcast */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">NFL Podcast</h3>
        <p className="text-gray-600 mb-4">
          Listen to ESPN's First Draft.{' '}
          <a
            href="https://www.espn.com/espnradio/podcast"
            className="text-red-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Listen now
          </a>
        </p>
        <p className="text-sm text-gray-500">External Link</p>
      </div>
    </div>
  )
}

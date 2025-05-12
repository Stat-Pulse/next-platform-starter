import SectionWrapper from '@/components/SectionWrapper'

export default function MediaVault() {
  return (
    <SectionWrapper title="Media Vault">
      <p className="text-gray-600 mb-4">Highlight videos and press conferences</p>
      <div className="aspect-video">
        <iframe
          className="w-full h-full rounded"
          src="https://www.youtube.com/embed/VIDEO_ID_HERE"
          title="NFL Highlight"
          frameBorder="0"
          allowFullScreen
        />
      </div>
    </SectionWrapper>
  )
}

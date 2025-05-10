export default function SectionWrapper({ title, children, bg = 'white' }) {
  const bgClass = bg === 'gray' ? 'bg-gray-100' : 'bg-white'
  return (
    <section className={`${bgClass} p-6 rounded-lg shadow`}>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">{title}</h2>
      {children}
    </section>
  )
}

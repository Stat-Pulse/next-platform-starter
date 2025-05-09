// pages/index.js
import { useState } from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Card from '../components/Card'
import Modal from '../components/Modal'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div>
      <NavBar />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">
          StatPulse Analytics
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Users" value="1,234" />
          <Card title="Sessions" value="5,678" />
          <Card title="Revenue" value="$12,345" />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 bg-blue-500 text-white p-2 rounded"
        >
          Open Modal
        </button>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl">Welcome to StatPulse!</h2>
          <p className="mt-2">This is a sample modal.</p>
        </Modal>
      </main>
      <Footer />
    </div>
  )
}

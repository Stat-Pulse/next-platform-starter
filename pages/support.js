import { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function Support() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      category: 'Account Management',
      items: [
        {
          question: 'How do I create an account?',
          answer: 'Click &quot;Forgot Password&quot; on the login page, enter your email...',
        },
        {
          question: 'How do I reset my password?',
          answer: 'Click &quot;Forgot Password&quot; on the login page, enter your email, and follow the link sent to reset your password.',
        },
      ],
    },
    {
      category: 'App Features',
      items: [
        {
          question: 'How do I use the Stat Tracker?',
          answer: 'Navigate to the Stats page, select a player or team, and view real-time performance metrics. Customize filters for specific stats.',
        },
      ],
    },
    {
      category: 'Data & Stats',
      items: [
        {
          question: 'Why are some stats not updating?',
          answer: 'Ensure your app is updated and check your internet connection. Stats may also lag during high server load; check our System Status for updates.',
        },
      ],
    },
    {
      category: 'Technical Issues',
      items: [
        {
          question: 'Why is the app not loading?',
          answer: 'Try clearing your browser cache, updating your browser, or switching to a different network. Contact support if the issue persists.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-gray-800 text-white">
        <NavBar />
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-8">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-center text-gray-800 mb-6">
          Support
        </h1>

        {/* Search Bar */}
        <section className="mb-8">
          <input
            type="text"
            placeholder="Search FAQs, guides, or support topics..."
            className="input w-full max-w-lg mx-auto block"
          />
        </section>

        {/* FAQs */}
        <section className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-4">Frequently Asked Questions</h2>
          {faqs.map((category, catIndex) => (
            <div key={catIndex} className="mb-4">
              <h3 className="text-xl font-bold text-gray-600 mb-2">{category.category}</h3>
              {category.items.map((faq, faqIndex) => {
                const index = `${catIndex}-${faqIndex}`;
                return (
                  <div key={index} className="border-b border-gray-200 py-2">
                    <button
                      className="w-full text-left flex justify-between items-center text-gray-600 font-semibold"
                      onClick={() => toggleFaq(index)}
                    >
                      {faq.question}
                      <span>{openFaq === index ? '−' : '+'}</span>
                    </button>
                    {openFaq === index && <p className="text-gray-600 mt-2">{faq.answer}</p>}
                  </div>
                );
              })}
            </div>
          ))}
        </section>

        {/* User Guides */}
        <section className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-4">User Guides</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-600">Getting Started</h3>
              <ol className="list-decimal list-inside text-gray-600">
                <li>Create an account via the Sign Up page.</li>
                <li>Explore the Stats page to view QB analytics.</li>
                <li>Customize your profile in the Settings section.</li>
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-600">Using the Stat Tracker</h3>
              <p className="text-gray-600">
                Select a player from the Stats page, apply filters for metrics like passing yards or touchdowns, and save your preferences for quick access.
              </p>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-4">Troubleshooting</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>
              <strong>App not loading:</strong> Clear browser cache, check your internet, or try a different browser.
            </li>
            <li>
              <strong>Login issues:</strong> Verify your email and password, or use &quot;Forgot Password&quot; to reset.
            </li>
            <li>
              <strong>Data not updating:</strong> Ensure the app is updated and check <a href="/status" className="text-primary hover:underline">System Status</a>.
            </li>
          </ul>
        </section>

        {/* Contact Us */}
        <section className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-4">Contact Us</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-600 font-semibold mb-1" htmlFor="name">Name</label>
              <input type="text" id="name" className="input w-full" />
            </div>
            <div>
              <label className="block text-gray-600 font-semibold mb-1" htmlFor="email">Email</label>
              <input type="email" id="email" className="input w-full" />
            </div>
            <div>
              <label className="block text-gray-600 font-semibold mb-1" htmlFor="subject">Subject</label>
              <input type="text" id="subject" className="input w-full" />
            </div>
            <div>
              <label className="block text-gray-600 font-semibold mb-1" htmlFor="message">Message</label>
              <textarea id="message" className="input w-full h-32" />
            </div>
            <div>
              <label className="block text-gray-600 font-semibold mb-1" htmlFor="attachment">Attach Screenshot (Optional)</label>
              <input type="file" id="attachment" className="w-full text-gray-600" />
            </div>
            <button type="submit" className="btn">Submit</button>
          </form>
          <p className="text-gray-600 mt-4">
            Email: <a href="mailto:support@statpulse.com" className="text-primary hover:underline">support@statpulse.com</a>
          </p>
          <p className="text-gray-600">
            Follow us on <a href="https://twitter.com/StatPulseNFL" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">X</a>: @StatPulseNFL
          </p>
          <p className="text-gray-600">
            Community Forum: <a href="/forum" className="text-primary hover:underline">Join our community</a> for peer support.
          </p>
          <p className="text-gray-600 mt-4">Support Hours: 9 AM–5 PM EST, Monday–Friday</p>
          <p className="text-gray-600">Expected Response Time: 24–48 hours</p>
        </section>

        {/* System Status */}
        <section className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-4">System Status</h2>
          <p className="text-gray-600">
            Check the current status of our servers and data feeds at{' '}
            <a href="/status" className="text-primary hover:underline">System Status</a>.
          </p>
        </section>

        {/* Legal Links */}
        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-4">Legal</h2>
          <p className="text-gray-600">
            <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
          </p>
          <p className="text-gray-600">
            <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <Footer />
      </footer>
    </div>
  );
}

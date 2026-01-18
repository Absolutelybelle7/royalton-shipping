import { MessageCircle, Phone, Mail, HelpCircle } from 'lucide-react';
import { Link } from '../components/Router';

export function SupportPage() {
  const faqs = [
    {
      question: 'How do I track my package?',
      answer: 'You can track your package by entering your tracking number on our Track page. You\'ll receive real-time updates on your shipment\'s location and estimated delivery time.',
    },
    {
      question: 'What are your shipping rates?',
      answer: 'Shipping rates vary based on service type, package weight, and destination. Use our Quote Calculator to get an instant price estimate for your specific shipment.',
    },
    {
      question: 'How long does international shipping take?',
      answer: 'International shipping typically takes 5-7 business days for standard service, 3-5 days for express, and 1-2 days for priority express. Actual delivery times may vary based on customs clearance.',
    },
    {
      question: 'Can I schedule a pickup?',
      answer: 'Yes! You can schedule a pickup through our Ship a Package page. Simply select your preferred pickup date and time, and we\'ll come to your location.',
    },
    {
      question: 'What items are prohibited from shipping?',
      answer: 'Prohibited items include hazardous materials, illegal substances, weapons, and perishable goods without proper packaging. Contact our support team for a complete list.',
    },
    {
      question: 'How do I file a claim for a lost or damaged package?',
      answer: 'Contact our support team with your tracking number and details of the issue. We\'ll investigate and process your claim within 5-7 business days.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="relative h-64 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.pexels.com/photos/3184431/pexels-photo-3184431.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Support Center</h1>
            <p className="text-xl">We're here to help 24/7</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <Phone className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-600 mb-4">24/7 phone support</p>
            <a href="tel:+1-800-TRACKXPRESS" className="text-orange-500 font-semibold">
              +1-800-ROYALTON GOLD SECURITY AND SHIPPING
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <Mail className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-600 mb-4">Response within 24 hours</p>
            <a href="mailto:support@royalton.com" className="text-orange-500 font-semibold">
              support@royalton.com
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <MessageCircle className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Instant assistance</p>
            <button className="text-orange-500 font-semibold">Start Chat</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <HelpCircle className="h-8 w-8 mr-3 text-orange-500" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-xl mb-8">Our support team is ready to assist you with any questions</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/track"
              className="bg-white text-orange-500 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              Track Package
            </Link>
            <Link
              to="/quote"
              className="bg-orange-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-orange-700 transition-colors"
            >
              Get Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

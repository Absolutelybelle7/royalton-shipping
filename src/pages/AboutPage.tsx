import { Package, Users, Globe, Award } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-3xl px-4">
            <h1 className="text-5xl font-bold mb-4">About Royalton Gold Security and Shipping</h1>
            <p className="text-xl">
              Leading the future of global logistics with reliable, transparent, and innovative shipping solutions
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 1998, Royalton Gold Security and Shipping has grown from a small local courier service to one of the world's most trusted logistics partners. Our journey has been driven by a simple mission: to make shipping simple, reliable, and transparent for everyone.
            </p>
            <p className="text-gray-600 mb-4">
              With over 25 years of experience, we've built a global network that spans 180+ countries, delivering millions of packages every year. Our commitment to innovation and customer service has made us the preferred choice for businesses and individuals worldwide.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              To connect people and businesses around the world through reliable, efficient, and sustainable shipping solutions. We believe that every package carries more than just goods—it carries trust, expectations, and opportunities.
            </p>
            <p className="text-gray-600">
              We're committed to reducing our environmental impact while expanding our services, investing in green technologies, and supporting the communities we serve.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <Package className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-orange-500 mb-2">10M+</h3>
            <p className="text-gray-600">Packages Delivered</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <Globe className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-orange-500 mb-2">100+</h3>
            <p className="text-gray-600">Countries Served</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <Users className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-orange-500 mb-2">500+</h3>
            <p className="text-gray-600">Team Members</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <Award className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-orange-500 mb-2">98%</h3>
            <p className="text-gray-600">Customer Satisfaction</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Reliability</h3>
              <p className="text-gray-300">
                We deliver on our promises, every single time. Your trust is our most valuable asset.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-300">
                Constantly evolving our technology and processes to provide better service.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
              <p className="text-gray-300">
                Committed to reducing our environmental footprint and building a greener future.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

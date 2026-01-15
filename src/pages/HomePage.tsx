import { useState, useEffect, useRef } from 'react';
import { Search, Package, Truck, Globe, Zap, MapPin, Calculator, Clock, Ship, ArrowRight } from 'lucide-react';
import { Link } from '../components/Router';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import shipVid from '../assets/videos/ship.vid.low.3.mp4';
import shipVid2 from '../assets/videos/shipvid.low.2.mp4';



export function HomePage() {
  // Multiple videos for looping
  const videos = [shipVid, shipVid2];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video end event to loop to next video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    };

    video.addEventListener('ended', handleVideoEnd);
    
    // Load and play the current video
    video.load();
    video.play().catch((error: Error) => {
      // Ignore AbortError which occurs when video load is interrupted by a new video load
      if (error.name !== 'AbortError') {
        console.error('Error playing video:', error);
      }
    });

    return () => {
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, [currentVideoIndex, videos.length]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // CountUp component wrapper
  function CountUpNumber({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
    const [startCount, setStartCount] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !startCount) {
            setStartCount(true);
          }
        },
        { threshold: 0.5 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, [startCount]);

    return (
      <div ref={ref}>
        {startCount ? (
          <CountUp
            start={0}
            end={end}
            duration={2.5}
            suffix={suffix}
            prefix={prefix}
          />
        ) : (
          <span>0{suffix}</span>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Video Background */}
      <div className="relative h-[700px] overflow-hidden">
        {/* Video Background - Looping through multiple videos */}
        <video
          ref={videoRef}
          key={currentVideoIndex}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videos[currentVideoIndex]} type="video/mp4" />
        </video>

        {/* Overlay with reduced opacity to show video */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-gray-900/40 to-gray-900/50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 opacity-10 blur-3xl transform rotate-45 translate-x-32 -translate-y-32"></div>
        </div>

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInLeft}
              className="text-white max-w-3xl"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-2 bg-orange-500 rounded-full text-sm font-semibold mb-4"
              >
                World Best Transport Service
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl font-bold mb-4 leading-tight"
              >
                We Providing Reliable
                <br />
                <span className="text-orange-500">Shipping & Logistic </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-300 mb-6"
              >
                Trusted by Top Logistics Companies Worldwide
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  to="/quote"
                  className="inline-block bg-orange-500 hover:bg-orange-600 text-brand-900 px-8 py-4 rounded-md font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  REQUEST A QUOTE
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

          {/* About Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
      >
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">About Us</h2>
              <p className="text-gray-600 mb-4">We provide reliable, end-to-end logistics services with a global network and local expertise. Our team ensures secure, timely delivery and responsive customer support.</p>
              <Link to="/about" className="inline-block bg-orange-500 hover:bg-orange-600 text-brand-900 px-6 py-3 rounded-md font-semibold">Learn More</Link>
            </div>
            <div className="hidden md:block">
              <img src="https://images.pexels.com/photos/386009/pexels-photo-386009.jpeg?auto=compress&cs=tinysrgb&w=800" alt="About" className="w-full h-44 object-cover rounded-md shadow-sm" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Storage Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16"
      >
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Storage Solutions</h3>
              <p className="text-gray-600 mb-4">Flexible warehousing, inventory management, and distribution services to keep your supply chain efficient and secure.</p>
              <Link to="/services/freight" className="inline-block bg-orange-500 hover:bg-orange-600 text-brand-900 px-6 py-3 rounded-md font-semibold">Explore Storage</Link>
            </div>
            <div>
              <img src="https://images.pexels.com/photos/1030896/pexels-photo-1030896.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Storage" className="w-full h-44 object-cover rounded-md shadow-sm" />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Quick Tools Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Tools</h2>
          <p className="text-gray-600">Everything you need to ship and track your packages</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
        >
          {[
            { icon: Search, title: 'Track Shipment', desc: 'Monitor your package in real-time', to: '/track' },
            { icon: Package, title: 'Schedule Pickup', desc: 'Book a pickup for your shipment', to: '/ship' },
            { icon: MapPin, title: 'Find Location', desc: 'Locate drop-off points near you', to: '/locations' },
            { icon: Calculator, title: 'Shipping Calculator', desc: 'Get instant pricing quotes', to: '/quote' },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Link
                to={item.to}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all text-center group block"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4 group-hover:bg-orange-500 transition-colors transform group-hover:scale-110">
                  <item.icon className="h-8 w-8 text-orange-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Services Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">SPECIALIZED IN THE TRANSPORTATION</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Specialist Logistics Services</h2>
            <p className="text-gray-600">Comprehensive shipping solutions for every need</p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                to: '/services/domestic',
                image: 'https://images.pexels.com/photos/3821667/pexels-photo-3821667.jpeg?auto=compress&cs=tinysrgb&w=800',
                title: 'Road Transport',
                desc: 'Fast and reliable shipping within your country',
                icon: Truck,
              },
              {
                to: '/services/international',
                image: 'https://images.pexels.com/photos/4391470/pexels-photo-4391470.jpeg?auto=compress&cs=tinysrgb&w=800',
                title: 'Sea Transport',
                desc: 'Global reach with customs expertise',
                icon: Ship,
              },
              {
                to: '/services/express',
                image: 'https://images.pexels.com/photos/76969/cold-front-warm-front-front-weather-76969.jpeg?auto=compress&cs=tinysrgb&w=800',
                title: 'Air Freight',
                desc: 'Lightning-fast delivery for time-sensitive shipments',
                icon: Zap,
              },
              {
                to: '/services/freight',
                image: 'https://images.pexels.com/photos/4467677/pexels-photo-4467677.jpeg?auto=compress&cs=tinysrgb&w=800',
                title: 'Freight & Cargo',
                desc: 'Heavy shipments and bulk logistics',
                icon: Package,
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all group"
              >
                <Link to={service.to} className="block">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                      <service.icon className="h-6 w-6 text-orange-500 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{service.desc}</p>
                    <span className="text-orange-500 font-semibold text-sm inline-flex items-center group-hover:translate-x-2 transition-transform">
                      READ MORE <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Statistics Section with CountUp */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
          className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-white mb-16 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 opacity-10 blur-3xl"></div>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              {[
                { number: 25, suffix: '+', label: 'Years of Experience' },
                { number: 180, suffix: '+', label: 'Countries Covered' },
                { number: 98, suffix: '%', label: 'On-Time Delivery' },
                { number: 10, suffix: 'M+', label: 'Packages Delivered' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, type: 'spring' }}
                  className="transform hover:scale-110 transition-transform"
                >
                  <div className="text-5xl font-bold text-orange-500 mb-2">
                    <CountUpNumber end={stat.number} suffix={stat.suffix} />
                  </div>
                  <div className="text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">HOW IT WORKS</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">3 Easy Steps to Task</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Background Map Effect */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <svg viewBox="0 0 1000 500" className="w-full h-full">
                <path d="M0,250 Q250,100 500,250 T1000,250" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>

            {[
              { number: '01', icon: Package, title: 'Enter Your & Product Details' },
              { number: '02', icon: Calculator, title: 'Pay Your Service Charges' },
              { number: '03', icon: Globe, title: 'Ready to Send Your Goods' },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="relative text-center"
              >
                <div className="relative inline-flex flex-col items-center">
                  <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg transform hover:rotate-360 transition-transform duration-500">
                    {step.number}
                  </div>
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-md">
                    <step.icon className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-orange-200 transform -translate-x-1/2">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-orange-500 rounded-full"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <Link
              to="/quote"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md font-semibold transition-colors"
            >
              READ MORE
            </Link>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="bg-orange-500 rounded-2xl p-12 text-white text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-4"
            >
              <Clock className="h-16 w-16 mx-auto" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
            <p className="text-xl mb-6">Our support team is available 24/7</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/support"
                className="bg-white text-orange-500 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Support
              </Link>
              <Link
                to="/support#faq"
                className="bg-orange-600 text-brand-900 px-8 py-3 rounded-md font-semibold hover:bg-orange-700 transition-colors"
              >
                View FAQs
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

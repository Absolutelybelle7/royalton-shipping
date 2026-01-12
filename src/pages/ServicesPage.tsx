import { Truck, Globe, Zap, Package, ArrowRight } from 'lucide-react';
import { Link } from '../components/Router';
import { motion } from 'framer-motion';

export function ServicesPage() {
  const services = [
    {
      id: 'domestic',
      name: 'Road Transport',
      icon: Truck,
      color: 'from-blue-500 to-blue-600',
      image: 'https://images.pexels.com/photos/3821667/pexels-photo-3821667.jpeg?auto=compress&cs=tinysrgb&w=1200',
      description: 'Fast and reliable shipping within your country with guaranteed delivery times.',
      features: [
        'Same-day and next-day delivery options',
        'Door-to-door service',
        'Real-time tracking',
        'Flexible pickup times',
        'Insurance included',
      ],
      pricing: 'Starting at $5/kg',
    },
    {
      id: 'international',
      name: 'Sea Transport',
      icon: Globe,
      color: 'from-green-500 to-green-600',
      image: 'https://images.pexels.com/photos/4391470/pexels-photo-4391470.jpeg?auto=compress&cs=tinysrgb&w=1200',
      description: 'Global reach with expert customs clearance and documentation support.',
      features: [
        'Customs documentation assistance',
        '180+ countries covered',
        'Duty and tax calculation',
        'Multi-language support',
        'Consolidated shipping options',
      ],
      pricing: 'Starting at $15/kg',
    },
    {
      id: 'express',
      name: 'Air Freight',
      icon: Zap,
      color: 'from-red-500 to-red-600',
      image: 'https://images.pexels.com/photos/76969/cold-front-warm-front-front-weather-76969.jpeg?auto=compress&cs=tinysrgb&w=1200',
      description: 'Lightning-fast delivery for time-sensitive shipments with priority handling.',
      features: [
        'Same-day delivery available',
        'Priority processing',
        'Dedicated support team',
        'Guaranteed on-time delivery',
        'Premium packaging',
      ],
      pricing: 'Starting at $25/kg',
    },
    {
      id: 'freight',
      name: 'Freight & Cargo',
      icon: Package,
      color: 'from-orange-500 to-orange-600',
      image: 'https://images.pexels.com/photos/4467677/pexels-photo-4467677.jpeg?auto=compress&cs=tinysrgb&w=1200',
      description: 'Heavy shipments and bulk logistics with specialized handling and equipment.',
      features: [
        'Palletized shipping',
        'Container services',
        'Specialized equipment',
        'Warehousing solutions',
        'Route optimization',
      ],
      pricing: 'Starting at $10/kg',
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative h-64 bg-cover bg-center overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.pexels.com/photos/4391470/pexels-photo-4391470.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white relative z-10">
            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold mb-4"
            >
              Our Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl"
            >
              Comprehensive shipping solutions for every need
            </motion.p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={service.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.2
                    }
                  }
                }}
                className={`flex flex-col ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-8 items-center`}
              >
                <motion.div
                  variants={isEven ? fadeInLeft : fadeInRight}
                  whileHover={{ scale: 1.05 }}
                  className="flex-1 w-full"
                >
                  <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl group">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-6 left-6 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-orange-500 transition-colors shadow-lg">
                      <Icon className="h-8 w-8 text-orange-500 group-hover:text-white transition-colors" />
                    </div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                      <p className="text-sm opacity-90">{service.description}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={isEven ? fadeInRight : fadeInLeft}
                  className="flex-1 w-full"
                >
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-gray-900 mb-4"
                  >
                    {service.name}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-lg text-gray-600 mb-6"
                  >
                    {service.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mb-6"
                  >
                    <h3 className="font-semibold text-gray-900 mb-3">Features:</h3>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                          className="flex items-start"
                        >
                          <span className="text-orange-500 mr-2 font-bold">✓</span>
                          <span className="text-gray-600">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center justify-between mb-6"
                  >
                    <div>
                      <p className="text-sm text-gray-600">Pricing</p>
                      <p className="text-2xl font-bold text-orange-500">{service.pricing}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9 }}
                    className="flex gap-4"
                  >
                    <Link
                      to="/quote"
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md font-semibold text-center transition-all transform hover:scale-105 shadow-md hover:shadow-lg inline-flex items-center justify-center"
                    >
                      Get Quote
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <Link
                      to="/ship"
                      className="flex-1 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 hover:border-orange-500 px-6 py-3 rounded-md font-semibold text-center transition-all transform hover:scale-105 inline-flex items-center justify-center"
                    >
                      Book Now
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-white text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 opacity-10 blur-3xl"></div>
          <div className="relative">
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold mb-4"
            >
              Need a Custom Solution?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-xl mb-8"
            >
              Our team can create tailored shipping solutions for your unique requirements
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                to="/support"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Contact Us
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, FileQuestion, Book, Phone, MessageCircle, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SEOManager from '@/components/seo/SEOManager';
import { Link } from 'react-router-dom';

const Support = () => {
  const supportOptions = [
    {
      icon: FileQuestion,
      title: 'FAQ',
      description: 'Find quick answers to common questions.',
      action: 'Browse FAQ',
      link: '/faq',
      gradient: 'from-blue-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10',
      hoverGradient: 'group-hover:from-blue-500/30 group-hover:to-cyan-500/30',
      iconColor: 'text-blue-500',
    },
    {
      icon: Book,
      title: 'Documentation',
      description: 'Detailed guides to master all features.',
      action: 'View Guides',
      link: '/about',
      gradient: 'from-purple-500/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-500/10',
      hoverGradient: 'group-hover:from-purple-500/30 group-hover:to-pink-500/30',
      iconColor: 'text-purple-500',
    },
  ];

  const contactOptions = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'kamleshguptaom4@gmail.com',
      link: 'mailto:kamleshguptaom4@gmail.com',
      gradient: 'from-orange-500/20 to-red-500/20 dark:from-orange-500/10 dark:to-red-500/10',
      hoverGradient: 'group-hover:from-orange-500/30 group-hover:to-red-500/30',
      iconColor: 'text-orange-500',
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: '+91 1234567890',
      link: 'tel:+911234567890',
      gradient: 'from-green-500/20 to-emerald-500/20 dark:from-green-500/10 dark:to-emerald-500/10',
      hoverGradient: 'group-hover:from-green-500/30 group-hover:to-emerald-500/30',
      iconColor: 'text-green-500',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: '+91 1234567890',
      link: 'https://wa.me/911234567890',
      gradient: 'from-teal-500/20 to-cyan-500/20 dark:from-teal-500/10 dark:to-cyan-500/10',
      hoverGradient: 'group-hover:from-teal-500/30 group-hover:to-cyan-500/30',
      iconColor: 'text-teal-500',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-4 sm:p-8">
      <SEOManager
        title="Support - GreetingInvite Help Center"
        description="Need help creating or sharing your greeting? Contact us or explore our guides and FAQs."
      />

      {/* Floating background bubbles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-2xl"
          style={{
            width: `${Math.random() * 120 + 40}px`,
            height: `${Math.random() * 120 + 40}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: Math.random() * 8 + 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="relative max-w-5xl mx-auto z-10">
        {/* Back Button */}
        <Link to="/">
          <Button variant="outline" className="mb-6 group bg-white hover:border-primary">
            <span className="mr-2 group-hover:animate-bounce">←</span>
            Back to Home
          </Button>
        </Link>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl mb-6 inline-block"
          >
            💬
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're here to support you every step of the way. Choose a way to connect with us below.
          </p>
        </motion.div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {supportOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -6 }}
              >
                <Card className={`h-full bg-gradient-to-br ${option.gradient} ${option.hoverGradient} border border-white/20 dark:border-white/10 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer`}>
                  <Link to={option.link}>
                    <CardContent className="p-8 text-center">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.15 }}
                        transition={{ duration: 0.6 }}
                        className={`w-20 h-20 bg-gradient-to-br ${option.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                      >
                        <Icon className={`w-10 h-10 ${option.iconColor}`} />
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {option.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 text-lg">{option.description}</p>
                      <Button variant="outline" className="group-hover:bg-primary/20 group-hover:border-primary transition-all">
                        {option.action}
                      </Button>
                    </CardContent>
                  </Link>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Contact Options */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8 text-primary">Contact Us Directly</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                >
                  <a href={option.link} target={option.link.startsWith('http') ? '_blank' : undefined} rel={option.link.startsWith('http') ? 'noopener noreferrer' : undefined}>
                    <Card className={`h-full bg-gradient-to-br ${option.gradient} ${option.hoverGradient} border border-white/20 dark:border-white/10 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer`}>
                      <CardContent className="p-8 text-center">
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.15 }}
                          transition={{ duration: 0.6 }}
                          className={`w-20 h-20 bg-gradient-to-br ${option.gradient} rounded-full flex items-center justify-center mx-auto mb-6`}
                        >
                          <Icon className={`w-10 h-10 ${option.iconColor}`} />
                        </motion.div>
                        <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                          {option.title}
                        </h3>
                        <p className="text-muted-foreground text-lg font-medium break-all">{option.description}</p>
                      </CardContent>
                    </Card>
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-4 text-lg">
            Still need help? We're always happy to assist.
          </p>
          <motion.a
            href="mailto:kamleshguptaom4@gmail.com"
            whileHover={{ scale: 1.1 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-2xl transition-all"
          >
            <Heart className="w-5 h-5 animate-pulse" />
            Contact Support
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};

export default Support;

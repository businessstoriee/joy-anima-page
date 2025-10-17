import React from 'react';
import { motion } from 'framer-motion';
import { Mail, FileQuestion, Book, Phone, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SEOManager from '@/components/seo/SEOManager';
import { Link } from 'react-router-dom';

const Support = () => {
  const supportOptions = [
    {
      icon: FileQuestion,
      title: 'FAQ',
      description: 'Find quick answers to common questions',
      action: 'Browse FAQ',
      link: '/faq',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      hoverGradient: 'group-hover:from-blue-500/30 group-hover:to-cyan-500/30',
      iconColor: 'text-blue-500',
    },
    {
      icon: Book,
      title: 'Documentation',
      description: 'Detailed guides on all features',
      action: 'View Guides',
      link: '/about',
      gradient: 'from-purple-500/20 to-pink-500/20',
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
      gradient: 'from-orange-500/20 to-red-500/20',
      hoverGradient: 'group-hover:from-orange-500/30 group-hover:to-red-500/30',
      iconColor: 'text-orange-500',
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: '+91 1234567890',
      link: 'tel:+911234567890',
      gradient: 'from-green-500/20 to-emerald-500/20',
      hoverGradient: 'group-hover:from-green-500/30 group-hover:to-emerald-500/30',
      iconColor: 'text-green-500',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: '+91 1234567890',
      link: 'https://wa.me/911234567890',
      gradient: 'from-teal-500/20 to-cyan-500/20',
      hoverGradient: 'group-hover:from-teal-500/30 group-hover:to-cyan-500/30',
      iconColor: 'text-teal-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4 sm:p-8">
      <SEOManager
        title="Support - Get Help with Beautiful Greetings"
        description="Need help? Our support team is here for you. Contact us for assistance with creating and sharing your greeting cards."
      />

      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" className="mb-6 group">
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
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're here to support you every step of the way. Reach out to us through your preferred channel.
          </p>
        </motion.div>

        {/* Support Options */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {supportOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className={`h-full border-2 border-transparent hover:border-primary/50 transition-all duration-300 group cursor-pointer bg-gradient-to-br ${option.gradient} ${option.hoverGradient} shadow-lg hover:shadow-2xl`}>
                  <Link to={option.link}>
                    <CardContent className="p-8 text-center">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className={`w-20 h-20 bg-gradient-to-br ${option.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-shadow`}
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
        </motion.div>

        {/* Contact Options */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8">Contact Us Directly</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <a href={option.link} target={option.link.startsWith('http') ? '_blank' : undefined} rel={option.link.startsWith('http') ? 'noopener noreferrer' : undefined}>
                    <Card className={`h-full border-2 border-transparent hover:border-primary/50 transition-all duration-300 group cursor-pointer bg-gradient-to-br ${option.gradient} ${option.hoverGradient} shadow-lg hover:shadow-2xl`}>
                      <CardContent className="p-8 text-center">
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                          className={`w-20 h-20 bg-gradient-to-br ${option.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-shadow`}
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
        </motion.div>
      </div>
    </div>
  );
};

export default Support;

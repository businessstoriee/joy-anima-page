import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Share2, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import SEOManager from '@/components/seo/SEOManager';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: [
        'Basic account information (name, email) when you create greetings',
        'Content you create including text, images, and customization preferences',
        'Usage data to improve our service and user experience',
        'Device and browser information for optimization purposes',
      ],
    },
    {
      icon: Lock,
      title: 'How We Protect Your Data',
      content: [
        'Industry-standard encryption for all data transmission',
        'Secure cloud storage with regular backups',
        'Strict access controls and authentication measures',
        'Regular security audits and updates',
      ],
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: [
        'To provide and maintain our greeting card service',
        'To personalize your experience and improve our features',
        'To send important service updates and notifications',
        'To analyze usage patterns and enhance performance',
      ],
    },
    {
      icon: Share2,
      title: 'Sharing Your Greetings',
      content: [
        'You have full control over greeting visibility (public/private)',
        'Public greetings may appear in our community feed',
        'We never share your personal information with third parties',
        'Shared links are unique and can be managed by you',
      ],
    },
    {
      icon: FileText,
      title: 'Your Rights',
      content: [
        'Access, update, or delete your account information anytime',
        'Download all your created content',
        'Opt-out of non-essential communications',
        'Request a complete copy of your data',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4 sm:p-8">
      <SEOManager
        title="Privacy Policy - Beautiful Greetings"
        description="Learn how we protect your data and respect your privacy. Transparent policies for a secure greeting card creation experience."
      />

      <div className="max-w-5xl mx-auto">
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
            🔒
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="border-2 border-primary/20">
            <CardContent className="p-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Beautiful Greetings, we are committed to protecting your privacy and ensuring the security
                of your personal information. This Privacy Policy explains how we collect, use, and safeguard
                your data when you use our greeting card creation platform.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Policy Sections */}
        <div className="space-y-8 mb-12">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="border-2 border-transparent hover:border-primary/30 transition-all duration-300 group">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-primary/20"
                      >
                        <Icon className="w-6 h-6 text-primary" />
                      </motion.div>
                      <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">
                        {section.title}
                      </h2>
                    </div>
                    <ul className="space-y-3 ml-16">
                      {section.content.map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 + i * 0.05 }}
                          className="flex items-start gap-3 text-muted-foreground"
                        >
                          <span className="text-primary mt-1 flex-shrink-0">✓</span>
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Questions About Your Privacy?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                If you have any questions or concerns about our privacy practices, please don't hesitate to contact us.
              </p>
              <Link to="/support">
                <Button size="lg" variant="outline" className="group">
                  <span className="mr-2 group-hover:animate-bounce">📧</span>
                  Contact Support
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

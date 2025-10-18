import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import SEOManager from '@/components/seo/SEOManager';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How do I create a greeting card?',
      answer: 'Simply click the "Create Your Greeting" button on the homepage, choose your event type, customize the design with text, images, and animations, then share it with your loved ones via a unique link.',
      gradient: 'from-blue-500/10 to-cyan-500/10',
    },
    {
      question: 'Is Beautiful Greetings free to use?',
      answer: 'Yes! Beautiful Greetings is completely free to use. You can create unlimited greeting cards, customize them with various features, and share them with anyone.',
      gradient: 'from-purple-500/10 to-pink-500/10',
    },
    {
      question: 'Can I add my own photos and videos?',
      answer: 'Absolutely! You can upload your own photos and videos to make your greeting cards more personal. We support most common image formats (JPG, PNG, GIF) and video formats.',
      gradient: 'from-green-500/10 to-emerald-500/10',
    },
    {
      question: 'How do I share my greeting card?',
      answer: 'After creating your card, you\'ll receive a unique shareable link. You can copy this link and send it via email, text message, social media, or any messaging platform. Recipients can view it instantly without creating an account.',
      gradient: 'from-orange-500/10 to-red-500/10',
    },
    {
      question: 'Can I edit my greeting after sharing it?',
      answer: 'Yes! You can edit your greeting cards anytime. Changes will be reflected immediately when someone views your shared link. This is perfect for fixing typos or updating information.',
      gradient: 'from-amber-500/10 to-yellow-500/10',
    },
    {
      question: 'Are my greeting cards private?',
      answer: 'You have full control over privacy. When creating a card, you can choose to make it public (visible in the community feed) or private (only accessible via the unique link you share).',
      gradient: 'from-rose-500/10 to-pink-500/10',
    },
    {
      question: 'What occasions can I create greetings for?',
      answer: 'We support 20+ event types including birthdays, weddings, anniversaries, graduations, holidays, thank you notes, and more. You can also create custom events for any special occasion.',
      gradient: 'from-indigo-500/10 to-purple-500/10',
    },
    {
      question: 'Can I add background music to my card?',
      answer: 'Yes! You can add background music to make your greeting card more engaging. Upload your own audio file or choose from our selection of music tracks.',
      gradient: 'from-teal-500/10 to-cyan-500/10',
    },
    {
      question: 'Is there a limit to how many cards I can create?',
      answer: 'No limits! Create as many greeting cards as you want. All features are unlimited and free to use.',
      gradient: 'from-violet-500/10 to-fuchsia-500/10',
    },
    {
      question: 'Do recipients need to create an account to view my card?',
      answer: 'No account needed! Recipients can view your beautiful greeting cards instantly by clicking the link you share. It\'s that simple.',
      gradient: 'from-lime-500/10 to-green-500/10',
    },
    {
      question: 'Can I use Beautiful Greetings on mobile devices?',
      answer: 'Yes! Our platform is fully responsive and works perfectly on smartphones, tablets, and desktop computers. Create and view greeting cards on any device.',
      gradient: 'from-sky-500/10 to-blue-500/10',
    },
    {
      question: 'How long do greeting cards stay active?',
      answer: 'Your greeting cards remain active indefinitely. As long as you don\'t delete them, they\'ll be accessible via the shared link forever.',
      gradient: 'from-emerald-500/10 to-teal-500/10',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4 sm:p-8">
      <SEOManager
        title="FAQ - Frequently Asked Questions"
        description="Find answers to common questions about creating and sharing beautiful greeting cards. Learn how to use all features effectively."
      />

      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link to="/">
          <Button variant="outline" className="bg-white mb-6 group hover:border-primary">
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
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl mb-6 inline-block"
          >
            ❓
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-primary bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about creating and sharing beautiful greeting cards
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
              >
                <Card
                  className={cn(
                    'border-2 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl',
                    `bg-gradient-to-br ${faq.gradient}`,
                    isOpen
                      ? 'border-primary/50 shadow-primary/20'
                      : 'border-transparent hover:border-primary/30'
                  )}
                >
                  <CardContent className="p-0">
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full text-left p-6 flex items-start gap-4 group"
                    >
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0 mt-1"
                      >
                        <ChevronDown
                          className={cn(
                            'w-5 h-5 transition-colors',
                            isOpen ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                          )}
                        />
                      </motion.div>
                      <div className="flex-1">
                        <h3
                          className={cn(
                            'text-lg font-semibold transition-colors',
                            isOpen ? 'text-primary' : 'group-hover:text-primary'
                          )}
                        >
                          {faq.question}
                        </h3>
                      </div>
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <HelpCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pl-16">
                            <motion.p
                              initial={{ y: -10 }}
                              animate={{ y: 0 }}
                              className="text-muted-foreground leading-relaxed"
                            >
                              {faq.answer}
                            </motion.p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Still Have Questions Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Can't find what you're looking for? Our support team is here to help!
              </p>
              <Link to="/support">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="group">
                    <span className="mr-2 group-hover:animate-bounce">💬</span>
                    Contact Support
                  </Button>
                </motion.div>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;

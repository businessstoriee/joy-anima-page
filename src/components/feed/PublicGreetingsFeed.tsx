import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useFirebaseGreetings, SavedGreeting } from '@/hooks/useFirebaseGreetings';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Heart, MessageCircle, Share2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface PublicGreetingsFeedProps {
  className?: string;
}

const PublicGreetingsFeed: React.FC<PublicGreetingsFeedProps> = ({ className = "" }) => {
  const [publicGreetings, setPublicGreetings] = useState<SavedGreeting[]>([]);
  const [loading, setLoading] = useState(true);
  const { getPublicGreetings } = useFirebaseGreetings();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicGreetings = async () => {
      setLoading(true);
      const greetings = await getPublicGreetings(20);
      setPublicGreetings(greetings);
      setLoading(false);
    };

    fetchPublicGreetings();
  }, [getPublicGreetings]);

  const handleGreetingClick = (slug: string) => {
    navigate(`/${slug}`);
  };

  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp?.seconds) return 'Recently';
    
    const now = new Date();
    const created = new Date(timestamp.seconds * 1000);
    const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return `${Math.floor(diffInDays / 7)}w ago`;
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-muted rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
              <div className="mt-3 h-32 bg-muted rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (publicGreetings.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">No public greetings yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Be the first to share a beautiful greeting with the community! Create your greeting and make it public to inspire others.
          </p>
          <Button onClick={() => navigate('/create')} className="mt-4">
            Create First Public Greeting
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Community Greetings
        </h2>
        <p className="text-muted-foreground">
          Beautiful greetings shared by our community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publicGreetings.map((greeting, index) => (
          <motion.div
            key={greeting.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Card 
              className="overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover-scale"
              onClick={() => handleGreetingClick(greeting.slug)}
            >
              <CardContent className="p-0">
                {/* Media/Image Section */}
                <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                  {greeting.firstMedia ? (
                    <img
                      src={greeting.firstMedia}
                      alt={`${greeting.eventName} greeting`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl opacity-80">
                        {greeting.eventEmoji || '🎉'}
                      </div>
                    </div>
                  )}
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Event type badge */}
                  <Badge 
                    variant="secondary" 
                    className="absolute top-3 left-3 bg-black/20 backdrop-blur-sm text-white border-white/20"
                  >
                    {greeting.eventEmoji} {greeting.eventName}
                  </Badge>
                  
                  {/* View count */}
                  <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <Eye className="w-3 h-3 text-white" />
                    <span className="text-xs text-white">{greeting.viewCount || 0}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 space-y-3">
                  {/* User info */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {greeting.senderName || 'Anonymous'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(greeting.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Greeting text preview */}
                  {greeting.firstText && (
                    <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">
                      {greeting.firstText}
                    </p>
                  )}

                  {/* Receiver info */}
                  {greeting.receiverName && (
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground">
                        For <span className="text-primary font-medium">{greeting.receiverName}</span>
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Button 
          variant="outline" 
          onClick={() => navigate('/create')}
          className="hover-scale"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Your Greeting
        </Button>
      </div>
    </div>
  );
};

export default PublicGreetingsFeed;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFirebaseGreetings } from '@/hooks/useFirebaseGreetings';
import { GreetingFormData } from '@/types/greeting';
import Preview from '@/components/preview/Preview';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ShareActions from '@/components/share/ShareActions';

const ViewGreeting: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { loadGreeting, isLoading } = useFirebaseGreetings();
  const [greetingData, setGreetingData] = useState<GreetingFormData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGreeting = async () => {
      if (!slug) {
        setError('No greeting slug provided');
        return;
      }

      try {
        const data = await loadGreeting(slug);
        if (data) {
          setGreetingData(data);
        } else {
          setError('Greeting not found');
        }
      } catch (err) {
        console.error('Error loading greeting:', err);
        setError('Failed to load greeting');
      }
    };

    fetchGreeting();
  }, [slug, loadGreeting]);

  const handleShareGreeting = () => {
    const shareableURL = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(shareableURL);
    toast({
      title: "Link copied!",
      description: "Greeting link has been copied to your clipboard.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading greeting...</p>
        </div>
      </div>
    );
  }

  if (error || !greetingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/20">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold mb-2">Greeting Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || 'The greeting you\'re looking for doesn\'t exist or has been removed.'}
          </p>
          <Button onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          
          <Button 
            onClick={handleShareGreeting}
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Greeting Preview */}
      <div className="max-w-4xl mx-auto p-4">
        <Preview 
          greetingData={greetingData}
          selectedEvent={null}
        />
        
        {/* Share Actions */}
        <div className="mt-6">
          <ShareActions 
            greetingData={greetingData}
            selectedEvent={null}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewGreeting;
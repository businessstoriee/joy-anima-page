// pages/ViewGreeting.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFirebaseGreetings } from '@/hooks/useFirebaseGreetings';
import { GreetingFormData } from '@/types/greeting';
import Preview from '@/components/preview/Preview';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ShareActions from '@/components/share/ShareActions';
import { FloatingButton } from '@/components/share/CustomizeAndShare';
import SEOManager from '@/components/seo/SEOManager';
import BackgroundAudioPlayer from '@/components/greeting/contentEditor/AudioPlayerInput/BackgroundAudioPlayer';
import AudioAutoPlay from '@/components/preview/AudioAutoPlay';


const ViewGreeting: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { loadGreeting, isLoading: hookLoading } = useFirebaseGreetings();
  const [greetingData, setGreetingData] = useState<GreetingFormData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const mountedRef = useRef(true);
  const { toast } = useToast();

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    // Guard: need slug
    if (!slug) {
      console.warn('ViewGreeting: no slug found in params');
      setError('No greeting slug provided');
      setInitialLoading(false);
      return;
    }

    // Only run initial fetch once (per mount)
    let cancelled = false;
    const fetch = async () => {
      try {
        console.log('🚀 ViewGreeting: fetching slug=', slug);
        setInitialLoading(true);
        const data = await loadGreeting(slug);
        if (cancelled || !mountedRef.current) return;

        console.log('📋 ViewGreeting: loadGreeting returned', data);
        if (data) {
          setGreetingData(data);
          setError(null);
          console.log('✅ ViewGreeting: greetingData set');
        } else {
          setGreetingData(null);
          setError('Greeting not found');
          console.warn('❌ ViewGreeting: greeting not found for slug=', slug);
        }
      } catch (err) {
        console.error('❌ ViewGreeting: error fetching greeting', err);
        if (!cancelled && mountedRef.current) setError('Failed to load greeting');
      } finally {
        if (!cancelled && mountedRef.current) {
          setInitialLoading(false);
        }
      }
    };

    fetch();

    return () => { cancelled = true; };
  }, [slug, loadGreeting]);

  // Loader UI: show only while initial load is happening.
  // If hookLoading toggles later (e.g. viewCount increment), don't re-show the big loader.
  if (initialLoading && !greetingData) {
    console.log('⏳ ViewGreeting: initial loading...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading greeting...</p>
        </div>
      </div>
    );
  }

  // Error or not found
  if (error || !greetingData) {
    console.log('❌ ViewGreeting: error state or empty data', { error, hasData: !!greetingData });
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

  // Render the greeting (stable view). We intentionally do NOT re-show a full-page loader
  // if hookLoading is true later (that would cause flashing).
  console.log('🎯 ViewGreeting: rendering greeting', greetingData);
  const handleShareGreeting = () => {
    const shareableURL = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(shareableURL);
    toast({
      title: "Link copied!",
      description: "Greeting link has been copied to your clipboard.",
    });
  };

  const handleCustomizeGreeting = () => {
    // Navigate to create page with the current greeting data
    navigate(`/create?edit=${slug}`, { state: { greetingData } });
  };

  return (
     <>
    <SEOManager 
        title={`${greetingData.eventType || 'Greeting'} for ${greetingData.receiverName || 'You'}`}
        description={greetingData.texts?.[0]?.content || greetingData.customEventText || ' '}
        customEventName = {greetingData.customEventName}
        greetingData={greetingData}
      />

    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="mr-2 sm:mx-4 px-2 sm:px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="h-4 w-4 animate-bounce" />
            Home
          </Button>

          <div className="flex justify-end gap-1 sm:gap-3">
            {/* Background Audio Player */}
            {greetingData.audioUrl && (
              <BackgroundAudioPlayer 
                audioUrl={greetingData.audioUrl}
                autoPlay={true}
                className=""
              />
            )}
            
            <Button onClick={handleCustomizeGreeting} variant="outline" className="gap-1 md:gap-2 bg-primary/10 text-primary border-primary hover:bg-gray-300">
              <Edit3 className="h-4 w-4" />
              Customize
            </Button>
            
            <Button onClick={handleShareGreeting} className="gap-1 md:gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div> 
      </div>

      {/* Greeting Preview */}
      <div className="max-w-4xl mx-auto p-4">
        <Preview greetingData={greetingData} selectedEvent={null} />
        <div className="mt-6 mx-4 mb-6">
          <ShareActions greetingData={greetingData} selectedEvent={null} />
        </div>
         <FloatingButton />
      </div>
    </div>

    </>
  );
};

export default ViewGreeting;
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Save, Copy, Check, ExternalLink, Share2 } from 'lucide-react';
import { useFirebaseGreetings } from '@/hooks/useFirebaseGreetings';
import { GreetingFormData } from '@/types/greeting';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface Props {
  greetingData: GreetingFormData;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

const SaveAndShareButton: React.FC<Props> = ({ 
  greetingData, 
  variant = "default",
  size = "default" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [savedSlug, setSavedSlug] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { saveGreeting, isLoading } = useFirebaseGreetings();
  const { toast } = useToast();

  const generatePreviewSlug = () => {
    const eventName = greetingData?.eventType === 'custom' 
      ? (greetingData?.customEventName || 'custom')
      : greetingData?.eventType || 'greeting';

    const sanitize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return `${sanitize(greetingData?.senderName || 'someone')}-wishes-${sanitize(greetingData?.receiverName || 'you')}-${sanitize(eventName)}`;
  };

  const handleSave = async () => {
    const slug = await saveGreeting(greetingData, title || undefined);
    
    if (slug) {
      setSavedSlug(slug);
      toast({
        title: "Greeting Saved! 🎉",
        description: "Your greeting has been saved successfully.",
      });
    } else {
      toast({
        title: "Save Failed",
        description: "There was an error saving your greeting. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopyLink = async () => {
    const shareableURL = `${window.location.origin}/${savedSlug}`;
    await navigator.clipboard.writeText(shareableURL);
    setIsCopied(true);
    
    toast({
      title: "Link Copied! 📋",
      description: "Shareable link has been copied to your clipboard.",
    });
    
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleOpenLink = () => {
    const shareableURL = `${window.location.origin}/${savedSlug}`;
    window.open(shareableURL, '_blank');
  };

  const isFormValid = greetingData.eventType && 
                     (greetingData.senderName || greetingData.receiverName);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          disabled={!isFormValid}
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          Save & Share
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5 text-primary" />
            Save Your Greeting
          </DialogTitle>
        </DialogHeader>
        
        {!savedSlug ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Greeting Title (Optional)</Label>
              <Input
                id="title"
                placeholder={`${greetingData.senderName || 'Someone'} wishes ${greetingData.receiverName || 'You'}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-primary">
                    Your shareable link will be:
                  </h4>
                  <p className="text-sm text-muted-foreground bg-background px-3 py-2 rounded border font-mono">
                    {window.location.origin}/{generatePreviewSlug()}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Saving...' : 'Save Greeting'}
            </Button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-400">
                Greeting Saved Successfully! 🎉
              </h3>
            </div>
            
            <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Label className="text-green-900 dark:text-green-300">Your Shareable Link:</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={`${window.location.origin}/${savedSlug}`}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyLink}
                      className="shrink-0"
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleOpenLink}
                className="flex-1 gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Open Link
              </Button>
              <Button 
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Done
              </Button>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SaveAndShareButton;
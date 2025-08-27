import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  QrCode,
  Facebook, 
  Twitter, 
  MessageCircle,
  Send,
  Linkedin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShareUtils } from '@/components/shared/ShareUtils';
import { useFirebaseGreetings } from '@/hooks/useFirebaseGreetings';
import { GreetingFormData, EventType } from '@/types/greeting';

interface UnifiedShareComponentProps {
  greetingData: GreetingFormData;
  selectedEvent?: EventType | null;
  className?: string;
}

const UnifiedShareComponent: React.FC<UnifiedShareComponentProps> = ({
  greetingData,
  selectedEvent,
  className
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  const { saveGreeting } = useFirebaseGreetings();
  const { 
    generateShareableURL, 
    copyShareLink, 
    shareToSocialMedia, 
    shareViaWebAPI, 
    generateQRCode 
  } = useShareUtils();

  const handleSaveAndShare = async () => {
    if (!greetingData.eventType || (!greetingData.senderName && !greetingData.receiverName)) {
      return;
    }

    setIsSaving(true);
    try {
      const slug = await saveGreeting(greetingData, selectedEvent?.label || undefined);
      setSavedSlug(slug);
    } catch (error) {
      console.error('Failed to save greeting:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyLink = async () => {
    const url = savedSlug 
      ? `${window.location.origin}/${savedSlug}`
      : generateShareableURL(greetingData, selectedEvent || undefined);
    
    await copyShareLink(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenLink = () => {
    const url = savedSlug 
      ? `${window.location.origin}/${savedSlug}`
      : generateShareableURL(greetingData, selectedEvent || undefined);
    
    window.open(url, '_blank');
  };

  const handleSocialShare = (platform: string) => {
    const url = savedSlug 
      ? `${window.location.origin}/${savedSlug}`
      : generateShareableURL(greetingData, selectedEvent || undefined);
    
    shareToSocialMedia(platform, url, "Check out this amazing greeting!");
  };

  const handleWebAPIShare = async () => {
    const url = savedSlug 
      ? `${window.location.origin}/${savedSlug}`
      : generateShareableURL(greetingData, selectedEvent || undefined);
    
    await shareViaWebAPI(url, "Amazing Greeting", "Check out this greeting!");
  };

  const shareUrl = savedSlug 
    ? `${window.location.origin}/${savedSlug}`
    : generateShareableURL(greetingData, selectedEvent || undefined);

  const qrCodeUrl = generateQRCode(shareUrl);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Share2 className="h-5 w-5 text-primary" />
          Save & Share Greeting
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Save Section */}
        {!savedSlug && (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Save your greeting to get a permanent shareable link
            </div>
            
            <Button
              onClick={handleSaveAndShare}
              disabled={isSaving || !greetingData.eventType}
              className="w-full gap-2"
            >
              {isSaving ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? 'Saving...' : 'Save Greeting'}
            </Button>

            {greetingData.senderName && greetingData.receiverName && greetingData.eventType && (
              <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                <p className="font-medium mb-1">Your shareable link will be:</p>
                <code className="text-primary break-all">
                  {window.location.origin}/
                  {greetingData.senderName?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-wishes-
                  {greetingData.receiverName?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-
                  {(greetingData.eventType === 'custom' 
                    ? (greetingData.customEventName || selectedEvent?.label || 'custom')
                    : greetingData.eventType
                  ).toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                </code>
              </div>
            )}
          </div>
        )}

        {/* Saved Greeting Section */}
        {savedSlug && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-green-600 font-medium">Greeting Saved!</span>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-green-900 dark:text-green-300">
                Your Shareable Link:
              </Label>
              <div className="flex gap-2">
                <Input
                  value={`${window.location.origin}/${savedSlug}`}
                  readOnly
                  className="flex-1 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                />
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="sm"
                  className="px-3 border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-950/20"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={handleOpenLink}
                  variant="outline"
                  size="sm"
                  className="px-3 border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-950/20"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        <Separator />

        {/* Quick Share Actions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Quick Share</h4>
            <Button
              onClick={() => setShowQR(!showQR)}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <QrCode className="h-4 w-4" />
              QR Code
            </Button>
          </div>

          {/* Social Media Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleCopyLink}
              variant="outline"
              size="sm"
              className="gap-2 justify-start"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>

            <Button
              onClick={handleWebAPIShare}
              variant="outline"
              size="sm"
              className="gap-2 justify-start"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>

            <Button
              onClick={() => handleSocialShare('whatsapp')}
              variant="outline"
              size="sm"
              className="gap-2 justify-start hover:bg-green-500/10"
            >
              <MessageCircle className="h-4 w-4 text-green-600" />
              WhatsApp
            </Button>

            <Button
              onClick={() => handleSocialShare('telegram')}
              variant="outline"
              size="sm"
              className="gap-2 justify-start hover:bg-blue-500/10"
            >
              <Send className="h-4 w-4 text-blue-600" />
              Telegram
            </Button>

            <Button
              onClick={() => handleSocialShare('facebook')}
              variant="outline"
              size="sm"
              className="gap-2 justify-start hover:bg-blue-500/10"
            >
              <Facebook className="h-4 w-4 text-blue-600" />
              Facebook
            </Button>

            <Button
              onClick={() => handleSocialShare('twitter')}
              variant="outline"
              size="sm"
              className="gap-2 justify-start hover:bg-black/10"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
          </div>
        </div>

        {/* QR Code */}
        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-center"
            >
              <Separator className="mb-4" />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">QR Code</h4>
                <div className="flex justify-center">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code for greeting"
                    className="border border-border rounded-lg"
                    width={200}
                    height={200}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Scan to view the greeting
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Badge */}
        <div className="flex justify-center">
          <Badge variant={savedSlug ? "default" : "secondary"} className="gap-1">
            {savedSlug ? (
              <>
                <Check className="h-3 w-3" />
                Saved & Ready to Share
              </>
            ) : (
              <>
                <Share2 className="h-3 w-3" />
                Ready to Share
              </>
            )}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedShareComponent;
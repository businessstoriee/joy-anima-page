import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Share2, 
  FileImage, 
  FileText, 
  Copy, 
  QrCode, 
  CheckCircle,
  Download,
  MessageCircle,
  Facebook,
  Twitter,
  Send,
  Linkedin
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'; 
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';
import type { EventType } from '@/types/greeting';

interface ShareActionsProps {
  greetingData: any;
  greetingRef?: React.RefObject<HTMLDivElement>;
  selectedEvent?: EventType | null;
}

const ShareActions = ({ greetingData, greetingRef, selectedEvent }: ShareActionsProps) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  const { translate } = useLanguageTranslation();

  // Generate Firebase-based slug URL
  const generateFirebaseSlugURL = (greetingData: any) => {
    const eventName = greetingData?.eventType === 'custom' 
      ? (greetingData?.customEventName || greetingData?.customEvent?.label || selectedEvent?.label || 'custom')
      : greetingData?.eventType;

    const sanitize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const slug = `${sanitize(greetingData?.senderName || 'someone')}-wishes-${sanitize(greetingData?.receiverName || 'you')}-${sanitize(eventName || 'greeting')}`;
    
    return `${window.location.origin}/${slug}`;
  };

  const generateShareableURL = () => {
    return generateFirebaseSlugURL(greetingData || {});
  };

  const copyShareLink = () => {
    const shareableURL = generateShareableURL();
    navigator.clipboard.writeText(shareableURL);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast({
      title: translate("Link copied!"),
      description: translate("Greeting link has been copied to your clipboard."),
    });
  };

  const shareToSocialMedia = (platform: string) => {
    const shareableURL = generateShareableURL();
    const text = translate("Check out this beautiful greeting I created!");
    
    let shareURL = '';
    switch (platform) {
      case 'whatsapp': 
        shareURL = `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareableURL)}`; 
        break;
      case 'facebook': 
        shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableURL)}`; 
        break;
      case 'twitter': 
        shareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareableURL)}`; 
        break;
      case 'telegram': 
        shareURL = `https://t.me/share/url?url=${encodeURIComponent(shareableURL)}&text=${encodeURIComponent(text)}`; 
        break;
      case 'linkedin': 
        shareURL = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableURL)}`; 
        break;
    }
    
    if (shareURL) window.open(shareURL, '_blank');
  };

  const handleNativeShare = async () => {
    const shareableURL = generateShareableURL();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: translate('Beautiful Greeting'),
          text: translate('Check out this beautiful greeting I created!'),
          url: shareableURL
        });
      } catch (error) {
        // User cancelled the share
        console.log('Share cancelled:', error);
      }
    } else {
      // Fallback to copy link
      copyShareLink();
    }
  };

  const saveAsImage = async () => {
    if (!greetingRef?.current) {
      toast({
        title: translate("Error"),
        description: translate("No greeting content to save."),
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Create temporary container for reliable rendering
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'fixed';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = `${greetingRef.current.scrollWidth}px`;
      tempDiv.style.height = 'auto';
      tempDiv.appendChild(greetingRef.current.cloneNode(true));
      document.body.appendChild(tempDiv);

      // Wait for all assets to load
      await Promise.all([
        document.fonts.ready,
        ...Array.from(tempDiv.querySelectorAll('img')).map(img => 
          img.complete ? Promise.resolve() : new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          })
        ),
        ...Array.from(tempDiv.querySelectorAll('video')).map(video => 
          video.readyState >= 3 ? Promise.resolve() : new Promise(resolve => {
            video.onloadeddata = resolve;
            video.onerror = resolve;
          })
        )
      ]);

      const canvas = await html2canvas(tempDiv.firstChild as HTMLElement, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false
      });

      document.body.removeChild(tempDiv);

      const link = document.createElement('a');
      link.download = `greeting-${greetingData.eventType || 'card'}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: translate("Image saved!"),
        description: translate("Your greeting has been saved as an image."),
      });
    } catch (error) {
      console.error('Error saving image:', error);
      toast({
        title: translate("Error"),
        description: translate("Failed to save image. Please try again."),
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveAsPDF = async () => {
    if (!greetingRef?.current) {
      toast({
        title: translate("Error"),
        description: translate("No greeting content to save."),
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // First capture as image
      const canvas = await html2canvas(greetingRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false
      });

      // Convert to PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'mm'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate dimensions to maintain aspect ratio
      const ratio = Math.min(
        (pageWidth - 20) / canvas.width, 
        (pageHeight - 20) / canvas.height
      );
      
      const imgX = (pageWidth - canvas.width * ratio) / 2;
      const imgY = (pageHeight - canvas.height * ratio) / 2;

      pdf.addImage(imgData, 'PNG', imgX, imgY, 
        canvas.width * ratio, 
        canvas.height * ratio
      );
      
      pdf.save(`greeting-${greetingData.eventType || 'card'}-${Date.now()}.pdf`);

      toast({
        title: translate("PDF saved!"),
        description: translate("Your greeting has been saved as a PDF."),
      });
    } catch (error) {
      console.error('Error saving PDF:', error);
      toast({
        title: translate("Error"),
        description: translate("Failed to save PDF. Please try again."),
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateQRCode = () => {
    const shareableURL = generateShareableURL();
    const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareableURL)}`;
    
    const link = document.createElement('a');
    link.download = 'greeting-qr-code.png';
    link.href = qrCodeURL;
    link.click();
    
    toast({
      title: translate("QR Code generated!"),
      description: translate("QR code for your greeting has been downloaded."),
    });
  };

  // Button styling configuration
  const buttonConfigs = [
    {
      id: 'image',
      label: translate('Save Image'),
      shortLabel: translate('Image'),
      icon: FileImage,
      onClick: saveAsImage,
      gradient: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      disabled: isGenerating
    },
    {
      id: 'pdf',
      label: translate('Save PDF'),
      shortLabel: translate('PDF'),
      icon: FileText,
      onClick: saveAsPDF,
      gradient: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
      disabled: isGenerating
    },
    {
      id: 'copy',
      label: isCopied ? translate('Copied!') : translate('Copy Link'),
      shortLabel: isCopied ? translate('Copied') : translate('Copy'),
      icon: isCopied ? CheckCircle : Copy,
      onClick: copyShareLink,
      gradient: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
    },
    {
      id: 'share',
      label: translate('Share'),
      shortLabel: translate('Share'),
      icon: Share2,
      onClick: () => setShareDialogOpen(true),
      gradient: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
    }
  ];

  const socialButtons = [
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'text-green-500' },
    { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-500' },
    { id: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-blue-400' },
    { id: 'telegram', label: 'Telegram', icon: Send, color: 'text-blue-400' },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' }
  ];

  return (
    <>
      <Card className="border-dashed border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 no-capture shadow-sm">
        <CardContent className="p-4">
          <div className="text-center mb-4">
            <h3 className="font-semibold text-lg mb-2">{translate('Save & Share')}</h3>
            <p className="text-sm text-muted-foreground">
              {translate('Download your greeting or share it with others')}
            </p>
          </div>
        
          <div className="w-full flex flex-wrap items-center justify-center gap-2 bg-gradient-to-r from-muted/10 to-muted/5 p-2 rounded-lg">
            {buttonConfigs.map((button) => (
              <Button 
                key={button.id}
                onClick={button.onClick}
                disabled={button.disabled}
                size="sm"
                className={`shrink-0 flex items-center gap-1.5 px-3 py-2 h-9 min-w-[3rem]
                  bg-gradient-to-r ${button.gradient}
                  text-white shadow-md hover:shadow-lg transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  group relative overflow-hidden`}
              >
                {/* Shine effect */}
                <span className="absolute inset-0 bg-white/20 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                
                <button.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap text-xs sm:text-sm font-medium">
                  {button.label}
                </span>
                <span className="sm:hidden sr-only">{button.shortLabel}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-center">{translate('Share Your Greeting')}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Native share button */}
            <div className="flex justify-center">
              <Button 
                onClick={handleNativeShare}
                className="w-full max-w-xs justify-center py-6 bg-primary/90 hover:bg-primary"
                size="lg"
              >
                <Share2 className="h-5 w-5 mr-2" />
                {translate('Share via...')}
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              {translate('Or share directly on')}
            </div>

            {/* Social media buttons */}
            <div className="grid grid-cols-2 gap-3">
              {socialButtons.map((social) => (
                <Button
                  key={social.id}
                  onClick={() => shareToSocialMedia(social.id)}
                  variant="outline"
                  className="justify-start py-3 h-auto"
                >
                  <social.icon className={`h-5 w-5 mr-2 ${social.color}`} />
                  {social.label}
                </Button>
              ))}
              
              {/* QR Code button */}
              <Button
                onClick={generateQRCode}
                variant="outline"
                className="justify-start py-3 h-auto"
              >
                <QrCode className="h-5 w-5 mr-2 text-purple-500" />
                {translate('QR Code')}
              </Button>

              {/* Copy link button */}
              <Button
                onClick={copyShareLink}
                variant="outline"
                className="justify-start py-3 h-auto"
              >
                {isCopied ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    {translate('Copied!')}
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5 mr-2" />
                    {translate('Copy Link')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShareActions;
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Download, Video, Loader2, Play, Pause } from 'lucide-react';
import { GreetingFormData } from '@/types/greeting';
import html2canvas from 'html2canvas';

interface VideoExportProps {
  greetingData: GreetingFormData;
  previewRef: React.RefObject<HTMLDivElement>;
}

type VideoFormat = 'mp4' | 'webm' | 'gif';
type VideoQuality = 'low' | 'medium' | 'high';

const VideoExport: React.FC<VideoExportProps> = ({ greetingData, previewRef }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [format, setFormat] = useState<VideoFormat>('mp4');
  const [quality, setQuality] = useState<VideoQuality>('medium');
  const [duration, setDuration] = useState(5);
  const [progress, setProgress] = useState(0);

  const exportVideo = async () => {
    if (!previewRef.current) return;

    setIsExporting(true);
    setProgress(0);

    try {
      // Create video recording
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: 'transparent',
        scale: quality === 'high' ? 2 : quality === 'medium' ? 1.5 : 1,
        useCORS: true,
        allowTaint: true
      });

      // Create video stream
      const stream = canvas.captureStream(30); // 30 FPS
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: format === 'webm' ? 'video/webm' : 'video/mp4'
      });

      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { 
          type: format === 'webm' ? 'video/webm' : 'video/mp4' 
        });
        
        // Download the video
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${greetingData.senderName || 'greeting'}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setIsExporting(false);
        setProgress(100);
      };

      // Start recording
      mediaRecorder.start();

      // Simulate animation duration
      const totalDuration = duration * 1000;
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (totalDuration / 100));
          if (newProgress >= 100) {
            clearInterval(interval);
            mediaRecorder.stop();
            return 100;
          }
          return newProgress;
        });
      }, 100);

      // Stop recording after duration
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, totalDuration);

    } catch (error) {
      console.error('Video export failed:', error);
      setIsExporting(false);
    }
  };

  return (
    <Card className="border border-blue-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5 text-blue-600" />
          Video Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="format">Format</Label>
            <Select value={format} onValueChange={(value: VideoFormat) => setFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mp4">MP4</SelectItem>
                <SelectItem value="webm">WebM</SelectItem>
                <SelectItem value="gif">GIF</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quality">Quality</Label>
            <Select value={quality} onValueChange={(value: VideoQuality) => setQuality(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (720p)</SelectItem>
                <SelectItem value="medium">Medium (1080p)</SelectItem>
                <SelectItem value="high">High (1440p)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="duration">Duration (seconds)</Label>
          <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 seconds</SelectItem>
              <SelectItem value="5">5 seconds</SelectItem>
              <SelectItem value="10">10 seconds</SelectItem>
              <SelectItem value="15">15 seconds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isExporting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Exporting...</span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <Button
          onClick={exportVideo}
          disabled={isExporting}
          className="w-full"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Exporting Video...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export as {format.toUpperCase()}
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Video will capture the current greeting animation</p>
          <p>• Higher quality = larger file size</p>
          <p>• GIF format works best for shorter durations</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoExport;
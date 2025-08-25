import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette, Upload, Wand2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

interface ColorPaletteGeneratorProps {
  onApplyPalette: (palette: ColorPalette) => void;
}

const ColorPaletteGenerator: React.FC<ColorPaletteGeneratorProps> = ({ onApplyPalette }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedPalettes, setGeneratedPalettes] = useState<ColorPalette[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Predefined color palettes for demonstration
  const presetPalettes: ColorPalette[] = [
    {
      primary: '#3b82f6',
      secondary: '#06b6d4',
      accent: '#f59e0b',
      background: '#f8fafc',
      text: '#1e293b'
    },
    {
      primary: '#ec4899',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: '#fdf2f8',
      text: '#831843'
    },
    {
      primary: '#10b981',
      secondary: '#f59e0b',
      accent: '#ef4444',
      background: '#f0fdf4',
      text: '#052e16'
    },
    {
      primary: '#f59e0b',
      secondary: '#ef4444',
      accent: '#8b5cf6',
      background: '#fffbeb',
      text: '#92400e'
    }
  ];

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const generatePaletteFromImage = useCallback(async () => {
    if (!selectedImage) return;

    setIsGenerating(true);
    
    // Mock palette generation - in real implementation, use color analysis
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock palettes based on image analysis
      const mockPalettes: ColorPalette[] = [
        {
          primary: '#2563eb',
          secondary: '#0891b2',
          accent: '#ea580c',
          background: '#f1f5f9',
          text: '#0f172a'
        },
        {
          primary: '#dc2626',
          secondary: '#16a34a',
          accent: '#ca8a04',
          background: '#fef2f2',
          text: '#7f1d1d'
        },
        {
          primary: '#7c3aed',
          secondary: '#db2777',
          accent: '#059669',
          background: '#faf5ff',
          text: '#581c87'
        }
      ];
      
      setGeneratedPalettes(mockPalettes);
      toast.success('Color palettes generated successfully!');
    } catch (error) {
      toast.error('Failed to generate palettes');
    } finally {
      setIsGenerating(false);
    }
  }, [selectedImage]);

  const copyPalette = useCallback((palette: ColorPalette, index: number) => {
    const paletteText = `Primary: ${palette.primary}\nSecondary: ${palette.secondary}\nAccent: ${palette.accent}\nBackground: ${palette.background}\nText: ${palette.text}`;
    
    navigator.clipboard.writeText(paletteText);
    setCopiedIndex(index);
    toast.success('Palette copied to clipboard!');
    
    setTimeout(() => setCopiedIndex(null), 2000);
  }, []);

  const renderPaletteCard = (palette: ColorPalette, index: number, title: string) => (
    <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">{title}</h4>
          <div className="flex gap-1">
            <Button
              onClick={() => copyPalette(palette, index)}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
            >
              {copiedIndex === index ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
            <Button
              onClick={() => onApplyPalette(palette)}
              size="sm"
              variant="outline"
              className="h-6 px-2 text-xs"
            >
              Apply
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-5 gap-1 mb-2">
          <div
            className="h-8 rounded-sm border"
            style={{ backgroundColor: palette.primary }}
            title={`Primary: ${palette.primary}`}
          />
          <div
            className="h-8 rounded-sm border"
            style={{ backgroundColor: palette.secondary }}
            title={`Secondary: ${palette.secondary}`}
          />
          <div
            className="h-8 rounded-sm border"
            style={{ backgroundColor: palette.accent }}
            title={`Accent: ${palette.accent}`}
          />
          <div
            className="h-8 rounded-sm border"
            style={{ backgroundColor: palette.background }}
            title={`Background: ${palette.background}`}
          />
          <div
            className="h-8 rounded-sm border"
            style={{ backgroundColor: palette.text }}
            title={`Text: ${palette.text}`}
          />
        </div>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Primary:</span>
            <span className="font-mono">{palette.primary}</span>
          </div>
          <div className="flex justify-between">
            <span>Secondary:</span>
            <span className="font-mono">{palette.secondary}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="border border-purple-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-purple-600" />
          Color Palette Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Upload */}
        <div className="space-y-3">
          <Label htmlFor="image-upload">Upload Image</Label>
          <div className="flex items-center gap-3">
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="flex-1"
            />
            <Button
              onClick={generatePaletteFromImage}
              disabled={!selectedImage || isGenerating}
              className="flex items-center gap-2"
            >
              <Wand2 className="h-4 w-4" />
              {isGenerating ? 'Analyzing...' : 'Generate'}
            </Button>
          </div>
        </div>

        {/* Image Preview */}
        {selectedImage && (
          <div className="space-y-2">
            <Label>Selected Image</Label>
            <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Generated Palettes */}
        {generatedPalettes.length > 0 && (
          <div className="space-y-3">
            <Label>Generated from Image</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {generatedPalettes.map((palette, index) => 
                renderPaletteCard(palette, index, `Generated ${index + 1}`)
              )}
            </div>
          </div>
        )}

        {/* Preset Palettes */}
        <div className="space-y-3">
          <Label>Preset Palettes</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {presetPalettes.map((palette, index) => 
              renderPaletteCard(palette, index + 1000, `Preset ${index + 1}`)
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorPaletteGenerator;
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Heart, Snowflake, Sun, Leaf, Flower, Star, Gift } from 'lucide-react';
import { GreetingFormData } from '@/types/greeting';
import { cn } from '@/lib/utils';

interface SeasonalTheme {
  id: string;
  name: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'holiday';
  icon: React.ReactNode;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  backgroundStyle: string;
  frameStyle: string;
  mediaAnimation: string;
  textStyle: any;
  description: string;
}

const seasonalThemes: SeasonalTheme[] = [
  // Spring Themes
  {
    id: 'spring-bloom',
    name: 'Spring Bloom',
    season: 'spring',
    icon: <Flower className="h-4 w-4" />,
    colors: {
      primary: '#10b981',
      secondary: '#f59e0b',
      accent: '#ec4899',
      background: 'linear-gradient(135deg, #fef3c7 0%, #d1fae5 100%)'
    },
    backgroundStyle: 'gradient',
    frameStyle: 'elegant',
    mediaAnimation: 'bounceIn',
    textStyle: { color: '#065f46', fontWeight: '600' },
    description: 'Fresh flowers and vibrant spring colors'
  },
  {
    id: 'easter-joy',
    name: 'Easter Joy',
    season: 'spring',
    icon: <Star className="h-4 w-4" />,
    colors: {
      primary: '#8b5cf6',
      secondary: '#f59e0b',
      accent: '#06b6d4',
      background: 'linear-gradient(135deg, #fef3c7 0%, #e0e7ff 100%)'
    },
    backgroundStyle: 'gradient',
    frameStyle: 'artistic',
    mediaAnimation: 'zoomIn',
    textStyle: { color: '#5b21b6', fontWeight: '500' },
    description: 'Pastel colors perfect for Easter celebrations'
  },

  // Summer Themes
  {
    id: 'summer-beach',
    name: 'Summer Beach',
    season: 'summer',
    icon: <Sun className="h-4 w-4" />,
    colors: {
      primary: '#0ea5e9',
      secondary: '#f59e0b',
      accent: '#06b6d4',
      background: 'linear-gradient(135deg, #fef3c7 0%, #bfdbfe 100%)'
    },
    backgroundStyle: 'gradient',
    frameStyle: 'modern',
    mediaAnimation: 'slideUp',
    textStyle: { color: '#0c4a6e', fontWeight: '500' },
    description: 'Ocean blues and sunny yellows'
  },

  // Autumn Themes
  {
    id: 'autumn-harvest',
    name: 'Autumn Harvest',
    season: 'autumn',
    icon: <Leaf className="h-4 w-4" />,
    colors: {
      primary: '#dc2626',
      secondary: '#f59e0b',
      accent: '#ea580c',
      background: 'linear-gradient(135deg, #fed7aa 0%, #fecaca 100%)'
    },
    backgroundStyle: 'gradient',
    frameStyle: 'vintage',
    mediaAnimation: 'rotateIn',
    textStyle: { color: '#7f1d1d', fontWeight: '600' },
    description: 'Warm autumn colors and harvest vibes'
  },

  // Winter Themes
  {
    id: 'winter-snow',
    name: 'Winter Snow',
    season: 'winter',
    icon: <Snowflake className="h-4 w-4" />,
    colors: {
      primary: '#3b82f6',
      secondary: '#e5e7eb',
      accent: '#06b6d4',
      background: 'linear-gradient(135deg, #f3f4f6 0%, #dbeafe 100%)'
    },
    backgroundStyle: 'snow',
    frameStyle: 'minimal',
    mediaAnimation: 'fadeIn',
    textStyle: { color: '#1e3a8a', fontWeight: '500' },
    description: 'Cool winter blues and white snow'
  },

  // Holiday Themes
  {
    id: 'christmas-magic',
    name: 'Christmas Magic',
    season: 'holiday',
    icon: <Gift className="h-4 w-4" />,
    colors: {
      primary: '#dc2626',
      secondary: '#16a34a',
      accent: '#f59e0b',
      background: 'linear-gradient(135deg, #fecaca 0%, #bbf7d0 100%)'
    },
    backgroundStyle: 'fireworks',
    frameStyle: 'magical',
    mediaAnimation: 'bounceIn',
    textStyle: { color: '#7f1d1d', fontWeight: '700' },
    description: 'Classic Christmas red and green'
  },
  {
    id: 'new-year-celebration',
    name: 'New Year Celebration',
    season: 'holiday',
    icon: <Star className="h-4 w-4" />,
    colors: {
      primary: '#f59e0b',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      background: 'linear-gradient(135deg, #fbbf24 0%, #a78bfa 100%)'
    },
    backgroundStyle: 'fireworks',
    frameStyle: 'neon',
    mediaAnimation: 'zoomIn',
    textStyle: { color: '#92400e', fontWeight: '700' },
    description: 'Sparkling gold and purple for celebrations'
  },
  {
    id: 'valentines-love',
    name: "Valentine's Love",
    season: 'holiday',
    icon: <Heart className="h-4 w-4" />,
    colors: {
      primary: '#ec4899',
      secondary: '#ef4444',
      accent: '#f97316',
      background: 'linear-gradient(135deg, #fce7f3 0%, #fee2e2 100%)'
    },
    backgroundStyle: 'gradient',
    frameStyle: 'romantic',
    mediaAnimation: 'bounceIn',
    textStyle: { color: '#be185d', fontWeight: '600' },
    description: 'Romantic pinks and reds for love'
  }
];

interface SeasonalThemesProps {
  onApplyTheme: (theme: SeasonalTheme) => void;
  currentTheme?: string;
}

const SeasonalThemes: React.FC<SeasonalThemesProps> = ({ onApplyTheme, currentTheme }) => {
  const [selectedSeason, setSelectedSeason] = useState<string>('spring');

  const seasons = [
    { id: 'spring', label: 'Spring', icon: <Flower className="h-4 w-4" /> },
    { id: 'summer', label: 'Summer', icon: <Sun className="h-4 w-4" /> },
    { id: 'autumn', label: 'Autumn', icon: <Leaf className="h-4 w-4" /> },
    { id: 'winter', label: 'Winter', icon: <Snowflake className="h-4 w-4" /> },
    { id: 'holiday', label: 'Holidays', icon: <Calendar className="h-4 w-4" /> }
  ];

  const getThemesBySeasonId = (seasonId: string) => {
    return seasonalThemes.filter(theme => theme.season === seasonId);
  };

  return (
    <Card className="border border-green-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-green-600" />
          Seasonal Themes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedSeason} onValueChange={setSelectedSeason}>
          <TabsList className="grid w-full grid-cols-5 mb-4">
            {seasons.map((season) => (
              <TabsTrigger 
                key={season.id} 
                value={season.id}
                className="flex items-center gap-1"
              >
                {season.icon}
                <span className="hidden sm:inline">{season.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {seasons.map((season) => (
            <TabsContent key={season.id} value={season.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getThemesBySeasonId(season.id).map((theme) => (
                  <Card 
                    key={theme.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-lg",
                      currentTheme === theme.id && "ring-2 ring-primary"
                    )}
                    onClick={() => onApplyTheme(theme)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {theme.icon}
                          <h3 className="font-semibold">{theme.name}</h3>
                        </div>
                        {currentTheme === theme.id && (
                          <Badge variant="default">Active</Badge>
                        )}
                      </div>

                      {/* Color Preview */}
                      <div className="flex gap-2 mb-3">
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: theme.colors.secondary }}
                        />
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: theme.colors.accent }}
                        />
                      </div>

                      {/* Background Preview */}
                      <div 
                        className="w-full h-12 rounded-lg mb-3 border"
                        style={{ background: theme.colors.background }}
                      />

                      <p className="text-sm text-muted-foreground mb-3">
                        {theme.description}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          {theme.frameStyle}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {theme.mediaAnimation}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {theme.backgroundStyle}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SeasonalThemes;
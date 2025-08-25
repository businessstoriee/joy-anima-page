import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Loader2, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { MediaItem } from '@/types/greeting';

interface GIFResult {
  id: string;
  url: string; // animated .gif (original / fixed_height)
  preview_url: string; // small preview
  title: string;
  width: number;
  height: number;
}

interface Props {
  onGIFSelect: (gif: MediaItem) => void;
  className?: string;
}

const GIFSearchWidget: React.FC<Props> = ({ onGIFSelect, className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [gifs, setGifs] = useState<GIFResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchGIFs = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=GlVGYHkr3WSBnllca54iNt0yFbjz7L65&q=${encodeURIComponent(query)}&limit=12&rating=g`
      );
      if (!response.ok) throw new Error('Failed to fetch GIFs');

      const data = await response.json();
      const results: GIFResult[] = data.data.map((g: any) => ({
        id: g.id,
        url: g.images.original?.url || g.images.fixed_height?.url,
        preview_url: g.images.fixed_height_small?.url || g.images.fixed_height?.url,
        title: g.title || 'GIF',
        width: parseInt(g.images.fixed_height?.width || '300', 10),
        height: parseInt(g.images.fixed_height?.height || '225', 10),
      }));
      setGifs(results);
    } catch (err) {
      console.error(err);
      // fallback mock
      const mockGifs: GIFResult[] = Array.from({ length: 8 }, (_, i) => ({
        id: `mock-${i}`,
        url: `https://via.placeholder.com/300x225?text=GIF+${i + 1}`,
        preview_url: `https://via.placeholder.com/150x112?text=GIF+${i + 1}`,
        title: `GIF ${i + 1}`,
        width: 300,
        height: 225,
      }));
      setGifs(mockGifs);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) searchGIFs(searchQuery);
  };

  const handleGIFSelect = (gif: GIFResult) => {
    const mediaItem: MediaItem = {
      id: `${gif.id}-${Date.now()}`,
      url: gif.url,           // animated gif
      type: 'gif',            // IMPORTANT: 'gif'
      position: { width: Math.min(gif.width, 500), height: Math.min(gif.height, 400) },
      animation: 'bounceIn',
      priority: 1,
      fileType: 'gif',
    };
    onGIFSelect(mediaItem);
  };

  const trendingQueries = ['celebration','party','happy','love','congratulations','birthday','christmas','new year','anniversary','thank you'];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`w-full ${className}`}>
      <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50">
        {/* Header — no toggle */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-pink-100 rounded-lg">
                <ImageIcon className="h-4 w-4 text-pink-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-pink-800">GIF Library</CardTitle>
                <p className="text-sm text-pink-600 mt-1">Add animated GIFs to your greeting</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-pink-100 text-pink-700">Free</Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input placeholder="Search for GIFs..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className="flex-1" />
            <Button type="submit" disabled={isLoading || !searchQuery.trim()} className="gap-2">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Search
            </Button>
          </form>

          {gifs.length === 0 && !isLoading && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Trending:</p>
              <div className="flex flex-wrap gap-2">
                {trendingQueries.map(q => (
                  <button key={q} type="button" onClick={() => { setSearchQuery(q); searchGIFs(q); }} className="text-xs px-3 py-1 rounded-full border border-primary/30 text-primary hover:bg-primary/10">{q}</button>
                ))}
              </div>
            </div>
          )}

          {gifs.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {gifs.map((gif, i) => (
                <motion.div key={gif.id} initial={{opacity:0,scale:0.96}} animate={{opacity:1,scale:1}} transition={{delay: i*0.03}} className="group relative rounded-lg overflow-hidden border border-primary/20 cursor-pointer" onClick={()=>handleGIFSelect(gif)}>
                  <div className="aspect-square overflow-hidden">
                    <img src={gif.preview_url} alt={gif.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200" loading="lazy"/>
                  </div>
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="sm" className="gap-2 bg-white text-pink-600">
                      <Plus className="h-3 w-3"/> Add
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-pink-600" />
              <span className="ml-2 text-pink-700">Searching GIFs...</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GIFSearchWidget;

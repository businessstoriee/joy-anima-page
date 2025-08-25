import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Plus, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseGreetings } from '@/hooks/useSupabaseGreetings';
import { TextContent } from '@/types/greeting';

interface Props {
  eventType: string;
  onTextSelect: (text: string) => void;
  currentTexts: TextContent[];
}

const AITextSuggestions: React.FC<Props> = ({ eventType, onTextSelect, currentTexts }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const { getAITextSuggestions, isLoading } = useSupabaseGreetings();

  useEffect(() => {
    if (eventType) {
      loadSuggestions();
    }
  }, [eventType]);

  const loadSuggestions = async () => {
    if (!eventType) return;
    const newSuggestions = await getAITextSuggestions(eventType);
    setSuggestions(newSuggestions);
  };

  const handleAddSuggestion = (suggestion: string) => {
    onTextSelect(suggestion);
  };

  if (!suggestions.length || !eventType) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardHeader 
          className="pb-3 cursor-pointer" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Sparkles className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-purple-800">AI Text Suggestions</CardTitle>
                <p className="text-sm text-purple-600 mt-1">
                  Perfect messages for your {eventType} greeting
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              {suggestions.length} ideas
            </Badge>
          </div>
        </CardHeader>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => {
                    const isAlreadyUsed = currentTexts.some(text => 
                      text.content.toLowerCase().includes(suggestion.toLowerCase().substring(0, 20))
                    );

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`group relative p-4 rounded-lg border-2 transition-all ${
                          isAlreadyUsed 
                            ? 'border-gray-200 bg-gray-50 opacity-60' 
                            : 'border-purple-200 bg-white hover:border-purple-300 hover:shadow-md cursor-pointer'
                        }`}
                        onClick={() => !isAlreadyUsed && handleAddSuggestion(suggestion)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className={`flex-1 text-sm leading-relaxed ${
                            isAlreadyUsed ? 'text-gray-500' : 'text-gray-700'
                          }`}>
                            "{suggestion}"
                          </p>
                          {!isAlreadyUsed && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-purple-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddSuggestion(suggestion);
                              }}
                            >
                              <Plus className="h-4 w-4 text-purple-600" />
                            </Button>
                          )}
                          {isAlreadyUsed && (
                            <Badge variant="secondary" className="text-xs">
                              Used
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadSuggestions}
                    disabled={isLoading}
                    className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh Suggestions
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default AITextSuggestions;
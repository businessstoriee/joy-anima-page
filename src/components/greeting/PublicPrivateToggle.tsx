import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, EyeOff, Users, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface PublicPrivateToggleProps {
  isPublic: boolean;
  onToggle: (isPublic: boolean) => void;
  className?: string;
}

const PublicPrivateToggle: React.FC<PublicPrivateToggleProps> = ({
  isPublic,
  onToggle,
  className = ""
}) => {
  return (
    <Card className={`border-border/50 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {isPublic ? (
                <Users className="w-5 h-5 text-primary" />
              ) : (
                <Lock className="w-5 h-5 text-muted-foreground" />
              )}
            </motion.div>
            <div className="flex flex-col">
              <Label 
                htmlFor="public-toggle" 
                className="text-sm font-medium cursor-pointer flex items-center gap-2"
              >
                {isPublic ? (
                  <>
                    <Eye className="w-4 h-4" />
                    Public Greeting
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Private Greeting
                  </>
                )}
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                {isPublic 
                  ? "Others can discover your greeting on the homepage" 
                  : "Only people with the link can view your greeting"
                }
              </p>
            </div>
          </div>
          
          <Switch
            id="public-toggle"
            checked={isPublic}
            onCheckedChange={onToggle}
            className="data-[state=checked]:bg-primary"
          />
        </div>
        
        {isPublic && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20"
          >
            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-xs text-primary">
                <p className="font-medium">Your greeting will be featured!</p>
                <p className="opacity-80">Public greetings appear in our community feed and help inspire others.</p>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default PublicPrivateToggle;
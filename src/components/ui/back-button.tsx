import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  to?: string;
  state?: any;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
}

const BackButton = ({ 
  to, 
  state, 
  className, 
  variant = "outline", 
  size = "sm",
  children = "Back"
}: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to, { state });
    } else {
      navigate(-1);
    }
  };

  return (
    <Button 
      onClick={handleClick}
      variant={variant}
      size={size}
      className={cn("bg-background/80 backdrop-blur", className)}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      {children}
    </Button>
  );
};

export default BackButton;
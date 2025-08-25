import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Zap, Palette, Layers, Sparkles } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized animations that run at 60fps with smooth transitions and minimal resource usage.",
    delay: "delay-0"
  },
  {
    icon: Palette,
    title: "Beautiful Design",
    description: "Carefully crafted gradients, colors, and typography that create stunning visual experiences.",
    delay: "delay-200"
  },
  {
    icon: Layers,
    title: "Layered Effects", 
    description: "Multi-dimensional animations with depth, shadows, and interactive hover states.",
    delay: "delay-400"
  },
  {
    icon: Sparkles,
    title: "Magical Interactions",
    description: "Delightful micro-interactions that respond to user input with smooth, natural motion.",
    delay: "delay-600"
  }
];

export const FeatureCards = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    const element = document.getElementById('features');
    if (element) observer.observe(element);
    
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Amazing Features</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover what makes our animations truly special and engaging.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`p-8 bg-gradient-card border-border/50 hover-float hover-glow transition-all duration-500 ${
                isVisible ? `animate-fade-in-up ${feature.delay}` : 'opacity-0'
              }`}
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 animate-glow">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
export const FloatingElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Large Floating Circles */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/5 rounded-full animate-float blur-3xl" />
      <div className="absolute top-3/4 right-20 w-80 h-80 bg-accent/5 rounded-full animate-float-delayed blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-secondary/5 rounded-full animate-float blur-2xl" />
      
      {/* Medium Floating Elements */}
      <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-primary/10 rounded-full animate-float blur-xl" />
      <div className="absolute top-1/3 left-1/2 w-24 h-24 bg-accent/15 rounded-full animate-float-delayed blur-lg" />
      
      {/* Small Glowing Dots */}
      <div className="absolute top-20 right-1/3 w-4 h-4 bg-primary rounded-full animate-glow opacity-60" />
      <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-accent rounded-full animate-glow opacity-80" />
      <div className="absolute top-2/3 right-1/2 w-2 h-2 bg-secondary rounded-full animate-glow opacity-70" />
    </div>
  );
};
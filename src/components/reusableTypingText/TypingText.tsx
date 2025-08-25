import React, { useState, useEffect } from "react";

interface TypingTextProps {
  texts: string[]; // Array of strings (paragraphs or sentences)
  typingSpeed?: number; // Speed per letter
  pauseBetweenTexts?: number; // Pause between paragraphs
  loop?: boolean; // Restart after last text
}

const TypingText: React.FC<TypingTextProps> = ({
  texts,
  typingSpeed = 50,
  pauseBetweenTexts = 1500,
  loop = true,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [textIndex, setTextIndex] = useState(0); // which paragraph
  const [charIndex, setCharIndex] = useState(0); // which letter

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (charIndex < texts[textIndex].length) {
      timer = setTimeout(() => {
        setDisplayedText((prev) => prev + texts[textIndex].charAt(charIndex));
        setCharIndex((prev) => prev + 1);
      }, typingSpeed);
    } else {
      // Pause before moving to the next text
      timer = setTimeout(() => {
        if (textIndex < texts.length - 1) {
          setDisplayedText("");
          setCharIndex(0);
          setTextIndex((prev) => prev + 1);
        } else if (loop) {
          setDisplayedText("");
          setCharIndex(0);
          setTextIndex(0);
        }
      }, pauseBetweenTexts);
    }

    return () => clearTimeout(timer);
  }, [charIndex, textIndex, texts, typingSpeed, pauseBetweenTexts, loop]);

  return (
    <p className="text-base sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-12 mx-auto max-w-2xl leading-relaxed">
      {displayedText}
      <span className="animate-pulse">|</span>
    </p>
  );
};

export default TypingText;

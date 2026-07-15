"use client";
import { useState, useEffect } from "react";

const words = ["Laptop", "MacBook Pro", "iPhone", "Car Insurance", "Sony Camera"];

export function TypingPlaceholder({ className }: { className?: string }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      if (currentText.length > 0) {
        timeout = setTimeout(() => setCurrentText(word.substring(0, currentText.length - 1)), 50);
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    } else {
      if (currentText.length < word.length) {
        timeout = setTimeout(() => setCurrentText(word.substring(0, currentText.length + 1)), 100);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2000);
      }
    }
    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex]);

  return (
    <input 
      type="text" 
      placeholder={`Let's secure your ${currentText}|`} 
      className={className}
      readOnly
      suppressHydrationWarning
    />
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NewsCarouselProps {
  items: any[];
  categoryKey: string;
  renderCard: (pub: any, idx: number, isSolidCard: boolean, classes: string) => React.ReactNode;
}

export default function NewsCarousel({ items, categoryKey, renderCard }: NewsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Determine responsive visible cards count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Clamp activeIndex when visibleCards changes
  const maxIndex = Math.max(0, items.length - visibleCards);
  useEffect(() => {
    if (activeIndex > maxIndex) {
      setActiveIndex(maxIndex);
    }
  }, [visibleCards, maxIndex, activeIndex]);

  // Autoplay function
  useEffect(() => {
    if (isHovered || items.length <= visibleCards) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        if (prev >= maxIndex) {
          return 0; // wrap back to start
        }
        return prev + 1;
      });
    }, 4500); // 4.5 seconds equal interval

    return () => clearInterval(interval);
  }, [isHovered, maxIndex, visibleCards, items.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const handleDotClick = (index: number) => {
    setActiveIndex(Math.min(index, maxIndex));
  };

  // Mobile swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50;

    if (diff > swipeThreshold) {
      // swipe left -> next
      handleNext();
    } else if (diff < -swipeThreshold) {
      // swipe right -> prev
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!items || items.length === 0) return null;

  // The dots represent all item pages (usually 5 items)
  // To allow clean navigation, let's render items.length dots.
  // Clicking index dot sets index, clamped by maxIndex.
  const dotCount = items.length;

  return (
    <div 
      className="space-y-4 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header controls (Manual transition arrows) */}
      <div className="absolute right-0 -top-14 flex items-center gap-1.5 z-20">
        <button 
          onClick={handlePrev}
          className="p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-600 shadow-sm transition active:scale-95 cursor-pointer"
          aria-label="Предыдущий слайд"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={handleNext}
          className="p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-600 shadow-sm transition active:scale-95 cursor-pointer"
          aria-label="Следующий слайд"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Slider Viewport Container */}
      <div 
        className="overflow-hidden rounded-[32px] p-1 -m-1"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ 
            transform: `translateX(-${activeIndex * (100 / visibleCards)}%)` 
          }}
        >
          {items.map((pub, idx) => {
            // Apply a beautiful highlight to the middle/third card if configured to look premium
            const isSolidCard = idx === 2; 
            
            // Width of outer slide flex-shrink-0 depends on configuration
            const slideWidthClass = visibleCards === 1 
              ? 'w-full' 
              : visibleCards === 2 
                ? 'w-1/2' 
                : 'w-1/3';

            return (
              <div 
                key={pub.id} 
                className={`${slideWidthClass} flex-shrink-0 px-3 transition-opacity duration-300`}
                style={{
                  // Soft fading for elements pushed outside the viewport for pristine aesthetics
                  opacity: idx >= activeIndex && idx < activeIndex + visibleCards ? 1 : 0.4
                }}
              >
                {renderCard(pub, idx, isSolidCard, 'w-full h-full')}
              </div>
            );
          })}
        </div>
      </div>

      {/* Carousel Dots Indicators */}
      <div className="flex items-center justify-center gap-2 pt-2">
        {Array.from({ length: dotCount }).map((_, idx) => {
          // If visibleCards is multiple, highlight dot representing current state gracefully
          const isActive = idx === activeIndex || 
            (visibleCards > 1 && idx >= activeIndex && idx < activeIndex + visibleCards && activeIndex + visibleCards <= items.length && idx === activeIndex);

          const dotHighlight = idx === activeIndex;

          return (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                dotHighlight 
                  ? 'w-8 bg-indigo-650' 
                  : isActive 
                    ? 'w-4 bg-indigo-305' 
                    : 'w-2.5 bg-slate-200 hover:bg-slate-400'
              }`}
              title={`Перейти к слайду ${idx + 1}`}
              aria-label={`Слайд ${idx + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}

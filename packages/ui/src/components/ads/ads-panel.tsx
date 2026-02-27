import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { Typography } from '../misc/typography';

const ads = [
  {
    id: 1,
    title: 'Create Payment Link',
    description: 'Fund your account via a secure payment link.',
    actionLabel: 'Create Link',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-900',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    path: '/dashboard/create-payment-link'
  },
  {
    id: 2,
    title: 'Refer a Friend',
    description: 'Invite your friends and earn rewards for every successful referral.',
    actionLabel: 'Invite Friends',
    bgColor: 'bg-green-50',
    textColor: 'text-green-900',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    path: '/dashboard/referrals'
  },
  {
    id: 3,
    title: 'New Integration Available',
    description: 'Connect with your favorite tools seamlessly with our new integration.',
    actionLabel: 'Learn More',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-900',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    path: '/dashboard/integrations'
  }
];

export const AdsPanel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const currentAd = ads[currentIndex];

  return (
    <div 
      className="relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 h-full min-h-[320px] group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Content */}
      <div className="relative h-full flex flex-col">
        {/* Image Section */}
        <div className="h-40 w-full overflow-hidden relative">
            <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-in-out transform hover:scale-105"
                style={{ backgroundImage: `url(${currentAd.image})` }}
            />
            <div className={cn("absolute inset-0 opacity-20", currentAd.bgColor)}></div>
        </div>

        {/* Text Content */}
        <div className="flex-1 p-6 flex flex-col justify-between items-center text-center">
            <div className="space-y-2">
                <Typography variant="h4" className={cn(" text-xl text-blue-black")}>
                    {currentAd.title}
                </Typography>
                <Typography className="text-gray-500 text-sm leading-relaxed max-w-[280px] mx-auto">
                    {currentAd.description}
                </Typography>
            </div>
            
            <Button 
                variant="disabled_outline"
                className='mt-2'
                asChild
            >
                <a href={currentAd.path}>
                    {currentAd.actionLabel}
                </a>
            </Button>
        </div>
      </div>

  
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        onClick={(e) => {
            e.stopPropagation();
            prevSlide();
        }}
      >
        <ChevronLeft className="h-4 w-4 text-gray-700" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        onClick={(e) => {
            e.stopPropagation();
            nextSlide();
        }}
      >
        <ChevronRight className="h-4 w-4 text-gray-700" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
        {ads.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === currentIndex 
                ? "bg-primary w-6" 
                : "bg-gray-300 w-1.5 hover:bg-gray-400"
            )}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};



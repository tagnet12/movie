import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function SlideBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      title: "혁신의 시작",
      subtitle: "새로운 경험을 만나보세요",
      bgColor: "from-amber-400 via-orange-500 to-rose-600",
      textColor: "text-white"
    },
    {
      title: "디지털 미래",
      subtitle: "당신의 꿈을 현실로",
      bgColor: "from-violet-600 via-purple-600 to-indigo-700",
      textColor: "text-white"
    },
    {
      title: "함께하는 여정",
      subtitle: "더 나은 내일을 위해",
      bgColor: "from-emerald-400 via-teal-500 to-cyan-600",
      textColor: "text-white"
    },
    {
      title: "무한한 가능성",
      subtitle: "새로운 도전의 시작",
      bgColor: "from-pink-500 via-rose-500 to-red-600",
      textColor: "text-white"
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Work+Sans:wght@300;400;600&display=swap');
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(-100%);
            opacity: 0;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(1.2);
          }
          to {
            transform: scale(1);
          }
        }
        
        .slide-enter {
          animation: slideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .slide-bg {
          animation: scaleIn 8s ease-out forwards;
        }
        
        .fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .title-font {
          font-family: 'Playfair Display', serif;
        }
        
        .body-font {
          font-family: 'Work Sans', sans-serif;
        }
        
        .gradient-overlay {
          background: linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%);
        }
      `}</style>

      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className={`slide-bg absolute inset-0 bg-gradient-to-br ${slide.bgColor}`}>
              <div className="gradient-overlay absolute inset-0" />
            </div>
            
            {index === currentSlide && (
              <div className="relative h-full flex flex-col items-center justify-center px-8 md:px-16 lg:px-24">
                <div className="max-w-5xl w-full">
                  <h1 
                    className={`fade-in-up title-font text-5xl md:text-7xl lg:text-8xl font-black mb-6 ${slide.textColor}`}
                    style={{ animationDelay: '0.1s', opacity: 0 }}
                  >
                    {slide.title}
                  </h1>
                  <p 
                    className={`fade-in-up body-font text-xl md:text-2xl lg:text-3xl font-light tracking-wide ${slide.textColor} opacity-90`}
                    style={{ animationDelay: '0.3s', opacity: 0 }}
                  >
                    {slide.subtitle}
                  </p>
                  <button
                    className={`fade-in-up body-font mt-10 px-10 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/40 ${slide.textColor} font-semibold text-lg rounded-full hover:bg-white/30 hover:scale-105 transition-all duration-300`}
                    style={{ animationDelay: '0.5s', opacity: 0 }}
                  >
                    자세히 보기
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
        aria-label="이전 슬라이드"
      >
        <ChevronLeft className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110 group"
        aria-label="다음 슬라이드"
      >
        <ChevronRight className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-500 rounded-full ${
              index === currentSlide
                ? 'w-12 h-3 bg-white'
                : 'w-3 h-3 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`슬라이드 ${index + 1}로 이동`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 z-20 body-font text-white text-lg font-light">
        <span className="text-2xl font-semibold">{String(currentSlide + 1).padStart(2, '0')}</span>
        <span className="opacity-60 mx-2">/</span>
        <span className="opacity-60">{String(slides.length).padStart(2, '0')}</span>
      </div>
    </div>
  );
}

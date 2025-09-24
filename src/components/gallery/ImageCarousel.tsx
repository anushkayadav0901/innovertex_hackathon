import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

interface ImageCarouselProps {
  images: string[]
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  if (images.length === 1) {
    return (
      <div className="relative aspect-video">
        <img
          src={images[0]}
          alt="Project"
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  return (
    <div className="relative aspect-video">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet-custom',
          bulletActiveClass: 'swiper-pagination-bullet-active-custom',
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        loop={true}
        className="w-full h-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={`Project ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
        
        {/* Custom Navigation */}
        <div className="swiper-button-prev-custom absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-black/70">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        
        <div className="swiper-button-next-custom absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-black/70">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Swiper>
      
      <style>{`
        .swiper-pagination-bullet-custom {
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          margin: 0 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .swiper-pagination-bullet-active-custom {
          background: #3b5cff;
          transform: scale(1.2);
        }
        
        .swiper-pagination {
          bottom: 12px !important;
        }
      `}</style>
    </div>
  )
}

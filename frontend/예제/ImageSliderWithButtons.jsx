import { Swiper, SwiperSlide } from 'swiper/react';
import { useState } from 'react';
import 'swiper/css';

export default function ImageSlider() {
  const [swiper, setSwiper] = useState(null);
  const [SwiperSlide, setSwiperSlide] = useState(null);

  const images = [
    'https://picsum.photos/800/400?random=1',
    'https://picsum.photos/800/400?random=2',
    'https://picsum.photos/800/400?random=3',
    'https://picsum.photos/800/400?random=4',
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', textAlign: 'center' }}>
      <Swiper
        onSwiper={setSwiper}
        spaceBetween={50}
        slidesPerView={1}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img 
              src={img} 
              alt={`Slide ${index + 1}`}
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={() => swiper?.slidePrev()}>이전</button>
        <button onClick={() => swiper?.slideNext()}>다음</button>
        <button onClick={() => swiper?.slideTo(0)}>첫 번째</button>
        <button onClick={() => swiper?.slideTo(2)}>세 번째</button>
      </div>
    </div>
  );
}

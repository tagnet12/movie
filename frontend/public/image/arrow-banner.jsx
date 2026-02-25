import { useState } from 'react';

export default function Banner() {
  const [index, setIndex] = useState(0);
  
  const images = [
    'https://via.placeholder.com/800x300/FF6B6B/FFFFFF?text=Banner+1',
    'https://via.placeholder.com/800x300/4ECDC4/FFFFFF?text=Banner+2',
    'https://via.placeholder.com/800x300/FFE66D/FFFFFF?text=Banner+3'
  ];
  
  const prev = () => setIndex(index === 0 ? images.length - 1 : index - 1);
  const next = () => setIndex(index === images.length - 1 ? 0 : index + 1);
  
  return (
    <div className="flex items-center gap-4 p-8">
      <button onClick={prev} className="text-4xl">←</button>
      <img src={images[index]} className="w-full rounded" />
      <button onClick={next} className="text-4xl">→</button>
    </div>
  );
}

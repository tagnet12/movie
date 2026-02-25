import { useState } from 'react';
import A from './A';
import B from './B';

function App() {
  const [bannerImage, setBannerImage] = useState('https://via.placeholder.com/800x200/blue/white?text=Banner+1');

  return (
    <div>
      <A bannerImage={bannerImage} />
      <B setBannerImage={setBannerImage} />
    </div>
  );
}

export default App;

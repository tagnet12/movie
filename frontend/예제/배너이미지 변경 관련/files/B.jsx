function B({ setBannerImage }) {
  const changeBanner = () => {
    setBannerImage('https://via.placeholder.com/800x200/red/white?text=Banner+2');
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>컴포넌트 B</h2>
      <button onClick={changeBanner}>배너 이미지 변경</button>
    </div>
  );
}

export default B;

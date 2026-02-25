function A({ bannerImage }) {
  return (
    <div>
      <h2>컴포넌트 A</h2>
      <img src={bannerImage} alt="배너" style={{ width: '100%', maxWidth: '800px' }} />
    </div>
  );
}

export default A;

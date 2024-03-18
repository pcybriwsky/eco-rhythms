
import React, { useState } from 'react';
import Drawing from './Components/Sketches/Drawing';

const Home = () => {
  return (
    <div className="App bg-background text-text">
      {/* Comment */}
      <Drawing />
    </div>
  );
}

export default Home;
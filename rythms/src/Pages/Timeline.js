
import React, { useState } from 'react';
import Drawing from './Components/Sketches/TimelinePage';

const Home = () => {
  return (
    <div className="App bg-background text-text">
      <Drawing />
    </div>
  );
}

export default Home;
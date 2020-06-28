import React, { useState, useEffect } from 'react';
import Easel from './easel';
import './paintUI.scss';

export default function PaintUI() {
  let easelContainerRef = React.createRef();
  const [easelDimensions, setEaselDimentions] = useState({});

  useEffect(() => {
    // TODO: add window resize event tracking
    const {
      clientWidth: width,
      clientHeight: height,
    } = easelContainerRef.current;

    setEaselDimentions({ width, height });
  }, []);

  return (
    <>
      <div className="easel" ref={easelContainerRef}>
        <Easel
          width={easelDimensions.width}
          height={easelDimensions.height}
          bgColor={'#FFF'}
        />
      </div>
    </>
  );
}

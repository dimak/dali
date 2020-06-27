import React from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';

export default function Canvas(props) {
  const handleClick = (e) => {
    console.log('click!', e);
  }

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Text text="Try click on rect" />
        <Rect
          x={20}
          y={20}
          width={50}
          height={50}
          fill={'blue'}
          shadowBlur={5}
          onClick={handleClick}
        />
      </Layer>
    </Stage>
  )
}

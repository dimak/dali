import React from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';

export default function Canvas(props) {
  let timer;

  const handleHover = (e) => {
    if (dragState) {
      console.log(e);
    }
  }

  const getPointerPosition = stage =>
    setInterval(() => {
      console.log(stage.getPointerPosition());
    }, 10);

  const handleDragToggle = (e, isDragging = false) => {
    if (isDragging) {
      const stage = e.target.getStage();
      timer = getPointerPosition(stage);
      console.log(timer);
    } else {
      clearInterval(timer);
    }
  }

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Text text="Try click on rect" />
        <Rect
          x={20}
          y={20}
          width={150}
          height={150}
          fill={'blue'}
          shadowBlur={5}
          onMouseDown={e => handleDragToggle(e, true)}
          onMouseUp={e => handleDragToggle(e, false)}
        />
      </Layer>
    </Stage>
  )
}

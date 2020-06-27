import React, { useState } from 'react';
import { Stage, Layer, Rect, Text, Line } from 'react-konva';
import Konva from 'konva';

const INTERVAL = 10;

export default function Canvas(props) {
  const [timer, setTimer] = useState(null);
  const [drawPoints, setDrawPoints] = useState([]);

  const getPointerPosition = stage =>
    setTimer(
      setInterval(() => {
        const {x, y} = stage.getPointerPosition();
        setDrawPoints(drawPoints => drawPoints.concat([x, y]));
        console.log({x, y});
      }, INTERVAL)
    );

  const handleDragToggle = (e, isDragging = false) => {
    // TODO: check for out of bounds dragging
    if (isDragging) {
      const stage = e.target.getStage();
      getPointerPosition(stage);
    } else {
      clearInterval(timer);
      console.log('stop interval');
    }
  }

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer
        onMouseDown={e => handleDragToggle(e, true)}
        onMouseUp={e => handleDragToggle(e, false)}
      >
        <Text text={drawPoints.join(', ')} />
        <Rect
          x={20}
          y={20}
          width={window.innerWidth - 40}
          height={window.innerHeight - 40}
          fill={'white'}
          shadowBlur={5}
        />
        <Line
          points={drawPoints}
          stroke={'red'}
          strokeWidth={5}
          lineCap={'round'}
          lineJoin={'round'}
          tension={0}
        />
      </Layer>
    </Stage>
  )
}

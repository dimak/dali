import React, { useState } from 'react';
import { Stage, Layer, Rect, Text, Line } from 'react-konva';
import Konva from 'konva';

const COLORS = ['red', 'blue', 'green', 'yellow'];
const INTERVAL = 10;

export default function Canvas(props) {
  const [timer, setTimer] = useState(null);
  const [drawPoints, setDrawPoints] = useState([]);

  const getPointerPosition = stage =>
    setTimer(
      setInterval(() => {
        const {x, y} = stage.getPointerPosition();
        setDrawPoints((drawPoints) => {
          const lastLine = drawPoints[drawPoints.length - 1];
          const newPoints = lastLine.points.concat([x, y]);
          // replacing with a new array as opposed to using the original,
          // to ensure that the reference is not mutated outside of the state hook
          lastLine.points = newPoints;
          return [ ...drawPoints ]; // return shallow clone
        });
      }, INTERVAL)
    );

  const handleDragToggle = (e, isDragging = false) => {
    // TODO: check for out of bounds dragging
    if (isDragging) {
      const stage = e.target.getStage();
      // create a new line with color
      setDrawPoints(drawPoints => drawPoints.concat([
        {
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          points: []
        }
      ]));
      getPointerPosition(stage);
    } else {
      clearInterval(timer);
      console.log('stop interval');
    }
  }

  console.log(drawPoints);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer
        onMouseDown={e => handleDragToggle(e, true)}
        onMouseUp={e => handleDragToggle(e, false)}
      >
        <Rect
          x={20}
          y={20}
          width={window.innerWidth - 40}
          height={window.innerHeight - 40}
          fill={'white'}
          shadowBlur={5}
        />
        { drawPoints.map(line => (
          <Line
            points={line.points}
            stroke={line.color}
            strokeWidth={5}
            lineCap={'round'}
            lineJoin={'round'}
            tension={1}
          />
        )) }

      </Layer>
    </Stage>
  )
}

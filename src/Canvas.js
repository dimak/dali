import React, { useState } from 'react';
import { Stage, Layer, Rect, Text, Line, Circle } from 'react-konva';
import throttle from 'lodash.throttle';
import Konva from 'konva';

const COLORS = ['red', 'blue', 'green', 'yellow'];
const INTERVAL = 20;

export default function Canvas(props) {
  const [currentLine, setCurrentLine] = useState(null);
  const [previousLines, setPreviousLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleMouseDown = (e) => {
    setIsDrawing(true);

    const { layerX, layerY } = e.evt
    setCurrentLine({
      color: '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16),
      points: [layerX, layerY],
    });
  }

  // cleanup
  const handleMouseUp = (e) => {
    setIsDrawing(false);
    if (currentLine) {
      setPreviousLines(previousLines.concat([currentLine]));
    }
    setCurrentLine(null);
  }

  const handleThrottledMouseMove = throttle((e) => {
    if (isDrawing) {
      const { layerX, layerY } = e.evt; // gives x, y coords from the stage

      setCurrentLine(currentLine =>
        ({ ...currentLine, points: currentLine.points.concat([layerX, layerY]) })
      );
      console.log(currentLine);
    }
  }, INTERVAL)

  const handleMouseEnter = (e) => {
    console.log(e);

    if(e.evt.buttons === 1) { // left click is currently pressed
      handleMouseDown(e);
    }
  }
  // console.log(currentLine);

  const drawLine = (line) => {
    let Component = Line;
    let props = {
      points: line.points,
      stroke: line.color,
      strokeWidth: 5,
      lineCap: 'round',
      lineJoin: 'round',
      tension: 1,
      onMouseEnter: (e) => { e.cancelBubble = true },
    };

    if (line.points.length === 2) {
      Component = Circle;
      delete props.points;
      props.x = line.points[0];
      props.y = line.points[1];
    }

    return (<Component {...props} />);
  }

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleThrottledMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseUp}
      >
        <Rect
          x={20}
          y={20}
          width={window.innerWidth - 40}
          height={window.innerHeight - 40}
          fill={'white'}
          shadowBlur={5}
        />

        {/* old lines */}
        { previousLines.map(line => drawLine(line)) }

        {/* current line */}
        { currentLine && drawLine(currentLine) }
      </Layer>
    </Stage>
  )
}

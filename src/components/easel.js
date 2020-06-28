import React, { useState } from 'react';
import { Stage, Layer, Rect, Text, Line, Circle } from 'react-konva';
import throttle from 'lodash.throttle';
import Konva from 'konva';

const INTERVAL = 20;

export default function Easel({ width, height, bgColor }) {
  console.log(width, height);
  const [currentLine, setCurrentLine] = useState(null);
  const [previousLines, setPreviousLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [wentOutOfBounds, setWentOutOfBounds] = useState(false);

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

  const handleMouseLeave = (e) => {
    console.log('left canvas');
    setWentOutOfBounds(true);
    handleMouseUp(e);
  }

  const handleMouseEnter = (e) => {
    console.log('leftCanvas?', wentOutOfBounds);
    if (wentOutOfBounds) {
      setWentOutOfBounds(false);
      if(e.evt.buttons === 1) { // left click is currently pressed
        handleMouseDown(e);
      }
    }
  }
  // console.log(currentLine);

  /**
   * will draw a line or circle, depending on how many points are available
   * @param {Object} line meta data about a stroke
   * @param {String|Number} key unique identifier for JSX rendering
   * @return {Node}
   */
  const drawLine = (line, key) => {
    let Component = Line;
    let props = {
      key,
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
    <Stage className="canvas" width={width} height={height}>
      <Layer
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleThrottledMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={bgColor}
        />

        {/* old lines */}
        { previousLines.map((line, i) => drawLine(line, i)) }

        {/* current line */}
        { currentLine && drawLine(currentLine, previousLines.length) }
      </Layer>
    </Stage>
  )
}

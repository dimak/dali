import React, { useState } from 'react';
import { Stage, Layer, Rect, Text, Line } from 'react-konva';
import Konva from 'konva';

const COLORS = ['red', 'blue', 'green', 'yellow'];
const INTERVAL = 20;

export default function Canvas(props) {
  const [timer, setTimer] = useState(null);  // does not need to be a hook
  const [currentLine, setCurrentLine] = useState(null);
  const [previousLines, setPreviousLines] = useState([]);

  const startDrawing = (stage) => {
    console.log('start');

    // clear an old timer, if one exists for any reason
    stopDrawing();

    const newTimer = setInterval(() => {
      const { x, y } = stage.getPointerPosition(); // gives x, y coords from the stage


      setCurrentLine((currentLine) => {
        // only add a new point if the user actually moved the mouse
        const [prevX, prevY] = currentLine.points.slice(-2);

        return prevX === x && prevY === y ?
          currentLine :
          { ...currentLine, points: currentLine.points.concat([x, y]) }
      });
    }, INTERVAL);

    setTimer(newTimer);
  }

  const stopDrawing = () => {
    if(timer) {
      console.log('stop');
      setPreviousLines(previousLines.concat([currentLine]));
      clearInterval(timer);
      setTimer(null);
      setCurrentLine(null);
      console.log(previousLines);
    }
  }

  const handleDragToggle = (e, isDrawing = false) => {
    // TODO: check for out of bounds dragging
    if (isDrawing) {
      const stage = e.target.getStage();
      // create a new line with color
      setCurrentLine({
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        points: []
      });
      startDrawing(stage);
    } else {
      stopDrawing();
    }
  }

  const handleMouseEnter = (e) => {
    if(e.evt.buttons === 1) { // left click is currently pressed
      const stage = e.target.getStage();
      // create a new line with color
      const { x, y } = stage.getPointerPosition()
      setCurrentLine({
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        points: [x, y]
      });
      startDrawing(stage);
    }
  }
  // console.log(currentLine);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer
        onMouseDown={e => handleDragToggle(e, true)}
        onMouseUp={e => handleDragToggle(e, false)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={e => stopDrawing()}
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
        { previousLines.map(line => (
          <Line
            points={line.points}
            stroke={line.color}
            strokeWidth={5}
            lineCap={'round'}
            lineJoin={'round'}
            tension={1}
          />
        )) }

        {/* current line */}
        { currentLine && (<Line
            points={currentLine.points}
            stroke={currentLine.color}
            strokeWidth={5}
            lineCap={'round'}
            lineJoin={'round'}
            tension={1}
          />)
        }
      </Layer>
    </Stage>
  )
}

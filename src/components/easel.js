import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Stage, Layer, Rect, Text, Line, Circle } from 'react-konva';
import throttle from 'lodash.throttle';
import PaintUIContext from './paintUIContext';

const INTERVAL = 10;

export default function Easel({ width, height, bgColor, provideExportHandler }) {
  // points within the currently-drawn line
  const [currentLine, setCurrentLine] = useState(null);
  // points that have been saved, once the mouse has been released
  const [previousLines, setPreviousLines] = useState([]);
  // toggle to determine if the mouse is currently down or not
  const [isDrawing, setIsDrawing] = useState(false);
  // used for literal edge handling: if the user continues to draw out of bounds
  const [wentOutOfBounds, setWentOutOfBounds] = useState(false);
  // easel params determined by the parent ui
  const {
    color,
    mode,
    brushWidth,
  } = useContext(PaintUIContext);

  // reference to the stage instance element
  let stageRef;

  // update the handler when previousLines has been updated;
  // otherwise, we'll have a stale reference to previousLines
  useEffect(() => {
    provideExportHandler(handleExport);
  }, [previousLines]);

  /**
   * @typedef {Object} EaselExport
   * @property {string} image base64 png export of the canvas
   * @property {string} thumb base64 png thumbnail export of the canvas
   * @property {string} retina base64 png retina export of the canvas
   */

  /**
   * handle export and saving of the canvas data
   * NOTE: this function will be invoked by a parent
   * @return {EaselExport} the easel data that we want to store
   */
  const handleExport = () => {
    const stage = stageRef.getStage();

    return {
      image: stage.toDataURL(),
      thumb: stage.toDataURL({ pixelRatio: .5 }),
      retina: stage.toDataURL({ pixelRatio: 2 }),
      strokes: previousLines,
    }
  }

  /**
   * handle drawing start
   * @param {Event} e
   */
  const handleMouseDown = (e) => {
    setIsDrawing(true);

    const { layerX, layerY } = e.evt
    setCurrentLine({
      color: mode ? color : bgColor,
      brushWidth,
      points: [layerX, layerY],
    });
  }

  /**
   * handle cleanup after drawing has stopped
   * @param {Event} e
   */
  const handleMouseUp = (e) => {
    setIsDrawing(false);
    if (currentLine) {
      setPreviousLines(previousLines.concat([currentLine]));
    }
    setCurrentLine(null);
  }

  /**
   * record mouse movement if mouse is currently pressed, but throttled
   * so that it doesn't overwhelm the browser
   * @param {Event} e
   */
  const handleThrottledMouseMove = throttle((e) => {
    if (isDrawing) {
      const { layerX, layerY } = e.evt; // gives x, y coords from the stage

      setCurrentLine(currentLine =>
        ({ ...currentLine, points: currentLine.points.concat([layerX, layerY]) })
      );
    }
  }, INTERVAL)

  /**
   * handle mouse leaving the canvas; pretend the user stopped drawing
   * @param {Event} e
   */
  const handleMouseLeave = (e) => {
    setWentOutOfBounds(true);
    handleMouseUp(e);
  }

  /**
   * handle returning to the canvas; if the mouse button is pressed, start drawing
   * @param {Event} e
   */
  const handleMouseEnter = (e) => {
    if (wentOutOfBounds) {
      setWentOutOfBounds(false);
      if(e.evt.buttons === 1) { // left click is currently pressed
        handleMouseDown(e);
      }
    }
  }

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
      strokeWidth: line.brushWidth,
      lineCap: 'round',
      lineJoin: 'round',
      tension: 0,
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
    <Stage ref={ref => stageRef = ref } className="canvas" width={width} height={height}>
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

Easel.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  bgColor: PropTypes.string,
  provideExportHandler: PropTypes.func,
}

Easel.defaulProps = {
  bgColor: '#FFFFFF',
  provideExportHandler: () => { console.log('provideExportHandler not provided')},
}

import React from "react";
import ReactDOM from "react-dom";
import { Stage } from "react-pixi-fiber";
// import './Canvas.css';

const height = 450;
const width = 600;
const OPTIONS = {
  backgroundColor: 0x1099bb,
  height: height,
  width: width
};

function Canvas() {
  return (
    <div className="Canvas">
      <Stage options={OPTIONS}>
      </Stage>
    </div>
  );
}

export default Canvas;

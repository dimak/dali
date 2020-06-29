import React, { useState, useEffect } from 'react';
import {
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
  Toggle,
  Slider,
 } from 'rsuite';
import ColorPicker from 'rsuite-color-picker';

import PaintUIContext from './paintUIContext';
import Easel from './easel';

import 'rsuite-color-picker/lib/styles.css';
import './paintUI.scss';

export default function PaintUI() {
  let easelContainerRef = React.createRef();
  const [easelDimensions, setEaselDimentions] = useState({});
  const [color, setColor] = useState('#000000');
  const [mode, setMode] = useState(true);
  const [brushWidth, setBrushWidth] = useState(5);

  useEffect(() => {
    // TODO: add window resize event tracking
    const {
      clientWidth: width,
      clientHeight: height,
    } = easelContainerRef.current;

    setEaselDimentions({ width, height });
  }, []);

  const handleModeToggle = (val) => {
    setMode(val);
  }

  const handleBrushSizeChange = (val) => {
    setBrushWidth(val)
  }

  const handleColorChange = (e) => {
    setColor(e.hex);
  }

  return (
    <>
      <div className="toolbar">
        <Form layout="inline">
          <FormGroup>
            <ControlLabel>Mode: </ControlLabel>
            <Toggle
              size="lg"
              checkedChildren="Paint"
              unCheckedChildren="Erase"
              checked={mode}
              onChange={handleModeToggle}
            />
          </FormGroup>
          <FormGroup className="brush-size">
            <ControlLabel>Brush size: </ControlLabel>
            <Slider
              progress
              defaultValue={brushWidth}
              min={1}
              max={20}
              onChange={handleBrushSizeChange}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Brush color: </ControlLabel>
            <ColorPicker
              value={color}
              onChangeComplete={handleColorChange}
            />
          </FormGroup>
        </Form>
      </div>
      <div className="easel" ref={easelContainerRef}>
        <PaintUIContext.Provider value={{
          color,
          mode,
          brushWidth
        }}>
          <Easel
            width={easelDimensions.width}
            height={easelDimensions.height}
            bgColor={'#FFF'}
          />
        </PaintUIContext.Provider>
      </div>
    </>
  );
}

import React, { useState } from 'react';
import {
  Panel,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  Toggle,
  ButtonToolbar,
  Button,
} from 'rsuite';

import './login.scss';

export default function(props) {
  const [ mode, setMode ] = useState(false);

  const handleOnChange = (val) => {
    console.log(val);
    setMode(val);
  }

  return (
    <Panel shaded className="login">
      <div className="login-toggle">
        <Toggle
          size="lg"
          defaultValue={mode}
          onChange={handleOnChange}
          checkedChildren="New user"
          unCheckedChildren="Log in"
        />
      </div>
      <Form layout="horizontal">
        <FormGroup>
          <ControlLabel>Username:</ControlLabel>
          <FormControl name="name" />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Password:</ControlLabel>
          <FormControl name="password" type="password" />
        </FormGroup>
        <FormGroup>
          <ButtonToolbar>
            <Button appearance="primary">{ mode ? 'Create' : 'Log in' }</Button>
            <Button appearance="default">Cancel</Button>
          </ButtonToolbar>
        </FormGroup>
      </Form>
    </Panel>
  )
};

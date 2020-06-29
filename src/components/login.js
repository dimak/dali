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
  Alert,
} from 'rsuite';
import { withRouter } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { doFetch } from '../util/api';
import { cookieProps, USERNAME, ID } from '../util/cookies';

import './login.scss';

function Login({ history }) {
  const [mode, setMode] = useState(false);
  const [cookies, setCookies] = useCookies([USERNAME, ID]);
  console.log(cookies);
  let form;

  const handleModeChange = (val) => {
    setMode(val);
  }

  const recordFormData = (formValues) => {
    form = formValues;
  }

  const handleSubmitForm = async () => {
    const apiRoute = mode ? '/api/user/create' : '/api/user/login';
    try {
      const response = await doFetch(apiRoute, {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setCookies(USERNAME, response.username, cookieProps);
      setCookies(ID, response._id, cookieProps);
      history.push('/');
    } catch (e) {
      if (e.error) {
        Alert.error(e.error);
      }
    }
  }

  return (
    <Panel shaded className="login">
      <div className="login-toggle">
        <Toggle
          size="lg"
          defaultValue={mode}
          onChange={handleModeChange}
          checkedChildren="New user"
          unCheckedChildren="Log in"
        />
      </div>
      <Form layout="horizontal" onChange={recordFormData}>
        <FormGroup>
          <ControlLabel>Username:</ControlLabel>
          <FormControl name="username" />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Password:</ControlLabel>
          <FormControl name="password" type="password" />
        </FormGroup>
        <FormGroup>
          <ButtonToolbar>
            <Button
              appearance="primary"
              onClick={handleSubmitForm}>
                { mode ? 'Create' : 'Log in' }
            </Button>
          </ButtonToolbar>
        </FormGroup>
      </Form>
    </Panel>
  )
};

export default withRouter(Login);

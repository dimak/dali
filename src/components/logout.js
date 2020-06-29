import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { USERNAME, ID } from '../util/cookies';

function Logout({ history }) {
  const [cookies, setCookies, removeCookie] = useCookies([USERNAME, ID]);

  useEffect(() => {
    removeCookie(USERNAME);
    removeCookie(ID);
    history.push('/');
  }, []);

  return null;
}

export default withRouter(Logout);

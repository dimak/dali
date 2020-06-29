import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Icon } from 'rsuite';

export const RouterLink = React.forwardRef((props, ref) => {
  const { to, children, ...rest } = props;
  return (
    <Link to={to} {...rest}>{children}</Link>
  );
});

export const NavLink = props => <Nav.Item componentClass={RouterLink} {...props} />;

export default function({ username }) {
  return (
    <Navbar className="navbar">
      <Navbar.Header>
        <span className="logo">Dali</span>
      </Navbar.Header>
      <Navbar.Body>
        <Nav>
          <NavLink to="/">Gallery</NavLink>
          <NavLink to="/draw">Create</NavLink>
        </Nav>
        { username ?
          (<Nav pullRight>
            <NavLink to="/logout">Logout</NavLink>
          </Nav>) : null 
        }
      </Navbar.Body>
    </Navbar>
  )
}

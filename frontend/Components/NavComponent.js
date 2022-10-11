import React from "react";
import PropTypes from "prop-types";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

// Step 3 Import some of the near tools
import { signInWithNearWallet, signOutNearWallet } from "../near-api";

const NavComponent = (props) => {
  return (
    <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
      <Container>
        <Navbar.Brand href='/'>
          <img src={"https://i.imgur.com/31dvjnh.png"}></img>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='mx-auto'></Nav>
          <Nav>
            <Nav.Link href='/newpoll'>New Poll</Nav.Link>
            <Nav.Link
              onClick={
                window.accountId === ""
                  ? signInWithNearWallet
                  : signOutNearWallet
              }
            >
              {window.accountId === "" ? "Login" : window.accountId}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

NavComponent.propTypes = {};

export default NavComponent;

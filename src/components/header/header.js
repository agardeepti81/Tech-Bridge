import React, { Component } from "react";
import { Container,Navbar } from "react-bootstrap";

class Header extends Component {
    render() {
        return (<>
            <Navbar bg="dark" variant="dark" fixed="top">
                <Container>
                    <Navbar.Brand href="#home">
                        <img
                            alt=""
                            src="/logo192.png"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        Tech Bridge
                    </Navbar.Brand>
                </Container>
            </Navbar>
        </>)
    }
}

export default Header;
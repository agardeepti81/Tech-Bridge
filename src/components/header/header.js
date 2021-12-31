import React, { Component } from "react";
import { Navbar, NavbarBrand } from "reactstrap";

class Header extends Component {
    render() {
        return (
            <div id="navbar">
                <Navbar
                    color="dark"
                    dark
                    fixed="top"
                >
                    <NavbarBrand href="/">
                        Tech-Bridge
                    </NavbarBrand>
                </Navbar>
            </div>
        )
    }
}

export default Header;
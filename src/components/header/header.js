import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Navbar, NavbarBrand, NavbarText, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navMenuOpen: false,
            navigate: false,
            logoutModal: false
        };
        this.toggle = this.toggle.bind(this);
        this.logout = this.logout.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    toggle() {
        this.setState({
            navMenuOpen: !this.state.navMenuOpen
        });
    }
    logout() {
        let logoutData = JSON.stringify({
            "email": this.props.email
        });
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: logoutData,
            redirect: 'follow'
        };
        fetch(this.props.logoutApi, requestOptions)
            .then(response => response.text())
            .then(response => {
                this.props.logout();
                this.setState({
                    logoutModal: true
                })
            })
            .catch(error => {
                console.error(error)
            });
    }
    closeModal() {
        this.setState({
            logoutModal: false
        })
    }
    render() {
        let userToggle = [];
        if (this.props.userName) {
            userToggle.push(
                <NavbarText>
                    <Dropdown toggle={this.toggle} isOpen={this.state.navMenuOpen}>
                        <DropdownToggle caret>
                            {this.props.userName}
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={this.logout}>Logout</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarText>
            )
        }
        return (
            <div id="navbar">
                <Modal
                    isOpen={this.state.logoutModal}
                >
                    <ModalHeader>Successfully Logged Out</ModalHeader>
                    <ModalBody>
                        You can go to start page to login again
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" href="/" onClick={this.closeModal}>Start Page</Button>
                    </ModalFooter>
                </Modal>
                <Navbar
                    color="dark"
                    dark
                    fixed="top"
                >
                    <NavbarBrand href="/">
                        Tech-Bridge
                    </NavbarBrand>
                    {userToggle}
                </Navbar>
            </div>
        )
    }
}

export default Header;
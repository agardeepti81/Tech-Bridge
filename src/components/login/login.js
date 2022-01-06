import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

const NavigateToHome = ({ nav }) => {
    const navigate = useNavigate();

    if (nav)
        navigate('/home');

    return (
        <></>
    );
}

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navigate: false
        }
        this.login = this.login.bind(this);
    }
    login(event) {
        event.preventDefault();
        fetch(`${this.props.loginApis.loginUser}?email=${this.email.value}&password=${this.password.value}`)
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.authorized) {
                        this.props.getLessonProgressEmailAndUserName(result.lessonProgress, this.email.value, result.name);
                        this.setState({
                            navigate: true
                        })
                    }
                    else
                    alert("Incorrect email or password");
                }
            )
    }

    render() {
        return (
            <Form onSubmit={this.login}>
                <FormGroup>
                    <Label for="email">
                        Email
                    </Label>
                    <Input
                        id="loginEmail"
                        name="email"
                        placeholder="Enter your email ID"
                        type="email"
                        innerRef={(input) => this.email = input}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="password">
                        Password
                    </Label>
                    <Input
                        id="loginPassword"
                        name="password"
                        placeholder="Enter password"
                        type="password"
                        innerRef={(input) => this.password = input}
                    />
                </FormGroup>
                <Button type="submit" color="primary">
                    Submit
                </Button>
                <NavigateToHome nav={this.state.navigate} />
            </Form>
        )
    }
}

export default Login;
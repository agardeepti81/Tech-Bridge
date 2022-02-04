import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

const NavigateToStartPage = ({nav}) => {
    const navigate = useNavigate();

    if(nav)
    navigate('/start-page');

    return (
        <></>
    );
}


class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emails: [],
            navigate: false
        }
        this.signUpAccount = this.signUpAccount.bind(this);
    }
    componentDidMount() {
        fetch(this.props.signUpApis.getEmails)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        emails: result
                    });
                }
            )
    }
    signUpAccount(event) {
        event.preventDefault();
        if (this.state.emails.find(email => email === this.email.value)) {
            alert("Account with this email altready exists");
            return;
        }
        if (this.password.value !== this.confirmPassword.value) {
            alert("Passwords didn't match");
            return;
        }
        var newUserData = JSON.stringify({
            "emailId": this.email.value,
            "name": this.name.value,
            "password": this.password.value
        });
        this.sendSignUpToServerAndReportToUser(newUserData);
    }
    sendSignUpToServerAndReportToUser(dataToSend) {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: dataToSend,
            redirect: 'follow'
        };

        fetch(this.props.signUpApis.createUser, requestOptions)
            .then(response => response.text())
            .then(response => {
                let result = JSON.parse(response);
                if (result.statusCode === 200) {
                    alert(result.body);
                    this.setState({
                        navigate: true
                    })
                }
            })
            .catch(error => {
                alert("Account Creation Failed");
                console.log('error', error)
            });
    }

    render() {
        return (
            <Form onSubmit={this.signUpAccount}>
                <FormGroup>
                    <Label for="email">
                        Email
                    </Label>
                    <Input
                        id="signupEmail"
                        name="email"
                        placeholder="Enter your email ID"
                        type="email"
                        innerRef={(input) => this.email = input}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="name">
                        Name
                    </Label>
                    <Input
                        id="signupName"
                        name="name"
                        placeholder="Enter your Name"
                        type="text"
                        innerRef={(input) => this.name = input}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="password">
                        Password
                    </Label>
                    <Input
                        id="signupPassword"
                        name="password"
                        placeholder="Enter password"
                        type="password"
                        innerRef={(input) => this.password = input}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="confirmPassword">
                        Confirm Password
                    </Label>
                    <Input
                        id="signupConfirmPassword"
                        name="confirmPassword"
                        placeholder="Re-Enter your password"
                        type="password"
                        innerRef={(input) => this.confirmPassword = input}
                    />
                </FormGroup>
                <Button type="submit" color="primary">
                    Submit
                </Button>
                <NavigateToStartPage nav={this.state.navigate} />
            </Form>
        )
    }
}

export default SignUp;
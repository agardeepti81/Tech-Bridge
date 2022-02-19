import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

const NavigateToHome = ({ nav, role }) => {
    const navigate = useNavigate();

    if (nav) {
        navigate('/home');
    }

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
        let isEmpty = this.checkEmptyValues();
        if (isEmpty)
            return;
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
            "name": this.userName.value,
            "password": this.password.value,
            "role": "Learner"
        });
        this.sendSignUpToServerAndReportToUser(newUserData, this.email.value, this.userName.value);
    }

    checkEmptyValues() {
        if (this.email.value.trim() === "") {
            alert("Please Enter your Email ID");
            return true;
        }
        if (this.userName.value.trim() === "") {
            alert("Please Enter your User Name");
            return true;
        }
        if (this.password.value.length < 8) {
            alert("Your password must contain atleast 8 characters");
            return true;
        }
        return false;
    }

    sendSignUpToServerAndReportToUser(dataToSend, email, userName) {
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
                    const lessonProgress =[];
                    this.props.getLessonProgressEmailAndUserName(lessonProgress, email, userName);
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
            <div id="signup">
                <h1>Sign up to start your journey</h1>
                <Form onSubmit={this.signUpAccount}>
                    <FormGroup>
                        <Input
                            id="signupEmail"
                            name="email"
                            placeholder="Enter your email ID"
                            type="email"
                            innerRef={(input) => this.email = input}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Input
                            id="signupUserName"
                            name="UserName"
                            placeholder="Enter your User Name"
                            type="text"
                            innerRef={(input) => this.userName = input}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Input
                            id="signupPassword"
                            name="password"
                            placeholder="Enter password"
                            type="password"
                            innerRef={(input) => this.password = input}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Input
                            id="signupConfirmPassword"
                            name="confirmPassword"
                            placeholder="Re-Enter your password"
                            type="password"
                            innerRef={(input) => this.confirmPassword = input}
                        />
                    </FormGroup>
                    <Button type="submit" color="primary">
                        Create Your Account
                    </Button>
                </Form>
                <NavigateToHome nav={this.state.navigate} />
            </div>
        )
    }
}

export default SignUp;
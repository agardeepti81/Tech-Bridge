import React, { Component } from 'react';
import { Button, Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle } from 'reactstrap';
import { Link } from 'react-router-dom';
import './start-page.css';
import SignUp from "../signup/signup";
import Login from "../login/login";

class StepTile extends Component {
    render() {
        return (
            <Card className='stepTile'>
                <CardImg
                    alt="Card image cap"
                    src={this.props.imgSrc}
                    top
                    width="100%"
                />
                <CardBody>
                    <CardTitle tag="h5">
                        {this.props.title}
                    </CardTitle>
                    <CardText>
                        {this.props.content}
                    </CardText>
                </CardBody>
            </Card>);
    }
}

class StartPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            steps: [
                {
                    placement: 'bottom',
                    title: 'Chose Profile',
                    body: 'Understand what someone in a specific profile does. How does this work affect people. If this looks exciting to you, understand what are the essential qualities to do well in this area. If this seems a good match with you, go for it',
                    text: 'Step 1'
                },
                {
                    placement: 'bottom',
                    title: 'Select Guide',
                    body: 'Browse through the list of guides, who take people through the journey to develop a specific profile. Each guide takes people through a unique roadmap that they have conceptualised through their experience. Understand what they expect in terms of prerequisite and what is expected from you. Select the guide that seems suitable to you',
                    text: 'Step 2'
                },
                {
                    placement: 'bottom',
                    title: 'Walk the Roadmap',
                    body: 'Walk through the roadmap with your guide. You will be supported by your fellow learners and a group of facilitators. As you walk through the journey you can expect to learn not only the subject but other soft skills that your guide has learnt through his/her own experience. And on top of it you will earn the references, that will help you get connected in the industry for a suitable opening',
                    text: 'Step 3'
                }

            ]
        };
    }
    render() {

        return (<div className="mainpage" id='start_page'>
            <h1>Everyone can become a software developer</h1>
            <p>Irrespective of age, prior education, existing profession, marital status etc.</p>
            <div id="steps">
                {this.state.steps.map((step, i) => {
                    return <StepTile key={i} title={step.title} id={i} content={step.body} imgSrc="https://picsum.photos/256/186" />;
                })}
            </div>
            <div id="signupLogin">
                <SignUp />
                <Login />
            </div>
            {/* <div id='loginOptions'>
                <Link to={`/signup`}><Button color="primary" className='loginButtons'>Sign Up</Button></Link>
                <div id='or'>OR</div>
                <Link to={`/login`}><Button color="primary" className='loginButtons'>Login</Button></Link>
            </div> */}
        </div>)
    }
}

export default StartPage;
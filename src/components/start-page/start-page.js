import React, { Component } from 'react';
import './start-page.css';
import SignUp from "../signup/signup";
import Button from '@mui/material/Button';

class StartPage extends Component {
    moveToTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
    
    render() {
        return (<div>
            <div className="mainpage" id='start_page'>
                <div id="title"><h1>Want to learn to Code?</h1></div>
                <div id="subtitle"><p>Learn to Code for Free with Our Foundation Course Today</p></div>
                <div id="main">
                    {window.screen.width < 768 && <SignUp signUpApis={this.props.signUpApis} getLessonProgressEmailAndUserName={this.props.getLessonProgressEmailAndUserName}/>}
                    <div id="content">
                        <div id="content-head">What is this Free Course About?</div>
                        <div id="content-info">
                            <p>Aspiring software developers have been working with us on <b>live projects</b> since 2014. This has helped them gain practical working experience and critical skills to be successful in the industry. <b>Everyone got a job</b> (at times much before they even completed their graduation) and they are growing fast.</p>

                            <p>This free course will give you skills, so that you can work with us on live projects.</p>

                            <p>Here's what you are going to get from this course:</p>
                            <ul>
                                <li>2 hour per day of <b>live sessions with industry experts</b></li>
                                <li>Guidance for developing logic and writing code</li>
                            </ul>
                        </div>
                    </div>
                    {window.screen.width >= 768 && <SignUp signUpApis={this.props.signUpApis} getLessonProgressEmailAndUserName={this.props.getLessonProgressEmailAndUserName}/>}
                </div>
                <div id="certificate">
                    <div className="head">Free Course Completion Certificate</div>
                    <div className="subHead">You will get a valid course completion certificate that you can showcase online.<br />
                        You will get this after completing the course.</div>
                    <img src={process.env.PUBLIC_URL + "/images/start-page/certificate.jpg"} id="certificateImg" />
                </div>
                <div id="reviews">
                    <div className="head">What our learners say</div>
                    <img src={process.env.PUBLIC_URL + "/images/start-page/review_1.png"} className="reviewImg" />
                    <img src={process.env.PUBLIC_URL + "/images/start-page/review_2.png"} className="reviewImg" />
                    <img src={process.env.PUBLIC_URL + "/images/start-page/review_3.png"} className="reviewImg" />
                </div>
            </div>
            <div id="footer">
                <Button id="footerButton" variant='contained' onClick={this.moveToTop}>Sign Up For the Free Course</Button>
            </div>
        </div>)
    }
}

export default StartPage;
import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import './start-page.css';

class StartPage extends Component {
    render() {
        return (<div id='start_page'>
            <div id='loginOptions'>
                <Link to={`/signup`}><Button color="primary" className='loginButtons'>Sign Up</Button></Link>
                <div id='or'>OR</div>
                <Link to={`/login`}><Button color="primary" className='loginButtons'>Login</Button></Link>
            </div>
        </div>)
    }
}

export default StartPage;
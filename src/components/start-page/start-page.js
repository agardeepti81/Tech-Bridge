import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import './start-page.css';

class StartPage extends Component {
    render() {
        return (<div id='start_page'>
            <div id='loginOptions'>
                <Button className='loginButtons'>Sign Up</Button>
                <div id='or'>OR</div>
                <Button className='loginButtons'>Login</Button>
            </div>
        </div>)
    }
}

export default StartPage;
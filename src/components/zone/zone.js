import React, { Component } from "react";
import "./zone.css";
import { Card, Button } from "react-bootstrap";

class Zone extends Component {
    render() {
        let zoneData=this.props.zoneData,button;
        if(zoneData.status==="locked")
            button=<Button variant="danger" disabled>Locked</Button>;
        if(zoneData.status==="completed")
            button=<Button variant="success">Completed</Button>;
        if(zoneData.status==="active")
            button=<Button variant="primary">Start</Button>;
        if(zoneData.status==="resume")
            button=<Button variant="warning">Resume</Button>;
        return (
            <Card className="zone">
                {/* <Card.Img variant="top" src="images/holder100x180.svg" /> */}
                <Card.Body>
                    <Card.Title>{zoneData.name}</Card.Title>
                    <Card.Text>{zoneData.desc}</Card.Text>
                    {button}
                </Card.Body>
            </Card>)
    }
}

export default Zone;
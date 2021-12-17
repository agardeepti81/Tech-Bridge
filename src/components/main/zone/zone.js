import React, { Component } from "react";
import "./zone.css";
import { Button, Card } from "reactstrap";
import { Link } from "react-router-dom";

class Zone extends Component {
    render() {
        let zoneData=this.props.zoneData,button;
        if(zoneData.status==="locked")
            button=<Button variant="danger" disabled>Locked</Button>;
        if(zoneData.status==="completed")
            button=<Link to={`/zone/${zoneData.name}`}><Button variant="success">Completed</Button></Link>;
        if(zoneData.status==="active")
            button=<Link to={`/zone/${zoneData.name}`}><Button variant="primary">Start</Button></Link>;
        if(zoneData.status==="resume")
            button=<Link to={`/zone/${zoneData.name}`}><Button variant="warning">Resume</Button></Link>;
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
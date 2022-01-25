import React, { Component } from "react";
import { Button, Card, CardBody, CardTitle, CardText } from "reactstrap";
import { Link } from "react-router-dom";

class Zone extends Component {
    render() {
        const { zoneData, status } = this.props;
        let button;
        if (status === "locked")
            button = <Button color="danger" disabled>Locked</Button>;
        if (status === "completed")
            button = <Link to={`/zone/${zoneData.name}`}><Button color="success">Completed</Button></Link>;
        if (status === "start")
            button = <Link to={`/zone/${zoneData.name}`}><Button color="primary">Start</Button></Link>;
        if (status === "inprogress")
            button = <Link to={`/zone/${zoneData.name}`}><Button color="warning">Resume</Button></Link>;
        return (<div>
            <div className="zoneHead">{zoneData.name}</div>
            <div className="zoneContent">{zoneData.desc}</div>
            <div className="zoneButton">{button}</div>
        </div>);
    }
}

export default Zone;
import React, { Component } from "react";
import "./zone.css";
import { Button, Card, CardBody, CardTitle, CardText } from "reactstrap";
import { Link } from "react-router-dom";

class Zone extends Component {
    constructor(props){
        super(props);
        this.updateActiveZoneStatus = this.updateActiveZoneStatus.bind(this);
    }
    updateActiveZoneStatus(){
        this.props.updateActiveZoneStatus(this.props.status);
    }
    render() {
        const { zoneData, status } = this.props;
        let button;
        if (status === "locked")
            button = <Button color="danger" disabled>Locked</Button>;
        if (status === "completed")
            button = <Link to={`/zone/${zoneData.name}`}><Button color="success" onClick={this.updateActiveZoneStatus}>Completed</Button></Link>;
        if (status === "start")
            button = <Link to={`/zone/${zoneData.name}`}><Button color="primary" onClick={this.updateActiveZoneStatus}>Start</Button></Link>;
        if (status === "inprogress")
            button = <Link to={`/zone/${zoneData.name}`}><Button color="warning" onClick={this.updateActiveZoneStatus}>Resume</Button></Link>;
        return (
            <Card className="zone">
                <CardBody>
                    <CardTitle tag="h5">{zoneData.name}</CardTitle>
                    {/* <CardSubtitle
                        className="mb-2 text-muted"
                        tag="h6"
                    >
                        Card subtitle
                    </CardSubtitle> */}
                    <CardText>{zoneData.desc}</CardText>
                    {button}
                </CardBody>
            </Card>)
    }
}

export default Zone;
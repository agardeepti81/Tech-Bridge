import React, { Component } from "react";
import { Button, Card, CardBody, CardTitle, CardText } from "reactstrap";
import { Link } from "react-router-dom";

class Zone extends Component {
    render() {
        const { zoneData, status } = this.props;
        let button, zoneDesc=[];
        if (status === "locked")
            button = <Button color="danger" disabled>Locked</Button>;
        if (status === "completed")
            button = <Link to={`/zone/${zoneData.name}`}><Button color="success">Completed</Button></Link>;
        if (status === "start")
            button = <Link to={`/zone/${zoneData.name}`}><Button color="primary">Start</Button></Link>;
        if (status === "inprogress")
            button = <Link to={`/zone/${zoneData.name}`}><Button color="warning">Resume</Button></Link>;
        if(status === "start" || status === "inprogress"){
            zoneDesc.push(<CardText>{zoneData.desc}</CardText>);
        }
        return (
            <Card className="zone">
                <CardBody className={status}>
                    <CardTitle tag="h5">{zoneData.name}</CardTitle>
                    {/* <CardSubtitle
                        className="mb-2 text-muted"
                        tag="h6"
                    >
                        Card subtitle
                    </CardSubtitle> */}
                    {zoneDesc}
                    {button}
                </CardBody>
            </Card>)
    }
}

export default Zone;
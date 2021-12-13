import React, { Component } from "react";
import zonesJson from "../../data/roadmap_foundation.json";
import zone1 from "../../data/foundation/zone1.json";
import { Table, Card, Button } from "react-bootstrap";

class ZoneContent extends Component {
    render() {
        let zone1Data = zone1.sections, zone1Html = [];

        for (let i = 0; i < zone1Data.length; i++) {
            zone1Html.push(<zone1 zone1Data={zone1Data[i]} />);
        }
        console.log(zone1);
        console.log(zone1Html+"haii");
        return (
            <div>
                <Card style={{ width: '80%', margin: '1.5% auto' }}>
                    <Card.Body>
                        <Table style={{ width: '60%', margin: 'auto 8%' }}>
                            <thead>
                                <Button style={{ margin: 'auto 2%', color: 'grey',backgroundColor:'white',border: 'white'}}>Text</Button>
                                <Button style={{ margin: 'auto 2%', color: 'grey',backgroundColor:'white' ,border: 'white'}}>Video</Button>
                            </thead>
                        </Table>
                        <hr/>
                        <div>
                            {zone1Html}
                        </div>
                    </Card.Body>
                </Card>
            </div>)
    }
}
export default ZoneContent;
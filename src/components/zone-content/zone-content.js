import React, { Component } from "react";
import "./zone-content.css"

import { Accordion } from "react-bootstrap";
import zoneJson from "../../data/foundation/zone1.json";
import ZoneSection from "./zone-section/zone-section";

class ZoneContent extends Component {
    render() {
        let sectionsData = zoneJson.sections, sectionsHtml = [];

        for (let i = 0; i < sectionsData.length; i++) {
            sectionsHtml.push(<Accordion.Item eventKey={i}>
                <Accordion.Header>{sectionsData[i].desc}</Accordion.Header>
                <Accordion.Body><ZoneSection sectionData={sectionsData[i]}/></Accordion.Body>
            </Accordion.Item>)
            // sectionsHtml.push(<ZoneSection sectionData={sectionsData[i]} />);
        }
        return (<div className="sections">
            <Accordion defaultActiveKey="0">{sectionsHtml}</Accordion></div>)
    }
}
export default ZoneContent;
import React, { Component } from "react";
import Zone from "./zone/zone";

class Main extends Component {
    render() {
        const { zonesJson } = this.props;
        let zones = [];
        for (let i = 0; i < zonesJson.length; i++) {
            zones.push(zonesJson[i].name);
        }
        const { lessonProgress } = this.props;
        let zonesHtml = [], i = 0, userZones = [], resumeZone = false;
        for (let j = 0; j < lessonProgress.length; j++) {
            if (lessonProgress[j].status)
                userZones.push(lessonProgress[j].zoneName)
            else {
                resumeZone = true;
            }
        }
        while (i < zones.length) {
            if (userZones.find(zone => zone === zones[i])) {
                zonesHtml.push(<Zone zoneData={zonesJson[i]} status="completed" />)
                i++;
            }
            else
                break;
        }
        if (resumeZone)
            zonesHtml.push(<Zone zoneData={zonesJson[i]} status="inprogress" />)
        else if (i < zones.length)
            zonesHtml.push(<Zone zoneData={zonesJson[i]} status="start" />)
        i++;
        while (i < zones.length) {
            zonesHtml.push(<Zone zoneData={zonesJson[i]} status="locked" />);
            i++;
        }
        return (
            <div className="zones">{zonesHtml}</div>
        );
    }
}

export default Main;
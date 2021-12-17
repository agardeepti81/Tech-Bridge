import React, { Component } from "react";
import Zone from "./zone/zone";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            zonesJson: [],
            zones: []
        };
    }
    componentDidMount() {
        fetch(process.env.PUBLIC_URL + "/data/roadmap_foundation.json")
            .then(res => res.json())
            .then(
                (result) => {
                    let zonesJson = result.zones, zones = [];
                    for (let i = 0; i < zonesJson.length; i++) {
                        zones.push(zonesJson[i].name);
                    }
                    this.setState({
                        isLoaded: true,
                        zonesJson: zonesJson,
                        zones: zones
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }
    render() {
        const { error, isLoaded, zonesJson, zones } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
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
                if (userZones.find(zone => zone == zones[i])) {
                    zonesHtml.push(<Zone zoneData={zonesJson[i]} status="completed" />)
                    i++;
                }
                else
                    break;
            }
            if (resumeZone)
                zonesHtml.push(<Zone zoneData={zonesJson[i]} status="inprogress" userData={lessonProgress[i]} />)
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
}

export default Main;
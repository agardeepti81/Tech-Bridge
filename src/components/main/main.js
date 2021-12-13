import React, { Component } from "react";
import zonesJson from "../../data/roadmap_foundation.json";
import Zone from "../zone/zone";

class Main extends Component {
    render() {
        let zonesData=zonesJson.zones,zonesHtml=[];
        for(let i=0;i<zonesData.length;i++){
            zonesHtml.push(<Zone zoneData={zonesData[i]}/>);
        }
        return (<>
            <div className="zones">
                {zonesHtml}
            </div>
        </>)
    }
}

export default Main;
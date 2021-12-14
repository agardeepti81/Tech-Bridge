import React, { Component } from "react";
import Zone from "./zone/zone";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            zonesJson: []
        };
    }
    componentDidMount() {
        fetch(process.env.PUBLIC_URL + "/data/roadmap_foundation.json")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        zonesJson: result.zones
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
        const { error, isLoaded, zonesJson } = this.state;
        let zonesHtml = [];

        for(let i=0;i<zonesJson.length;i++){
            zonesHtml.push(<Zone zoneData={zonesJson[i]}/>);
        }
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div className="sections">{zonesHtml}</div>
            );
        }
    }
}

export default Main;
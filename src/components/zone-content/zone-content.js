import React, { Component } from "react";
import "./zone-content.css"

import { useParams } from "react-router-dom";
import { Accordion, AccordionItem, AccordionHeader, AccordionBody } from "reactstrap";
import ZoneSection from "./zone-section/zone-section";

const ZoneRoute = (lessonProgress, zoneStatus, zonesData, mainApis) => {
    const params = useParams();
    const zoneName = params.zoneName;
    console.log(lessonProgress);
    console.log(zoneStatus);
    console.log(zonesData);
    console.log(mainApis);
    return (<ZoneContent zoneName={zoneName} />)
}

class ZoneContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            sectionsJson: [],
            accordion: 1
        };
        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        fetch(process.env.PUBLIC_URL + "/data/foundation/" + this.props.zoneName + ".json")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        sectionsJson: result.sections
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

    toggle(accordion) {
        if (accordion === this.state.accordion)
            this.setState({
                accordion: 0
            })
        else
            this.setState({
                accordion: accordion
            })
    }

    render() {
        const { error, isLoaded, sectionsJson } = this.state;
        let sectionsHtml = [];

        for (let i = 0; i < sectionsJson.length; i++) {
            sectionsHtml.push(<AccordionItem>
                <AccordionHeader targetId={i + 1}>{sectionsJson[i].desc}</AccordionHeader>
                <AccordionBody accordionId={i + 1}><ZoneSection sectionData={sectionsJson[i]} /></AccordionBody>
            </AccordionItem>)
        }
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div className="sections"><Accordion open={this.state.accordion} toggle={this.toggle}>{sectionsHtml}</Accordion></div>
            );
        }
    }
}

export default ZoneRoute;
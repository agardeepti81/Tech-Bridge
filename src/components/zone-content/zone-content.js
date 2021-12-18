import React, { Component } from "react";
import "./zone-content.css"

import { useParams } from "react-router-dom";
import { Accordion, AccordionItem, AccordionHeader, AccordionBody } from "reactstrap";
import ZoneSection from "./zone-section/zone-section";

const ZoneRoute = () => {
    const params = useParams();
    const zoneName = params.zoneName;
    return (<ZoneContent zoneName={zoneName} />)
}

class ZoneContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            sectionsJson: []
        };
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

    render() {
        const { error, isLoaded, sectionsJson } = this.state;
        let sectionsHtml = [];

        for (let i = 0; i < sectionsJson.length; i++) {
            sectionsHtml.push(<AccordionItem>
                <AccordionHeader targetId={i}>{sectionsJson[i].desc}</AccordionHeader>
                <AccordionBody accordionId={i}><ZoneSection sectionData={sectionsJson[i]} /></AccordionBody>
            </AccordionItem>)
        }
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div className="sections"><Accordion open="0" toggle={function noRefCheck() { }}>{sectionsHtml}</Accordion></div>
            );
        }
    }
}

export default ZoneRoute;
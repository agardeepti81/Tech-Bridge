import React, { Component } from "react";
import "./zone-section.css";

import { Button, Card, CardBody, CardHeader, CardTitle, Collapse, Input } from "reactstrap";

class ZoneSection extends Component {
    constructor(props){
        super(props);
        this.state={
            openId:0
        }
        this.toggle = this.toggle.bind(this);
    }

    toggle(openId){
        if(this.state.openId===openId)
        this.setState({
            openId:0
        });
        else
        this.setState({
            openId:openId
        });
    }

    render() {
        const sectionData=this.props.sectionData;
        const exerciseData = sectionData.exercises,exerciseHtml =[];
        for(let i=0;i<exerciseData.length;i++){
            exerciseHtml.push(
                <Card>
                    <CardHeader className="instructionHeader">
                        <CardTitle className="instruction">{exerciseData[i].code}</CardTitle>
                        <Button className="instructionFunction" color="primary" onClick={() => this.toggle(i+2)}>Start</Button>
                    </CardHeader>
                    <Collapse isOpen={this.state.openId===(i+2)}>
                        <CardBody>
                            {exerciseData[i].desc}
                            <Input type="textarea" placeholder="Enter your response"/>
                            <Button color="primary">Submit</Button>
                        </CardBody>
                    </Collapse>
                </Card>
        )};
        return (<div>
            <Card>
                <CardHeader className="instructionHeader">
                    <CardTitle className="instruction">Play Course Video</CardTitle>
                    <Button className="instructionFunction" color="primary" onClick={() => this.toggle(1)}>Play</Button>
                </CardHeader>
                <Collapse isOpen={this.state.openId===1}>
                    <CardBody>
                        <video width="400" controls>
                            <source src={sectionData.video} type="video/mp4"/>
                            Your browser doesn't support HTML video
                        </video>
                    </CardBody>
                </Collapse>
            </Card>
            {exerciseHtml}
        </div>)
    }
}


export default ZoneSection;
import React, { Component } from "react";

import { Button, Card, CardBody, CardHeader, CardTitle, Collapse, Input } from "reactstrap";

class VideoButton extends Component {
    render() {
        if (this.props.status)
            return (<Button className="instructionFunction" color="success" onClick={this.props.onClick}>Watch Again</Button>);
        else
            return (<Button className="instructionFunction" color="primary" onClick={this.props.onClick}>Play</Button>)
    }
}

class ExerciseButton extends Component {
    render() {
        if (this.props.status === "completed")
            return (<Button className="instructionFunction" color="success" onClick={this.props.onClick}>Completed</Button>);
        else if (this.props.status === "start")
            return (<Button className="instructionFunction" color="primary" onClick={this.props.onClick}>Start</Button>);
        else if (this.props.status === "locked")
            return (<Button className="instructionFunction" color="danger" onClick={this.props.onClick} disabled>Locked</Button>);
        else
            return (<></>);
    }
}

class ZoneSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openId: 0,
            startTime: "",
            sectionProgress: this.props.sectionProgress
        }
        this.toggle = this.toggle.bind(this);
        this.sendExerciseResponse = this.sendExerciseResponse.bind(this);
        this.completeVideo = this.completeVideo.bind(this);
    }

    toggle(openId) {
        if (this.state.openId === openId)
            this.setState({
                openId: 0
            });
        else
            this.setState({
                openId: openId,
                startTime: Math.round(new Date().getTime()/1000)
            });
    }

    sendExerciseResponse(exerciseIndex){
        this.props.sendExerciseResponse(exerciseIndex, this.state.sectionProgress.exercises[exerciseIndex].response, this.state.startTime);
        this.setState({
            openId: 0
        })
    }

    completeVideo(){
        this.props.completeVideo();
        this.setState({
            openId: 0
        })
    }

    render() {
        const { sectionData } = this.props;
        const exerciseData = sectionData.exercises, exerciseHtml = [], completeVideoButtton = [];
        let exercisesIndex = 0;
        if (!this.state.sectionProgress.video)
            completeVideoButtton.push(<Button color="primary" onClick={() => this.completeVideo}>Mark Video as complete</Button>)
        else {
            while (exercisesIndex < exerciseData.length && this.state.sectionProgress.exercises[exercisesIndex].status) {
                let toggleIndex = exercisesIndex + 2;
                exerciseHtml.push(
                    <Card>
                        <CardHeader className="instructionHeader">
                            <CardTitle className="instruction">{exerciseData[exercisesIndex].code}</CardTitle>
                            <ExerciseButton status="completed" onClick={() => this.toggle(toggleIndex)} />
                        </CardHeader>
                        <Collapse isOpen={this.state.openId === (toggleIndex)}>
                            <CardBody>
                                {exerciseData[exercisesIndex].desc}
                                <Input
                                    type="textarea"
                                    placeholder="Enter your response" 
                                    value={this.state.sectionProgress.exercises[exercisesIndex].response}
                                    onChange={(e) => {
                                        let sectionProgress = this.state.sectionProgress;
                                        sectionProgress.exercises[toggleIndex-2].response = e.target.value
                                        this.setState({
                                            sectionProgress : sectionProgress
                                        })
                                    }} 
                                />
                                <Button color="primary" onClick={() => this.sendExerciseResponse(toggleIndex-2)} >Submit</Button>
                            </CardBody>
                        </Collapse>
                    </Card>
                )
                exercisesIndex++;
            }
            if (exercisesIndex < exerciseData.length) {
                let toggleIndex = exercisesIndex + 2;
                exerciseHtml.push(
                    <Card>
                        <CardHeader className="instructionHeader">
                            <CardTitle className="instruction">{exerciseData[exercisesIndex].code}</CardTitle>
                            <ExerciseButton status="start" onClick={() => this.toggle(toggleIndex)} />
                        </CardHeader>
                        <Collapse isOpen={this.state.openId === (toggleIndex)}>
                            <CardBody>
                                {exerciseData[exercisesIndex].desc}
                                <Input
                                    type="textarea"
                                    placeholder="Enter your response" 
                                    value={this.state.sectionProgress.exercises[exercisesIndex].response}
                                    onChange={(e) => {
                                        let sectionProgress = this.state.sectionProgress;
                                        sectionProgress.exercises[toggleIndex-2].response = e.target.value
                                        this.setState({
                                            sectionProgress : sectionProgress
                                        })
                                    }} 
                                />
                                <Button color="primary" onClick={() => this.sendExerciseResponse(toggleIndex-2)} >Submit</Button>
                            </CardBody>
                        </Collapse>
                    </Card>
                )
                exercisesIndex++;
            }
        }
        while (exercisesIndex < exerciseData.length) {
            let toggleIndex = exercisesIndex + 2;
            exerciseHtml.push(
                <Card>
                    <CardHeader className="instructionHeader">
                        <CardTitle className="instruction">{exerciseData[exercisesIndex].code}</CardTitle>
                        <ExerciseButton status="locked" onClick={() => this.toggle(toggleIndex)} />
                    </CardHeader>
                    <Collapse isOpen={this.state.openId === (toggleIndex)}>
                        <CardBody>
                            {exerciseData[exercisesIndex].desc}
                            <Input type="textarea" placeholder="Enter your response" />
                            <Button color="primary">Submit</Button>
                        </CardBody>
                    </Collapse>
                </Card>
            )
            exercisesIndex++;
        }
        return (<div>
            <Card>
                <CardHeader className="instructionHeader">
                    <CardTitle className="instruction">Play Course Video</CardTitle>
                    <VideoButton status={this.state.sectionProgress.video} onClick={() => this.toggle(1)} />
                </CardHeader>
                <Collapse isOpen={this.state.openId === 1}>
                    <CardBody>
                        <video width="400" controls>
                            <source src={sectionData.video} type="video/mp4" />
                            Your browser doesn't support HTML video
                        </video>
                        {completeVideoButtton}
                    </CardBody>
                </Collapse>
            </Card>
            {exerciseHtml}
        </div>)
    }
}


export default ZoneSection;
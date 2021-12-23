import React, { Component } from "react";
import "./zone-content.css"

import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, Button, Collapse, CardBody } from "reactstrap";
import ZoneSection from "./zone-section/zone-section";

const ZoneRoute = (props) => {
    const params = useParams();
    const zoneName = params.zoneName;
    return (<ZoneContent zoneName={zoneName} lessonProgress={props.lessonProgress} mainApis={props.mainApis} email={props.email} />)
}

class CustomButton extends Component {
    render() {
        const { sectionStatus, onClick } = this.props;
        if (sectionStatus === "completed")
            return (<Button className="instructionFunction" color="success" onClick={onClick}>Completed</Button>);
        else if (sectionStatus === "resume")
            return (<Button className="instructionFunction" color="warning" onClick={onClick}>Resume</Button>);
        else if (sectionStatus === "start")
            return (<Button className="instructionFunction" color="primary" onClick={onClick}>Start</Button>);
        else if (sectionStatus === "locked")
            return (<Button className="instructionFunction" color="danger" disabled>Locked</Button>);
        else
            return (<></>);
    }
}

class ZoneContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            sectionsJson: [],
            activeCardNo: 0,
            lessonProgress: this.props.lessonProgress
        };
        this.toggle = this.toggle.bind(this);
        this.completeVideo = this.completeVideo.bind(this);
        this.completeExercise = this.completeExercise.bind(this);
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

    toggle(cardToggleNo) {
        if (cardToggleNo === this.state.activeCardNo)
            this.setState({
                activeCardNo: 0
            })
        else
            this.setState({
                activeCardNo: cardToggleNo
            })
    }

    completeVideo(zoneIndex, sectionIndex){
        let lessonProgress = this.state.lessonProgress;
        lessonProgress[zoneIndex].zoneProgress[sectionIndex].video = true;
        this.updateLessonProgress(lessonProgress);
        this.setState({
            lessonProgress: lessonProgress
        })
    }

    completeExercise(zoneIndex, sectionIndex, exerciseIndex, exerciseResponse, startTime){
        let lessonProgress = this.state.lessonProgress;
        lessonProgress[zoneIndex].zoneProgress[sectionIndex].exercises[exerciseIndex].response = exerciseResponse;
        lessonProgress[zoneIndex].zoneProgress[sectionIndex].exercises[exerciseIndex].startTime = startTime;
        lessonProgress[zoneIndex].zoneProgress[sectionIndex].exercises[exerciseIndex].endTime = Math.round(new Date().getTime()/1000);
        lessonProgress[zoneIndex].zoneProgress[sectionIndex].exercises[exerciseIndex].status = true;
        if(lessonProgress[zoneIndex].zoneProgress[sectionIndex].exercises.length === (exerciseIndex+1)){
            lessonProgress[zoneIndex].zoneProgress[sectionIndex].status = true;
            if(lessonProgress[zoneIndex].zoneProgress.length === (sectionIndex+1))
            lessonProgress[zoneIndex].status = true
        }
        this.updateLessonProgress(lessonProgress);
        this.setState({
            lessonProgress: lessonProgress
        })
    }

    updateLessonProgress(lessonProgress){
        var lessonProgressDetails = JSON.stringify({
            "email": this.props.email,
            "lessonProgress": lessonProgress
        });
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: lessonProgressDetails,
            redirect: 'follow'
        };
        console.log(requestOptions);
        console.log(lessonProgress);
        fetch(this.props.mainApis.updateLesson, requestOptions)
            .then(response => response.text())
            .then(response => {
                let result = JSON.parse(response);
                if (result.status !== 200) {
                    alert("Couldn't update progress to server");
                }
            })
            .catch(error => {
                alert("Couldn't update progress to server");
                console.log('error', error)
            });
    }

    render() {
        const { error, isLoaded, sectionsJson, lessonProgress } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            let sectionsHtml = [], sectionPos = 0, zoneProgress, zoneIndex;
            const { zoneName } = this.props;
            if (!lessonProgress.find(zone => zone.zoneName === zoneName)) {
                let newZoneJson = {
                    "zoneName": zoneName,
                    "status": false,
                    "zoneProgress": []
                }
                for (let i = 0; i < sectionsJson.length; i++) {
                    newZoneJson.zoneProgress.push({
                        "status": false,
                        "video": false,
                        "exercises": []
                    })
                    for (let j = 0; j < sectionsJson[i].exercises.length; j++) {
                        newZoneJson.zoneProgress[i].exercises.push({
                            "status": false,
                            "startTime": "",
                            "endTime": "",
                            "response": ""
                        })

                    }
                }
                lessonProgress.push(newZoneJson);
                this.setState({
                    lessonProgress: lessonProgress
                })
            }
            zoneProgress = lessonProgress.find(zone => zone.zoneName === zoneName).zoneProgress;
            zoneIndex = lessonProgress.findIndex(zone => zone.zoneName === zoneName);
            while (sectionPos < sectionsJson.length && zoneProgress[sectionPos].status === true) {
                let toggleValue=sectionPos+1;
                sectionsHtml.push(
                    <Card>
                        <CardHeader className="instructionHeader">
                            <CardTitle className="instruction">{sectionsJson[sectionPos].desc}</CardTitle>
                            <CustomButton sectionStatus="completed" onClick={() => this.toggle(toggleValue)} />
                        </CardHeader>
                        <Collapse isOpen={this.state.activeCardNo === (toggleValue)}>
                            <CardBody><ZoneSection completeVideo={() => this.completeVideo(zoneIndex, toggleValue-1)} sendExerciseResponse={(exerciseIndex, exerciseResponse, startTime) => this.completeExercise(zoneIndex, toggleValue-1, exerciseIndex, exerciseResponse, startTime)} sectionProgress={zoneProgress[sectionPos]} sectionData={sectionsJson[sectionPos]} /></CardBody>
                        </Collapse>
                    </Card>
                );
                sectionPos++;
            }
            if (sectionPos < sectionsJson.length) {
                let sectionStatus;
                if (zoneProgress[sectionPos].video === true)
                    sectionStatus = "resume";
                else
                    sectionStatus = "start";
                let toggleValue=sectionPos+1;
                sectionsHtml.push(
                    <Card>
                        <CardHeader className="instructionHeader">
                            <CardTitle className="instruction">{sectionsJson[sectionPos].desc}</CardTitle>
                            <CustomButton sectionStatus={sectionStatus} onClick={() => this.toggle(toggleValue)} />
                        </CardHeader>
                        <Collapse isOpen={this.state.activeCardNo === (toggleValue)}>
                            <CardBody><ZoneSection completeVideo={() => this.completeVideo(zoneIndex, toggleValue-1)} sendExerciseResponse={(exerciseIndex, exerciseResponse, startTime) => this.completeExercise(zoneIndex, toggleValue-1, exerciseIndex, exerciseResponse, startTime)} sectionProgress={zoneProgress[sectionPos]} sectionData={sectionsJson[sectionPos]} /></CardBody>
                        </Collapse>
                    </Card>
                );
                sectionPos++;
            }
            while (sectionPos < sectionsJson.length) {
                let toggleValue=sectionPos+1;
                sectionsHtml.push(
                    <Card>
                        <CardHeader className="instructionHeader">
                            <CardTitle className="instruction">{sectionsJson[sectionPos].desc}</CardTitle>
                            <CustomButton sectionStatus="locked" onClick={() => this.toggle(toggleValue)} />
                        </CardHeader>
                        <Collapse isOpen={this.state.activeCardNo === (toggleValue)}>
                            <CardBody><ZoneSection completeVideo={() => this.completeVideo(zoneIndex, toggleValue-1)} sectionProgress={zoneProgress[sectionPos]} sectionData={sectionsJson[sectionPos]} /></CardBody>
                        </Collapse>
                    </Card>
                );
                sectionPos++;
            }
            return (
                <div className="sections">
                    {sectionsHtml}
                </div>
            );
        }
    }
}

export default ZoneRoute;
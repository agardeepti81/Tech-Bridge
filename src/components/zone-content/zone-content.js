import React, { Component } from "react";
import "./zone-content.css"

import { useParams } from "react-router-dom";
import { Accordion, AccordionItem, AccordionHeader, AccordionBody } from "reactstrap";
import ZoneSection from "./zone-section/zone-section";

const ZoneRoute = (props) => {
    const params = useParams();
    const zoneName = params.zoneName;
    return (<ZoneContent zoneName={zoneName} lessonProgress={props.lessonProgress} mainApis={props.mainApis} email={props.email} />)
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
                    <AccordionItem>
                        <AccordionHeader targetId={toggleValue}>
                            {sectionsJson[sectionPos].desc}
                        </AccordionHeader>
                        <AccordionBody accordionId={toggleValue}>
                            <ZoneSection completeVideo={() => this.completeVideo(zoneIndex, toggleValue-1)} sendExerciseResponse={(exerciseIndex, exerciseResponse, startTime) => this.completeExercise(zoneIndex, toggleValue-1, exerciseIndex, exerciseResponse, startTime)} sectionProgress={zoneProgress[sectionPos]} sectionData={sectionsJson[sectionPos]} />
                        </AccordionBody>
                    </AccordionItem>
                );
                sectionPos++;
            }
            if (sectionPos < sectionsJson.length) {
                let toggleValue=sectionPos+1;
                sectionsHtml.push(
                    <AccordionItem>
                        <AccordionHeader targetId={toggleValue}>
                            {sectionsJson[sectionPos].desc}
                        </AccordionHeader>
                        <AccordionBody accordionId={toggleValue}>
                            <ZoneSection completeVideo={() => this.completeVideo(zoneIndex, toggleValue-1)} sendExerciseResponse={(exerciseIndex, exerciseResponse, startTime) => this.completeExercise(zoneIndex, toggleValue-1, exerciseIndex, exerciseResponse, startTime)} sectionProgress={zoneProgress[sectionPos]} sectionData={sectionsJson[sectionPos]} />
                        </AccordionBody>
                    </AccordionItem>
                );
                sectionPos++;
            }
            while (sectionPos < sectionsJson.length) {
                let toggleValue=sectionPos+1;
                sectionsHtml.push(
                    <AccordionItem>
                        <AccordionHeader targetId={toggleValue}>
                            {sectionsJson[sectionPos].desc}
                        </AccordionHeader>
                        <AccordionBody accordionId={toggleValue}>
                            <ZoneSection completeVideo={() => this.completeVideo(zoneIndex, toggleValue-1)} sectionProgress={zoneProgress[sectionPos]} sectionData={sectionsJson[sectionPos]} />
                        </AccordionBody>
                    </AccordionItem>
                );
                sectionPos++;
            }
            return (
                <div className="sections">
                    <Accordion open={this.state.activeCardNo}toggle={this.toggle}>
                        {sectionsHtml}
                    </Accordion>
                </div>
            );
        }
    }
}

export default ZoneRoute;
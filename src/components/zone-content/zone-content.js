import React, { Component } from "react";
import "./zone-content.css"

import { Link, useParams } from "react-router-dom";
import { Accordion, AccordionItem, AccordionHeader, AccordionBody, Card, CardTitle, CardText, Button, Badge } from "reactstrap";
import ZoneSection from "./zone-section/zone-section";

const ZoneRoute = (props) => {
    const params = useParams();
    const profile = params.profile, roadmap = params.roadmap, pathName = params.pathName, zoneName = params.zoneName;
    return (<ZoneContent lessonProgress={props.lessonProgress} updateLessonProgress={props.updateLessonProgress} mainApis={props.mainApis} roomManagementApis={props.roomManagementApis} email={props.email} profile={profile} roadmap={roadmap} pathName={pathName} zoneName={zoneName} />)
}

class ZoneContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            sectionsJson: [],
            activeSectionIndex: 0,
            lessonProgress: this.props.lessonProgress,
            sectionsLocation: {
                zoneName: this.props.zoneName,
                profile: this.props.profile,
                roadmap: this.props.roadmap,
                pathName: this.props.pathName,
            },
            sectionsLocationIndex: {},
            room: ""
        };
        this.toggle = this.toggle.bind(this);
        this.completeVideo = this.completeVideo.bind(this);
    }

    async componentDidMount() {
        let sectionsJson = await this.fetchSectionsJson();
        this.checkAndAddNewUserProgress(sectionsJson.sections);
        this.getRoomNo();
    }

    checkAndAddNewUserProgress(sectionsJson) {
        let { lessonProgress, sectionsLocation } = this.state;
        if (!lessonProgress.find(currProfile => currProfile.profileCode === sectionsLocation.profile)) {
            let newProfile = {
                "profileCode": sectionsLocation.profile,
                "roadmaps": []
            }
            lessonProgress.push(newProfile);
        }
        const profileIndex = lessonProgress.findIndex(currProfile => currProfile.profileCode === sectionsLocation.profile);
        if (!lessonProgress[profileIndex].roadmaps.find(currRoadmap => currRoadmap.name === sectionsLocation.roadmap)) {
            let newRoadmap = {
                "name": sectionsLocation.roadmap,
                "status": false,
                "paths": []
            }
            lessonProgress[profileIndex].roadmaps.push(newRoadmap);
        }
        const roadmapIndex = lessonProgress[profileIndex].roadmaps.findIndex(currRoadmap => currRoadmap.name === sectionsLocation.roadmap);
        if (!lessonProgress[profileIndex].roadmaps[roadmapIndex].paths.find(currPath => currPath.code === sectionsLocation.pathName)) {
            let newPath = {
                "code": sectionsLocation.pathName,
                "status": false,
                "progress": []
            }
            lessonProgress[profileIndex].roadmaps[roadmapIndex].paths.push(newPath);
        }
        const pathIndex = lessonProgress[profileIndex].roadmaps[roadmapIndex].paths.findIndex(currPath => currPath.code === sectionsLocation.pathName)
        if (!lessonProgress[profileIndex].roadmaps[roadmapIndex].paths[pathIndex].progress.find(currZone => currZone.name === sectionsLocation.zoneName)) {
            let newZone = {
                "name": sectionsLocation.zoneName,
                "status": false,
                "progress": []
            }
            lessonProgress[profileIndex].roadmaps[roadmapIndex].paths[pathIndex].progress.push(newZone);
        }
        const zoneIndex = lessonProgress[profileIndex].roadmaps[roadmapIndex].paths[pathIndex].progress.findIndex(currZone => currZone.name === sectionsLocation.zoneName);
        let activeSectionIndex = lessonProgress[profileIndex].roadmaps[roadmapIndex].paths[pathIndex].progress[zoneIndex].progress.length;
        if (activeSectionIndex === 0) {
            let newZoneJson = [];
            for (let i = 0; i < sectionsJson.length; i++) {
                newZoneJson.push({
                    "status": false,
                    "video": false,
                    "exercises": []
                })
                for (let j = 0; j < sectionsJson[i].exercises.length; j++) {
                    newZoneJson[i].exercises.push({
                        "status": false,
                        "startTime": "",
                        "endTime": "",
                        "response": []
                    })

                }
            }
            lessonProgress[profileIndex].roadmaps[roadmapIndex].paths[pathIndex].progress[zoneIndex].progress = newZoneJson;
        }
        else {
            for (let i = 0; i < activeSectionIndex; i++) {
                if (!lessonProgress[profileIndex].roadmaps[roadmapIndex].paths[pathIndex].progress[zoneIndex].progress[i].status) {
                    activeSectionIndex = i;
                    break;
                }
            }
        }
        activeSectionIndex++;
        let sectionsLocationIndex = {
            profileIndex: profileIndex,
            roadmapIndex: roadmapIndex,
            pathIndex: pathIndex,
            zoneIndex: zoneIndex
        }
        this.setState({
            lessonProgress: lessonProgress,
            activeSectionIndex: activeSectionIndex,
            sectionsJson: sectionsJson,
            isLoaded: true,
            sectionsLocationIndex: sectionsLocationIndex
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.zoneName !== this.props.zoneName) {
            this.checkAndAddNewUserProgress();
            this.fetchSectionsJson();
            this.getRoomNo();
            console.log("room updated")
        }
    }

    fetchSectionsJson = async () => {
        const fetchResponse = await fetch(`${process.env.PUBLIC_URL}/data/profiles/${this.props.profile}/${this.props.roadmap}/${this.props.pathName}/${this.props.zoneName}.json`);
        const data = await fetchResponse.json();
        return data;
    }

    getRoomNo() {
        let zone = this.state.lessonProgress.find(zone => zone.zoneName === this.props.zoneName);
        if (zone) {
            if (!zone.status) {
                for (let i = 0; i < zone.zoneProgress.length; i++) {
                    if (!zone.zoneProgress[i].status) {
                        fetch(this.props.roomManagementApis.getRoomNo + "?email=" + this.props.email + "&roadmap=foundation&zone=" + this.state.zoneName + "&section=Section" + (i + 1))
                            .then(res => res.json())
                            .then(
                                (result) => {
                                    this.setState({
                                        room: result.roomsName
                                    });
                                },
                                (error) => {
                                    console.error(error);
                                }
                            )
                        break;
                    }
                }
            }
        }
        else {
            fetch(this.props.roomManagementApis.getRoomNo + "?email=" + this.props.email + "&roadmap=foundation&zone=" + this.state.zoneName + "&section=Section1")
                .then(res => res.json())
                .then(
                    (result) => {
                        this.setState({
                            room: result.roomsName
                        });
                    },
                    (error) => {
                        console.error(error);
                    }
                )
        }
    }

    toggle(cardToggleNo) {
        if (cardToggleNo === this.state.activeSectionIndex)
            this.setState({
                activeSectionIndex: 0
            })
        else
            this.setState({
                activeSectionIndex: cardToggleNo
            })
    }

    completeVideo() {
        let { lessonProgress, sectionsLocationIndex, activeSectionIndex } = this.state;
        lessonProgress[sectionsLocationIndex.profileIndex].roadmaps[sectionsLocationIndex.roadmapIndex].paths[sectionsLocationIndex.pathIndex].progress[sectionsLocationIndex.zoneIndex].progress[activeSectionIndex - 1].video = true;
        this.updateLessonProgress(lessonProgress, false);
    }

    submitExercise(exerciseInput, startTime, exerciseIndex) {
        let { lessonProgress, sectionsLocationIndex, activeSectionIndex } = this.state;
        let updateRoom = false;
        lessonProgress[sectionsLocationIndex.profileIndex].roadmaps[sectionsLocationIndex.roadmapIndex].paths[sectionsLocationIndex.pathIndex].progress[sectionsLocationIndex.zoneIndex].progress[activeSectionIndex - 1].exercises[exerciseIndex].status = true;
        lessonProgress[sectionsLocationIndex.profileIndex].roadmaps[sectionsLocationIndex.roadmapIndex].paths[sectionsLocationIndex.pathIndex].progress[sectionsLocationIndex.zoneIndex].progress[activeSectionIndex - 1].exercises[exerciseIndex].startTime = startTime;
        lessonProgress[sectionsLocationIndex.profileIndex].roadmaps[sectionsLocationIndex.roadmapIndex].paths[sectionsLocationIndex.pathIndex].progress[sectionsLocationIndex.zoneIndex].progress[activeSectionIndex - 1].exercises[exerciseIndex].endTime = Math.round(new Date().getTime() / 1000);
        if (lessonProgress[sectionsLocationIndex.profileIndex].roadmaps[sectionsLocationIndex.roadmapIndex].paths[sectionsLocationIndex.pathIndex].progress[sectionsLocationIndex.zoneIndex].progress[activeSectionIndex - 1].exercises.length === (exerciseIndex + 1)) {
            lessonProgress[sectionsLocationIndex.profileIndex].roadmaps[sectionsLocationIndex.roadmapIndex].paths[sectionsLocationIndex.pathIndex].progress[sectionsLocationIndex.zoneIndex].progress[activeSectionIndex - 1].status = true;
            if (lessonProgress[sectionsLocationIndex.profileIndex].roadmaps[sectionsLocationIndex.roadmapIndex].paths[sectionsLocationIndex.pathIndex].progress[sectionsLocationIndex.zoneIndex].progress.length === activeSectionIndex)
            lessonProgress[sectionsLocationIndex.profileIndex].roadmaps[sectionsLocationIndex.roadmapIndex].paths[sectionsLocationIndex.pathIndex].progress[sectionsLocationIndex.zoneIndex].status = true
            else
                updateRoom = true;
        }
        let exerciseData = {
        //     "roadmap": "foundation",
        //     "zone": lessonProgress[zoneIndex].zoneName,
        //     "sectionIndex": sectionIndex,
        //     "exerciseIndex": exerciseIndex,
        //     "timeTaken": lessonProgress[zoneIndex].zoneProgress[sectionIndex].exercises[exerciseIndex].endTime - startTime,
        //     "startTime": startTime
        }
        this.updateLessonProgress(lessonProgress, exerciseData);
        // if (this.state.sectionsJson[sectionIndex].exercises.length === (exerciseIndex + 1)) {
        //     activeSectionIndex++;
        // }
        this.setState({
            lessonProgress: lessonProgress,
            activeSectionIndex: activeSectionIndex
        })
        if (updateRoom)
            this.getRoomNo();
    }

    updateLessonProgress(lessonProgress, exerciseUpdate) {
        this.props.updateLessonProgress(lessonProgress);
        var lessonProgressDetails = JSON.stringify({
            "email": this.props.email,
            "lessonProgress": lessonProgress,
            "exerciseAnalytics": exerciseUpdate
        });
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: lessonProgressDetails,
            redirect: 'follow'
        };
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
        const { error, isLoaded, lessonProgress, sectionsJson, activeSectionIndex, room, sectionsLocation, sectionsLocationIndex } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            let sectionsHtml = [], sectionPos = 0, zoneProgress, zoneIndex, moveToNextZone = [];
            zoneProgress = lessonProgress[sectionsLocationIndex.profileIndex].roadmaps[sectionsLocationIndex.roadmapIndex].paths[sectionsLocationIndex.pathIndex].progress[sectionsLocationIndex.zoneIndex].progress;
            // zoneProgress = lessonProgress.find(zone => zone.zoneName === zoneName).zoneProgress;
            // zoneIndex = lessonProgress.findIndex(zone => zone.zoneName === zoneName);
            // if (lessonProgress.find(zone => zone.zoneName === zoneName).status && zonesJson.length !== (zoneIndex + 1)) {
            //     moveToNextZone.push(
            //         <Card
            //             body
            //             className="text-center"
            //         >
            //             <CardTitle tag="h5">
            //                 Zone Completed
            //             </CardTitle>
            //             <CardText>
            //                 Congratulations on completing this zone, you can move to next zone by clicking on the button below.
            //             </CardText>
            //             <Link to={`/zone/${zonesJson[zoneIndex + 1].name}`}>
            //                 <Button color="primary">Go to Next Zone</Button>
            //             </Link>
            //         </Card>
            //     )
            // }
            while (sectionPos < sectionsJson.length && zoneProgress[sectionPos].status === true) {
                let toggleValue = sectionPos + 1;
                sectionsHtml.push(
                    <AccordionItem>
                        <AccordionHeader targetId={toggleValue}>
                            {sectionsJson[sectionPos].desc}
                        </AccordionHeader>
                        <AccordionBody accordionId={toggleValue}>
                            <ZoneSection completeVideo={this.completeVideo} submitExercise={this.submitExercise} sectionProgress={zoneProgress[sectionPos]} sectionData={sectionsJson[sectionPos]} />
                        </AccordionBody>
                    </AccordionItem>
                );
                sectionPos++;
            }
            if (sectionPos < sectionsJson.length) {
                let roomInfo = [], toggleValue = sectionPos + 1;
                if (activeSectionIndex === sectionPos + 1)
                    roomInfo.push(
                        <Badge color="primary">{room}</Badge>
                    )
                sectionsHtml.push(
                    <AccordionItem>
                        <AccordionHeader targetId={toggleValue}>
                            {sectionsJson[sectionPos].desc}
                            {roomInfo}
                        </AccordionHeader>
                        <AccordionBody accordionId={toggleValue}>
                            <ZoneSection completeVideo={this.completeVideo} submitExercise={this.submitExercise} sectionProgress={zoneProgress[sectionPos]} sectionData={sectionsJson[sectionPos]} />
                        </AccordionBody>
                    </AccordionItem>
                );
                sectionPos++;
            }
            while (sectionPos < sectionsJson.length) {
                let toggleValue = sectionPos + 1;
                sectionsHtml.push(
                    <AccordionItem>
                        <AccordionHeader targetId={toggleValue}>
                            {sectionsJson[sectionPos].desc}
                        </AccordionHeader>
                    </AccordionItem>
                );
                sectionPos++;
            }
            return (
                <div key={this.props.zoneName} className="sections">
                    <Link to={`/${sectionsLocation.profile}/${sectionsLocation.roadmap}/${sectionsLocation.pathName}`}><Button color="primary">Back to Home</Button></Link>
                    <Accordion open={this.state.activeSectionIndex} toggle={this.toggle}>
                        {sectionsHtml}
                    </Accordion>
                    {/* {moveToNextZone} */}
                </div>
            );
        }
    }
}

export default ZoneRoute;
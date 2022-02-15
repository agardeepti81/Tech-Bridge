import React, { Component } from "react";

import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button, Card, CardBody, CardHeader, CardText, CardTitle, Col, Collapse, Container, Input, InputGroup, Modal, ModalBody, ModalHeader, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { BsPlayCircle } from "react-icons/bs";

import ZoneSectionContent from "./zone-section-content/zone-section-content";

class VideoButton extends Component {
    render() {
        if (this.props.status)
            return (<Button color="success" onClick={this.props.onClick}>Lesson<BsPlayCircle id="videoIcon" /></Button>);
        else
            return (<Button color="primary" onClick={this.props.onClick}>Lesson<BsPlayCircle id="videoIcon" /></Button>)
    }
}

class ExerciseButton extends Component {
    render() {
        if (this.props.status === "completed")
            return (<Button color="success" onClick={this.props.onClick}>{this.props.name}</Button>);
        else if (this.props.status === "start")
            return (<Button color="primary" onClick={this.props.onClick}>{this.props.name}</Button>);
        else if (this.props.status === "locked")
            return (<Button color="danger" onClick={this.props.onClick} disabled>{this.props.name}</Button>);
        else
            return (<></>);
    }
}

class ZoneSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: Math.round(new Date().getTime() / 1000),
            help: false,
            contactFacilitator: false,
            activeHelpTab: "1",
            helpTabsClasses: ['active', ''],
            type: "",
            exerciseIndex: 0,
            solutions: [],
            helpWindowActiveProblem: 0,
            askedProblem: false,
            problemDesc: "",
            facilitatorRoom: ""
        }
        this.toggle = this.toggle.bind(this);
        this.completeVideo = this.completeVideo.bind(this);
        this.toggleHelpWindow = this.toggleHelpWindow.bind(this);
        this.toggleContactFacilitator = this.toggleContactFacilitator.bind(this);
        this.changeHelpActiveTab = this.changeHelpActiveTab.bind(this);
        this.openVideo = this.openVideo.bind(this);
        this.openExercise = this.openExercise.bind(this);
        this.submitExercise = this.submitExercise.bind(this);
        this.changeHelpWindowActiveProblem = this.changeHelpWindowActiveProblem.bind(this);
        this.contactFacilitator = this.contactFacilitator.bind(this);
        this.sendProblem = this.sendProblem.bind(this);
        this.submitProblem = this.submitProblem.bind(this);
    }

    componentDidMount() {
        this.getCurrentContent();
        this.getExerciseSolutions();
    }

    getCurrentContent(){
        let { sectionProgress } = this.props;
        if (sectionProgress.status) {
            this.setState({
                type: "video"
            })
        }
        else {
            if (sectionProgress.video) {
                let type = "exercise", exerciseIndex = 0;
                for (exerciseIndex = 0; exerciseIndex < sectionProgress.exercises.length; exerciseIndex++) {
                    if (!sectionProgress.exercises[exerciseIndex].status)
                        break;
                }
                exerciseIndex++;
                this.setState({
                    type: type,
                    exerciseIndex: exerciseIndex
                });
            }
            else {
                let type = "video";
                this.setState({
                    type: type
                });
            }
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps !== this.props){
            this.getCurrentContent();
        }
    }

    getExerciseSolutions() {
        const { helpApis, sectionsLocation, sectionIndex } = this.props;
        const { exerciseIndex } = this.state;
        const { profile, roadmap, pathName, zoneName } = sectionsLocation;
        fetch(`${helpApis.getSolutions}?profile=${profile}&roadmap=${roadmap}&path=${pathName}&zone=${zoneName}&section=${sectionIndex}&exercise=${exerciseIndex}`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        solutions: result
                    });
                }
            )
    }

    openVideo() {
        this.setState({
            type: "video"
        });
    }

    openExercise(exerciseIndex) {
        this.setState({
            type: "exercise",
            exerciseIndex: exerciseIndex
        })
    }

    toggle(openId) {
        if (this.state.openId === openId)
            this.setState({
                openId: 0
            });
        else
            this.setState({
                openId: openId,
                startTime: Math.round(new Date().getTime() / 1000)
            });
    }

    submitExercise(exerciseInput) {
        const { startTime, exerciseIndex } = this.state;
        if (!this.props.sectionProgress.exercises[exerciseIndex - 1].status)
            this.setState({
                exerciseIndex: this.state.exerciseIndex + 1
            })
        this.props.submitExercise(exerciseInput, startTime, exerciseIndex);
    }

    completeVideo() {
        this.props.completeVideo();
        this.setState({
            type: "exercise",
            exerciseIndex: this.state.exerciseIndex + 1
        })
    }

    toggleHelpWindow() {
        this.setState({
            help: !this.state.help
        });
    }

    toggleContactFacilitator() {
        this.setState({
            contactFacilitator: !this.state.contactFacilitator
        });
    }

    changeHelpActiveTab(tabNo) {
        let helpTabsClasses = ['', '', ''];
        helpTabsClasses[tabNo - 1] = 'active';
        this.setState({
            activeHelpTab: tabNo + "",
            helpTabsClasses: helpTabsClasses
        })
    }

    changeHelpWindowActiveProblem(problemIndex) {
        if (problemIndex === this.state.helpWindowActiveProblem)
            this.setState({
                helpWindowActiveProblem: 0
            })
        else
            this.setState({
                helpWindowActiveProblem: problemIndex
            })
    }

    contactFacilitator() {
        this.setState({
            help: false,
            contactFacilitator: true
        })
    }

    submitProblem() {
        let problemDesc = JSON.stringify({
            "problem": this.state.problemDesc,
            "email": this.props.email,
            "exerciseLocation": {
                "profile": this.props.sectionsLocation.profile,
                "roadmap": this.props.sectionsLocation.roadmap,
                "path": this.props.sectionsLocation.pathName,
                "zone": this.props.sectionsLocation.zoneName,
                "section": this.props.sectionIndex,
                "exercise": this.state.exerciseIndex
            }
        });
        this.sendProblem(problemDesc);
    }

    sendProblem(dataToSend) {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: dataToSend,
            redirect: 'follow'
        };

        fetch(this.props.helpApis.getSolutions, requestOptions)
            .then(response => response.json())
            .then(response => {
                this.setState({
                    facilitatorRoom: response.room,
                    askedProblem: true
                })
            })
            .catch(error => {
                alert("Some error occured, Please try again later");
                console.log('error', error)
            });
    }

    render() {
        const { sectionData, sectionProgress } = this.props;
        const { type, exerciseIndex, solutions, helpWindowActiveProblem, askedProblem } = this.state;
        const exerciseData = sectionData.exercises, exerciseHtml = [], exerciseNav = [];
        let exercisesIndex = 0, exerciseInfo;
        if (sectionProgress.video) {
            while (exercisesIndex < exerciseData.length && sectionProgress.exercises[exercisesIndex].status) {
                let toggleIndex = exercisesIndex + 2, activeClass = '';
                if (exerciseIndex === toggleIndex - 1)
                    activeClass = ' active';
                exerciseNav.push(<Col className={"zoneSectionNavButton" + activeClass}><ExerciseButton status="completed" onClick={() => this.openExercise(toggleIndex - 1)} name={exerciseData[exercisesIndex].code} /></Col>);
                exercisesIndex++;
            }
            if (exercisesIndex < exerciseData.length) {
                let toggleIndex = exercisesIndex + 2, activeClass = '';
                if (exerciseIndex === toggleIndex - 1)
                    activeClass = ' active';
                exerciseNav.push(<Col className={"zoneSectionNavButton" + activeClass}><ExerciseButton status="start" onClick={() => this.openExercise(toggleIndex - 1)} name={exerciseData[exercisesIndex].code} /></Col>);
                exercisesIndex++;
            }
        }
        while (exercisesIndex < exerciseData.length) {
            let toggleIndex = exercisesIndex + 2, activeClass = '';
            if (exerciseIndex === toggleIndex - 1)
                activeClass = ' active';
            exerciseNav.push(<Col className={"zoneSectionNavButton" + activeClass}><ExerciseButton status="locked" onClick={() => this.openExercise(toggleIndex - 1)} name={exerciseData[exercisesIndex].code} /></Col>);
            exercisesIndex++;
        }
        let tempExercise = []
        for (let i = 0; i < exerciseData.length; i++) {
            tempExercise.push(<Col className="zoneSectionNavButton"><Button>{exerciseData[i].code}</Button></Col>)
        }
        let hintsUI = [], hintNav = [];
        if (sectionData.exercises[exerciseIndex - 1]?.hints?.length > 0) {
            console.log("working")
            for (let i = 0; i < sectionData.exercises[exerciseIndex - 1].hints.length; i++) {
                hintsUI.push(<div>
                    <div className="hintHeader">Hint {i + 1}</div>
                    <div dangerouslySetInnerHTML={{ __html: sectionData.exercises[exerciseIndex - 1].hints[i] }}></div>
                </div>
                )
            }
            hintNav.push(
                <NavItem>
                    <NavLink
                        className={this.state.helpTabsClasses[0]}
                        onClick={() => this.changeHelpActiveTab(1)}
                    >
                        Hint
                    </NavLink>
                </NavItem>
            )
        }
        let solutionsListUI = [];
        for (let i = 0; i < solutions.length; i++) {
            solutionsListUI.push(
                <AccordionItem>
                    <AccordionHeader targetId={i + 1}>
                        {solutions[i].problem}
                    </AccordionHeader>
                    <AccordionBody accordionId={i + 1}>
                        {solutions[i].solution}
                    </AccordionBody>
                </AccordionItem>
                // <Card>
                //     <CardBody>
                //         <CardTitle tag="h5">
                //             {solutions[i].problem}
                //         </CardTitle>
                //         <CardText>
                //             {solutions[i].solution}
                //         </CardText>
                //     </CardBody>
                // </Card>
            )
        }
        let askProblemUI = [];
        if (!askedProblem) {
            askProblemUI = <div>
                <Input
                    type="textarea"
                    placeholder="Enter your problem here"
                    value={this.state.problemDesc}
                    onChange={(e) => {
                        this.setState({
                            problemDesc: e.target.value
                        });
                    }}
                />
                <Button onClick={this.submitProblem}>Ask your problem</Button>
            </div>
        }
        else {
            askProblemUI = <div>
                Your problem is recorded. Please join facilitator room : {this.state.facilitatorRoom}. Hopefully this will resolve your problem.
            </div>
        }
        return (<div className="zoneSection" key={this.props.sectionProgress}>
            <Container>
                <Row>
                    <Col className="zoneSectionNavButton" xs="2">
                        <VideoButton status={sectionProgress.video} onClick={this.openVideo} />
                    </Col>
                    {/* {exerciseNav} */}
                    <Col>Exercise {exerciseIndex} of {exerciseData.length}</Col>
                </Row>
            </Container>
            <ZoneSectionContent type={type} completeVideo={this.completeVideo} sectionProgress={sectionProgress} sectionData={sectionData} exerciseIndex={exerciseIndex} toggleHelpWindow={this.toggleHelpWindow} submitExercise={this.submitExercise} />
            <Modal
                isOpen={this.state.help}
            >
                <ModalHeader
                    toggle={this.toggleHelpWindow}
                >
                    Help Window
                </ModalHeader>
                <ModalBody>
                    <Nav tabs>
                        {hintNav}
                        <NavItem>
                            <NavLink
                                className={this.state.helpTabsClasses[1]}
                                onClick={() => this.changeHelpActiveTab(2)}
                            >
                                Ask your problem
                            </NavLink>
                        </NavItem>
                    </Nav>


                    <TabContent activeTab={this.state.activeHelpTab}>
                        <TabPane tabId="1">
                            {hintsUI}
                        </TabPane>
                        <TabPane tabId="2">
                            <div id="searchResultsPane">
                                <Accordion
                                    open={helpWindowActiveProblem}
                                    toggle={this.changeHelpWindowActiveProblem}
                                >
                                    {solutionsListUI}
                                </Accordion>
                            </div>
                            <Button id="newProblem" color="info" onClick={this.contactFacilitator}>Contact Facilitator</Button>
                        </TabPane>
                    </TabContent>
                </ModalBody>
            </Modal>
            <Modal
                isOpen={this.state.contactFacilitator}
            >
                <ModalHeader
                    toggle={this.toggleContactFacilitator}
                >
                    Describe your Problem
                </ModalHeader>
                <ModalBody>
                    {askProblemUI}
                </ModalBody>
            </Modal>

        </div>)
    }
}


export default ZoneSection;
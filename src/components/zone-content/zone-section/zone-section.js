import React, { Component } from "react";

import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button, Card, CardBody, CardHeader, CardText, CardTitle, Col, Collapse, Container, Input, InputGroup, Modal, ModalBody, ModalHeader, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { BsPlayCircle } from "react-icons/bs";

import ZoneSectionContent from "./zone-section-content/zone-section-content";
import SectionNav from "./sections-nav/sections-nav";

class ZoneSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: false,
            help: false,
            contactFacilitator: false,
            activeHelpTab: "1",
            helpTabsClasses: ['active', ''],
            solutions: [],
            helpWindowActiveProblem: 0,
            askedProblem: false,
            problemDesc: "",
            facilitatorRoom: "",
            activeExercise: 0,
            currentExercise: 0,
            isExerciseComplete: false,
            isActiveSection: false
        }
        this.toggleHelpWindow = this.toggleHelpWindow.bind(this);
        this.toggleContactFacilitator = this.toggleContactFacilitator.bind(this);
        this.changeHelpActiveTab = this.changeHelpActiveTab.bind(this);
        this.submitExercise = this.submitExercise.bind(this);
        this.changeHelpWindowActiveProblem = this.changeHelpWindowActiveProblem.bind(this);
        this.contactFacilitator = this.contactFacilitator.bind(this);
        this.sendProblem = this.sendProblem.bind(this);
        this.submitProblem = this.submitProblem.bind(this);
        this.changeExercise = this.changeExercise.bind(this);
        this.nextExercise = this.nextExercise.bind(this);
    }

    componentDidMount() {
        this.getCurrentContent();
        this.getExerciseSolutions();
    }

    getCurrentContent() {
        let { sectionProgress } = this.props;
        if (sectionProgress.status) {
            this.setState({
                activeExercise: 0,
                currentExercise: 0,
                isActiveSection: false
            })
        }
        else {
            if (sectionProgress.video) {
                let currentExercise = 0;
                for (currentExercise = 0; currentExercise < sectionProgress.exercises.length; currentExercise++) {
                    if (!sectionProgress.exercises[currentExercise].status)
                        break;
                }
                this.setState({
                    activeExercise: currentExercise,
                    currentExercise: currentExercise,
                    isExerciseComplete: true,
                    isActiveSection: true
                });
            }
            else {
                this.setState({
                    activeExercise: 0,
                    currentExercise: 0,
                    isExerciseComplete: false,
                    isActiveSection: true
                });
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.getCurrentContent();
            this.getExerciseSolutions();
        }
    }

    getExerciseSolutions() {
        const { helpApis, sectionsLocation, sectionIndex } = this.props;
        const { activeExercise } = this.state;
        const { profile, roadmap, pathName, zoneName } = sectionsLocation;
        fetch(`${helpApis.getSolutions}?profile=${profile}&roadmap=${roadmap}&path=${pathName}&zone=${zoneName}&section=${sectionIndex}&exercise=${activeExercise}`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        solutions: result
                    });
                }
            )
    }

    submitExercise(exerciseInput) {
        const { startTime, activeExercise } = this.state;
        this.props.submitExercise(exerciseInput, startTime, activeExercise);
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
        let helpTabsClasses = ['', ''];
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
            "userName": this.props.userName,
            "exerciseLocation": {
                "profile": this.props.sectionsLocation.profile,
                "roadmap": this.props.sectionsLocation.roadmap,
                "path": this.props.sectionsLocation.pathName,
                "zone": this.props.sectionsLocation.zoneName,
                "section": this.props.sectionIndex,
                "exercise": this.state.activeExercise-1
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

    changeExercise(exerciseIndex) {
        this.setState({
            activeExercise: exerciseIndex
        })
        this.getExerciseSolutions();
    }

    nextExercise() {
        this.setState({
            startTime: Math.round(new Date().getTime() / 1000),
            isExerciseComplete: false,
            currentExercise: this.state.currentExercise + 1,
            activeExercise: this.state.activeExercise + 1
        })
        this.getExerciseSolutions();
    }

    render() {
        const { sectionData, sectionProgress } = this.props;
        const { activeExercise, solutions, helpWindowActiveProblem, askedProblem, currentExercise, isExerciseComplete, isActiveSection } = this.state;
        const exerciseData = sectionData.exercises;
        let exercisesIndex = 0;
        if (sectionProgress.video) {
            while (exercisesIndex < exerciseData.length && sectionProgress.exercises[exercisesIndex].status) {
                let toggleIndex = exercisesIndex + 2, activeClass = '';
                if (activeExercise === toggleIndex - 1)
                    activeClass = ' active';
                exercisesIndex++;
            }
            if (exercisesIndex < exerciseData.length) {
                let toggleIndex = exercisesIndex + 2, activeClass = '';
                if (activeExercise === toggleIndex - 1)
                    activeClass = ' active';
                exercisesIndex++;
            }
        }
        while (exercisesIndex < exerciseData.length) {
            let toggleIndex = exercisesIndex + 2, activeClass = '';
            if (activeExercise === toggleIndex - 1)
                activeClass = ' active';
            exercisesIndex++;
        }
        let tempExercise = []
        for (let i = 0; i < exerciseData.length; i++) {
            tempExercise.push(<Col className="zoneSectionNavButton"><Button>{exerciseData[i].code}</Button></Col>)
        }
        let hintsUI = [], hintNav = [];
        if (sectionData.exercises[activeExercise - 1]?.hints?.length > 0) {
            for (let i = 0; i < sectionData.exercises[activeExercise - 1].hints.length; i++) {
                hintsUI.push(<div>
                    <div className="hintHeader">Hint {i + 1}</div>
                    <div dangerouslySetInnerHTML={{ __html: sectionData.exercises[activeExercise - 1].hints[i] }}></div>
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
                Your problem is recorded.
                <br />Facilitators are available between 9pm to 11pm Monday to Saturday.
                <br />Please join facilitator room : {this.state.facilitatorRoom}.
                <br />Hopefully this will resolve your problem.
            </div>
        }
        return (<div className="zoneSection" key={this.props.sectionProgress}>
            <SectionNav activeExercise={activeExercise} totalExercises={exerciseData.length} currentExercise={currentExercise} isExerciseComplete={isExerciseComplete} isActiveSection={isActiveSection} changeExercise={this.changeExercise} nextExercise={this.nextExercise} />
            <ZoneSectionContent completeVideo={this.props.completeVideo} sectionProgress={sectionProgress} sectionData={sectionData} activeExercise={activeExercise} toggleHelpWindow={this.toggleHelpWindow} submitExercise={this.submitExercise} />
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
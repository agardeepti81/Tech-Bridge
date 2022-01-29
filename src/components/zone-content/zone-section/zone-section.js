import React, { Component } from "react";

import { Button, Card, CardBody, CardHeader, CardText, CardTitle, Col, Collapse, Container, Input, InputGroup, Modal, ModalBody, ModalHeader, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { BsLockFill, BsPlayCircle } from "react-icons/bs";

import ZoneSectionContent from "./zone-section-content/zone-section-content";

class VideoButton extends Component {
    render() {
        if (this.props.status)
            return (<Button color="success" onClick={this.props.onClick}>Video<BsPlayCircle id="videoIcon" /></Button>);
        else
            return (<Button color="primary" onClick={this.props.onClick}>Video<BsPlayCircle id="videoIcon" /></Button>)
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
            openId: 0,
            startTime: "",
            sectionProgress: this.props.sectionProgress,
            help: false,
            activeHelpTab: "1",
            helpTabsClasses: ['active', '', '', ''],
            type: "",
            exerciseIndex: 0
        }
        this.toggle = this.toggle.bind(this);
        this.sendExerciseResponse = this.sendExerciseResponse.bind(this);
        this.completeVideo = this.completeVideo.bind(this);
        this.toggleHelpWindow = this.toggleHelpWindow.bind(this);
        this.changeHelpActiveTab = this.changeHelpActiveTab.bind(this);
        this.openVideo = this.openVideo.bind(this);
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

    sendExerciseResponse(exerciseIndex) {
        this.props.sendExerciseResponse(exerciseIndex, this.state.sectionProgress.exercises[exerciseIndex].response, this.state.startTime);
        this.setState({
            openId: 0
        })
    }

    completeVideo() {
        this.props.completeVideo();
        this.setState({
            openId: 0
        })
    }

    toggleHelpWindow() {
        this.setState({
            help: !this.state.help
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

    render() {
        const { sectionData } = this.props;
        const { type, exerciseIndex } = this.state;
        const exerciseData = sectionData.exercises, exerciseHtml = [], exerciseNav = [];
        let exercisesIndex = 0;
        if (this.state.sectionProgress.video) {
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
                                <div dangerouslySetInnerHTML={{ __html: exerciseData[exercisesIndex].desc }}></div>

                                <Input
                                    type="textarea"
                                    placeholder="Enter your response"
                                    value={this.state.sectionProgress.exercises[exercisesIndex].response}
                                    onChange={(e) => {
                                        let sectionProgress = this.state.sectionProgress;
                                        sectionProgress.exercises[toggleIndex - 2].response = e.target.value
                                        this.setState({
                                            sectionProgress: sectionProgress
                                        })
                                    }}
                                />
                                <Button className="exerciseButtons" color="primary" onClick={() => this.sendExerciseResponse(toggleIndex - 2)} >Submit</Button>
                                <Button className="exerciseButtons" color="primary" onClick={() => this.toggleHelpWindow()}>Ask for help</Button>
                            </CardBody>
                        </Collapse>
                    </Card>
                )
                exerciseNav.push(<Col className="zoneSectionNavButton"><ExerciseButton status="completed" onClick={(exercisesIndex) => this.openExercise(exercisesIndex)} name={exerciseData[exercisesIndex].code} /></Col>);
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
                                <div dangerouslySetInnerHTML={{ __html: exerciseData[exercisesIndex].desc }}></div>
                                <Input
                                    type="textarea"
                                    placeholder="Enter your response"
                                    value={this.state.sectionProgress.exercises[exercisesIndex].response}
                                    onChange={(e) => {
                                        let sectionProgress = this.state.sectionProgress;
                                        sectionProgress.exercises[toggleIndex - 2].response = e.target.value
                                        this.setState({
                                            sectionProgress: sectionProgress
                                        })
                                    }}
                                />
                                <Button className="exerciseButtons" color="primary" onClick={() => this.sendExerciseResponse(toggleIndex - 2)} >Submit</Button>
                                <Button className="exerciseButtons" color="primary" onClick={() => this.toggleHelpWindow()}>Ask for help</Button>
                            </CardBody>
                        </Collapse>
                    </Card>
                )
                exerciseNav.push(<Col className="zoneSectionNavButton"><ExerciseButton status="start" onClick={(exercisesIndex) => this.openExercise(exercisesIndex)} name={exerciseData[exercisesIndex].code} /></Col>);
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
                            <div dangerouslySetInnerHTML={{ __html: exerciseData[exercisesIndex].desc }}></div>
                            <Input type="textarea" placeholder="Enter your response" />
                            <Button color="primary">Submit</Button>
                        </CardBody>
                    </Collapse>
                </Card>
            )
            exerciseNav.push(<Col className="zoneSectionNavButton"><ExerciseButton status="locked" onClick={(exercisesIndex) => this.openExercise(exercisesIndex)} name={exerciseData[exercisesIndex].code} /></Col>);
            exercisesIndex++;
        }
        let tempExercise = []
        for (let i = 0; i < exerciseData.length; i++) {
            tempExercise.push(<Col className="zoneSectionNavButton"><Button>{exerciseData[i].code}</Button></Col>)
        }
        return (<div className="zoneSection">
            <Container>
                <Row>
                    <Col className="zoneSectionNavButton" xs="2">
                        <VideoButton status={this.state.sectionProgress.video} onClick={this.openVideo} />
                    </Col>
                    {exerciseNav}
                </Row>
            </Container>
            <ZoneSectionContent type={type} completeVideo={this.completeVideo} sectionProgress={this.state.sectionProgress} sectionData={sectionData} exerciseIndex={exerciseIndex} />
            {exerciseHtml}
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
                        <NavItem>
                            <NavLink
                                className={this.state.helpTabsClasses[0]}
                                onClick={() => this.changeHelpActiveTab(1)}
                            >
                                Hint
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={this.state.helpTabsClasses[1]}
                                onClick={() => this.changeHelpActiveTab(2)}
                            >
                                See Solution
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={this.state.helpTabsClasses[2]}
                                onClick={() => this.changeHelpActiveTab(3)}
                            >
                                Ask your problem
                            </NavLink>
                        </NavItem>
                    </Nav>


                    <TabContent activeTab={this.state.activeHelpTab}>
                        <TabPane tabId="1">
                            This is your hint<br />
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi laudantium quam fuga aut quo recusandae. Consectetur ex delectus dolores repellendus, exercitationem reiciendis unde laboriosam explicabo esse ducimus tenetur recusandae totam impedit error! Praesentium, fuga exercitationem neque, perferendis nam, debitis cumque repudiandae dolore consectetur quia repellat dignissimos soluta? Tempore, labore blanditiis.
                        </TabPane>
                        <TabPane tabId="2">
                            Solution of the problem<br />
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi laudantium quam fuga aut quo recusandae. Consectetur ex delectus dolores repellendus, exercitationem reiciendis unde laboriosam explicabo esse ducimus tenetur recusandae totam impedit error! Praesentium, fuga exercitationem neque, perferendis nam, debitis cumque repudiandae dolore consectetur quia repellat dignissimos soluta? Tempore, labore blanditiis.
                        </TabPane>
                        <TabPane tabId="3">
                            <InputGroup>
                                <Input />
                                <Button>Search</Button>
                            </InputGroup>
                            <div id="searchResultsPane">
                                <Card>
                                    <CardBody>
                                        <CardTitle tag="h5">
                                            Solution Title
                                        </CardTitle>
                                        <CardText>
                                            Some solution content
                                        </CardText>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardBody>
                                        <CardTitle tag="h5">
                                            Solution Title
                                        </CardTitle>
                                        <CardText>
                                            Some solution content
                                        </CardText>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardBody>
                                        <CardTitle tag="h5">
                                            Solution Title
                                        </CardTitle>
                                        <CardText>
                                            Some solution content
                                        </CardText>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardBody>
                                        <CardTitle tag="h5">
                                            Solution Title
                                        </CardTitle>
                                        <CardText>
                                            Some solution content
                                        </CardText>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardBody>
                                        <CardTitle tag="h5">
                                            Solution Title
                                        </CardTitle>
                                        <CardText>
                                            Some solution content
                                        </CardText>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardBody>
                                        <CardTitle tag="h5">
                                            Solution Title
                                        </CardTitle>
                                        <CardText>
                                            Some solution content
                                        </CardText>
                                    </CardBody>
                                </Card>
                            </div>
                            <Button id="newProblem" color="info">Ask as a fresh Problem</Button>
                        </TabPane>
                    </TabContent>
                </ModalBody>
            </Modal>
        </div>)
    }
}


export default ZoneSection;
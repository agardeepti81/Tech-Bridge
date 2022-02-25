import React, { Component } from "react";

import { AccordionBody, AccordionHeader, AccordionItem, Button, Col, Input, NavItem, NavLink } from "reactstrap";

import ZoneSectionContent from "./zone-section-content/zone-section-content";
import SectionNav from "./sections-nav/sections-nav";

class ZoneSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: false,
            facilitatorRoom: "",
            activeExercise: 0,
            currentExercise: 0,
            isExerciseComplete: false,
            isActiveSection: false
        }
        this.changeExercise = this.changeExercise.bind(this);
        this.nextExercise = this.nextExercise.bind(this);
        this.submitExercise = this.submitExercise.bind(this);
    }

    componentDidMount() {
        this.getCurrentContent();
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
        }
    }

    submitExercise(exerciseInput) {
        const { startTime, activeExercise } = this.state;
        this.props.submitExercise(exerciseInput, startTime, activeExercise);
    }

    changeExercise(exerciseIndex) {
        this.setState({
            activeExercise: exerciseIndex
        })
    }

    nextExercise() {
        this.setState({
            startTime: Math.round(new Date().getTime() / 1000),
            isExerciseComplete: false,
            currentExercise: this.state.currentExercise + 1,
            activeExercise: this.state.activeExercise + 1
        })
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
        return (<div className="zoneSection" key={this.props.sectionProgress}>
            <SectionNav activeExercise={activeExercise} totalExercises={exerciseData.length} currentExercise={currentExercise} isExerciseComplete={isExerciseComplete} isActiveSection={isActiveSection} changeExercise={this.changeExercise} nextExercise={this.nextExercise} sectionsLocationIndex={this.props.sectionsLocationIndex} meetingLink={this.props.meetingLink} />
            <ZoneSectionContent completeVideo={this.props.completeVideo} sectionProgress={sectionProgress} sectionData={sectionData} activeExercise={activeExercise} toggleHelpWindow={this.toggleHelpWindow} submitExercise={this.submitExercise} email={this.props.email} userName={this.props.userName} sectionsLocation={this.props.sectionsLocation} sectionIndex={this.props.sectionIndex} helpApis={this.props.helpApis} />
        </div>)
    }
}


export default ZoneSection;
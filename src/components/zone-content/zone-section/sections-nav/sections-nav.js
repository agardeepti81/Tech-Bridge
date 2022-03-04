import { Component } from "react";
import "./sections-nav.css"
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Input, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

export default class SectionNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shareFeedbackWindow: false,
            feedback: ""
        }
        this.changeExercise = this.changeExercise.bind(this);
        this.toggleFeedbackWindow = this.toggleFeedbackWindow.bind(this);
        this.shareFeedback = this.shareFeedback.bind(this);
    }

    changeExercise(exerciseIndexEvent) {
        let exerciseIndex = exerciseIndexEvent.target.value;
        this.props.changeExercise(exerciseIndex);
    }

    toggleFeedbackWindow() {
        this.setState({
            shareFeedbackWindow: !this.state.shareFeedbackWindow,
            feedback: ""
        })
    }

    shareFeedback() {
        let feedback = JSON.stringify({
            "feedback": this.state.feedback,
            "email": this.props.email,
            "userName": this.props.userName,
            "exerciseLocation": {
                "profile": this.props.sectionsLocation.profile,
                "roadmap": this.props.sectionsLocation.roadmap,
                "path": this.props.sectionsLocation.pathName,
                "zone": this.props.sectionsLocation.zoneName,
                "section": this.props.sectionIndex,
                "exercise": this.props.activeExercise
            }
        });
        this.sendFeedback(feedback);
    }

    sendFeedback(feedback) {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: feedback,
            redirect: 'follow'
        };
        console.log(this.props)
        fetch(this.props.feedbackApis.sendFeedback, requestOptions)
            .then(response => response.json())
            .then(response => {
                this.setState({
                    shareFeedbackWindow: false
                })
                console.log(response);
                alert("Thanks for sharing your valuable feedback");
            })
            .catch(error => {
                alert("Some error occured, Please try again later");
                console.log('error', error)
            });
    }

    render() {
        const { isActiveSection, currentExercise, activeExercise, isExerciseComplete, nextExercise, changeExercise } = this.props;
        let menuItems = [], currentNextExercise;

        if (isActiveSection) {
            if (currentExercise === activeExercise) {
                if (isExerciseComplete)
                    currentNextExercise = <Button className="currentNextExercise" variant="contained" onClick={nextExercise}>Start Next Exercise</Button>;
                else
                    currentNextExercise = <Button className="currentNextExercise" variant="contained" disabled>Current Exercise</Button>;
            }
            else
                currentNextExercise = <Button className="currentNextExercise" variant="contained" onClick={() => changeExercise(currentExercise)}>Current Exercise</Button>;

        }
        else {
            currentNextExercise = <Button className="currentNextExercise" variant="contained" disabled>Current Exercise</Button>;
        }
        for (let i = 0; i < currentExercise; i++) {
            menuItems.push(<MenuItem value={i + 1}>{i + 1}</MenuItem>)
        }
        return (<div className="sectionsNav">
            <Button className="viewLesson" variant="contained" onClick={() => changeExercise(0)}>Lesson <AutoStoriesIcon className="iconCsss" /></Button>
            <div className="emptySpace">Join room Room{this.props.sectionsLocationIndex.zoneIndex + 1} <a href={this.props.meetingLink} target="_blank">here</a></div>
            <Button className="shareFeedback" variant="contained" onClick={this.toggleFeedbackWindow}>Share Feedback</Button>
            <div className="exerciseInfo">
                <div className="exerciseInfo1st">Exercise</div>
                <Select
                    className="exerciseInfo2nd"
                    value={this.props.activeExercise}
                    onChange={this.changeExercise}
                    variant="standard"
                    disableUnderline
                >
                    {menuItems}
                </Select>
                <div className="exerciseInfo3rd">of {this.props.totalExercises}</div>
            </div>
            {currentNextExercise}

            <Modal
                isOpen={this.state.shareFeedbackWindow}
                toggle={this.toggleFeedbackWindow}
            >
                <ModalHeader toggle={this.toggleFeedbackWindow}>
                    Share Feedback
                </ModalHeader>
                <ModalBody>
                    <Input
                        type="textarea"
                        placeholder="Share your Feedback"
                        value={this.state.feedback}
                        onChange={(e) => {
                            this.setState({
                                feedback: e.target.value
                            });
                        }}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' variant='contained' onClick={this.shareFeedback}>Share Feedback</Button>
                </ModalFooter>
            </Modal>
        </div>)
    }
}
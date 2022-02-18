import { Component } from "react";
import { Button, Input } from "reactstrap";

export default class ZoneSectionContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exerciseInput: "",
            improveAnswer: false
        }
        this.submitExercise = this.submitExercise.bind(this);
        this.improveAnswer = this.improveAnswer.bind(this);
    }
    componentDidMount() {
        this.setExerciseView();
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setExerciseView();
            console.log("view updated");
        }
    }

    setExerciseView() {
        const { sectionProgress, type, activeExercise } = this.props;
        let n = sectionProgress.exercises[activeExercise - 1]?.response.length;
        if (activeExercise !== 0 && n !== 0) {
            console.log("called");
            this.setState({
                exerciseInput: sectionProgress.exercises[activeExercise - 1]?.response[n - 1],
                improveAnswer: true
            })
        }
        else {
            this.setState({
                exerciseInput: '',
                improveAnswer: false
            })
        }
    }

    submitExercise() {
        const { exerciseInput } = this.state;
        if (exerciseInput.trim() === "")
            alert("Enter exercise response");
        else
            this.props.submitExercise(exerciseInput);
    }

    improveAnswer() {
        this.setState({
            improveAnswer: false
        })
    }

    render() {
        const { type, sectionProgress, sectionData, activeExercise } = this.props;
        const { improveAnswer } = this.state;
        const completeVideoButtton = [], exerciseData = sectionData.exercises;
        if (!sectionProgress.video)
            completeVideoButtton.push(<Button color="primary" onClick={this.props.completeVideo}>Mark Video as complete</Button>)
        if (activeExercise == 0)
            return (<div className="videoView">
                <video width="600" controls>
                    <source src={sectionData.video} type="video/mp4" />
                    Your browser doesn't support HTML video
                </video>
                <div>{completeVideoButtton}</div>
            </div>)
        else {
            if (improveAnswer)
                return (<div className="exerciseContent">
                    <div className="exerciseDesc" dangerouslySetInnerHTML={{ __html: exerciseData[activeExercise - 1]?.desc }}></div>
                    <div className="exerciseResp">
                        <Input
                            type="textarea"
                            placeholder="Enter your response"
                            value={this.state.exerciseInput}
                            disabled
                        />
                        <Button className="exerciseButtons" color="primary" onClick={this.improveAnswer} >Improve Answer</Button>
                        <Button className="exerciseButtons" color="primary" onClick={this.props.toggleHelpWindow}>Ask for help</Button>
                    </div>
                </div>)
            else
                return (<div className="exerciseContent">
                    <div className="exerciseDesc" dangerouslySetInnerHTML={{ __html: exerciseData[activeExercise - 1]?.desc }}></div>
                    <div className="exerciseResp">
                        <Input
                            type="textarea"
                            placeholder="Enter your response"
                            value={this.state.exerciseInput}
                            onChange={(e) => {
                                this.setState({
                                    exerciseInput: e.target.value
                                });
                            }}
                        />
                        <Button className="exerciseButtons" color="primary" onClick={this.submitExercise} >Submit</Button>
                        <Button className="exerciseButtons" color="primary" onClick={this.props.toggleHelpWindow}>Ask for help</Button>
                    </div>
                </div>)
        }
    }
}
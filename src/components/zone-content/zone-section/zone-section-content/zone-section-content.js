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
        }
    }

    setExerciseView(){
        const { sectionProgress, type, exerciseIndex } = this.props;
        let n = sectionProgress.exercises[exerciseIndex-1]?.response.length;
        if (type === "exercise" && n !== 0) {
            this.setState({
                exerciseInput: sectionProgress.exercises[exerciseIndex-1].response[n - 1],
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
        const { type, sectionProgress, sectionData, exerciseIndex } = this.props;
        const { improveAnswer } = this.state;
        const completeVideoButtton = [], exerciseData = sectionData.exercises;
        if (!sectionProgress.video)
            completeVideoButtton.push(<Button color="primary" onClick={this.props.completeVideo}>Mark Video as complete</Button>)
        if (type === "video")
            return (<div>
                <video width="400" controls>
                    <source src={sectionData.video} type="video/mp4" />
                    Your browser doesn't support HTML video
                </video>
                {completeVideoButtton}
            </div>)
        else if (type === "exercise") {
            if (improveAnswer)
                return (<div>
                    <div dangerouslySetInnerHTML={{ __html: exerciseData[exerciseIndex-1].desc }}></div>
                    <Input
                        type="textarea"
                        placeholder="Enter your response"
                        value={this.state.exerciseInput}
                        disabled
                    />
                    <Button className="exerciseButtons" color="primary" onClick={this.improveAnswer} >Improve Answer</Button>
                    <Button className="exerciseButtons" color="primary" onClick={this.props.toggleHelpWindow}>Ask for help</Button>
                </div>)
            else
                return (<div>
                    <div dangerouslySetInnerHTML={{ __html: exerciseData[exerciseIndex-1].desc }}></div>
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
                </div>)
        }
        else
            return (<div></div>)
    }
}
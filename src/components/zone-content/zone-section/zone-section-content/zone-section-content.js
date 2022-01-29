import { Component } from "react";
import { Button, Input } from "reactstrap";

export default class ZoneSectionContent extends Component {
    constructor(props){
        super(props);
        this.state = {
            exerciseInput:""
        }
    }
    render() {
        const { type, sectionProgress, sectionData,exerciseIndex } = this.props;
        const completeVideoButtton = [], exerciseData=sectionData.exercises;
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
        else if (type === "exercise")
            return (<div>
                <div dangerouslySetInnerHTML={{ __html: exerciseData[exerciseIndex].desc }}></div>

                <Input
                    type="textarea"
                    placeholder="Enter your response"
                    value={sectionProgress.exercises[exerciseIndex].response}
                    onChange={(e) => {
                        let sectionProgress = sectionProgress;
                        sectionProgress.exercises[exerciseIndex].response = e.target.value
                    }}
                />
                <Button className="exerciseButtons" color="primary" onClick={() => this.sendExerciseResponse(exerciseIndex)} >Submit</Button>
                <Button className="exerciseButtons" color="primary" onClick={() => this.toggleHelpWindow()}>Ask for help</Button>
            </div>)
        else
            return (<div></div>)
    }
}
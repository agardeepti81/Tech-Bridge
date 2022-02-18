import { Component } from "react";
import "./sections-nav.css"
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default class SectionNav extends Component {
    constructor(props){
        super(props);
        this.changeExercise = this.changeExercise.bind(this);
    }
    changeExercise(exerciseIndexEvent){
        let exerciseIndex = exerciseIndexEvent.target.value;
        this.props.changeExercise(exerciseIndex);
    }
    render() {
        const { isActiveSection, currentExercise, activeExercise, isExerciseComplete, nextExercise, changeExercise } = this.props;
        let menuItems = [], currentNextExercise;

        if (isActiveSection) {
            if (currentExercise === activeExercise){
                if(isExerciseComplete)
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
        menuItems.push(<MenuItem value={0}>0</MenuItem>)
        for (let i = 0; i < currentExercise; i++) {
            menuItems.push(<MenuItem value={i + 1}>{i + 1}</MenuItem>)
        }
        return (<div className="sectionsNav">
            <Button className="viewLesson" variant="contained">Lesson <AutoStoriesIcon className="iconCsss" /></Button>
            <div className="emptySpace"></div>
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
        </div>)
    }
}
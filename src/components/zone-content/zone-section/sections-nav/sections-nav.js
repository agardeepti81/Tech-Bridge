import { Component } from "react";
import "./sections-nav.css"
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default class SectionNav extends Component {
    changeExercise(exercise) {
        console.log(exercise);
    }
    render() {
        let menuItems=[];
        menuItems.push(<MenuItem value={0}>0</MenuItem> )
        for(let i=0;i<this.props.totalExercises;i++){
            menuItems.push(<MenuItem value={i+1}>{i+1}</MenuItem>)
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
            <Button className="viewCurrentExercise" variant="contained">Current Exercise</Button>
        </div>)
    }
}
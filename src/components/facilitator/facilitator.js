import { Button, ButtonGroup } from '@mui/material';
import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import './facilitator.css';

class Facilitator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            problemsList: [],
            solutionsList: [],
            solvedProblemsList: [],
            activeProblem: -1,
            exerciseDesc: "",
            mode: "problems",
            modeVariants: ["active", ""]
        }
        this.updateActiveProblem = this.updateActiveProblem.bind(this);
        this.toggleMode = this.toggleMode.bind(this);
    }

    componentDidMount() {
        fetch(`${this.props.facilitatorApis.getProblemList}`)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    this.setState({
                        problemsList: result.filter(problem => problem.status === "Unresolved"),
                        solutionsList: result.filter(problem => problem.status === "Resolved")
                    })
                }
            )
    }

    updateActiveProblem(problemIndex) {
        const { mode, problemsList, solutionsList } = this.state;
        let currentList = [];
        if (mode === "problems")
            currentList = problemsList;
        else if(mode === "solutions")
            currentList = solutionsList;
            
        let url = `${process.env.PUBLIC_URL}/data/profiles/${currentList[problemIndex].exerciseLocation.profile}/${currentList[problemIndex].exerciseLocation.roadmap}/${currentList[problemIndex].exerciseLocation.path}/${currentList[problemIndex].exerciseLocation.zone}.json`;
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        exerciseDesc: result.sections[currentList[problemIndex].exerciseLocation.section].exercises[currentList[problemIndex].exerciseLocation.exercise].desc,
                        activeProblem: problemIndex
                    });
                }
            )
        this.setState({
            activeProblem: problemIndex
        })
    }

    toggleMode(mode) {
        let modeVariants = ['', ''];
        modeVariants[0] = mode === "problems" ? "active" : "";
        modeVariants[1] = mode === "problems" ? "" : "active";
        console.log(modeVariants, mode)
        this.setState({
            mode: mode,
            modeVariants: modeVariants,
            activeProblem: -1,
            exerciseDesc: ""
        })
    }

    render() {
        const { problemsList, activeProblem, exerciseDesc, modeVariants, solutionsList, mode } = this.state;
        let currentList;
        if (mode === "problems")
            currentList = problemsList;
        else if (mode == "solutions")
            currentList = solutionsList;
        else
            currentList = [];
        let currentListUI = [];
        for (let i = 0; i < currentList.length; i++) {
            let index = i;
            if (i === activeProblem)
                currentListUI.push(<ListGroupItem
                    active
                    tag="button"
                    className='listItem'
                    onClick={() => this.updateActiveProblem(index)}
                >
                    {currentList[i].userName}
                </ListGroupItem>);
            else {
                currentListUI.push(<ListGroupItem
                    tag="button"
                    className='listItem'
                    onClick={() => this.updateActiveProblem(index)}
                >
                    {currentList[i].userName}
                </ListGroupItem>);
            }
        }
        return (<div id='facilitator'>
            <div id="problemsList">
                <ButtonGroup className='toggleMode' aria-label="outlined white button group">
                    <Button className={'toggleButtons toggleButtonLeft ' + modeVariants[0]} onClick={() => this.toggleMode("problems")}>Problems</Button>
                    <Button className={'toggleButtons toggleButtonRight ' + modeVariants[1]} onClick={() => this.toggleMode("solutions")}>Solutions</Button>
                </ButtonGroup>
                <ListGroup>
                    {currentListUI}
                </ListGroup>
            </div>
            <div id="problemAndExerciseDesc">
                <div id="exerciseDesc" dangerouslySetInnerHTML={{ __html: exerciseDesc }}></div>
                <div id="problemDesc">
                    <div>{currentList[activeProblem]?.problem}</div>
                </div>
            </div>
            <div id="existingSolutionsList"></div>
        </div>)
    }
}

export default Facilitator;
import React, { Component } from 'react';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import './facilitator.css';

class Facilitator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            problemsList: [
                {
                    "name": "Problem 1",
                    "desc": "Problem Description",
                    "exerciseLocation": {
                        "profileCode": "agile-sd",
                        "roadmapName": "roadmap1",
                        "pathCode": "foundation",
                        "zoneName": "Zone-1",
                        "sectionIndex": 0,
                        "exerciseIndex": 0
                    }
                },
                {
                    "name": "Problem 2",
                    "desc": "Problem Description",
                    "exerciseLocation": {
                        "profileCode": "agile-sd",
                        "roadmapName": "roadmap1",
                        "pathCode": "foundation",
                        "zoneName": "Zone-5",
                        "sectionIndex": 0,
                        "exerciseIndex": 2
                    }
                },
                {
                    "name": "Problem 3",
                    "desc": "Problem Description",
                    "exerciseLocation": {
                        "roadmapName": "roadmap1",
                        "profileCode": "agile-sd",
                        "pathCode": "foundation",
                        "zoneName": "Zone-3",
                        "sectionIndex": 0,
                        "exerciseIndex": 1
                    }
                },
                {
                    "name": "Problem 4",
                    "desc": "Problem Description",
                    "exerciseLocation": {
                        "profileCode": "agile-sd",
                        "roadmapName": "roadmap1",
                        "pathCode": "foundation",
                        "zoneName": "Zone-2",
                        "sectionIndex": 0,
                        "exerciseIndex": 1
                    }
                },
                {
                    "name": "Problem 5",
                    "desc": "Problem Description",
                    "exerciseLocation": {
                        "profileCode": "agile-sd",
                        "roadmapName": "roadmap1",
                        "pathCode": "foundation",
                        "zoneName": "Zone-1",
                        "sectionIndex": 2,
                        "exerciseIndex": 0
                    }
                }
            ],
            activeProblem: -1,
            exerciseDesc: ""
        }
        this.updateActiveProblem = this.updateActiveProblem.bind(this);
    }

    updateActiveProblem(problemIndex) {
        const { problemsList } = this.state
        fetch(`${process.env.PUBLIC_URL}/data/profiles/${problemsList[problemIndex].exerciseLocation.profileCode}/${problemsList[problemIndex].exerciseLocation.roadmapName}/${problemsList[problemIndex].exerciseLocation.pathCode}/${problemsList[problemIndex].exerciseLocation.zoneName}.json`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        exerciseDesc: result.sections[problemsList[problemIndex].exerciseLocation.sectionIndex].exercises[problemsList[problemIndex].exerciseLocation.exerciseIndex].desc,
                        activeProblem: problemIndex
                    });
                }
            )
        this.setState({
            activeProblem: problemIndex
        })
    }

    render() {
        const { problemsList, activeProblem, exerciseDesc } = this.state;
        let problemListUI = [];
        for (let i = 0; i < problemsList.length; i++) {
            let index = i;
            if (i === activeProblem)
                problemListUI.push(<ListGroupItem
                    active
                    tag="button"
                    className='listItem'
                    onClick={() => this.updateActiveProblem(index)}
                >
                    {problemsList[i].name}
                </ListGroupItem>);
            else {
                problemListUI.push(<ListGroupItem
                    tag="button"
                    className='listItem'
                    onClick={() => this.updateActiveProblem(index)}
                >
                    {problemsList[i].name}
                </ListGroupItem>);
            }
        }
        return (<div id='facilitator'>
            <div id="problemsList">
                <ListGroup>
                    {problemListUI}
                </ListGroup>
            </div>
            <div id="problemAndExerciseDesc">
                <div id="exerciseDesc" dangerouslySetInnerHTML={{ __html: exerciseDesc }}></div>
                <div id="problemDesc">
                    <h5>{problemsList[activeProblem]?.name}</h5>
                    <div>{problemsList[activeProblem]?.desc}</div>
                </div>
            </div>
            <div id="existingSolutionsList"></div>
        </div>)
    }
}

export default Facilitator;
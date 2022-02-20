import { Button, ButtonGroup, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React, { Component } from 'react';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, ListGroup, ListGroupItem } from 'reactstrap';
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
            modeVariants: ["active", ""],
            curatedSolutions: []
        }
        this.updateActiveProblem = this.updateActiveProblem.bind(this);
        this.toggleMode = this.toggleMode.bind(this);
    }

    componentDidMount() {
        fetch(`${this.props.facilitatorApis.getProblemList}`)
            .then(res => res.json())
            .then(
                (result) => {
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
        else if (mode === "solutions")
            currentList = solutionsList;
        const { profile, roadmap, path, zone, section, exercise } = currentList[problemIndex].exerciseLocation;

        fetch(`${process.env.PUBLIC_URL}/data/profiles/${profile}/${roadmap}/${path}/${zone}.json`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        exerciseDesc: result.sections[section].exercises[exercise].desc,
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
            <div id="existingSolutionsList">
                <CuratedSolutions exerciseLocation={currentList[activeProblem]?.exerciseLocation} getCuratedSolutionApi={this.props.facilitatorApis.getSolutionsOfExercise} activeProblem={activeProblem} />
            </div>
        </div>)
    }
}

class CuratedSolutions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeCuratedSolution: 0,
            curatedSolutions: []
        }
        this.changeActiveCuratedSolution = this.changeActiveCuratedSolution.bind(this);
    }

    componentDidMount() {
        this.fetchCuratedSolutions();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.exerciseLocation !== this.props.exerciseLocation)
            this.fetchCuratedSolutions();
    }

    fetchCuratedSolutions() {
        if (this.props.exerciseLocation) {
            const { profile, roadmap, path, zone, section, exercise } = this.props.exerciseLocation;
            fetch(`${this.props.getCuratedSolutionApi}?profile=${profile}&roadmap=${roadmap}&path=${path}&zone=${zone}&section=${section}&exercise=${exercise}`)
                .then(res => res.json())
                .then(
                    (result) => {
                        this.setState({
                            curatedSolutions: result
                        })
                    }
                )
        }
    }

    changeActiveCuratedSolution(solutionIndex) {
        this.setState({
            activeCuratedSolution: solutionIndex
        })
    }

    render() {
        if (this.props.activeProblem !== -1)
            return (<div>
                <Accordion
                    className='curatedSolutions'
                    open={this.state.activeCuratedSolution}
                    toggle={this.changeActiveCuratedSolution}
                >
                    {this.state.curatedSolutions.map((solution, i) => {
                        return <AccordionItem key={i}>
                            <AccordionHeader className='solutionHeader' targetId={i + 1}>
                                {solution.problem}
                            </AccordionHeader>
                            <AccordionBody className='solutionBody' accordionId={i + 1}>
                                <div className="solution">{solution.solution}</div>
                                <Button variant="contained" color='info'>Attach Solution</Button>
                            </AccordionBody>
                        </AccordionItem>;
                    })}
                </Accordion>
                <div className='addSolution'>
                    <Fab color="primary" aria-label="add">
                        <AddIcon />
                    </Fab>
                </div>
            </div>)
        else
            return (<></>);
    }
}

export default Facilitator;
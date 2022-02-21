import { Button, ButtonGroup, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React, { Component } from 'react';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Input, ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
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
        this.fetchProblems = this.fetchProblems.bind(this);
    }

    componentDidMount() {
        this.fetchProblems();
    }

    fetchProblems() {
        fetch(`${this.props.facilitatorApis.getProblemList}`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        problemsList: result.filter(problem => problem.statusMsg === "Unresolved"),
                        solutionsList: result.filter(problem => problem.statusMsg === "Resolved"),
                        activeProblem: -1
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
        this.setState({
            mode: mode,
            modeVariants: modeVariants,
            activeProblem: -1,
            exerciseDesc: ""
        })
    }

    render() {
        const { problemsList, activeProblem, exerciseDesc, modeVariants, solutionsList, mode } = this.state;
        let currentList, note;
        if (mode === "problems")
            currentList = problemsList;
        else if (mode == "solutions"){
            currentList = solutionsList;
            note = solutionsList[activeProblem]?.note
        }
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
                    <div>{note}</div>
                </div>
            </div>
            <div id="existingSolutionsList">
                <CuratedSolutions activeProblem={currentList[activeProblem]} facilitatorApis={this.props.facilitatorApis} activeProblemIndex={activeProblem} mode={mode} refresh={this.fetchProblems} />
            </div>
        </div>)
    }
}

class CuratedSolutions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeCuratedSolution: 0,
            curatedSolutions: [],
            addSolutionWindow: false,
            solution: "",
            problem: ""
        }
        this.changeActiveCuratedSolution = this.changeActiveCuratedSolution.bind(this);
        this.toggleSolutionWindow = this.toggleSolutionWindow.bind(this);
        this.addSolution = this.addSolution.bind(this);
    }

    componentDidMount() {
        this.fetchCuratedSolutions();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.exerciseLocation !== this.props.exerciseLocation)
            this.fetchCuratedSolutions();
    }

    fetchCuratedSolutions() {
        if (this.props.activeProblem?.exerciseLocation) {
            const { profile, roadmap, path, zone, section, exercise } = this.props.exerciseLocation;
            fetch(`${this.props.facilitatorApis.getCuratedSolutionApi}?profile=${profile}&roadmap=${roadmap}&path=${path}&zone=${zone}&section=${section}&exercise=${exercise}`)
                .then(res => res.json())
                .then(
                    (result) => {
                        this.setState({
                            curatedSolutions: result,
                            activeCuratedSolution: 0,
                            solution: ""
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

    toggleSolutionWindow() {
        this.setState({
            addSolutionWindow: !this.state.addSolutionWindow,
            solution: "",
            problem: ""
        })
    }

    attachSolution(solutionIndex) {

    }

    addSolution() {
        debugger
        let solutionToSend;
        if (this.props.mode === "problems") {
            solutionToSend = JSON.stringify({
                "statusMsg": "Resolved",
                "email": this.props.activeProblem.email,
                "problem": this.props.activeProblem.problem,
                "note": this.state.solution
            });
        }
        else if (this.props.mode === "solutions") {
            solutionToSend = JSON.stringify({
                "statusMsg": "Completed",
                "email": this.props.activeProblem.email,
                "problem": this.props.activeProblem.problem,
                "newCuratedSolution": {
                    "problem": this.state.problem,
                    "solution": this.state.solution,
                    "exerciseLocation": this.props.activeProblem.exerciseLocation
                }
            });
        }
        console.log(solutionToSend);
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: solutionToSend,
            redirect: 'follow'
        };

        fetch(this.props.facilitatorApis.updateProblem, requestOptions)
            .then(response => response.json())
            .then(response => {
                this.toggleSolutionWindow();
                this.props.refresh();
            })
            .catch(error => {
                alert("Some error occured, Please try again later");
                console.log('error', error)
            });
    }

    render() {
        if (this.props.activeProblemIndex !== -1) {
            let problemUI;
            if (this.props.mode === "solutions")
                problemUI = <Input
                    placeholder="Enter your problem"
                    value={this.state.problem}
                    onChange={(e) => {
                        this.setState({
                            problem: e.target.value
                        });
                    }}
                />
            return (<div>
                <Accordion
                    className='curatedSolutions'
                    open={this.state.activeCuratedSolution}
                    toggle={this.changeActiveCuratedSolution}
                >
                    {this.state.curatedSolutions.map((solution, i) => {
                        let attachSolution = this.props.mode === "problems" ? <Button variant="contained" color='info' onClick={() => this.attachSolution(i)}>Attach Solution</Button> : [];
                        return <AccordionItem key={i}>
                            <AccordionHeader className='solutionHeader' targetId={i + 1}>
                                {solution.problem}
                            </AccordionHeader>
                            <AccordionBody className='solutionBody' accordionId={i + 1}>
                                <div className="solution">{solution.solution}</div>
                                {attachSolution}
                            </AccordionBody>
                        </AccordionItem>;
                    })}
                </Accordion>
                <div className='addSolution'>
                    <Fab color="primary" aria-label="add" onClick={this.toggleSolutionWindow}>
                        <AddIcon />
                    </Fab>
                    <Modal
                        isOpen={this.state.addSolutionWindow}
                        toggle={this.toggleSolutionWindow}
                    >
                        <ModalHeader toggle={this.toggleSolutionWindow}>
                            Add Solution
                        </ModalHeader>
                        <ModalBody>
                            {problemUI}
                            <Input
                                type="textarea"
                                placeholder="Enter your Solution"
                                value={this.state.solution}
                                onChange={(e) => {
                                    this.setState({
                                        solution: e.target.value
                                    });
                                }}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color='primary' variant='contained' onClick={this.addSolution}>Add Solution</Button>
                        </ModalFooter>
                    </Modal>
                </div>
            </div>)
        }
        else
            return (<></>);
    }
}

export default Facilitator;
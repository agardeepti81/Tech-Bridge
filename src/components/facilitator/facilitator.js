import { Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import './facilitator.css';

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
      '& .MuiSwitch-thumb': {
        width: 15,
      },
      '& .MuiSwitch-switchBase.Mui-checked': {
        transform: 'translateX(9px)',
      },
    },
    '& .MuiSwitch-switchBase': {
      padding: 2,
      '&.Mui-checked': {
        transform: 'translateX(12px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(['width'], {
        duration: 200,
      }),
    },
    '& .MuiSwitch-track': {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor:
        theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
      boxSizing: 'border-box',
    },
  }));
  

class Facilitator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            problemsList: [],
            solutionsList: [],
            solvedProblemsList: [],
            activeProblem: -1,
            exerciseDesc: "",
            documentSolutions: false
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

    toggleMode(){
        this.setState({
            documentSolutions: !this.state.documentSolutions
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
                    {problemsList[i].userName}
                </ListGroupItem>);
            else {
                problemListUI.push(<ListGroupItem
                    tag="button"
                    className='listItem'
                    onClick={() => this.updateActiveProblem(index)}
                >
                    {problemsList[i].userName}
                </ListGroupItem>);
            }
        }
        return (<div id='facilitator'>
            <div id="problemsList">
                <div id="toggleMode">
                    Document Solutions
                    <AntSwitch
                        checked={this.state.documentSolutions}
                        onChange={this.toggleMode}
                        color="default"
                    />
                </div>
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
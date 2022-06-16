import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./scope-cards.css";
import SubjectScope from "./Subjectscope";
import SubjectCard from "./SubjectCard";

class MainSubjectScope extends Component {
  state = {
    loading: true,
    subjectsList: null,
    activeSubjectId: null,
    activeSubjectName: null,
  };

  async componentDidMount() {
    const subjectList = await this.fetchSubjectList();
    this.setState({ subjectsList: subjectList, loading: false });
  }

  fetchSubjectList = async() => {
    const url = process.env.PUBLIC_URL + "/data/scope-cards/Subjects/subjects.json";
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  changeActiveSubject = (subjectId, subjectName) => {
    this.setState({
      activeSubjectId: subjectId,
      activeSubjectName: subjectName,
    });
  };

  render() {
    if (this.state.loading || !this.state.subjectsList) return <div>loading...</div>;

    return (
      <div id="scope-window">
        <div id="subjectSelection">
          {this.state.subjectsList.map((element) => (
            <SubjectCard
              subjectInfo={element}
              changeActiveSubject={this.changeActiveSubject}
              activeSubjectId = {this.state.activeSubjectId}
            />
          ))}
        </div>
        <div id="subjectView">
          <SubjectScope
            currentScope={this.state.activeSubjectId}
            currentScopeName={this.state.activeSubjectName}
          />
        </div>
      </div>
    );
  }
}

export default MainSubjectScope;

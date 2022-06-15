import React, { Component } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./scope-cards.css";
import SubjectScope from "./Subjectscope";
import SubjectCard from "./SubjectCard";
import TopicQuestions from "./TopicQuestions";


class ScopeView extends Component {
  state = {
    loading: true,
    data: null,
    currentScope: null,
    // viewTopic: false,
    // activeTopicId: false,
    // activeTopicName: null,
    currentScopeName: null
  };

  async componentDidMount() {
    const url = process.env.PUBLIC_URL + "/data/scope-cards/Subjects/subjects.json";
    const response = await fetch(url);
    const data = await response.json();
    this.setState({ data: data, loading: false });
  }

  changeActiveScope = (scopeId, scopeName) => {
    this.setState({
      currentScope: scopeId,
      currentScopeName: scopeName,
      // viewTopic: false,
    });
  };

  // changeTopicView = (topicId, topicName) => {
  //   this.setState({
  //     activeTopicId: topicId,
  //     activeTopicName: topicName
  //   });
  //   // this.toggleTopicView();
  // };

  // toggleTopicView = () => {
  //   this.setState({ viewTopic: !this.state.viewTopic });
  // };

  render() {
    if (this.state.loading || !this.state.data) return <div>loading...</div>;

    return (
      <div id="scope-window">
        <div id="scopeSelection">
          {this.state.data.map((element) => (
            <SubjectCard
              subjectInfo={element}
              changeActiveScope={this.changeActiveScope}
            />
          ))}
        </div>
        <div id="scopeView">
          {/* {this.state.viewTopic ? (
            <TopicQuestions
              activeTopicId={this.state.activeTopicId}
              activeTopicName={this.state.activeTopicName}
              currentScope={this.state.currentScope}
              back={this.toggleTopicView}
            /> */}
          {/* ) : ( */}
            <SubjectScope
              currentScope={this.state.currentScope}
              currentScopeName={this.state.currentScopeName}
              // changeTopicView={this.changeTopicView}
            />
          {/* )} */}
        </div>
      </div>
    );
  }
}

export default ScopeView;

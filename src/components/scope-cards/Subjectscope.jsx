import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import TopicTiles from "./TopicTiles";
import TopicQuestions from "./TopicQuestions";

class SubjectScope extends Component {
  state = {
    viewTopic: false,
    activeTopicId: false,
    activeTopicName: null,
    categories: null,
    loading: true,
    progress: [],
  };

  async componentDidUpdate(prevProps) {
    if (prevProps.activeSubjectId != this.props.activeSubjectId) {
      let email = this.props.email;
      const url =
        process.env.PUBLIC_URL +
        `/data/scope-cards/Subjects/${this.props.activeSubjectId}/topics.json`;
      const response = await fetch(url);
      const data = await response.json();
      let categories = {};
      const progress_url = `https://bbjzmgdir5.execute-api.ap-south-1.amazonaws.com/dev/scope-cards?email=${email}&subject_id=${this.props.activeSubjectId}`;
      const response_progress = await fetch(progress_url);
      const data_progress = await response_progress.json();
      data.forEach((topic) => {
        if (!(topic.category in categories)) categories[topic.category] = [];

        categories[topic.category].push({ name: topic.name, id: topic.id });
      });

      this.setState({
        categories: categories,
        loading: false,
        viewTopic: false,
        progress: data_progress.progress,
      });
    }
  }

  async componentDidMount() {
    let email = this.props.email;
    let categories = null;
    let data_progress = [];
    if (this.props.activeSubjectId) {
      const url =
        process.env.PUBLIC_URL +
        `/data/scope-cards/Subjects/${this.props.activeSubjectId}/topics.json`;
      const response = await fetch(url);
      const data = await response.json();
      categories = {};
      const progress_url = `https://bbjzmgdir5.execute-api.ap-south-1.amazonaws.com/dev/scope-cards?email=${email}&subject_id=${this.props.activeSubjectId}`;
      const response_progress = await fetch(progress_url);
      data_progress = await response_progress.json();
      data_progress = data_progress.progress;

      data.forEach((topic) => {
        if (!(topic.category in categories)) categories[topic.category] = [];

        categories[topic.category].push({ name: topic.name, id: topic.id });
      });
    }
    this.setState({
      categories: categories,
      loading: false,
      progress: data_progress,
    });
  }

  getProgressData = () => {
    let email = this.props.email;
    let data_progress = [];
    const progress_url = `https://bbjzmgdir5.execute-api.ap-south-1.amazonaws.com/dev/scope-cards?email=${email}&subject_id=${this.props.activeSubjectId}`;
    const response_progress = fetch(progress_url);
    data_progress = response_progress.json();
    this.setState({ progress: data_progress.body.Item.progress });

  };

  changeProgress = (topicid, index) => {
    let changedProgress = this.state.progress;
    for (let i = 0; i < changedProgress.length; i++) {
      if (changedProgress[i].topic_id == topicid) {
        changedProgress[i].completed[index] =
          !changedProgress[i].completed[index];
      }
    }
    this.setState({ progress: changedProgress });
    //Push this progress to Server
    let email = this.props.email;
    let progressUpdate = JSON.stringify({
      "email": email,
      "subject_id": this.props.activeSubjectId,
      "progress": changedProgress
    })
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: progressUpdate,
      redirect: "follow",
    };

    fetch(`https://bbjzmgdir5.execute-api.ap-south-1.amazonaws.com/dev/scope-cards`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        console.log("data updated successfully");
      })
      .catch((error) => {
        alert("Progress couldn't be saved. Please refresh and try again later!!");
        console.log("error", error);
      });
  };

  setNewTopicProgress = (topicId, newTopicProgress) => {
    let progress = this.state.progress;
    let newTopicProgressUpdate = {
      topic_id: topicId,
      completed: newTopicProgress,
    };
    progress.push(newTopicProgressUpdate);
    this.setState({
      progress: progress,
    });
    console.log(progress);
  };

  changeTopicView = (topicId, topicName) => {
    this.setState({
      activeTopicId: topicId,
      activeTopicName: topicName,
    });
    this.toggleTopicView();
  };

  toggleTopicView = () => {
    this.setState({ viewTopic: !this.state.viewTopic });
  };

  render() {
    const categoriesHTML = [];
    for (const category in this.state.categories) {
      categoriesHTML.push(
        <div>
          <Container fluid>
            <Row
              className="bg-primary p-3 m-5"
              style={{
                fontSize: "15pt",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {category}

              <Col
                className="bg-info"
                md={{ span: 12 }}
                style={{
                  fontSize: "10pt",
                  textAlign: "center",
                  margin: "3pt",
                  marginTop: "5pt",
                }}
              >
                {this.state.categories[category].map((element) => (
                  <TopicTiles
                    topic={element}
                    changeTopicView={this.changeTopicView}
                    progressTopicid={this.state.progress.find(
                      (topicProgress) => topicProgress.topic_id == element.id
                    )}
                  />
                ))}
              </Col>
            </Row>
          </Container>
        </div>
      );
    }
    if (!this.props.activeSubjectId)
      return <div id="message">Please click on subject to view scope</div>;
    if (this.state.loading || !this.state.categories)
      return <div>loading... </div>;
    return (
      <div key={this.props.activeSubjectId}>
        {this.state.viewTopic ? (
          <TopicQuestions
            activeTopicId={this.state.activeTopicId}
            activeTopicName={this.state.activeTopicName}
            currentScope={this.props.activeSubjectId}
            progressTopicid={this.state.progress.find(
              (topicProgress) => topicProgress.topic_id == this.state.activeTopicId
            )}
            back={this.toggleTopicView}
            changeProgress={this.changeProgress}
            setNewTopicProgress={this.setNewTopicProgress}
          />
        ) : (
          <div>
            <p id="topictitle">{this.props.activeSubjectName}</p>
            {categoriesHTML}
          </div>
        )}
      </div>
    );
  }
}

export default SubjectScope;

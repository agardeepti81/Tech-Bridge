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
    // progress: [
    //   {
    //     name: "singleandmultipleinheritance",
    //     selected: [false, true, false, false, true, false, false, true],
    //   },
    //   {
    //     name: "templates",
    //     selected: [false, true, false, true],
    //   },
    //   {
    //     name: "references",
    //     selected: [false, true, false],
    //   },
    // ],
  };

  async componentDidUpdate(prevProps) {
    //this.getProgressData();
    if (prevProps.currentScope != this.props.currentScope) {
      let email = "deepti7206@gmail.com";
      const url = process.env.PUBLIC_URL + `/data/scope-cards/Subjects/${this.props.currentScope}/topics.json`;
      const response = await fetch(url);
      const data = await response.json();
      let categories = {};
      const progress_url = `https://bbjzmgdir5.execute-api.ap-south-1.amazonaws.com/dev/scope-cards?email=${email}&subject_id=${this.props.currentScope}`;
      const response_progress = await fetch(progress_url);
      const data_progress = await response_progress.json();
      console.log(data_progress);

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
    // this.getProgressData();
    let email = "deepti7206@gmail.com";
    let categories = null;
    let data_progress = [];
    if (this.props.currentScope) {
      const url = process.env.PUBLIC_URL + `/data/scope-cards/Subjects/${this.props.currentScope}/topics.json`;
      const response = await fetch(url);
      const data = await response.json();
      categories = {};
      const progress_url = `https://bbjzmgdir5.execute-api.ap-south-1.amazonaws.com/dev/scope-cards?email=${email}&subject_id=${this.props.currentScope}`;
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
      progress: data_progress
    });
  }

  getProgressData = () => {
    console.log(this.props.currentScope)
    let email = "deepti7206@gmail.com";
    let data_progress = [];
    const progress_url =
    `https://bbjzmgdir5.execute-api.ap-south-1.amazonaws.com/dev/scope-cards?email=${email}&subject_id=${this.props.currentScope}`;
    const response_progress = fetch(progress_url);
    data_progress = response_progress.json();
    this.setState({progress: data_progress.body.Item.progress});
  }

  changeProgress = (topicid, index) => {
    let changedProgress = this.state.progress;
    for (let i = 0; i < changedProgress.length; i++) {
      if (changedProgress[i].id == topicid) {
        changedProgress[i].selected[index] =
          !changedProgress[i].selected[index];
      }
    }
    this.setState({ progress: changedProgress });
    //Push this progress to Server
  };

  setNewTopicProgress = (topicId, newTopicProgress) => {
    let progress = this.state.progress;
    let newTopicProgressUpdate = {
      "topic_id": topicId,
      "completed": newTopicProgress
    }
    progress.push(newTopicProgressUpdate);
    this.setState({
      progress: progress
    })
  }

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
                      (topicProgress) => topicProgress.name == element.id
                    )}
                  />
                ))}
              </Col>
            </Row>
          </Container>
        </div>
      );
    }

    if (!this.props.currentScope)
      return <div id="message">Please click on subject to view scope</div>;
    if (this.state.loading || !this.state.categories)
      return <div>loading... </div>;
    return (
      <div>
        {this.state.viewTopic ? (
          <TopicQuestions
            activeTopicId={this.state.activeTopicId}
            activeTopicName={this.state.activeTopicName}
            currentScope={this.props.currentScope}
            progressTopicid={this.state.progress.find(
              (topicProgress) => topicProgress.name == this.state.activeTopicId
            )}
            back={this.toggleTopicView}
            changeProgress={this.changeProgress}
            setNewTopicProgress={this.setNewTopicProgress}
          />
        ) : (
          <div>
            <p id="topictitle">{this.props.currentScopeName}</p>
            {categoriesHTML}
          </div>
        )}
      </div>
    );
  }
}

export default SubjectScope;

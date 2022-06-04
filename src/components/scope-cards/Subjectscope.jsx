import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import TopicTiles from "./TopicTiles";

class SubjectScope extends Component {
  state = {
    categories: null,
    loading: true,
  };

  async componentDidUpdate() {
    const url =
      process.env.PUBLIC_URL +
      `/data/scope-cards/Subjects/${this.props.currentScope}/topics.json`;
    const response = await fetch(url);
    const data = await response.json();
    let categories = {};

    data.forEach((topic) => {
      if (!(topic.category in categories)) categories[topic.category] = [];

      categories[topic.category].push({ name: topic.name, id: topic.id });
    });

    this.setState({
      categories: categories,
      loading: false,
    });
  }

  async componentDidMount() {
    let categories = null;
    if (!this.props.currentScope) {
      const url =
        process.env.PUBLIC_URL +
        `/data/scope-cards/Subjects/${this.props.currentScope}/topics.json`;
      const response = await fetch(url);
      const data = await response.json();
      categories = {};

      data.forEach((topic) => {
        if (!(topic.category in categories)) categories[topic.category] = [];

        categories[topic.category].push({ name: topic.name, id: topic.id });
      });
    }
    this.setState({
      categories: categories,
      loading: false,
    });
  }

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
                    changeTopicView={this.props.changeTopicView}
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
        <p id="topictitle">{this.props.currentScopeName}</p>
        {categoriesHTML}
      </div>
    );
  }
}

export default SubjectScope;

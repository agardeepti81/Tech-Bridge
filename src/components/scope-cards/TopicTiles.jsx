import React, { Component } from "react";
import { Card, ProgressBar, Button } from "react-bootstrap";

class TopicTiles extends Component {
  render() {
    const percentage = 59;
    return (
      <Card
        id={this.props.topic.id}
        className="cardstyle"
        style={{
          width: "10rem",
          height: "10rem",
          textAlign: "center",
          margin: "5px",
        }}
      >
        <Card.Body>
          <Card.Title className="subjectTitle">
            {this.props.topic.name}
          </Card.Title>
          {`${percentage}% completed`}
          <ProgressBar variant="success" now={percentage} animated />
          <Button
            onClick={() => {
              this.props.changeTopicView(this.props.topic.id, this.props.topic.name);
            }}
          >
            Submit
          </Button>
        </Card.Body>
      </Card>
    );
  }
}

export default TopicTiles;

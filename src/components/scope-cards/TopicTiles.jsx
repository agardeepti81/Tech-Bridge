import React, { Component } from "react";
import { Card, ProgressBar, Button } from "react-bootstrap";

class TopicTiles extends Component {
  render() {
    let percentage;
    if(this.props.progressTopicid)
    {
      let count = 0;
      for (let i = 0; i < this.props.progressTopicid.selected.length; i++) {
        if(this.props.progressTopicid.selected[i])
        count++;
      }
      percentage = count/this.props.progressTopicid.selected.length*100;
    }

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
          {percentage ?<div>{ ` ${percentage}% completed`}
          <ProgressBar variant="success" now={percentage} animated /> </div> : <div></div>}
         
          <Button
            onClick={() => {
              this.props.changeTopicView(this.props.topic.id, this.props.topic.name);
            }}
          >
          {this.props.progressTopicid ? "Resume" : "Start"}
          </Button>
        </Card.Body>
      </Card>
    );
  }
}

export default TopicTiles;

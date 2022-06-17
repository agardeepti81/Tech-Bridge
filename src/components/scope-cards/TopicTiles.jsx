import React, { Component } from "react";
import { Card, ProgressBar, Button } from "react-bootstrap";

class TopicTiles extends Component {
  render() {
    let percentage;
    if(this.props.progressTopicid){
      let count = 0;
      for (let i = 0; i < this.props.progressTopicid.completed.length; i++) {
        if(this.props.progressTopicid.completed[i])
        count++;
      }
      percentage = parseFloat(count/this.props.progressTopicid.completed.length*100).toFixed(2);
    }
    if(percentage == 100)
    percentage = null;
    return (
      <Card key={this.props.topic.id}
        id={this.props.topic.id}
        className="topicTiles"
      >
        <Card.Body>
          <Card.Title className="topicTitle">
            {this.props.topic.name}
          </Card.Title>
          {percentage ?<ProgressBar className="topicProgress" variant="success" now={percentage} animated /> : <div className="topicProgress"></div>}
         
          <Button
            className="topicButton"
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

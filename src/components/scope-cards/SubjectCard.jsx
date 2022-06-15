import React, { Component } from "react";
import { Card, Button, SplitButton } from "react-bootstrap";

class SubjectCard extends Component {
  render() {
    return (
      <Card className="subjectCard">
        <Card.Img
          className="subjectLogo"
          src={process.env.PUBLIC_URL + this.props.subjectInfo.logo}
        />
        <Card.Body>
          <Card.Title className="subjectTitle">
            {this.props.subjectInfo.name}
          </Card.Title>
          <Button
            variant="primary"
            onClick={() => {
              this.props.changeActiveScope(this.props.subjectInfo.id, this.props.subjectInfo.name);
            }}
          >
            Check Scope
          </Button>
        </Card.Body>
      </Card>
    );
  }
}

export default SubjectCard;

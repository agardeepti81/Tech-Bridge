import React, { Component } from "react";
import { Table, Button } from "react-bootstrap";

class TopicQuestions extends Component {
  state = { data: null, loading: true };

  async componentDidMount() {
    const url = process.env.PUBLIC_URL + `/data/scope-cards/Subjects/${this.props.currentScope}/${this.props.activeTopicId}.json`;
    const response = await fetch(url);
    const data = await response.json();
    if(!this.props.progressTopicid){
      let newTopicProgress = [];
      for (let i = 0; i < data.length; i++) {
        newTopicProgress.push(false);
      }
      this.props.setNewTopicProgress(this.props.activeTopicId, newTopicProgress);
    }
    this.setState({ data: data, loading: false });
  }

  changeProgress(index)
  {
    console.log(this.props.progressTopicid)
    this.props.changeProgress(this.props.progressTopicid.topic_id, index)
  }

  render() {
    return this.state.loading || !this.state.data ? (
      <div>loading... </div>
    ) : (
      <div className="questionTable" key={this.props.progressTopicid}>
        <p id="topictitle">{this.props.activeTopicName}</p>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th className="col-sm-1"> </th>
              <th className="col-sm-1">Q-ID</th>
              <th className="col-md-8">Questions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((qus, i) => (
              <tr key={i}>
                <td>
                  {this.props.progressTopicid?.completed[i] ? (
                    <input type="checkbox" checked onClick={() => this.changeProgress(i)}/>
                  ) : (
                    <input type="checkbox" onClick={() => this.changeProgress(i)} />
                  )}
                </td>
                <td>{i + 1}</td>
                <td>{qus}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button onClick={this.props.back}> back</Button>
      </div>
    );
  }
}

export default TopicQuestions;

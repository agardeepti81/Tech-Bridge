import React, { Component } from "react";
import { Table, Button } from "react-bootstrap";

class TopicQuestions extends Component {
  state = { data: null, loading: true };

  async componentDidMount() {
    const url =
      process.env.PUBLIC_URL +
      `/data/scope-cards/Subjects/${this.props.currentScope}/${this.props.activeTopicId}.json`;
    const response = await fetch(url);
    const data = await response.json();
    this.setState({ data: data, loading: false });
  }

  changeProgress(index)
  {
    this.props.changeProgress(this.props.progressTopicid.name, index)
  }

  render() {
    return this.state.loading || !this.state.data ? (
      <div>loading... </div>
    ) : (
      <div className="questionTable">
        <p id="topictitle">{this.props.activeTopicName}</p>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th class="col-sm-1"> </th>
              <th class="col-sm-1">Q-ID</th>
              <th class="col-md-8">Questions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((qus, i) => (
              <tr>
                <td>
                  {this.props.progressTopicid.selected[i] ? (
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

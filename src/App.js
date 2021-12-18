import './App.css';
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Spinner } from 'reactstrap';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/header/header';
import Main from './components/main/main';
// import ZoneRoute from './components/zone-content/zone-content'
import StartPage from './components/start-page/start-page';
import SignUp from './components/signup/signup';
import Login from './components/login/login';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseFile: false,
      lessonProgress: false
    }
    this.getLessonProgress = this.getLessonProgress.bind(this);
  }
  componentDidMount() {
    fetch(process.env.PUBLIC_URL + "/data/index.json")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            baseFile: result
          });
        }
      )
  }
  getLessonProgress(lessonProgress) {
    console.log(lessonProgress);
    this.setState({
      lessonProgress: lessonProgress
    });
  }
  render() {
    if (this.state.baseFile)
    return (
          <div className="App">
            <Router>
              <Header />
              <Routes>
                <Route exact path="/" element={<Navigate to="/startpage" />} />
                <Route exact path="/startpage" element={<StartPage />} />
                <Route exact path="/signup" element={<SignUp signUpApis={this.state.baseFile.apis.signUp} />} />
                <Route exact path="/login" element={<Login loginApis={this.state.baseFile.apis.login} getLessonProgress={this.getLessonProgress} />} />
                <Route exact path="/home" element={<Main lessonProgress={this.state.lessonProgress} mainApis={this.state.baseFile.apis.main} />} />
                {/* <Route exact path="/zone/:zoneName" element={<ZoneRoute />} /> */}
              </Routes>
            </Router>
          </div>
        );
      else
        return (
          <div className="App">
            <Header />
            <div id="loadingApp">
              <Spinner id='appSpinner'>
                Loading...
              </Spinner>
            </div>
          </div>
    )
  }
}

export default App;

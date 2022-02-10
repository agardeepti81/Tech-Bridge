import './App.css';
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Spinner } from 'reactstrap';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/header/header';
import MainRoute from './components/main/main';
import ZoneRoute from './components/zone-content/zone-content'
import StartPage from './components/start-page/start-page';
import SignUp from './components/signup/signup';
import Login from './components/login/login';
import Home from './components/home/home';
import Facilitator from './components/facilitator/facilitator';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseFile: false,
      lessonProgress: false,
      email: "",
      userName: false
    }
    this.getLessonProgressEmailAndUserName = this.getLessonProgressEmailAndUserName.bind(this);
    this.logout = this.logout.bind(this);
    this.updateLessonProgress = this.updateLessonProgress.bind(this);
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
  getLessonProgressEmailAndUserName(lessonProgress, email, userName) {
    this.setState({
      lessonProgress: lessonProgress,
      email: email,
      userName: userName
    });
  }

  logout() {
    this.setState({
      userName: false
    })
  }

  updateLessonProgress(lessonProgress){
    this.setState({
      lessonProgress: lessonProgress
    })
  }

  render() {
    if (this.state.baseFile)
      return (
        <div className="App">
          <Router>
            <Header userName={this.state.userName} email={this.state.email} logoutApi={this.state.baseFile.apis.login.logout} logout={this.logout} />
            <Routes>
              <Route exact path="/" element={<Navigate to="/start-page" />} />
              <Route exact path="/start-page" element={<StartPage />} />
              <Route exact path="/facilitator" element={<Facilitator />} />
              <Route exact path="/signup" element={<SignUp signUpApis={this.state.baseFile.apis.signUp} />} />
              <Route exact path="/login" element={<Login loginApis={this.state.baseFile.apis.login} getLessonProgressEmailAndUserName={this.getLessonProgressEmailAndUserName} />} />
              <Route exact path="/home" element={<Home lessonProgress={this.state.lessonProgress} />} />
              <Route exact path="/:profile/:roadmap/:pathName" element={<MainRoute lessonProgress={this.state.lessonProgress} />} />
              <Route exact path="/:profile/:roadmap/:pathName/:zoneName" element={<ZoneRoute lessonProgress={this.state.lessonProgress} mainApis={this.state.baseFile.apis.main} roomManagementApis={this.state.baseFile.apis.roomManagement} email={this.state.email} updateLessonProgress={this.updateLessonProgress} helpApis={this.state.baseFile.apis.help} />} />
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

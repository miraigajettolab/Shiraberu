import './App.css';
import React from "react"
import SignIn from "./panels/signIn/SignIn"
import SignUp from "./panels/signUp/SignUp"
import ResetPassword from "./panels/resetPassword/ResetPassword"
import Home from "./panels/home/Home"
import Loading from "./util/Loading"
import Lesson from './panels/lesson/Lesson'
import Greeting from './panels/greeting/Greeting'
import Review from './panels/review/Review'

import * as firebase from "firebase"
import { createMuiTheme } from '@material-ui/core/styles';


class App extends React.Component {
  constructor(props) {
      super(props)
      this.state = {activePanel: "Loading"}

      this.activePanelHandler = this.activePanelHandler.bind(this)
      this.handleLesson = this.handleLesson.bind(this)
      this.handleReview = this.handleReview.bind(this)
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const metadata = firebase.auth().currentUser.metadata
        //Show greeting only to users who logged in for the first time
        if (metadata.creationTime === metadata.lastSignInTime) {
            //We need to show this only once ever, so let's use localStorage to store if we did
            let alerted = localStorage.getItem('alerted'+user.uid) || '';
            if (alerted !== "yes") {
              this.setState({activePanel: "Greeting"})
              localStorage.setItem('alerted'+user.uid, "yes")
            }
            else { //If the user is logged in for the first time but already saw the greeting 
              this.setState({activePanel: "Home"})
            }
        } 
        else {
          this.setState({activePanel: "Home"})
        }
      } else {
          this.setState({activePanel: "SignIn"})
      }
  }.bind(this))
  }

  activePanelHandler(nextPanel, event = null) {
      this.setState({activePanel: nextPanel})
  }

  handleLesson(queue){
    this.setState({lessonQueue: queue})
    this.activePanelHandler("Lesson")
  }

  handleReview(queue){
    this.setState({reviewQueue: queue})
    this.activePanelHandler("Review")
  }

  render() 
  {
  const theme = createMuiTheme({
    palette: {
      primary: {
        light: '#ffdb50',
        main: '#f7aa11',
        dark: '#bf7b00',
        contrastText: '#fff',
      },
      secondary: {
        light: '#d853ff',
        main: '#a108ee',
        dark: '#6a00ba',
        contrastText: '#fff',
      }
    },
  });

  const colors = {
    radicals : '#10f6a9',
    kanji: '#f7aa11',
    vocab: '#a108ee',
  }
  switch (this.state.activePanel) {
      case "Loading":
        return <Loading theme={theme}/>
      case "Home":
        return <Home activePanelHandler = {this.activePanelHandler} handleLesson = {this.handleLesson} handleReview={this.handleReview} theme={theme}/>
      case "Lesson":
        return <Lesson activePanelHandler = {this.activePanelHandler} lessonQueue = {this.state.lessonQueue} theme={theme} colors={colors}/>
      case "Review":
        return <Review activePanelHandler = {this.activePanelHandler} reviewQueue = {this.state.reviewQueue} theme={theme} colors={colors}/>
      case "SignIn":
        return <SignIn activePanelHandler = {this.activePanelHandler} theme={theme}/>
      case "SignUp":
        return <SignUp activePanelHandler = {this.activePanelHandler} theme={theme}/>
      case "Greeting":
        return <Greeting activePanelHandler = {this.activePanelHandler} theme={theme}/>
      case "ResetPassword":
        return <ResetPassword activePanelHandler = {this.activePanelHandler} theme={theme}/>
      default:
        return <h1>Что-то пошло не так 🤕</h1>
  }
  }

}

export default App
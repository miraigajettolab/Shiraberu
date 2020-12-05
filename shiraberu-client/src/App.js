import './App.css';
import React from "react"
import SignIn from "./panels/signIn/SignIn"
import * as firebase from "firebase"

class App extends React.Component {
  constructor(props) {
      super(props)
      this.state = {activePanel: "Loading"}
      firebase.auth().onAuthStateChanged(function(user) {
          console.log(user)
          if (user) {
              this.setState({activePanel: "Home"})
          } else {
              this.setState({activePanel: "SignIn"})
          }
      }.bind(this))
      this.activePanelHandler = this.activePanelHandler.bind(this)
  }


  activePanelHandler(nextPanel, event) {
      this.setState({activePanel: nextPanel})
  }

  render() {
      switch (this.state.activePanel) {
          case "Home":
            return <div>もぐもぐ～おかゆ～！</div>
          case "SignIn":
            return <SignIn activePanelHandler = {this.activePanelHandler}/>
          default:
            return <h1>Что-то пошло не так 🤕</h1>
      }
  }

}

export default App
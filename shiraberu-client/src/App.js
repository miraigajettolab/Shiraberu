import './App.css';
import React from "react"
import SignIn from "./panels/signIn/SignIn"
import SignUp from "./panels/signUp/SignUp"
import * as firebase from "firebase"
import { createMuiTheme } from '@material-ui/core/styles';

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
      },
      radicals : '#10f6a9',
      kanji: '#f7aa11',
      vocab: '#a108ee',
    },
  });
  switch (this.state.activePanel) {
      case "Home":
        return <div>もぐもぐ～おかゆ～！</div>
      case "SignIn":
        return <SignIn activePanelHandler = {this.activePanelHandler} theme={theme}/>
      case "SignUp":
        return <SignUp activePanelHandler = {this.activePanelHandler} theme={theme}/>
      default:
        return <h1>Что-то пошло не так 🤕</h1>
  }
  }

}

export default App
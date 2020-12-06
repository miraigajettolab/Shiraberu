import React from "react"
import * as firebase from "firebase"
import { ThemeProvider } from '@material-ui/core/styles';
import AppBar from './AppBar'

class Home extends React.Component {
    constructor(props) {
    super(props)
        this.state = {
        }
        this.signOutHandler = this.signOutHandler.bind(this)
    }

    signOutHandler() {
        firebase.auth().signOut()
        this.props.activePanelHandler("SignIn")
    }

    render() {
        return (
            <div>
                <ThemeProvider theme={this.props.theme}>
                    <AppBar logout = {this.signOutHandler} go={this.props.activePanelHandler}/>
                </ThemeProvider>
                <div className="Home" style={{maxWidth: "80%", marginLeft: "10%", marginTop: "10%"}}>
                    <ThemeProvider theme={this.props.theme}>
                        
                    </ThemeProvider>
                </div>
            </div>
        )
    }
} 

export default Home
import React from "react"
import * as firebase from "firebase"

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import { ThemeProvider } from '@material-ui/core/styles';



class ResetPassword extends React.Component {
    constructor(props) {
    super(props)
        this.state = {
            showAlert: false,
            alertMsg: "",
            alertSeverity: "info",
            email:"",
            password:""
        }
        this.changeHandler = this.changeHandler.bind(this)
        this.resetHandler = this.resetHandler.bind(this)
    }

    changeHandler(event) {
        const name = event.target.name
        const value = event.target.value
        this.setState({[name]:value})
    }

    resetHandler() {
        const auth = firebase.auth();
        const promise = auth.sendPasswordResetEmail(this.state.email)
        promise
        .then(event => this.props.activePanelHandler("SignIn", event))
        .catch(e => {
            let rusMessage
            switch (e.code) {
                case "auth/invalid-email":
                    rusMessage = "Некорректный email"
                    break;
                case "auth/user-not-found":
                    rusMessage = "Такого пользователя нет"
                    break;
                default:
                    rusMessage = "Что-то пошло не так"
                    break;
            }
            this.setState({
                showAlert:true, 
                alertMsg: rusMessage, 
                alertSeverity: "error"
            })
        })
    }

    render() {
        return (
            <div className="Сontainer">
                <ThemeProvider theme={this.props.theme}>
                <Alert 
                    style={{marginBottom: "20px", visibility: this.state.showAlert ? "visible": "hidden"}} 
                    elevation={6} 
                    variant="filled" 
                    severity={this.state.alertSeverity}>{this.state.alertMsg}
                </Alert>
                <FormControl fullWidth="true">    
                    <TextField 
                        style={{marginBottom: "10px"}}
                        label="Email"
                        variant="outlined"
                        name = "email"
                        type = "email"
                        value = {this.state.email}
                        onChange = {this.changeHandler}
                    />
                    <Button 
                        style = {{height: "48px", width: "100%", marginBottom: "10px"}}
                        variant="contained"
                        color="primary"
                        onClick={this.resetHandler}>
                        Сменить Пароль
                    </Button>           
                </FormControl>
                </ThemeProvider>
            </div>
        )
    }
} 

export default ResetPassword
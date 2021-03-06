import React from "react"
import * as firebase from "firebase"
import './SignIn.css'

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import { ThemeProvider } from '@material-ui/core/styles';



class SignIn extends React.Component {
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
        this.signInHandler = this.signInHandler.bind(this)
    }

    changeHandler(event) {
        const name = event.target.name
        const value = event.target.value
        this.setState({[name]:value})
    }

    signInHandler() {
        const auth = firebase.auth();
        const promise = auth.signInWithEmailAndPassword(this.state.email, this.state.password)
        promise
        .then(event => this.props.activePanelHandler("Home", event))
        .catch(e => {
            let rusMessage
            switch (e.code) {
                case "auth/invalid-email":
                    rusMessage = "Некорректный email"
                    break;
                case "auth/wrong-password":
                    rusMessage = "Неправильный пароль"
                    break;
                case "auth/user-not-found":
                    rusMessage = "Такого пользователя нет"
                    break;
                case "user-disabled":
                    rusMessage = "Пользователь заблокирован"
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
                    <TextField 
                        style={{marginBottom: "10px"}}
                        label="Пароль"
                        type="password"
                        variant="outlined"
                        name = "password"
                        value = {this.state.password}
                        onChange = {this.changeHandler}
                    />
                    <Button 
                        style = {{height: "48px", width: "100%", marginBottom: "10px"}}
                        variant="contained"
                        color="primary"
                        onClick={this.signInHandler}>
                            Войти
                    </Button>
                    <div className="ExtraContainer">
                        <Button
                            className="ExtraContainerChild"
                            variant="contained" 
                            color="secondary" 
                            onClick={event => this.props.activePanelHandler("ResetPassword", event)}>
                                Забыли пароль?
                        </Button>
                        <div className="ExtraContainerSpacer" style = {{marginBottom:"10px"}}>
                        </div>
                        <Button
                            className="ExtraContainerChild"
                            variant="contained" 
                            color="secondary" 
                            onClick={event => this.props.activePanelHandler("SignUp", event)}>
                                Зарегистрироваться
                        </Button>
                    </div>            
                </FormControl>
                </ThemeProvider>
            </div>
        )
    }
} 

export default SignIn
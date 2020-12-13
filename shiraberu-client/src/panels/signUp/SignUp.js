import React from "react"
import * as firebase from "firebase"
import PasswordStrengthBar from './PasswordStrengthBar'

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import { ThemeProvider } from '@material-ui/core/styles';

class SignUp extends React.Component {
    constructor(props) {
        super(props)
            this.state = {
                showAlert: false,
                alertMsg: "",
                alertSeverity: "info",
                email:"",
                password:"",
                repeatedPassword:"",
            }
            this.changeHandler = this.changeHandler.bind(this)
            this.signUpHandler = this.signUpHandler.bind(this)
        }
    
        changeHandler(event) {
            const name = event.target.name
            const value = event.target.value
            const type = event.target.type
            const checked = event.target.checked
            type === "checkbox" ? this.setState({[name]:checked}) : this.setState({[name]:value})
        }

        //courtesy of github.com/tstriker
        scorePassword(pass) {
            var score = 0;
            if (!pass)
                return score;
        
            // award every unique letter until 5 repetitions
            var letters = {};
            for (var i=0; i<pass.length; i++) {
                letters[pass[i]] = (letters[pass[i]] || 0) + 1;
                score += 5.0 / letters[pass[i]];
            }
        
            // bonus points for mixing it up
            var variations = {
                digits: /\d/.test(pass),
                lower: /[a-z]/.test(pass),
                upper: /[A-Z]/.test(pass),
                nonWords: /\W/.test(pass),
            }
        
            var variationCount = 0;
            for (var check in variations) {
                variationCount += (variations[check] === true) ? 1 : 0;
            }
            score += (variationCount - 1) * 10;
        
            return parseInt(score);
        }

        signUpHandler() {
            if((this.state.password !== this.state.repeatedPassword)){
                this.setState({
                    showAlert:true, 
                    alertMsg: "Пароли не совпадают", 
                    alertSeverity: "error"
                })
                return
            }
            if(this.state.password.length < 6){
                this.setState({
                    showAlert:true, 
                    alertMsg: "Пароль должен содержать не менее 6 символов", 
                    alertSeverity: "error"
                })
                return
            }
            const firestore = firebase.firestore();

            const auth = firebase.auth();
            const promise = auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
            promise
            .then(obj => {
                const docRef = firestore.doc("Users/"+ obj.user.uid)
                docRef.set({
                    email: obj.user.email,
                    level: 1,
                })
            })
            .then(user => this.props.activePanelHandler("Greeting", user))
            .catch(e => {
                let rusMessage
                switch (e.code) {
                    case "auth/invalid-email":
                        rusMessage = "Некорректный email"
                        break;
                    case "auth/weak-password":
                        rusMessage = "Слабый пароль"
                        break;
                    case "auth/email-already-in-use":
                        rusMessage = "Email уже зарегистрирован"
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
        let passwordScore = this.scorePassword(this.state.password);
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
                    <PasswordStrengthBar value ={(passwordScore > 100) ? 100 : passwordScore}/>
                    <TextField 
                        style={{marginBottom: "10px"}}
                        label="Пароль"
                        type="password"
                        variant="outlined"
                        name = "password"
                        value = {this.state.password}
                        onChange = {this.changeHandler}
                    />
                    <TextField 
                        style={{marginBottom: "10px"}}
                        label="Пароль ещё раз"
                        type="password"
                        variant="outlined"
                        name = "repeatedPassword"
                        value = {this.state.repeatedPassword}
                        onChange = {this.changeHandler}
                    />
                    <Button 
                        style = {{height: "48px", width: "100%", marginBottom: "10px"}}
                        variant="contained"
                        color="primary"
                        onClick={this.signUpHandler}>
                            Зарегистрироваться
                    </Button>         
                </FormControl>
                </ThemeProvider>
            </div>
        )
    }
    
}

export default SignUp
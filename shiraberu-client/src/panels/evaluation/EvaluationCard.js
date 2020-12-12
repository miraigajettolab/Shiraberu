import React from "react"
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import cyrillicToHiragana from '../../kikana-src/src/cyrillicToHiragana'

/*REQUIRED PROPS:
    *current
    *colors
    *handleSubmit
*/

const blackTheme = createMuiTheme({
    palette: {
      primary: {
        light: '#ccc',
        main: '#999',
        dark: '#444',
        contrastText: '#fff',
      }
    },
  });

class EvaluationCard extends React.Component {
    constructor(props) {
    super(props)
        this.state = {
            answer: "",
            isReading: false,
            fireSnackbar: false,
            snackbarMsg: "",
            resultColor: null,
            resolved: false,
        }
        this.evaluationChangeHandler = this.evaluationChangeHandler.bind(this)
        this.transcribe = this.transcribe.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this)
        this.checkIsReading = this.checkIsReading.bind(this)
    }

    evaluationChangeHandler(event) {
        const value = event.target.value

        if(this.state.isReading){
            this.transcribe(event)
        }
        else{
            this.setState(
                {
                    answer: value
                }
            )
        }
    }

    transcribe(event) {
        let value = event.target.value
        const last = value.slice(-1).toLowerCase()
        //checking if the last character is "н" or "й"
        if(last !== "н" && last !== "й"){
            value = cyrillicToHiragana(value)
        }
        else if (last === "н"){
            //if the last two are "н"
            if(this.state.answer.slice(-1) === 'н'){
                value = this.state.answer.slice(0, -1) + "ん"
            }
            //if just the last one is "н"
            else {
                value = this.state.answer + "н"
            }
        }
        else { // last === "й"
            //if the last two are "й"
            if(this.state.answer.slice(-1) === 'й'){
                value = this.state.answer.slice(0, -1) + "い"
            }
            //if just the last one is "й"
            else {
                value = this.state.answer + "й"
            }
        }
        this.setState(
            {
                answer: value
            }
        )
    }

    handleSubmit(){
        let ans = this.state.answer;
        if(this.state.isReading){
            //Spaces aren't used in readings, so let's get rid of accidental ones
            ans = ans.replace(/\s/g, '')
        }
        else {
            //Remove the white spaces from both the ends of the given string
            ans = ans.trim()
        }
        if(ans.length === 0){
            this.setState({
                snackbarMsg : "Пустой ответ был проигнорирован",
                fireSnackbar: true
            })
            return
        }

        this.props.handleSubmit(ans, this.state.isReading, this.state.resolved)
        .then(response => {
            let resultColor = null;
            let resolved = false;
            if(response.status === "error"){
                resultColor = "#f44336"
                resolved = true;
            }
            else if (response.status === "success"){
                resultColor = "#4caf50"
                resolved = true;
            }
            this.setState({
                snackbarMsg: response.msg,
                fireSnackbar: true,
                resultColor: resultColor,
                resolved: resolved
            })
        })
        .catch(e => {
            this.setState({ //reset state
                answer: "",
                isReading: false,
                fireSnackbar: false,
                snackbarMsg: "",
                resultColor: null,
                resolved: false,
            })
            this.checkIsReading()
        }
        )
    }

    handleSnackbarClose(){
        this.setState({
            snackbarMsg : "",
            fireSnackbar: false
        })
    }

    checkIsReading(){
        const current = this.props.current
        if(!current.readingPassed && !current.meaningPassed){
            this.setState({
                    isReading : (current.meaningFirst ? false: true)
                }
            )
        }
        else{
            this.setState({
                    isReading : (current.readingPassed ? false: true)
                }
            )
        }
    }

    componentDidMount(){
        this.checkIsReading();
    }

    render() {
            const current = this.props.current
            let currentColor;
            let characters = current.characters

            let question = this.state.isReading ? "Чтение" : "Значение";

            if(current.type === "R") {
                currentColor = this.props.colors.radicals;
                question += " Радикала"
            }
            else if(current.type === "K") {
                currentColor = this.props.colors.kanji;
                question += " Кандзи"
            }
            else if (current.type === "V")  {
                currentColor = this.props.colors.vocab;
                question += " Слова"
            }
            else {
                currentColor = "red"
                characters = "Ошибка"
            }

            if(this.state.resultColor){
                currentColor = this.state.resultColor
            }

        
        return (<Card>
            <CardContent style={{backgroundColor: currentColor}}>
                <Typography variant="h1" component="h1" style = {{textAlign: "center", color: "white"}}>
                    {characters !== null ? 
                        characters :
                        <img alt = "radical_image" style={{ maxHeight: "90px"}} src={current.radical_picture} />
                    }
                </Typography>
                <br />
            </CardContent>
            <CardContent>
                <Typography variant="h5" component="h2" style = {{textAlign: "center"}}>
                    {question}
                </Typography>
            </CardContent>
            <hr color={"#EEEEEE"}/>
            <CardContent>
                <ThemeProvider theme={blackTheme}>
                    <FormControl fullWidth="true">    
                        <TextField 
                            style={{marginBottom: "10px"}}
                            label="Ответ"
                            variant="outlined"
                            color = "primary"
                            disabled = {this.state.resolved ? true : false}
                            name = "answer"
                            type = "answer"
                            value = {this.state.answer}
                            onChange = {this.evaluationChangeHandler}
                        />            
                    </FormControl>
                </ThemeProvider>
                <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
                }}
                open={this.state.fireSnackbar}
                autoHideDuration={5000}
                onClose={this.handleSnackbarClose}
                message={this.state.snackbarMsg}
                action={
                    <React.Fragment>
                      <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleSnackbarClose}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </React.Fragment>
                }
                />
            </CardContent>
            <CardActions>
                <Button 
                    style = {{flex: 1}} 
                    size="small" 
                    onClick = {this.handleSubmit}
                >
                    {this.state.resolved ? "Дальше" : "Проверить"}
                </Button>
            </CardActions>
            </Card>
        )
    }
} 

export default EvaluationCard
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
            answer: ""
        }
        this.changeHandler = this.changeHandler.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    changeHandler(event) {
        const name = event.target.name
        const value = event.target.value
        this.setState({[name]:value})
    }

    handleSubmit(){
        this.props.handleSubmit(this.state.answer)
    }

    render() {
            const current = this.props.current
            let currentColor;
            let characters = current.characters
            let question;

            if(!current.readingPassed && !current.meaningPassed){
                question = current.meaningFirst ? "Значение": "Чтение";
            }
            else{
                question = current.readingPassed ? "Значение": "Чтение";
            }

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
                        name = "answer"
                        type = "answer"
                        value = {this.state.answer}
                        onChange = {this.changeHandler}
                    />            
                    </FormControl>
                </ThemeProvider>
            </CardContent>
            <CardActions>
                <Button 
                    style = {{flex: 1}} 
                    size="small" 
                    onClick = {this.handleSubmit}
                >
                    Проверить
                </Button>
            </CardActions>
            </Card>
        )
    }
} 

export default EvaluationCard
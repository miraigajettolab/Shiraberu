import React from "react"
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

/*REQUIRED PROPS:
    *selected
    *current
    *lessonQueueLength
    *colors
    *handleLeftClick
    *handleRightClick
    *handleLessonQuiz
*/

class LessonCard extends React.Component {
    constructor(props) {
    super(props)
        this.state = {}
        this.handleLessonCardKeypress = this.handleLessonCardKeypress.bind(this)
    }

    handleLessonCardKeypress(event){
        let code = event.keyCode || event.which;
        if (code === 13) {
            if(this.props.selected !== this.props.lessonQueueLength-1){
                this.props.handleRightClick();
            }
            else {
                this.props.handleLessonQuiz();
            }
        }
        if (code === 39) {
            if(this.props.selected !== this.props.lessonQueueLength-1){
                this.props.handleRightClick();
            }
        }
        if (code === 37) {
            if(this.props.selected !== 0) {
                this.props.handleLeftClick();
            }
        }
    }
    
    componentDidMount(){
        document.addEventListener("keydown", this.handleLessonCardKeypress)
    }

    componentWillUnmount(){
        // removing listener when the component is unmounted
        document.removeEventListener("keydown", this.handleLessonCardKeypress)
    }

    render() {
            const selected = this.props.selected
            const current = this.props.current
            const lessonQueueLength = this.props.lessonQueueLength
            let currentColor;
            let mnemonics;
            let mainMeaning = current.meanings.filter(m => m.is_primary)[0].text
            let characters = current.characters
            let extra
            let example

            if(current.type === "R") {
                currentColor = this.props.colors.radicals;
                extra= <p><b>Тип: </b>{"Радикал" + (current.extra_data ? ", " + current.extra_data  : "")}</p>
                mnemonics = 
                    <Typography variant="body2" component="p">
                        <b>Мнемоника значения:</b>
                        <p>{current.meaning_mnemonic}</p>
                    </Typography>
            }
            else if(current.type === "K") {
                currentColor = this.props.colors.kanji;
                extra= <p><b>Тип: </b>{"Кандзи" + (current.extra_data ? ", " + current.extra_data  : "")}</p>
                mnemonics = 
                    <Typography variant="body2" component="p">
                        <b>Мнемоника значения:</b>
                        <p>{current.meaning_mnemonic}</p>
                        <b>Мнемоника чтения:</b>
                        <p>{current.reading_mnemonic}</p>
                    </Typography>
            }
            else if (current.type === "V")  {
                currentColor = this.props.colors.vocab;
                extra= <p><b>Тип: </b>{"Слово" + (current.extra_data ? ", " + current.extra_data  : "")}</p>
                mnemonics = 
                    <Typography variant="body2" component="p">
                        <b>Мнемоника значения:</b>
                        <p>{current.meaning_mnemonic}</p>
                        <b>Мнемоника чтения:</b>
                        <p>{current.reading_mnemonic}</p>
                    </Typography>
                if(current.sentences){
                    example =   <Typography variant="body2" component="p">
                    <b>Пример:</b>
                <p><i>{current.sentences[0].text}</i>　ー　{current.sentences[0].translation}</p>
                </Typography>
                }
            }
            else {
                currentColor = "red"
                mainMeaning = "Этого не должно было произойти"
                mnemonics = "Обратитесь в техподдержку"
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
                    {mainMeaning}
                </Typography>
            </CardContent>
            <hr color={"#EEEEEE"}/>
            <CardContent>
                <Typography variant="body2" component="p">
                {extra}
                {mnemonics}
                {example}
                </Typography>
            </CardContent>
            <CardActions>
                <Button 
                    style = {{flex: 1}} 
                    size="small" 
                    disabled = {selected === 0} 
                    onClick = {this.props.handleLeftClick}
                >
                    {"<"}
                </Button>
                <Button 
                    style = {{flex: 1}} 
                    size="small" 
                    disabled = {selected === lessonQueueLength-1} 
                    onClick = {this.props.handleRightClick}
                >
                    {">"}
                </Button>
            </CardActions>
            <CardActions>
                <Button 
                    style = {{flex: 1}} 
                    size="small" 
                    disabled = {selected !== lessonQueueLength-1} 
                    onClick = {this.props.handleLessonQuiz}
                >
                    Проверить
                </Button>
            </CardActions>
            </Card>
        )
    }
} 

export default LessonCard
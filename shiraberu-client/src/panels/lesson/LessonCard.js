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
    }

    render() {
            const selected = this.props.selected
            const current = this.props.current
            const lessonQueueLength = this.props.lessonQueueLength
            let currentColor;
            let mnemonics;
            let mainMeaning = current.meanings.filter(m => m.is_primary)[0].text
            let characters = current.characters

            if(current.type === "R") {
                currentColor = this.props.colors.radicals;
                mnemonics = 
                    <Typography variant="body2" component="p">
                        <b>Мнемоника значения:</b>
                        <p>{current.meaning_mnemonic}</p>
                    </Typography>
            }
            else if(current.type === "K") {
                currentColor = this.props.colors.kanji;
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
                mnemonics = 
                    <Typography variant="body2" component="p">
                        <b>Мнемоника значения:</b>
                        <p>{current.meaning_mnemonic}</p>
                        <b>Мнемоника чтения:</b>
                        <p>{current.reading_mnemonic}</p>
                    </Typography>
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
                {mnemonics}
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
import React from "react"
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { ThemeProvider } from '@material-ui/core/styles';

/*REQUIRED PROPS:
    *activePanelHandler
*/

class Greeting extends React.Component {
    constructor(props) {
    super(props)
    this.state = {}
    }

    render() {
        return (<div className="Сontainer">
            <ThemeProvider theme={this.props.theme}>
                <Typography variant="h5" component="h5" style = {{textAlign: "center", marginBottom: "10px"}}>
                Добро пожаловать на shirabe.ru
                </Typography>
                <Typography variant="p" component="p" style = {{textAlign: "left", marginBottom: "10px"}}>
                Японский - один из самых сложных для изучения языков, особенно учитывая непохожесть его на наш язык. Один из ключевых моментов в изучении языка это изучение слов. Однако, учитывая сложную структуру письменности японского языка для изучения слова нужно сперва изучить знаки (кандзи, хирагана, катакана) из которых оно состоит, сами знаки также состоят из более простых элементов.
                </Typography>
                <Typography variant="p" component="p" style = {{textAlign: "left", marginBottom: "10px"}}>
                Здесь будет инcтрукция для новых пользователей, но пока её нет :/
                </Typography>
                <Typography variant="p" component="p" style = {{textAlign: "left", marginBottom: "10px"}}>
                Нажмите на кнопку внизу чтобы перейти к сайту
                </Typography>
                <hr color={"#EEEEEE"}/>
                <Button
                    style={{width: "100%", marginBottom: "10px"}}
                    className="ExtraContainerChild"
                    variant="contained" 
                    color="primary" 
                    onClick={event => this.props.activePanelHandler("Home", event)}>
                    調べよう！
                </Button>
            </ThemeProvider>
        </div>)
    }
} 

export default Greeting
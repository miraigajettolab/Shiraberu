import React from "react"
import { ThemeProvider } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

/*REQUIRED PROPS:
    *theme
    *activePanelHandler
    *prototypes - array of objects of Prototype data type
    *onPass     - promise
    *onFail     - promise
*/

class Evaluation extends React.Component {
    constructor(props) {
    super(props)
        this.state = {
            prototypes: this.props.prototypes.map(prot => {
                //TODO: Finish this stuff
                return ({
                    "id": prot.id
                })
            }),
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleOnPass = this.handleOnPass.bind(this)
        this.handleOnFail = this.handleOnFail.bind(this)
    }

    handleSubmit(){
        //TODO: Write me
        /*this.setState({
            selected: this.state.selected + 1
        })*/
    }

    handleOnPass(){
        this.props.onPass().then(confirmation => {
            console.log(confirmation)
            //After the promise is fulfilled we want to remove the prototype from queue
            //We don't want to mutate state directly 
            let prevPrototypes = this.state.prototypes; 
            prevPrototypes.shift(); //removing first element
            this.setState({
                selected: prevPrototypes
            })
        })
        .catch(err => {
            console.log(err);
            //TODO: add a user friendly error message
        })
    }

    handleOnFail(){

    }

    componentDidMount(){
    }

    render() {
        console.log(this.state)
        return (
                <div className="Lesson" style={{maxWidth: "80%", marginLeft: "10%", marginTop: "10%"}}>
                    <ThemeProvider theme={this.props.theme}>
                        <Button 
                            style = {{flex: 1}} 
                            size="small" 
                            onClick = {this.handleOnPass}
                        >
                            Проверить
                        </Button>
                    </ThemeProvider>
                </div>
        )
    }
} 

export default Evaluation
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
    *shuffleDepth   - how "deep" the shuffle is
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
                    "id": prot.id,
                    "type": prot.type,
                    "characters": prot.characters ? prot.characters : null, //just in case
                    "radical_picture": prot.radical_picture ? prot.radical_picture : null,
                    "meanings": prot.meanings,
                    "readings": prot.readings ? prot.readings : null,
                    "meaningPassed" : null, //TODO:
                    "readingPassed" : null,
                })
            }),
            shuffleDepth: this.props.shuffleDepth ? this.props.shuffleDepth : 10, //setting default depth if prop wasn't passed
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleOnPass = this.handleOnPass.bind(this)
        this.handleOnFail = this.handleOnFail.bind(this)
        this.shuffleWhole = this.shuffleWhole.bind(this)
        this.shuffleCurrent = this.shuffleCurrent.bind(this)
    }

    //Fisher–Yates shuffle implementation
    shuffleWhole() {
        //We don't want to mutate state directly 
        let array = this.state.prototypes
        let currentIndex = array.length
        let temporaryValue;
        let randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex); //will get at most currentIndex - 1
          currentIndex -= 1;       
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }

        this.setState({
            prototypes: array
        })
    }

    //Changes places of first element in the array with random one within the shuffleDepth
    shuffleCurrent() {
        //We don't want to mutate state directly 
        let array = this.state.prototypes
        //maxIndex can't be greater than array.length
        let maxIndex = this.state.shuffleDepth <= this.state.prototypes.length ? this.state.shuffleDepth : this.state.prototypes.length
        let randomIndex = Math.floor(Math.random() * maxIndex);  //will get at most maxIndex - 1
        let temporaryValue = array[0];
        array[0] = array[randomIndex];
        array[randomIndex] = temporaryValue;

        this.setState({
            prototypes: array
        })
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
                prototypes: prevPrototypes
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
                            onClick = {this.shuffleCurrent}
                        >
                            Проверить
                        </Button>
                    </ThemeProvider>
                </div>
        )
    }
} 

export default Evaluation
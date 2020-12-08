import React from "react"
import * as firebase from "firebase"
import { ThemeProvider } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


class Lesson extends React.Component {
    constructor(props) {
    super(props)
        this.state = {
            lessonQueue: this.props.lessonQueue.slice(0, 10), // 10 at most at once
            selected: 0

        }
        this.getPrototypes = this.getPrototypes.bind(this)
        this.handleRightClick = this.handleRightClick.bind(this)
        this.handleLeftClick = this.handleLeftClick.bind(this)
    }

    getPrototypes(){
        var t0 = performance.now()
        const db = firebase.firestore();
        db.collection('Prototypes').where('id', 'in', this.state.lessonQueue.map(Number)).get()
        .then(protsSnapshot => {
            var t1 = performance.now()
            console.log("Call to getPrototypes() took " + (t1 - t0) + " milliseconds.")
            this.setState({
                prototypes: protsSnapshot.docs.map(doc => doc.data())
            })
            console.log(this.state.prototypes)
            return 0
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
            return -1
        })
    }

    handleRightClick(){
        this.setState({
            selected: ++this.state.selected
        })
    }

    handleLeftClick(){
        this.setState({
            selected: --this.state.selected
        })
    }

    componentDidMount(){
        this.getPrototypes();
    }

    render() {
        return (
                <div className="Lesson" style={{maxWidth: "80%", marginLeft: "10%", marginTop: "10%"}}>
                    <ThemeProvider theme={this.props.theme}>
                   {this.state.prototypes ?<Card>
                    <CardContent style={{backgroundColor: "#10F6A9"}}>
                        <Typography variant="h1" component="h1" style = {{textAlign: "center", color: "white"}}>
                            {this.state.prototypes[this.state.selected].characters !== null ? 
                                this.state.prototypes[this.state.selected].characters :
                                <img style={{ maxHeight: "90px"}} src={this.state.prototypes[this.state.selected].radical_picture} />
                            }
                        </Typography>
                        <br />
                    </CardContent>
                    <CardContent>
                        <Typography variant="h5" component="h2" style = {{textAlign: "center"}}>
                            {this.state.prototypes[this.state.selected].meanings.filter(m => m.is_primary)[0].text}
                        </Typography>
                    </CardContent>
                    <hr color={"EEEEEE"}/>
                    <CardContent>
                        <Typography variant="body2" component="p">
                        {this.state.prototypes[this.state.selected].meaning_mnemonic}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button 
                            style = {{flex: 1}} 
                            size="small" 
                            disabled = {this.state.selected === 0} 
                            onClick = {this.handleLeftClick}
                        >
                            {"<"}
                        </Button>
                        <Button 
                            style = {{flex: 1}} 
                            size="small" 
                            disabled = {this.state.selected === this.state.lessonQueue.length-1} 
                            onClick = {this.handleRightClick}
                        >
                            {">"}
                        </Button>
                    </CardActions>
                    </Card>: <div></div>}
                    </ThemeProvider>
                </div>
        )
    }
} 

export default Lesson
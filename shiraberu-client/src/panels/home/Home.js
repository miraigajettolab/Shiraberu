import React from "react"
import * as firebase from "firebase"
import { ThemeProvider } from '@material-ui/core/styles';
import AppBar from './AppBar'

import Button from '@material-ui/core/Button';


class Home extends React.Component {
    constructor(props) {
    super(props)
        this.state = {
            uid: " "
        }
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                this.setState({uid: user.uid})
            } 
        }.bind(this))

        this.signOutHandler = this.signOutHandler.bind(this)
        this.getIndices = this.getIndices.bind(this)
        this.countReviews = this.countReviews.bind(this)
        this.countLessons = this.countLessons.bind(this)
        this.handleLesson = this.handleLesson.bind(this)
    }

    signOutHandler() {
        firebase.auth().signOut()
        this.props.activePanelHandler("SignIn")
    }

    countReviews(){
        var t0 = performance.now()
        //TODO:
        var t1 = performance.now()
        console.log("Call to countReviews() took " + (t1 - t0) + " milliseconds.")
    }

    countLessons(){
        var t0 = performance.now()
        let lessonQueue = [];
        Object.keys(this.state.itemsIdx).forEach(key => {
            if(this.state.itemsIdx[key].srs === 0){
                if(this.state.protsIdx[key].comp){ //if prototype has components
                    let passed = true 
                    this.state.protsIdx[key].comp.forEach(component => {
                        if (this.state.itemsIdx[component].srs < 5){ //we check that every one of them passed
                            passed = false
                        }
                    })
                    if(passed){
                        lessonQueue.push(key)
                    }
                }
                else{
                    lessonQueue.push(key)
                }
            }
        })
        this.setState({
            "lessonQueue": lessonQueue
        })
        var t1 = performance.now()
        console.log("Call to countLessons() took " + (t1 - t0) + " milliseconds.")
    }

    getIndices(){
        var t0 = performance.now()
        const db = firebase.firestore();
        db.collection('Prototypes').doc('index').get()
        .then(ProtsIndex => {
                this.setState({
                    protsIdx:ProtsIndex.data()
                })
                return 0
            })
            .then(check => {
                db.collection('Users').doc(this.state.uid).collection('Items').doc('index').get()
                .then(ItemsIndex => {
                    this.setState({
                        itemsIdx:ItemsIndex.data()
                    })

                var t1 = performance.now()
                console.log("Call to getIndices() took " + (t1 - t0) + " milliseconds.")
                this.countReviews()
                this.countLessons()
                return 0
                })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
                return -1
            })
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
            return -1
        })
    }

    handleLesson(){
        this.props.handleLesson(this.state.lessonQueue)
    }

    componentDidMount(){
        this.getIndices();
    }

    render() {
        return (
            <div>
                <ThemeProvider theme={this.props.theme}>
                    <AppBar logout = {this.signOutHandler} go={this.props.activePanelHandler}/>
                </ThemeProvider>
                <div className="Home" style={{maxWidth: "80%", marginLeft: "10%", marginTop: "20px"}}>
                    <ThemeProvider theme={this.props.theme}>
                        <Button
                            style = {{height: "120px"}}
                            className="ExtraContainerChild"
                            variant="contained" 
                            color="secondary" 
                            onClick={this.handleLesson}>
                                Уроки: {this.state.lessonQueue ? this.state.lessonQueue.length: ""}
                        </Button>
                    </ThemeProvider>
                </div>
            </div>
        )
    }
} 

export default Home
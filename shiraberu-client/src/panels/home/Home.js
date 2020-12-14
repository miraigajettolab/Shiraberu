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
        this.handleReview = this.handleReview.bind(this)
    }

    signOutHandler() {
        firebase.auth().signOut()
        this.props.activePanelHandler("SignIn")
    }

    countReviews(){
        var t0 = performance.now()
        const currentTimestamp = new Date().getTime()
        let reviewQueue = []
        Object.keys(this.state.itemsIdx).forEach(key => {
            // if exists and less than current time
            if(this.state.itemsIdx[key].due && this.state.itemsIdx[key].due < currentTimestamp) {
                reviewQueue.push(key)
            }
        })
        this.setState({
            "reviewQueue": reviewQueue
        })
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
        // reference to self, we need to save it before we get into the promise chain
        const self = this.getIndices
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
                console.log("Error getting documents: Let's try again in one second");
                //Let's wait for one second and restart the method
                const delay = t => new Promise(resolve => setTimeout(resolve, t));
                delay(1000).then(() => self());
            })
        })
        .catch(function(error) {
            console.log("Failed to connect: ", error);
            return -1
        })
    }

    handleLesson(){
        this.props.handleLesson(this.state.lessonQueue)
    }

    handleReview(){
        this.props.handleReview(this.state.reviewQueue)
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
                            style = {{height: "120px", marginRight: "10px", marginBottom: "10px"}}
                            className="ExtraContainerChild"
                            variant="contained" 
                            disabled = { this.state.lessonQueue && this.state.lessonQueue.length > 0 ? false : true}
                            color="secondary" 
                            onClick={this.handleLesson}>
                                Уроки: {this.state.lessonQueue ? this.state.lessonQueue.length: ""}
                        </Button>
                        <Button
                            style = {{height: "120px", marginBottom: "10px"}}
                            className="ExtraContainerChild"
                            variant="contained" 
                            disabled = { this.state.reviewQueue && this.state.reviewQueue.length > 0 ? false : true}
                            color="primary" 
                            onClick={this.handleReview}>
                                Ревью: {this.state.reviewQueue ? this.state.reviewQueue.length: ""}
                        </Button>
                    </ThemeProvider>
                </div>
            </div>
        )
    }
} 

export default Home
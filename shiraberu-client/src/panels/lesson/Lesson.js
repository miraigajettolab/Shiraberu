import React from "react"
import * as firebase from "firebase"
import { ThemeProvider } from '@material-ui/core/styles';
import Evaluation from '../evaluation/Evaluation'
import LessonCard from './LessonCard'

class Lesson extends React.Component {
    constructor(props) {
    super(props)
        this.state = {
            lessonQueue: this.props.lessonQueue.slice(0, 10), // 10 at most at once
            prototypes: null,
            selected: 0,

        }
        this.getPrototypes = this.getPrototypes.bind(this)
        this.handleRightClick = this.handleRightClick.bind(this)
        this.handleLeftClick = this.handleLeftClick.bind(this)
        this.handleLessonQuiz = this.handleLessonQuiz.bind(this)
    }

    comparePrototypes(prototype1, prototype2, key) {
        const prot1 = prototype1[key]
        const prot2 = prototype2[key]
        if (prot1 < prot2) {
          return -1
        }
        else if (prot1 > prot2) {
          return 1
        }
        else {
            return 0
        }
      }

    getPrototypes(){
        var t0 = performance.now()
        const db = firebase.firestore();
        db.collection('Prototypes').where('id', 'in', this.state.lessonQueue.map(Number)).get()
        .then(protsSnapshot => {
            var t1 = performance.now()
            console.log("Call to getPrototypes() took " + (t1 - t0) + " milliseconds.")
            let lessonsData = protsSnapshot.docs.map(doc => doc.data())
            //sorting
            lessonsData.sort((prot1, prot2) => {
                return this.comparePrototypes(prot1, prot2, 'id')
            })
            this.setState({
                prototypes: lessonsData
            })
            console.log(this.state.prototypes) //TEST
            return 0
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
            return -1
        })
    }

    handleRightClick(){
        this.setState({
            selected: this.state.selected + 1
        })
    }

    handleLeftClick(){
        this.setState({
            selected: this.state.selected - 1
        })
    }

    handleLessonQuiz(){

    }

    componentDidMount(){
        this.getPrototypes();
    }

    onPass(obj) {
        return new Promise(function(resolve, reject) {
          /*stuff using obj*/
            console.log("in lessons!")
            console.log(obj)
            resolve("onPass worked!");
           // reject(Error("It broke"));
        });
    }

    render() {
        let card = <div></div>
        if(this.state.prototypes){
            const selected = this.state.selected;
            const current = this.state.prototypes[this.state.selected];
            const lessonQueueLength = this.state.lessonQueue.length;
            card = <LessonCard 
                        selected={selected} 
                        current={current}
                        lessonQueueLength={lessonQueueLength}
                        colors={this.props.colors}
                        handleLeftClick={this.handleLeftClick}
                        handleRightClick={this.handleRightClick}
                        handleLessonQuiz={this.handleLessonQuiz}
                    />
        
        }
        
        return (
                <div className="Lesson" style={{maxWidth: "80%", marginLeft: "10%", marginTop: "10%"}}>
                    <ThemeProvider theme={this.props.theme}>
                        {card}
                    </ThemeProvider>
                    {this.state.prototypes ? <Evaluation theme = {this.props.theme} prototypes = {this.state.prototypes} onPass = {this.onPass}/> : <div></div>}
                </div>
        )
    }
} 

export default Lesson
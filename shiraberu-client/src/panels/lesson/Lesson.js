import React from "react"
import * as firebase from "firebase"
import { ThemeProvider } from '@material-ui/core/styles';
import Evaluation from '../evaluation/Evaluation'
import LessonCard from './LessonCard'
import LessonSummary from './LessonSummary'
import HomeButton from '../../util/HomeButton'

/*REQUIRED PROPS:
    *activePanelHandler
    *handleLesson
    *theme
*/

class Lesson extends React.Component {
    constructor(props) {
    super(props)
        this.state = {
            lessonQueue: this.props.lessonQueue.slice(0, 10), // 10 at most at once
            prototypes: null,
            selected: 0,
            lessonMode: "default"
        }
        this.getPrototypes = this.getPrototypes.bind(this)
        this.handleRightClick = this.handleRightClick.bind(this)
        this.handleLeftClick = this.handleLeftClick.bind(this)
        this.handleLessonQuiz = this.handleLessonQuiz.bind(this)
        this.onPass = this.onPass.bind(this)
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
        this.setState({
            lessonMode: "evaluation"
        })
    }

    componentDidMount(){
        this.getPrototypes();
    }

    onPass(obj, remaining) {
        if (remaining === 0){
            this.setState({
                lessonMode: "summary"
            })
        }

        const firestore = firebase.firestore();
        const uid =  firebase.auth().currentUser.uid;
        const extraDataRef = firestore.collection('Users').doc(uid).collection('Items').doc(''+obj.id)
        const indexRef = firestore.collection('Users').doc(uid).collection('Items').doc('index')
        const srsRef = firestore.collection('Scheme').doc('srs-intervals')

        srsRef.get()
        .then(srsSnap => {
            const srs = srsSnap.data();
            console.log(srs.stages[1])
            //In case something changed
            indexRef.get()
            .then(indexSnap => {
                let indexItem = indexSnap.data()[obj.id]
                //If current srs stage is zero lets learn the item
                if(indexItem.srs === 0){
                    indexItem.srs = 1
                    const currentTimestamp = new Date().getTime()
                    indexItem.due = currentTimestamp + srs.stages[1].interval*1000;
                    indexRef.update({[obj.id] : indexItem})
                    .then(obj => {
                        extraDataRef.set({
                            "aux_meanings": null,
                            "reading_note": null,
                            "meaning_note": null,
                            "learned_at": currentTimestamp,
                            "burned_at": null,
                            "meaning_rev": 0,
                            "meaning_rev_correct": 0,
                            "meaning_rev_streak": 0,
                            "meaning_rev_max_streak": 0,
                            "reading_rev": 0,
                            "reading_rev_correct": 0,
                            "reading_rev_streak": 0,
                            "reading_rev_max_streak": 0,
                        })
                    })
                }
            })
        })

        return new Promise(function(resolve, reject) {
          /*stuff using obj*/
            resolve();
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

        const evaluation = <Evaluation 
                            theme = {this.props.theme} 
                            colors={this.props.colors}
                            prototypes = {this.state.prototypes} 
                            onPass = {this.onPass}
                        />
        
        const summary = <LessonSummary
                            theme = {this.props.theme} 
                            colors={this.props.colors}
                            prototypes = {this.state.prototypes} 
                            activePanelHandler = {this.props.activePanelHandler}
                    />
                        
        let lessonModuleContent
        switch (this.state.lessonMode) {
            case "default":
                lessonModuleContent = card    
                break;
            case "evaluation":
                lessonModuleContent = evaluation    
                break;
            case "summary":
                lessonModuleContent = summary    
                break;
            default:
                lessonModuleContent = <p>Ошибка! Обратитесь в техподдержку</p>   
                break;
        }

        return (
                <dvi>
                    <ThemeProvider theme={this.props.theme}>
                        <HomeButton go={this.props.activePanelHandler}/>
                    </ThemeProvider>
                    <div className="Lesson" style={{maxWidth: "80%", marginLeft: "10%", marginTop: "0%"}}>
                        <ThemeProvider theme={this.props.theme}>
                            {lessonModuleContent}
                        </ThemeProvider>
                    </div>
                </dvi>
        )
    }
} 

export default Lesson
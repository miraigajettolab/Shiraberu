import React from "react"
import * as firebase from "firebase"
import { ThemeProvider } from '@material-ui/core/styles';
import Evaluation from '../evaluation/Evaluation'
import ReviewSummary from './ReviewSummary'
import Loading from '../../util/Loading'

/*REQUIRED PROPS:
    *activePanelHandler
    *handleReview
    *theme
*/

class Review extends React.Component {
    constructor(props) {
    super(props)
        this.state = {
            reviewQueue: this.props.reviewQueue.slice(0, 10), // 10 at most at once
            prototypes: null,
            selected: 0,
            reviewMode: "loading"
        }
        this.getPrototypes = this.getPrototypes.bind(this)
        this.onPass = this.onPass.bind(this)
    }

    getPrototypes(){
        var t0 = performance.now()
        const db = firebase.firestore();
        db.collection('Prototypes').where('id', 'in', this.state.reviewQueue.map(Number)).get()
        .then(protsSnapshot => {
            var t1 = performance.now()
            console.log("Call to getPrototypes() took " + (t1 - t0) + " milliseconds.")
            let reviewsData = protsSnapshot.docs.map(doc => doc.data())
            this.setState({
                prototypes: reviewsData,
                reviewMode: "evaluation"
            })
            console.log(this.state.prototypes) //TEST
            return 0
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
            return -1
        })
    }

    componentDidMount(){
        this.getPrototypes();
    }

    onPass(obj, remaining) { //TODO:
        if (remaining === 0){
            this.setState({
                reviewMode: "summary"
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
                if(obj.didFail){
                    // if srs is one just leave it the same (no need to go to 0)
                    if(indexItem.srs !== 1){
                        indexItem.srs = indexItem.srs  - (indexItem.srs >= 5 ? 2 : 1);
                    }
                }
                else {
                    indexItem.srs += 1;
                }
                const currentTimestamp = new Date().getTime()
                indexItem.due = currentTimestamp + srs.stages[indexItem.srs].interval*1000;
                indexRef.update({[obj.id] : indexItem})
                /*.then(obj => {
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
                })*/
            })
        })

        return new Promise(function(resolve, reject) {
          /*stuff using obj*/
            resolve();
           // reject(Error("It broke"));
        });
    }
    

    render() {

        const evaluation = <Evaluation 
                            theme = {this.props.theme} 
                            colors={this.props.colors}
                            prototypes = {this.state.prototypes} 
                            onPass = {this.onPass}
                        />
        
        const summary = <ReviewSummary
                            theme = {this.props.theme} 
                            colors={this.props.colors}
                            prototypes = {this.state.prototypes} 
                            activePanelHandler = {this.props.activePanelHandler}
                    />
                        
        let reviewModuleContent
        switch (this.state.reviewMode) {
            case "loading":
                reviewModuleContent = <Loading /> 
                break;
            case "evaluation":
                reviewModuleContent = evaluation    
                break;
            case "summary":
                reviewModuleContent = summary    
                break;
            default:
                reviewModuleContent = <p>Ошибка! Обратитесь в техподдержку</p>   
                break;
        }

        return (
                <div className="Review" style={{maxWidth: "80%", marginLeft: "10%", marginTop: "10%"}}>
                    <ThemeProvider theme={this.props.theme}>
                        {reviewModuleContent}
                    </ThemeProvider>
                </div>
        )
    }
} 

export default Review
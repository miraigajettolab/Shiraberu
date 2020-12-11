import React from "react"
import EvaluationCard from './EvaluationCard'

/*REQUIRED PROPS:
    *theme
    *activePanelHandler
    *shuffleDepth   - how "deep" the shuffle is
    *prototypes - array of objects of Prototype data type
    *onPass     - promise
*/

class Evaluation extends React.Component {
    constructor(props) {
    super(props)
        this.state = {
            prototypes: this.props.prototypes.map(prot => {
                return ({
                    "id": prot.id,
                    "type": prot.type,
                    "characters": prot.characters ? prot.characters : null, //just in case
                    "radical_picture": prot.radical_picture ? prot.radical_picture : null,
                    "meanings": prot.meanings,
                    "readings": prot.readings ? prot.readings : null,
                    "meaningPassed" : false,
                    "readingPassed" : prot.type === "R" ? true : false, //radicals don't have readings
                    "didFail": false,
                    "meaningFirst" : prot.type === "R" ? true : (Math.random() < 0.5), //50% of getting true, unless it's a radical //TODO: TEST
                })
            }),
            shuffleDepth: this.props.shuffleDepth ? this.props.shuffleDepth : 10, //setting default depth if prop wasn't passed
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleOnPass = this.handleOnPass.bind(this)
        this.handleMeaningPass = this.handleMeaningPass.bind(this)
        this.handleReadingPass = this.handleReadingPass.bind(this)
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

    //TODO: Add new srs stage to the msg of resolve
    handleSubmit(answer, isReading, resolved){
        const current = this.state.prototypes[0]
    
        if(isReading){
            const readings = current.readings.map(rd => rd.kana)
            //If the type is Kanji than we have to consider if reading is accepted
            if(current.type === "K"){
                let acceptedReadings = current.readings.filter(rd => rd.is_accepted === true)
                acceptedReadings = acceptedReadings.map(rd => rd.kana)
                if(acceptedReadings.includes(answer)){
                    if(resolved){
                        this.handleReadingPass()
                        return new Promise(function(resolve, reject) {reject()})
                    }
                    return new Promise(function(resolve, reject) {
                        resolve({
                            "msg":"Верно",
                            "status":"success",
                        })
                    })
                }
                else if(readings.includes(answer)){
                    return new Promise(function(resolve, reject) {
                        resolve({
                            "msg":"Укажите другое чтение",
                            "status":"warning",
                        })
                    })
                }
                else {
                    if(resolved){
                        this.handleOnFail()
                        return new Promise(function(resolve, reject) {reject()})
                    }
                    return new Promise(function(resolve, reject) {
                        resolve({
                            "msg":"Неверно 😢",
                            "status":"error",
                        })
                    })
                }
            }
            else { //The type is Vocab
                if(readings.includes(answer)){
                    if(resolved){
                        this.handleReadingPass()
                        return new Promise(function(resolve, reject) {reject()})
                    }
                    return new Promise(function(resolve, reject) {
                        resolve({
                            "msg":"Верно",
                            "status":"success",
                        })
                    })
                }
                else {
                    if(resolved){
                        this.handleOnFail()
                        return new Promise(function(resolve, reject) {reject()})
                    }
                    return new Promise(function(resolve, reject) {
                        resolve({
                            "msg":"Неверно 😢",
                            "status":"error",
                        })
                    })
                }
            }
        } 
        else { //TODO: add Damerau - Levenshtein
            const meanings = current.meanings.map(mn => mn.text.toLowerCase())
            if(meanings.includes(answer.toLowerCase())){
                if(resolved){
                    this.handleMeaningPass()
                    return new Promise(function(resolve, reject) {reject()})
                }
                return new Promise(function(resolve, reject) {
                    resolve({
                        "msg":"Верно",
                        "status":"success",
                    })
                })
            }
            else {
                if(resolved){
                    this.handleOnFail()
                    return new Promise(function(resolve, reject) {reject()})
                }
                return new Promise(function(resolve, reject) {
                    resolve({
                        "msg":"Неверно 😢",
                        "status":"error",
                    })
                })
            }
        }
    }

    //Do not call this directly, only handleMeaningPass and handleReadingPass should do so
    handleOnPass(){
        this.props.onPass(this.state.prototypes[0]).then(confirmation => {
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

    handleMeaningPass(){
        //If reading already passed, just delegate to handleOnPass()
        if(this.state.prototypes[0].readingPassed){
            this.handleOnPass();
        }
        else {
            //We don't want to mutate state directly 
            let prevPrototypes = this.state.prototypes;
            prevPrototypes[0].meaningPassed = true;
            this.setState({
                prototypes: prevPrototypes
            })
            //Shuffle it out
            this.shuffleCurrent();
        }
    }

    handleReadingPass(){
        //If meaning already passed, just delegate to handleOnPass()
        if(this.state.prototypes[0].meaningPassed){
            this.handleOnPass();
        }
        else {
            //We don't want to mutate state directly 
            let prevPrototypes = this.state.prototypes;
            prevPrototypes[0].readingPassed = true;
            this.setState({
                prototypes: prevPrototypes
            })
            //Shuffle it out
            this.shuffleCurrent();
        }
    }

    handleOnFail(){
        //We don't want to mutate state directly 
        let prevPrototypes = this.state.prototypes;
        //Fail the current one
        prevPrototypes[0].didFail = true;
        this.setState({
            prototypes: prevPrototypes
        })
        //Shuffle it out
        this.shuffleCurrent();
    }

    componentDidMount(){
        //Shuffle prototypes at the start of evaluation session
        this.shuffleWhole();
    }

    render() {
        let evaluationCard = "Всё!"
        if(this.state.prototypes.length > 0) {
            evaluationCard = <EvaluationCard 
                current={this.state.prototypes[0]} 
                colors={this.props.colors}
                handleSubmit={this.handleSubmit}
            />
        }
        return (
            <div className="Evaluation">
                {evaluationCard}
            </div>
        )
    }
} 

export default Evaluation
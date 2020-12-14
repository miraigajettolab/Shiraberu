import React from "react"
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

/*REQUIRED PROPS:
    *activePanelHandler
    *summaryData
    *colors
    *type //"lesson" or "review"
*/

class EvaluationSummary extends React.Component {
    constructor(props) {
    super(props)
    this.state = {
        summaryData: this.props.summaryData.map(prot => {
            return ({
                "id": prot.id,
                "type": prot.type,
                "characters": prot.characters ? prot.characters : null, //just in case
                "radical_picture": prot.radical_picture ? prot.radical_picture : null,
                "didFail": prot.didFail
            })
        })
    }
    this.makeCards = this.makeCards.bind(this)
    }

    makeCards(cards){
        return cards.map(current => {
            let currentColor;

            if(current.type === "R") {
                currentColor = this.props.colors.radicals;
            }
            else if(current.type === "K") {
                currentColor = this.props.colors.kanji;
            }
            else if (current.type === "V")  {
                currentColor = this.props.colors.vocab;
            }
            else {
                currentColor = "red"
            }
            return <Card style = {{backgroundColor: currentColor, margin: "5px", padding: "5px"}}>
                <Typography variant="h5" component="h5" style = {{textAlign: "center", color: "white"}}>
                    {current.characters !== null ? 
                        current.characters :
                        <img alt = "radical_image" style={{ maxHeight: "24px"}} src={current.radical_picture} />
                    }
                </Typography>
            </Card>
        });

    }

    render() {
        let passCards = this.state.summaryData.filter(current => current.didFail === false)
        let failCards = this.state.summaryData.filter(current => current.didFail === true)

        passCards = this.makeCards(passCards)
        failCards = this.makeCards(failCards)

        return (<div>
            <Button
                style={{width: "100%", marginBottom: "10px"}}
                className="ExtraContainerChild"
                variant="contained" 
                color="primary" 
                onClick={event => this.props.activePanelHandler("Home", event)}>
                Домой
            </Button>
            <hr color={"#EEEEEE"}/>
            <Typography variant="h5" component="h5" style = {{textAlign: "left", marginBottom: "10px"}}>
                {this.props.type === "lesson" ? "Результаты урока:" : "Результаты ревью:"}
            </Typography>
            {failCards.length > 0 ? 
            <Typography variant="h7" component="h7" style = {{textAlign: "left", marginBottom: "10px"}}>
                Отвечено неверно:
            </Typography> : <div></div>}
            <div style={{display: "flex", flexWrap: "wrap"}}>
                {failCards}
            </div>
            {passCards.length > 0 ? 
            <Typography variant="h7" component="h7" style = {{textAlign: "left", marginBottom: "10px"}}>
                Отвечено верно:
            </Typography> : <div></div>}
            <div style={{display: "flex", flexWrap: "wrap"}}>
                {passCards}
            </div>
        </div>)
    }
} 

export default EvaluationSummary
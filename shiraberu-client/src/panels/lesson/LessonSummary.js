import React from "react"
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

/*REQUIRED PROPS:
    *activePanelHandler
    *prototypes
    *colors
*/

class LessonSummary extends React.Component {
    constructor(props) {
    super(props)
    this.state = {
        prototypes: this.props.prototypes.map(prot => {
            return ({
                "id": prot.id,
                "type": prot.type,
                "characters": prot.characters ? prot.characters : null, //just in case
                "radical_picture": prot.radical_picture ? prot.radical_picture : null,
            })
        })
    }
    }

    render() {
        let cards = this.state.prototypes.map(current => {
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

        console.log(cards)
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
            Результаты урока:
            </Typography>
            <div style={{display: "flex", flexWrap: "wrap"}}>
                {cards}
            </div>
        </div>)
    }
} 

export default LessonSummary
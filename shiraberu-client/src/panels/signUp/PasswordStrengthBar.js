import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

//takes props.value from 0 to 100

export default function PasswordStrengthBar(props) {
    let strength
    if (props.value === 100){
        strength = "🔒";
    }
    else if (props.value > 90){
        strength = "💪";
    }
    else if (props.value > 60){
        strength = "сильный";
    }
    else if (props.value > 40){
        strength = "средний";
    }
    else if (props.value > 0){
        strength = "слабый"
    }
    else {
        strength = "🔓"
    }
    return (
    <div style = {{display: "flex", justifyContent: "space-between", marginBottom: "10px"}}>
      <div style = {{flex: 10, marginTop: "8px", marginRight: "5px"}}>
        <LinearProgress variant="determinate" {...props} />
      </div>
      <div style={{display: "inline-block"}}>
        <Typography variant="body2" color="textSecondary">{strength}</Typography>
      </div>
    </div>
  );
}

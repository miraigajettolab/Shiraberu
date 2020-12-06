import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';


export default function Loading(props) {
  return (
    <ThemeProvider theme={props.theme}>
        <div style={{
            marginTop: "200px",
            maxWidth: "10%", 
            marginLeft: "45%", 
        }}>
            <CircularProgress size={"100%"}/>
        </div>
    </ThemeProvider>
  );
}
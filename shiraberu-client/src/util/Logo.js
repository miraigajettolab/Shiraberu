import '../App.css'
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
    typography: {
      fontFamily: [
        'Kosugi',
        'sans-serif',
      ].join(','),
    },});

class Logo extends React.Component {
render() {
    return (
        <div style = {{display: "flex", justifyContent: "center"}}>
            <ThemeProvider theme={theme}>
                <Typography variant="h1" component="h1" gutterBottom>
                    調べる
                </Typography>
            </ThemeProvider>
        </div>
    );
}
}

export default Logo
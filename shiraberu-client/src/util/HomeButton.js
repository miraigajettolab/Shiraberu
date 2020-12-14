import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function HomeButton(props) {
  const classes = useStyles();

  //you have to provide id in all three places
  return (
    <div className={classes.root}>
        <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={e => props.go("Home", e)}> 
        <HomeOutlinedIcon/>
        </IconButton>
        </Toolbar>
    </div>
  );
}
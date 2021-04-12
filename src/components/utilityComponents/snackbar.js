import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function SnackBar({snackbarData : {open,message,type,handleClose,duration,position } }) {
  const classes = useStyles();
  // open,message,type,handleClose,duration,position
  
  return (
    <div className={classes.root}>
      <Snackbar elevation={6} open={open} autoHideDuration={duration} anchorOrigin={position}  onClose={handleClose}>
        <Alert onClose={handleClose} severity={type}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}




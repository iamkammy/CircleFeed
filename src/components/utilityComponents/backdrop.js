import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}))
function BackDrop(props) {
    const classes = useStyles();

    return (
        <>
            <Backdrop className={classes.backdrop} open={props.backdropOpen}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

export default BackDrop;
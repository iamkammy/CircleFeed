import React from 'react';

import Skeleton from "@material-ui/lab/Skeleton";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: 345,
        margin: "26px auto",
    },
    media: {
        height: 190,
    },
    postpic: {
        width: 310,
        height: 190,
    }
}));

export default function PostShimmer() {
    const classes = useStyles();
    return (
        <Card className={classes.card} >
            <CardHeader
                avatar={<Skeleton animation="wave" variant="circle" width={40} height={40} />}
                title={<Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />}
                subheader={<Skeleton animation="wave" height={10} width="40%" />}
            />

            {
                <Skeleton animation="wave" variant="rect" className={classes.media} />
            }

            <CardContent>
                {
                    <React.Fragment>
                        <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                        <Skeleton animation="wave" height={10} width="80%" />
                    </React.Fragment>
                }
            </CardContent>
        </Card>
    )
}

export function PostPhotoShimmer() {
    const classes = useStyles();
    return (
        <Skeleton animation="wave" variant="rect" className={classes.postpic} style={{ marginLeft: '5px' }} />
    )
}

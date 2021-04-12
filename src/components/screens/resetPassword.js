import React, {useState} from 'react'
import { Link as RouterLink, useHistory} from 'react-router-dom'
import axios from '../../helpers/axios';
import M from 'materialize-css';
import work from '../../assets/images/work.png';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

const useStyles = makeStyles((theme) => ({
    root: {
      height: 'calc(100vh - 64px )',
      backgroundColor : 'white'
    },
    ImgHolder : {
        width : '80%',
      position : 'relative',
      top : '50%',
      left : '50%',
      transform : 'translate(-50%,-50%)',
      [theme.breakpoints.down('sm')]: {
        display : 'none'
        },
    },
    paper: {
      margin: theme.spacing(8, 4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));


 const  ResetPassword = ()=> {
     const history = useHistory();
     const classes = useStyles();

     const [data,setData] = useState({
         email : "",
     });

     const InputValue = (e)=> {
        const {name, value} = e.target;
        setData(preVal => {
            return {
                ...preVal,
                [name] : value
            }
        })
     }

     const handleSubmit = (e)=> {
        e.preventDefault();
        if(email.length !== 0){
            if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(data.email)){
                M.toast({ html : 'Invalid email address',classes: '#e57373 red lighten-2 rounded' });
               return;
           }
        }
        reset();
     }

     const reset = ()=> {
        axios.post('/reset-password',data)
        .then(res => {
            let {data} = res;
            M.toast({ html : data.message, displayLength: 4000, classes : "#81c784 green lighten-2 rounded" });
            history.push('/login')
        })
        .catch(err =>{
            console.log(err.response,"this");
            M.toast({ html : err.response ? err.response.data.error : err, classes: '#e57373 red lighten-2 rounded' })
        })
     }

     const {email} = data;

    return (
        <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} >
            <div className={classes.ImgHolder}>
                 <img className="animated" src={work} alt="reset" style={{width : '100%'}}  />
            </div>
            
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={0} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Reset your account password
            </Typography>

            <form onSubmit={handleSubmit} className={classes.form}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                type="email"
                label="Email Address"
                value={email}
                onChange={InputValue}
                name="email"
                autoComplete="email"
                autoFocus
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Reset
              </Button>
              <Grid container>
                <Grid item xs>
                    <div style={{display: 'flex', alignItems:'center'}}>
                    <KeyboardBackspaceIcon />
                    <Link ic component={RouterLink} color="tertiary" to="/login" variant="body2">
                    &nbsp;Back
                    </Link>
                    </div>
                </Grid>
              </Grid>

            </form>
          </div>
        </Grid>
      </Grid>
    )
}

export default ResetPassword;
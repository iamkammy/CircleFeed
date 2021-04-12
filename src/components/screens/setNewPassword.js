import React, {useState} from 'react'
import { Link as RouterLink, useHistory, useParams} from 'react-router-dom'
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



 const  SetNewPassword = ()=> {
     const history = useHistory();
     const {token} = useParams()
     const classes = useStyles();
     const [data,setData] = useState({
         password : ""
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
        changePassword();
     }

     const changePassword = ()=> {
         let obj = {
             password : data.password,
             token
         }
        axios.post('/new-password', obj)
        .then(res => {
            let {data} = res;
            console.log(data);    
            M.toast({ html : data.message,displayLength: 2000, classes : "#81c784 green lighten-2 rounded" });
            history.push('/login')
        })
        .catch(err =>{
            console.log(err.response,"this");
            alert(err.response.data.error)
            M.toast({ html : err.response.data.error , classes: '#e57373 red lighten-2 rounded' })
        })
     }

     const {password} = data;

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
               Change Your Password
            </Typography>

            <form onSubmit={handleSubmit} className={classes.form}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="password"
                type="password"
                label="Enter new password"
                value={password}
                onChange={InputValue}
                name="password"
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
                Update password
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

export default SetNewPassword;
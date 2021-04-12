import React, { useState, useContext } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import axios from "../../helpers/axios";
import { UserContext, SnackbarContext } from "../../App";
import Img1 from "../../assets/images/Img1.svg";
import BackDrop from '../utilityComponents/backdrop';

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "calc(100vh - 64px )",
    backgroundColor: "white",
  },
  ImgHolder: {
    width: "80%",
    position: "relative",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = () => {
  const { state, dispatch } = useContext(UserContext);
  const { handleSnackBar } = useContext(SnackbarContext);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  if (state && Object.keys(state).length) {
    history.push("/");
  }

  const InputValue = (e) => {
    const { name, value } = e.target;
    setData((preVal) => {
      return {
        ...preVal,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.length !== 0) {
      if (
        !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(data.email)
      ) {
        handleSnackBar("Invalid email address", "error", 3000);
        return;
      }
    }
    login();
  };

  const login = () => {
    setBackdropOpen(true)
    axios
      .post("/signin", data)
      .then((res) => {
        let { data } = res;
        console.log(data);
        setBackdropOpen(false);
        localStorage.setItem("jwt", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        handleSnackBar(data.message, "success", 1000);
        dispatch({ type: "USER", payload: data.user });
        history.push("/");
      })
      .catch((err) => {
        setBackdropOpen(false);
        handleSnackBar(err.response ? err.response.data.message : err, "error", 3000);
      });
  };

  const { email, password } = data;

  return (
    <Grid container component="main" className={classes.root}>
      <BackDrop backdropOpen={backdropOpen} />

      <CssBaseline />
      <Grid item xs={false} sm={4} md={6}>
        <div className={classes.ImgHolder}>
          <img className="animated" src={Img1} alt="login" style={{ width: "100%" }} />
        </div>
      </Grid>

      <Grid item md={2}></Grid>

      <Grid item xs={12} sm={8} md={4} component={Paper} elevation={0} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          <form onSubmit={handleSubmit} className={classes.form} noValidate>
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
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              value={password}
              onChange={InputValue}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link component={RouterLink} to="/reset" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <span style={{ color: "grey" }}>Not a member yet? &nbsp;</span>
                <Link
                  component={RouterLink}
                  to="/signup"
                  color="primary"
                  variant="body2"
                >
                  {"Create an account"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

export default Login;

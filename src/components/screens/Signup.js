import React, { useState, useContext, useEffect } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import axios from "../../helpers/axios";
import { cloudinary } from "../../config";
import Img1 from "../../assets/images/Img1.svg";
import { SnackbarContext } from "../../App";
import BackDrop from '../utilityComponents/backdrop';

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import PersonIcon from "@material-ui/icons/Person";
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
  previewImgInput: {
    display: "none",
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

const Signup = () => {
  const { handleSnackBar } = useContext(SnackbarContext);

  const [data, setData] = useState({
    name: "",
    password: "",
    email: "",
  });
  const classes = useStyles();
  const [image, setImage] = useState("");
  const [publisedImageUrl, setPublishedImageUrl] = useState(undefined);
  const history = useHistory();
  const [backdropOpen, setBackdropOpen] = useState(false);

  let interval = null;

  const InputValue = (e) => {
    const { name, value } = e.target;
    setData((preVal) => {
      return {
        ...preVal,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    if (publisedImageUrl) {
      signup();
    }

    return () => {
      clearInterval(interval);
    };
  }, [publisedImageUrl]);

  function handleSubmit(e) {
    e.preventDefault();
    if (data.email.length !== 0) {
      if (
        !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          data.email
        )
      ) {
        handleSnackBar("Invalid email address", "error", 3000);
        return;
      }
    }

    if (!data.name || !data.password) {
      handleSnackBar("Please Fill all the fields", "error", 3000);
      return;
    }

    // for checking whether to upload with image or not
    if (image) {
      postImage();
    } else {
      signup();
    }
  }

  function signup() {
    setBackdropOpen(true);
    let obj = Object.assign({ pic: publisedImageUrl }, data);
    axios
      .post("/signup", obj)
      .then((res) => {
        console.log(res);
        setBackdropOpen(false);
        handleSnackBar(res.data.message, "success", 1000);
        interval = setTimeout(() => {
          history.push("/login");
        }, 1000);
      })
      .catch((err) => {
        console.log(err.response);
        setBackdropOpen(false);
        handleSnackBar(err.response ? err.response.data.message : err, "error", 3000);
      });
  }

  // Function to post Image to cloudinary
  const postImage = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "circle");
    data.append("cloud_name", "kammy");
    fetch(cloudinary.apiUrl, {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          handleSnackBar(data.error.message + "  and fields", "error", 3000);
          return;
        } else {
          setPublishedImageUrl(data.secure_url);
        }
      })
      .catch((err) => {
        handleSnackBar(err + ", Internet DisConnected", "error", 3000);
      });
  };

  // Function to show selected image of user
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={6}>
        <div className={classes.ImgHolder}>
          <img className="animated" src={Img1} alt="login" style={{ width: "100%" }} />
        </div>
        <BackDrop backdropOpen={backdropOpen} />
      </Grid>

      <Grid item md={2}>
        <Typography component="h1" variant="h5">
          Instagram
        </Typography>
        <i>Signup to access the posts of your folowers</i>
      </Grid>

      <Grid item xs={12} sm={8} md={4} component={Paper} elevation={0} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <PersonIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>

          <form onSubmit={handleSubmit} className={classes.form}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              type="text"
              label="Full Name"
              value={data.name}
              onChange={InputValue}
              name="name"
              autoComplete="name"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              type="email"
              label="Email Address"
              value={data.email}
              onChange={InputValue}
              name="email"
              autoComplete="email"
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              value={data.password}
              onChange={InputValue}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <div className="previewImageSection">
              <div className="left">
                {image ? (
                  <div id="ImgHolder">
                    <Avatar alt="avatar" src={image} id="userpic" />
                  </div>
                ) : (
                    <Typography id="nophoto">No photo choosen</Typography>
                  )}
              </div>

              <div className="right">
                <input
                  accept="image/*"
                  className={classes.previewImgInput}
                  id="contained-button-file"
                  onChange={onImageChange}
                  multiple
                  type="file"
                />
                <label htmlFor="contained-button-file">
                  <Button variant="outlined" color="primary" component="span">
                    Browse photo
                  </Button>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Register
            </Button>

            <Grid container justify="flex-end">
              <Grid item>
                <Link
                  component={RouterLink}
                  to="/login"
                  color="primary"
                  variant="body2"
                >
                  {"Already have an account? Sign in"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

export default Signup;

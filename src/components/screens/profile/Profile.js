import React, { useEffect, useState, useContext } from "react";
import axios from "../../../helpers/axios";
import { UserContext, SnackbarContext } from "../../../App";
import "./profile.css";
import { cloudinary } from "../../../config";
import { Button } from "@material-ui/core";
import CameraUpload from "../../utilityComponents/cameraUpload";
import { PostPhotoShimmer } from '../../utilityComponents/shimmer';

import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Alert from "@material-ui/lab/Alert";


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 636,
    height: 450,
  },
}));

const Profile = () => {
  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const { handleSnackBar } = useContext(SnackbarContext);
  const [image, setImage] = useState(state ? state.pic : null);
  const [publisedImageUrl, setPublishedImageUrl] = useState("");
  const [picChange, setPicChange] = useState(false);
  console.log(state, "state");
  const classes = useStyles();

  const myPosts = () => {
    axios
      .get("/mypost", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        console.log(res.data.mypost);
        setPics(res.data.mypost);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  //runs to update publishedurl pic of user into database
  useEffect(() => {
    if (publisedImageUrl) {
      updatePicToDB();
    }
  }, [publisedImageUrl]);

  // Runs only when mount component
  useEffect(() => {
    myPosts();
  }, []);

  // posting Image to cloudinary
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

  // Function to set updated pic url to database
  const updatePicToDB = () => {
    console.log("going to update");
    let data = { pic: publisedImageUrl };
    axios
      .put("/updatepic", data, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        console.log(res, "updated pic");
        localStorage.setItem(
          "user",
          JSON.stringify({ ...state, pic: res.data.result.pic })
        );
        dispatch({ type: "UPDATEPIC", payload: res.data.result.pic });
        setPicChange(false);
        handleSnackBar(res.data.message, "success", 2000);
      })
      .catch((err) => {
        console.log(err, "error in updated pic");
        setPicChange(false);
        handleSnackBar(err.error ? err.error : err, "error", 3000);
      });
  };

  // Function to choose user picture
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setPicChange(true);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <div className="parent">
      <div className="holder">
        <div className="avatar">
          <img src={image} alt="avatar" />
          <CameraUpload onImageChange={onImageChange} place="cameraIcon" />
          <div className="updatebtn">
            {picChange ? (
              <Button onClick={postImage} size="small" variant="contained" color="secondary" >
                update
              </Button>
            ) : null}
          </div>
        </div>

        {!state ? (
          "Loading..."
        ) : (
            <div className="details">
              <h3>{state.name}</h3>
              <h5>{state.email}</h5>
              <div className="flex">
                <h6>
                  {mypics.length} {mypics.length < 2 ? "post" : "posts"}
                </h6>
                <h6>
                  {state.followers.length}{" "}
                  {state.followers.length < 2 ? "follower" : "followers"}
                </h6>
                <h6>
                  {state.following.length}{" "}
                  {state.following.length < 2 ? "following" : "followings"}
                </h6>
              </div>
            </div>
          )}
      </div>

      <GridList cellHeight={160} className={classes.gridList} cols={2}>
        {mypics.length === 0 ? (
          [<PostPhotoShimmer />, <PostPhotoShimmer />]
        ) : (
            mypics.map((item) => (
              <GridListTile key={item._id}>
                <img src={item.photo} alt="mypost" />
              </GridListTile>
            ))
          )}
      </GridList>
    </div>
  );
};

export default Profile;

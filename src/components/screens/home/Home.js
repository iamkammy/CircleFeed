import React, { useState, useEffect, useContext } from "react";
import "./home.css";
import axios from "../../../helpers/axios";
import Post from "../post/post";
import { UserContext } from "../../../App";
import PostShimmer from "../../utilityComponents/shimmer";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Add from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 500,
    margin: "70px auto 20px",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "98vw",
    },
  },
  blankscreen: {
    display: "flex",
    height: "calc(100vh - 100px)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
}));

const Home = () => {
  const [data, setData] = useState([]);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const { state } = useContext(UserContext);
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    console.log("Home component,  state changed");
    if (state && Object.keys(state).length) {
      fetchAllPosts();
    }
  }, [state]);

  //functio to fetch all posts
  const fetchAllPosts = () => {
    setIsPostsLoading(true);
    axios
      .get("/allpost", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        setIsPostsLoading(false);
        if (res.data.posts) {
          setData(res.data.posts);
        }
      })
      .catch((err) => {
        setIsPostsLoading(false);
        console.log(err.response, "error in fetch");
      });
  };

  // delete a post
  const removePost = (id) => {
    const newdata = data.filter((item) => {
      return item._id !== id;
    });
    setData(newdata);
  };

  return (
    <div className={classes.root}>
      {isPostsLoading ? (
        <>
          <PostShimmer />
          <br />
          <PostShimmer />
        </>
      ) : null}

      {data.length ? (
        data?.map((item) => {
          return <Post key={item._id} item={item} removepost={removePost} />;
        })
      ) : (
        <div className={classes.blankscreen}>
          <Typography style={{ color: "grey", marginBottom: "10px" }}>No Posts Available</Typography>
          <Button endIcon={<Add />} variant='outlined' color='primary' size='small' onClick={() => history.push("/createPost")}>
            Add Post
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;

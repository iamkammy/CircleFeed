import React, { useState, useEffect, useContext } from "react";
import "./home.css";
import axios from "../../../helpers/axios";
import Post from "../post/post";
import { UserContext } from "../../../App";
import PostShimmer from '../../utilityComponents/shimmer';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 500,
    margin: "70px auto 20px",
    [theme.breakpoints.down("sm")]: {
      maxWidth: '98vw',
    },
  }
}));

const Home = () => {
  const [data, setData] = useState([]);
  const { state } = useContext(UserContext);
  const classes = useStyles();

  useEffect(() => {
    console.log("Home component,  state changed");
    if (state && Object.keys(state).length) {
      fetchAllPosts();
    }
  }, [state]);

  //functio to fetch all posts
  const fetchAllPosts = () => {
    axios
      .get("/allpost", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        console.log(typeof res.data, res.data);

        setData(res.data.posts);
      })
      .catch((err) => {
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
      {data.length ? (
        data?.map((item) => {
          return <Post key={item._id} item={item} removepost={removePost} />;
        })
      ) : (
        <>
          <PostShimmer />
          <br />
          <PostShimmer />
        </>
      )}
    </div>
  );
};

export default Home;

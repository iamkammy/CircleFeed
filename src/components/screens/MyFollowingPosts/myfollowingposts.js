import React, { useState, useEffect } from "react";
import axios from "../../../helpers/axios";
import Post from "../post/post";
import { Alert, AlertTitle } from "@material-ui/lab";
import PostShimmer from "../../utilityComponents/shimmer";

import { Empty, Card } from "antd";
import "./myfollowing-posts.scss";

const MyFollowingPosts = (props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchAllPosts();
  }, []);

  //function to fetch My following posts
  const fetchAllPosts = () => {
    axios
      .get("/myfollowingposts", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        console.log(typeof res.data, res.data);
        if (res.data.posts !== "undefined") {
          setData(res.data.posts);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  return (
    <div className='my-following-posts-container'>
      {data && data.length == 0 && <PostShimmer />}

      {!data ? (
        <Card title='My Following Posts' bordered={true} className='card-block'>
          <Empty description='No posts available' />
        </Card>
      ) : (
        data.map((item) => {
          return <Post key={item._id} item={item} />;
        })
      )}
    </div>
  );
};

export default MyFollowingPosts;

import React, { useEffect, useState, useContext } from "react";
import axios from "../../../helpers/axios";
import { UserContext } from "../../../App";
import { useParams } from "react-router-dom";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  followbtn: {
    backgroundColor: theme.palette.primary.main,
    color: "#ffffff",
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
    textTransform: "none",
  },
}));

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const classes = useStyles();
  const [isFollowed, setIsFollowed] = useState(
    state ? state.following.includes(userid) : false
  );

  useEffect(() => {
    setIsFollowed(state ? state.following.includes(userid) : false);
  }, [state?.following]);

  const profile = () => {
    axios
      .get(`/user/${userid}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        console.log(res.data);
        setUserProfile(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  // function to follow user
  const followUser = () => {
    axios
      .put(
        "/follow",
        { followId: userid },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
      .then((res) => {
        console.log(res);
        let { followers, following } = res.data;
        dispatch({ type: "UPDATE", payload: { followers, following } });
        localStorage.setItem("user", JSON.stringify(res.data));
        setIsFollowed(true);
        setUserProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, res.data._id],
            },
          };
        });
      })
      .catch((err) => {
        console.log(err.response);
        alert(err.response.data.error + "to follow the user");
      });
  };

  // function to Unfollow user
  const unFollowUser = () => {
    axios
      .put(
        "/unfollow",
        { unfollowId: userid },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
      .then((res) => {
        console.log(res);
        let { followers, following } = res.data;
        dispatch({ type: "UPDATE", payload: { followers, following } });
        localStorage.setItem("user", JSON.stringify(res.data));
        setIsFollowed(false);
        setUserProfile((prevState) => {
          const newFollowers = prevState.user.followers.filter(
            (item) => item !== res.data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollowers,
            },
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Runs only when mount component
  useEffect(() => {
    profile();
  }, []);

  return (
    <>
      {!userProfile ? (
        <h2>loading...!</h2>
      ) : (
        <div className="parent">
          <div className="holder">
            <div className="avatar">
              <img src={userProfile.user.pic} alt="avatar" />
            </div>

            <div className="details">
              <h3>{userProfile.user.name}</h3>
              <h5>{userProfile.user.email}</h5>
              <div className="flex">
                <h6>
                  {userProfile.posts.length}{" "}
                  {userProfile.posts.length < 2 ? "post" : "posts"}
                </h6>
                <h6>
                  {userProfile.user.followers.length}{" "}
                  {userProfile.user.followers.length < 2
                    ? "follower"
                    : "followers"}
                </h6>
                <h6>
                  {userProfile.user.following.length}{" "}
                  {userProfile.user.following.length < 2
                    ? "following"
                    : "followings"}
                </h6>
              </div>
              {!isFollowed ? (
                <Button
                  variant="contained"
                  onClick={followUser}
                  className={classes.followbtn}
                >
                  Follow
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={unFollowUser}
                  className={classes.followbtn}
                >
                  Unfollow
                </Button>
              )}
            </div>
          </div>

          <div className="gallery">
            {userProfile.posts.length === 0 ? (
              <h6>No Posts available</h6>
            ) : (
              userProfile.posts.map((item) => {
                return (
                  <img
                    key={item._id}
                    className="item"
                    src={item.photo}
                    alt="mypost"
                  />
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;

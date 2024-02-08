import React, { useState, useContext, useEffect } from "react";
import axios from "../../../helpers/axios";
import "./post.css";
import { UserContext } from "../../../App";
import { useHistory } from "react-router-dom";
import commentIcon from "../../../assets/icons/commentIcon.png";
import { RWebShare } from "react-web-share";

import { Menu, MenuItem, Grid, CssBaseline, ListItemIcon, ListItemText, Link, Divider } from "@material-ui/core";

import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SendIcon from "@material-ui/icons/Send";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ShareIcon from "@material-ui/icons/Share";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: "10px",
  },
  redHeart: {
    color: "#e25656",
  },
  cardContent: {
    padding: "16px 16px 0",
  },
  bottomCardContent: {
    padding: "0px 19px 7px",
  },
  avatar: {
    textTransform: "capitalize",
  },
  sendIcon: {
    color: theme.palette.primary.main,
  },
  commentIconHolder: {
    width: "27px",
  },
  commentsUL: {
    paddingLeft: "0",
    height: "305px",
    overflow: "auto",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "0.5px solid grey",
    boxShadow: theme.shadows[5],
    outline: "none",
    padding: "0px",
    width: "80vw",
    height: "75vh",
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  medium: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const Post = ({ item, removepost }) => {
  const [likes, setLikes] = useState(item.likes);
  const [comments, setComments] = useState(item.comments);
  const [anchorEl, setAnchorEl] = useState(null);
  const { state } = useContext(UserContext);
  const [commentText, setCommentText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    if (item._id == getParameterByName("id")) {
      setOpenModal(true);
    }
  }, []);

  const link = window.location.host + "/?id=" + item._id;

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  //function to likePost
  const likePost = () => {
    let data = { postId: item._id };
    axios
      .put("/like", data, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        console.log(res);
        setLikes(res.data.likes);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //function to unlikePost
  const unlikePost = () => {
    let data = { postId: item._id };
    axios
      .put("/unlike", data, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        console.log(res);
        setLikes(res.data.likes);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //function for commentlike
  const commentPost = (text, postId) => {
    axios
      .put(
        "/comment",
        { text, postId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
      .then((res) => {
        console.log(res, "backedn");
        setComments(res.data.comments);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // On submitting comment
  const makeComment = (e) => {
    e.preventDefault();
    commentPost(commentText, item._id);
    setCommentText("");
  };

  const handleComment = (e) => {
    if (window.screen.width < 768) {
      localStorage.setItem("singlePost", JSON.stringify(item));
      history.push("/comment");
    } else {
      handleModalOpen();
    }
  };

  // function to set comment text
  const fillCommentText = (e) => {
    setCommentText(e.target.value);
  };

  //function to delete post by owner of post
  const deletePost = () => {
    window.confirm("Are u sure u want to delete");
    axios
      .delete(`/deletepost/${item._id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        removepost(item._id);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  // Function to navigate to user profile
  const handleProfile = () => {
    history.push(`${item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"}`);
  };

  const { pic, name } = item.postedBy;

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          pic && !pic.includes("default-user-image-2_pputze") ? (
            <Avatar alt='user-image' src={pic} />
          ) : (
            <Avatar aria-label='recipe' className={classes.avatar}>
              {name.split("")[0]}
            </Avatar>
          )
        }
        action={
          <IconButton onClick={handleClick} aria-controls='long-menu' aria-haspopup='true' aria-label='settings'>
            <MoreVertIcon />
          </IconButton>
        }
        title={name}
        subheader='September 14, 2016'
      />
      <Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <RWebShare
          data={{
            text: "Have a look at Circle App !!",
            url: link,
            title: "Checkout this post",
          }}>
          <MenuItem>
            <ListItemIcon>
              <ShareIcon />
            </ListItemIcon>
            <ListItemText primary='Share' />{" "}
          </MenuItem>
        </RWebShare>

        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary='User Profile' />
        </MenuItem>
      </Menu>

      <CardMedia component='img' height='100%' image={item.photo} title={`${name} post`} />
      <CardContent className={classes.cardContent}>
        <Typography variant='subtitle1'>{item.title}</Typography>
        <Typography variant='body1'>{item.body}</Typography>
      </CardContent>

      <CardActions disableSpacing>
        {likes && likes.includes(state._id) ? (
          <IconButton className={classes.redHeart} onClick={unlikePost}>
            <FavoriteIcon />
          </IconButton>
        ) : (
          <IconButton onClick={likePost}>
            <FavoriteBorderIcon fontSize='default' />
          </IconButton>
        )}
        <IconButton onClick={handleComment} aria-label='comment'>
          <div className={classes.commentIconHolder}>
            <img style={{ width: "93%" }} src={commentIcon} alt='comment-icon' />
          </div>
        </IconButton>

        <RWebShare
          data={{
            text: "Have a look at Circle App !!",
            url: link,
            title: "Checkout this post",
          }}>
          <IconButton aria-label='share'>
            <ShareIcon />
          </IconButton>
        </RWebShare>
      </CardActions>

      <CardContent className={classes.bottomCardContent}>
        <Typography variant='subtitle2' style={{ marginBottom: "1rem" }}>
          {likes.length} {likes.length < 2 ? "like" : "likes"}
        </Typography>
        {comments.length ? (
          comments && (
            <>
              <div className='commenters'>
                <Avatar className={classes.small} src={comments[0].commentedBy.pic} alt='user-pic' />
                <Typography variant='subtitle2' style={{ paddingLeft: "4px", minWidth: "110px" }}>
                  {comments[0].commentedBy.name}
                </Typography>
                <Typography variant='body1' style={{ paddingLeft: "10px" }}>
                  {comments[0].text}
                </Typography>
              </div>
              <Typography onClick={handleComment} component='p' color='textSecondary' variant='caption'>
                <Link color='inherit' style={{ cursor: "pointer" }}>
                  View all {comments.length} comments
                </Link>
              </Typography>
            </>
          )
        ) : (
          <Typography color='textSecondary' variant='caption'>
            No comments available
          </Typography>
        )}
      </CardContent>

      {/* Modal section start For Simgle Post*/}
      <Modal
        className={classes.modal}
        open={openModal}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        <Fade in={openModal}>
          <div className={classes.paper}>
            <Grid container style={{ width: "100%", height: "100%" }}>
              <CssBaseline />
              <Grid item xs={12} md={6} lg={6} sm={12}>
                <div style={{ width: "100%", height: "100%" }}>
                  <img
                    src={item.photo}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    alt='User Image'
                  />
                </div>
              </Grid>

              <Grid item xs={12} md={6} lg={6} sm={12} style={{ padding: "20px" }}>
                {
                  <>
                    <div className='commenters'>
                      <Avatar src={pic} alt='user-pic' />
                      <Typography variant='subtitle2' style={{ paddingLeft: "4px", minWidth: "110px" }}>
                        {name}
                      </Typography>
                      <Typography variant='body1' style={{ paddingLeft: "10px" }}>
                        {item.title}
                      </Typography>
                    </div>
                    <Typography variant='body1'>{item.body}</Typography>
                  </>
                }
                <Divider />

                <ul className={classes.commentsUL}>
                  {comments.length ? (
                    comments &&
                    comments.map((comment) => {
                      return (
                        <div key={comment._id} className='commenters'>
                          <Avatar className={classes.small} src={comment.commentedBy.pic} alt='user-pic' />
                          <Typography variant='subtitle2' style={{ paddingLeft: "4px", minWidth: "110px" }}>
                            {comment.commentedBy.name}
                          </Typography>
                          <Typography variant='body1' style={{ paddingLeft: "10px" }}>
                            {comment.text}
                          </Typography>
                        </div>
                      );
                    })
                  ) : (
                    <Typography color='textSecondary' variant='caption'>
                      No comments available
                    </Typography>
                  )}
                </ul>
                <Divider />
                <Typography variant='subtitle2'>
                  {likes.length} {likes.length < 2 ? "like" : "likes"}
                </Typography>
                <CardActions style={{ margin: "0", padding: "0" }}>
                  {likes && likes.includes(state._id) ? (
                    <IconButton className={classes.redHeart} onClick={unlikePost}>
                      <FavoriteIcon />
                    </IconButton>
                  ) : (
                    <IconButton onClick={likePost}>
                      <FavoriteBorderIcon fontSize='default' />
                    </IconButton>
                  )}
                  <IconButton onClick={handleComment} aria-label='comment'>
                    <div className={classes.commentIconHolder}>
                      <img style={{ width: "93%" }} src={commentIcon} alt='comment-icon' />
                    </div>
                  </IconButton>

                  <IconButton aria-label='share'>
                    <ShareIcon />
                  </IconButton>
                </CardActions>

                <div className='commentBox'>
                  <form onSubmit={makeComment}>
                    <input onChange={fillCommentText} value={commentText} type='text' placeholder='Add a comment' />
                    <div className={commentText.length > 0 ? "undisabled" : "disabled"} id='sendicon'>
                      {" "}
                      <SendIcon className={classes.sendIcon} />{" "}
                    </div>
                  </form>
                </div>
              </Grid>
            </Grid>
          </div>
        </Fade>
      </Modal>

      {/* Modal ends */}

      <div className='commentBox'>
        <form onSubmit={makeComment}>
          <input onChange={fillCommentText} value={commentText} type='text' placeholder='Add a comment' />
          <div className={commentText.length > 0 ? "undisabled" : "disabled"} id='sendicon'>
            {" "}
            <SendIcon className={classes.sendIcon} />{" "}
          </div>
        </form>
      </div>
    </Card>
  );
};

export default Post;

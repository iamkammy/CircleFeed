import React, { useState, useRef, useContext } from 'react'
import axios from '../../../helpers/axios';
import '../post/post.css';
import { UserContext } from '../../../App';
import { useHistory } from 'react-router-dom';
import commentIcon from '../../../assets/icons/commentIcon.png';

import { Divider } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import Alert from '@material-ui/lab/Alert';

import { makeStyles } from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ShareIcon from '@material-ui/icons/Share';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 500,
    margin: '85px auto 0',
    padding: '0px 12px'
  },
  redHeart: {
    color: '#e25656'
  },
  cardContent: {
    padding: '16px 16px 0'
  },
  bottomCardContent: {
    padding: '0px 19px 7px'
  },
  avatar: {
    textTransform: 'capitalize'
  },
  sendIcon: {
    color: theme.palette.primary.main
  },
  commentIconHolder: {
    width: '27px'
  },
  commentsUL: {
    paddingLeft: '0',
    height: 'calc(70vh - 130px);',
    overflow: 'auto'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '0.5px solid grey',
    boxShadow: theme.shadows[5],
    outline: 'none',
    padding: '0px',
    width: '80vw',
    height: '75vh'
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
  back: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '-20px',
    paddingBottom: '20px'
  },
  backIcon: {
    marginRight: '10px'
  }
}));

const Comment = () => {
  const item = JSON.parse(localStorage.getItem('singlePost'));
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  console.log(item, loggedInUser);
  const [likes, setLikes] = useState(item.likes);
  const [comments, setComments] = useState(item.comments);
  const { state } = useContext(UserContext);
  const [commentText, setCommentText] = useState("");
  const history = useHistory();
  const inputRef = useRef(null);
  const classes = useStyles();

  //function to likePost
  const likePost = () => {
    let data = { postId: item._id };
    axios.put('/like', data, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('jwt')
      }
    })
      .then(res => {
        console.log(res)
        setLikes(res.data.likes)
      })
      .catch(err => {
        console.log(err)
      })
  }

  //function to unlikePost
  const unlikePost = () => {
    let data = { postId: item._id };
    axios.put('/unlike', data, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('jwt')
      }
    })
      .then(res => {
        console.log(res)
        setLikes(res.data.likes)
      })
      .catch(err => {
        console.log(err)
      })
  }

  //function for comment
  const commentPost = (text, postId) => {
    axios.put('/comment', { text, postId }, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('jwt')
      }
    })
      .then(res => {
        console.log(res, "backedn")
        setComments(res.data.comments);
      })
      .catch(err => {
        console.log(err)
      })
  }

  // On submitting comment
  const makeComment = (e) => {
    e.preventDefault();
    commentPost(commentText, item._id);
    setCommentText("");
  }

  const focusComment = (e) => {
    inputRef.current.focus()
  }

  // go back to dashboard
  const backToHome = () => {
    history.push('/')
  }

  // function to set comment text
  const fillCommentText = (e) => {
    setCommentText(e.target.value)
  }

  const { pic, name } = item.postedBy;
  return (
    !item ? (<Alert severity="info">Some technical issues</Alert>)
      :
      <div className={classes.root}>

        <div className={classes.back}>
          <KeyboardBackspaceIcon onClick={backToHome} className={classes.backIcon} />
          <Typography variant="h6">Comments</Typography>
        </div>

        <div className="commenters" >
          <Avatar src={pic} alt="user-pic" />
          <Typography variant="subtitle2" style={{ paddingLeft: '4px', minWidth: '110px' }}>{name}</Typography>
          <Typography variant="body1" style={{ paddingLeft: '10px' }}>{item.title}</Typography>
        </div>
        <Typography variant="body1">{item.body}</Typography>
        <Divider />

        <ul className={classes.commentsUL}>
          {
            comments.length ?
              comments && comments.map(comment => {
                return (
                  <div key={comment._id} className="commenters">
                    <Avatar className={classes.small} src={comment.commentedBy.pic} alt="user-pic" />
                    <Typography variant="subtitle2" style={{ paddingLeft: '4px', minWidth: '110px' }}>{comment.commentedBy.name}</Typography>
                    <Typography variant="body1" style={{ paddingLeft: '10px' }}>{comment.text}</Typography>
                  </div>
                )
              })
              :
              (<Typography color="textSecondary" variant="caption">No comments available</Typography>)
          }
        </ul>
        <Divider />
        <Typography variant="subtitle2">
          {likes.length} {likes.length < 2 ? 'like' : 'likes'}
        </Typography>

        <CardActions style={{ margin: '0', padding: '0' }}>
          {
            likes && likes.includes(loggedInUser._id || state._id) ?
              (
                <IconButton className={classes.redHeart} onClick={unlikePost} >
                  <FavoriteIcon />
                </IconButton>
              )
              :
              (
                <IconButton onClick={likePost} >
                  <FavoriteBorderIcon fontSize="default" />
                </IconButton>
              )
          }
          <IconButton onClick={focusComment} aria-label="comment">
            <div className={classes.commentIconHolder}>
              <img style={{ width: '93%' }} src={commentIcon} alt="comment-icon" />
            </div>
          </IconButton>

          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>

        </CardActions>

        <div className="commentBox">
          <form onSubmit={makeComment}>
            <input ref={inputRef} onChange={fillCommentText} value={commentText} type="text" placeholder="Add a comment" />
            <div className={commentText.length > 0 ? 'undisabled' : 'disabled'} id="sendicon"> <SendIcon className={classes.sendIcon} /> </div>
          </form>
        </div>

      </div>
  );
}

export default Comment;
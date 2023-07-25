import React, { useContext, useState } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MoreIcon from "@material-ui/icons/MoreVert";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";
import AddIcon from "@material-ui/icons/Add";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import { Button, Divider } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";

import { NavLink, Redirect, useHistory } from "react-router-dom";
import { UserContext, SnackbarContext } from "../App";
import axios from "../helpers/axios";

// Utility Functions
import { debounce } from "../utils/utils";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  toolbar: {
    [theme.breakpoints.down("sm")]: {
      padding: "2px 2px",
    },
  },
  brand: {
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "6px",
    },
  },
  AppBar: {
    backgroundColor: "#ffffff",
    color: "#000000",
    borderBottom: "0.2px solid #e8e8e8",
  },
  MuiButton: {
    textTransform: "none",
    fontWeight: "normal",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },

  userlist: {
    position: "absolute",
    top: "56px",
    width: "100%",
    maxWidth: 362,
    backgroundColor: "#ffffff",
    zIndex: 999,
    boxShadow: "0 1px 6px rgba(32,33,36,.28)",
    borderColor: "rgba(223,225,229,0)",
    [theme.breakpoints.down("sm")]: {
      width: "100vw",
      left: "-56%",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.lightWhite, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.lightWhite, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(2),
      width: "auto",
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: "8px",
      width: "auto",
    },

    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing(4),
      width: 362,
    },
  },

  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    color: "#2b2727;",
    alignItems: "center",
    justifyContent: "center",
  },

  inputRoot: {
    color: "inherit",
  },

  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    width: "100%",
  },

  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  desktopMenu: {
    "& div": {
      minWidth: "156px",
      top: "60px !important",
    },
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [anchorElDesktop, setDesktopAnchorEl] = useState(null);
  const [showuserDiv, setShowuserDiv] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const { state, dispatch } = useContext(UserContext);
  const { handleSnackBar } = useContext(SnackbarContext);
  const history = useHistory();

  const logout = () => {
    localStorage.clear();
    dispatch({ type: "CLEAR" });
    handleDesktopMenuClose();
    history.push("/login");
  };

  const fetchUsers = (email) => {
    axios
      .post("/findusers", { query: email })
      .then((result) => {
        console.log(result.data.users);
        if (result.data.users.length > 0) {
          setUsers(result.data.users);
        }
        if (result.data.users.length === 0) {
          handleSnackBar("No users found", "warning", 2000, { vertical: "bottom", horizontal: "left" });
          setUsers([]);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  // const searchUsers = debounce(fetchUsers(e.target.value), 500);

  const handleSearchUser = (e) => {
    setSearchText(e.target.value);
    if (e.target.value === "") {
      setShowuserDiv(false);
      setUsers([]);
      return;
    }
    setShowuserDiv(true);
    fetchUsers(e.target.value);
  };

  const closeUserDiv = () => {
    setShowuserDiv(false);
    setSearchText("");
  };

  const renderListMobile = () => {
    if (state) {
      return [
        <MenuItem key='11'>
          {" "}
          <IconButton>
            {" "}
            <AccountCircle />{" "}
          </IconButton>{" "}
          <p>
            {" "}
            <NavLink onClick={handleMobileMenuClose} to='/profile'>
              Profile
            </NavLink>{" "}
          </p>{" "}
        </MenuItem>,
        <MenuItem key='12'>
          {" "}
          <IconButton>
            {" "}
            <AddIcon />{" "}
          </IconButton>{" "}
          <p>
            {" "}
            <NavLink onClick={handleMobileMenuClose} to='/createPost'>
              Create Post
            </NavLink>{" "}
          </p>{" "}
        </MenuItem>,
        <MenuItem key='13'>
          {" "}
          <IconButton>
            {" "}
            <InsertPhotoIcon />
          </IconButton>
          <p>
            <NavLink onClick={handleMobileMenuClose} to='/myfollowingposts'>
              My Following Posts
            </NavLink>
          </p>{" "}
        </MenuItem>,
        <MenuItem key='14' onClick={logout}>
          {" "}
          <IconButton>
            {" "}
            <ExitToAppIcon />{" "}
          </IconButton>{" "}
          Logout{" "}
        </MenuItem>,
      ];
    } else {
      return [
        <MenuItem key='15'>
          {" "}
          <IconButton>
            {" "}
            <AccountCircle />{" "}
          </IconButton>{" "}
          <p>
            {" "}
            <NavLink onClick={handleMobileMenuClose} to='/login'>
              Login
            </NavLink>{" "}
          </p>{" "}
        </MenuItem>,
        <MenuItem key='16'>
          {" "}
          <IconButton>
            {" "}
            <AccountBoxIcon />{" "}
          </IconButton>{" "}
          <p>
            {" "}
            <NavLink onClick={handleMobileMenuClose} to='/signup'>
              Signup
            </NavLink>{" "}
          </p>{" "}
        </MenuItem>,
      ];
    }
  };

  const renderListDesktop = () => {
    if (state) {
      return [
        <Button className={classes.MuiButton} key='1'>
          {" "}
          <NavLink to='/profile'>Profile</NavLink>{" "}
        </Button>,
        <Button className={classes.MuiButton} key='2'>
          {" "}
          <NavLink to='/createPost'>Create Post</NavLink>{" "}
        </Button>,
        <Button className={classes.MuiButton} key='6'>
          {" "}
          <NavLink to='/myfollowingposts'>My Following Posts</NavLink>{" "}
        </Button>,
        <div className='flex ptr' onClick={handleDesktopMenuOpen} key='3'>
          <Avatar alt='user-pic' src={state.pic} style={{ marginRight: "6px" }} />
          <span className='user-name'>{state.name}</span>
          <ExpandMoreIcon />
        </div>,
        anchorElDesktop ? menuofDesktop : null,
      ];
    } else {
      return [
        <Button className={classes.MuiButton} key='4'>
          {" "}
          <NavLink to='/login'>Login</NavLink>{" "}
        </Button>,
        <Button className={classes.MuiButton} key='5'>
          {" "}
          <NavLink to='/signup'>Signup</NavLink>{" "}
        </Button>,
      ];
    }
  };

  const handleDesktopMenuOpen = (event) => {
    setDesktopAnchorEl(event.currentTarget);
  };
  const handleDesktopMenuClose = () => {
    setDesktopAnchorEl(null);
  };
  const goToProfile = () => {
    history.push("/profile");
  };

  const menuofDesktop = (
    <Menu
      id='simple-menu'
      className={classes.desktopMenu}
      anchorEl={anchorElDesktop}
      keepMounted
      open={Boolean(anchorElDesktop)}
      onClose={handleDesktopMenuClose}>
      <MenuItem onClick={goToProfile}>Profile</MenuItem>
      <Divider />
      <MenuItem onClick={logout}>
        Log Out&nbsp;
        <ExitToAppIcon />
      </MenuItem>
    </Menu>
  );

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}>
      {renderListMobile()}
    </Menu>
  );

  return (
    <div className={`${classes.grow}`}>
      <AppBar className={classes.AppBar} elevation={4} position='fixed'>
        <Toolbar className={classes.toolbar}>
          <Typography variant='h4' className={`brand-logo ${classes.brand}`}>
            <NavLink to={state ? "/" : "/login"}>Instagram</NavLink>
          </Typography>

          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              style={{ color: "#000", width: "100%" }}
              placeholder='Search User by emails…'
              value={searchText}
              onChange={handleSearchUser}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />

            {showuserDiv && (
              <List className={classes.userlist} dense>
                {users?.map((user) => {
                  return (
                    <NavLink
                      to={state ? (user._id !== state._id ? `/profile/${user._id}` : `/profile`) : `/profile/${user._id}`}
                      onClick={closeUserDiv}
                      key={user._id}>
                      <ListItem key={user._id}>
                        <ListItemAvatar>
                          <Avatar alt={`Avatar n°${user._id}`} src={user.pic} />
                        </ListItemAvatar>
                        <ListItemText id={user._id} primary={user.name} secondary={user.email} />
                      </ListItem>
                    </NavLink>
                  );
                })}
              </List>
            )}
          </div>

          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>{renderListDesktop()}</div>

          <div className={classes.sectionMobile}>
            <IconButton aria-label='show more' aria-controls={mobileMenuId} aria-haspopup='true' onClick={handleMobileMenuOpen} color='inherit'>
              <Avatar alt='user-pic' src={state?.pic} className={classes.small} />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </div>
  );
};

export default Navbar;

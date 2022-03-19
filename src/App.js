import React, {
  createContext,
  useState,
  useReducer,
  useEffect,
  useContext,
} from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import {
  Navbar,
  Home,
  Profile,
  Login,
  Signup,
  CreatePost,
  MyFollowingPosts,
  UserProfile,
  ResetPassword,
  SetNewPassword,
  Comment,
} from "./components";
import SnackBar from "./components/utilityComponents/snackbar";

import { reducer, initialState } from "./reducers/userReducer";
import theme from "./theme";
import { ThemeProvider } from "@material-ui/core/styles";

export const UserContext = createContext();
export const SnackbarContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
      // history.push('/');
    } else {
      history.push("/login");
    }
  }, []);

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/createPost" component={CreatePost} />
      <Route exact path="/profile/:userid" component={UserProfile} />
      <Route exact path="/myfollowingposts" component={MyFollowingPosts} />
      <Route exact path="/reset" component={ResetPassword} />
      <Route exact path="/reset/:token" component={SetNewPassword} />
      <Route exact path="/comment" component={Comment} />
    </Switch>
  );
};

// App Component
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // function to close snackbar,  and to open snackbar just pass open prop in snackbar
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarData((preVal) => {
      return {
        ...preVal,
        open: false,
      };
    });
  };

  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: null,
    type: "info",
    handleClose,
    duration: 4000,
    position: {
      vertical: "bottom",
      horizontal: "center",
    },
  });

  const handleSnackBar = (
    message,
    type,
    duration,
    position = snackbarData.position
  ) => {
    console.log(message, type, duration);
    setSnackbarData((preVal) => {
      return {
        ...preVal,
        open: true,
        message: message,
        type: type,
        duration: duration,
        position: position,
      };
    });
  };

  return (
    <>
      <SnackBar snackbarData={snackbarData} />

      <UserContext.Provider value={{ state, dispatch }}>
        <SnackbarContext.Provider value={{ handleSnackBar }}>
          <ThemeProvider theme={theme}>
            <Router>
              <Navbar />
              <Routing />
            </Router>
          </ThemeProvider>
        </SnackbarContext.Provider>
      </UserContext.Provider>
    </>
  );
}

export default App;

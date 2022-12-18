export const getBaseApiUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return "https://circlefeed-backend.onrender.com";

    // return 'http://localhost:3200'
  } else {
    return "https://circlefeed-backend.onrender.com";
  }
};

// http://localhost:5000
export const cloudinary = {
  apiUrl: "https://api.cloudinary.com/v1_1/kammy/image/upload",
};

// Heroku backend Link:  https://circle-backendapi.herokuapp.com

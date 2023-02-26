import axios from "axios";
import { showAlert } from "./alerts";

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/users/login",
      withCredentials: true,
      data: {
        email,
        password,
      },
    });
    if (res.data.status === "success") {
      document.cookie = `jwt=${res.data.token};expires=${new Date(
        Date.now() + 86400 * 1000
      ).toUTCString()};path=/;`;
      showAlert("success", "Logged in succesfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 500);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:3000/api/v1/users/logout",
      withCredentials: true,
    });
    if (res.data.status === "success") {
      document.cookie = `jwt=;path=/;`;
      showAlert("success", "Logged out succesfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 500);
    }
  } catch (err) {
    // console.log(err);
    showAlert("error", "Error logging out! Try again");
  }
};
// const res = await fetch("http://127.0.0.1:3000/api/v1/users/login", {
//   method: "POST",
//   credentials: "include",
//   headers: {
//     "Content-Type": "application/jsopn",
//   },
//   body: JSON.stringify({
//     email,
//     password,
//   }),
// });
// console.log(res);
// const data = await res.json();
// console.log(data);

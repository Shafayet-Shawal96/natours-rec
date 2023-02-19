/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "http://127.0.0.1:3000/api/v1/users/updateMyPassword"
        : "http://127.0.0.1:3000/api/v1/users/updateMe";
    const res = await axios({
      method: "PATCH",
      url,
      headers: { Authorization: `Bearer ${document.cookie.slice(4)}` },
      withCredentials: true,
      data,
    });

    if (res.data.status === "success") {
      document.cookie = `jwt=${res.data.token};expires=${new Date(
        Date.now() + 86400 * 1000
      ).toUTCString()};path=/;`;
      showAlert("success", `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

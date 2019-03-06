import axios from "axios";
import { VERIFY_ADMIN } from "./types";

const { REACT_APP_BACKEND_URL } = process.env;

export const verifyAdmin = () => async dispatch => {
  const res = await axios
    .get(REACT_APP_BACKEND_URL + "/api/current_user")
    .catch(err => console.log(err));

  let username = null;
  if (res) {
    username = res.data.username;
  }

  dispatch({
    type: VERIFY_ADMIN,
    payload: { username }
  });
};

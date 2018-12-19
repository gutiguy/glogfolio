import axios from "axios";
import { VERIFY_ADMIN } from "./types";

export const verifyAdmin = () => async dispatch => {
  let verified = false;
  const res = await axios
    .get("api/current_user")
    .catch(err => console.log(err));
  if (typeof res === "undefined") {
    console.log(
      "Unable to verify user for internal server reasons, please try again soon"
    );
  } else if (res.status === 200) {
    verified = true;
  }
  dispatch({ type: VERIFY_ADMIN, payload: { verified } });
};

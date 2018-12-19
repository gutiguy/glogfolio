import axios from "axios";
import { LOAD_CATEGORIES } from "./types";

export const loadCategories = ({
  normalize = false
} = {}) => async dispatch => {
  const request = await axios.get("api/categories?normalize=" + normalize);
  if (request.status === 200) {
    dispatch({
      type: LOAD_CATEGORIES,
      payload: request.data.categories
    });
  } else {
    console.log("Problem loading categories");
  }
};

export const changeCategories = newTree => async dispatch => {
  dispatch({ type: LOAD_CATEGORIES, payload: newTree });
};

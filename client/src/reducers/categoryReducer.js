import { LOAD_CATEGORIES } from "../actions/types";

const initialState = {
  categoryTree: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_CATEGORIES:
      return {
        ...state,
        categoryTree: action.payload
      };
    default:
      return state;
  }
};

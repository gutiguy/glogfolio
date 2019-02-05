import { VERIFY_ADMIN } from "../actions/types";

const initialState = {
  username: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case VERIFY_ADMIN:
      return {
        ...state,
        username: action.payload.username
      };
    default:
      return state;
  }
};

import { VERIFY_ADMIN } from "../actions/types";

const initialState = {
  isVerified: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case VERIFY_ADMIN:
      return {
        ...state,
        isVerified: action.payload.verified
      };
    default:
      return state;
  }
};

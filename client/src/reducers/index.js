import { combineReducers } from "redux";
import adminReducer from "./adminReducer";
import categoryReducer from "./categoryReducer";

export default combineReducers({
  admin: adminReducer,
  category: categoryReducer
});

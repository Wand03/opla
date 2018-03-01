import createReducer from "zoapp-front/reducers/createReducer";
import {
  FETCH_REQUEST,
  FETCH_SUCCESS,
} from "zoapp-front/actions/constants";

import { API_GETMETRICS } from "../actions/constants";


export const initialState = {
  metrics: null,
};

export default createReducer(initialState, {
  [API_GETMETRICS + FETCH_REQUEST]: () => ({ ...initialState }),
  [API_GETMETRICS + FETCH_SUCCESS]: (state, { metrics }) => ({
    ...state,
    metrics,
  }),
});

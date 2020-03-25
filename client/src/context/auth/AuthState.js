import React, { useReducer } from "react";
import axios from "axios";
import AuthContext from "./authContext";
import authReducer from "./authReducer";
import setAuthToken from "../../utils/setAuthToken";
import ContextDevTool from "react-context-devtool";

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS
} from "../types";

const AuthState = props => {
  const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    error: null,
    user: null
  };
  const [state, dispatch] = useReducer(authReducer, initialState);

  //  load user
  const loadUser = async () => {
    // @todo - load token into global headers
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    try {
      const res = await axios.get("/api/auth");

      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    } catch (error) {
      dispatch({
        type: AUTH_ERROR
      });
    }
  };
  // Register User
  const register = async FormData => {
    // Since we are using post method we need to pass some headers
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    try {
      const res = await axios.post("/api/users", FormData, config);
      // If everything goes okay
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });
      loadUser();
    } catch (error) {
      // if some error occurs
      dispatch({
        type: REGISTER_FAIL,
        payload: error.response.data.msg
      });
    }
  };
  // Login user
  const login = async FormData => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    try {
      const res = await axios.post("/api/auth", FormData, config);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
      loadUser();
    } catch (error) {
      dispatch({
        type: LOGIN_FAIL,
        payload: error.response.data.msg
      });
    }
  };
  // Logout
  const logout = () => {
    dispatch({ type: LOGOUT });
  };
  // Clear Errors
  const clearErrors = () => {
    dispatch({
      type: CLEAR_ERRORS
    });
  };
  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        loadUser,
        clearErrors
      }}
    >
      <ContextDevTool
        context={AuthContext}
        id='uniqContextId'
        displayName='Context Display Name'
      />
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthState;

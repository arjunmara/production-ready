import React, { useReducer } from "react";
import uuid from "uuid";
import AlertContext from "./alertContext";
import alertReducer from "./alertReducer";
import ContextDevTool from "react-context-devtool";

import { SHOW_ALERT, REMOVE_ALERT } from "../types";

const AlertState = props => {
  const initialState = [];
  const [state, dispatch] = useReducer(alertReducer, initialState);

  //  Set alert
  const setAlert = (msg, type, timeout = 5000) => {
    const id = uuid.v4();
    dispatch({
      type: SHOW_ALERT,
      payload: { msg, type, id }
    });
    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
  };

  return (
    <AlertContext.Provider
      value={{
        alerts: state,
        setAlert
      }}
    >
      <ContextDevTool
        context={AlertContext}
        id='uniqContextId'
        displayName='Alert Context'
      />
      {props.children}
    </AlertContext.Provider>
  );
};
export default AlertState;

import { createContext, useReducer, useContext } from "react";

export const initialState = {
  activeWalletKey: null,
};

const appReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_ACTIVE_WALLET_KEY":
      console.trace("SET_ACTIVE_WALLET_KEY", payload);

      return {
        ...state,
        activeWalletKey: payload.key
      };
    case "UNSET_ACTIVE_WALLET_KEY":
      console.trace("UNSET_ACTIVE_WALLET_KEY", payload);

      return {
        ...state,
        activeWalletKey: null
      };
    default:
      throw new Error(`No case for type ${type} found in appReducer.`);
  }
};

const AppContext = createContext(initialState);

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setActiveWalletKey = (key: string) => {
    dispatch({
      type: "SET_ACTIVE_WALLET_KEY",
      payload: { key }
    });
  };

  const unsetActiveWalletKey = () => {
    dispatch({
      type: "UNSET_ACTIVE_WALLET_KEY",
      payload: {}
    });
  };

  const value = {
    activeWalletKey: state.activeWalletKey,
    setActiveWalletKey,
    unsetActiveWalletKey,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useApp = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useApp must be used within AppContext");
  }

  return context;
};

export default useApp;

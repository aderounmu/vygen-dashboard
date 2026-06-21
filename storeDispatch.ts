import { Action } from "./context/Store";

type Dispatch = React.Dispatch<Action>;

let _dispatch: Dispatch | null = null;

export const setStoreDispatch = (dispatch: Dispatch) => {
  _dispatch = dispatch;
};

export const storeDispatch = (action: Action) => {
  _dispatch?.(action);
};

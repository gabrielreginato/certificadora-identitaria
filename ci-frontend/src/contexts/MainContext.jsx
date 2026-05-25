import { useReducer, useContext, useEffect, createContext } from "react";

const initialState = {
  oficinas: [],
  page: 0,
  titleParam: "",
  token: "",
  role: "",
  headerSnackbar: {
    isOpen: false,
    message: "No results",
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_OFICINAS":
      return { ...state, oficinas: action.payload };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_TITLE_PARAM":
      return { ...state, titleParam: `&title=${action.payload}` };
    case "SET_TOKEN":
      return { ...state, token: action.payload };
    case "SET_ROLE":
      return { ...state, role: action.payload };
    case "SET_HEADER_SNACKBAR":
      return { ...state, headerSnackbar: action.payload };
    default:
      return state;
  }
}

const PageContext = createContext();

export function PageProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function getOficinas() {
      fetch(`http://localhost:3000/oficinas?titulo=${state.titleParam}`)
        .then((res) => res.json())
        .then((res) => {
          dispatch({ type: "SET_OFICINAS", payload: res });
          //console.log(res)
        });
    }
    getOficinas();
    window.scrollTo(0, 0);
  }, [state.page, state.titleParam]);

  return (
    <PageContext.Provider value={{ state, dispatch }}>
      {children}
    </PageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePageContext = () => useContext(PageContext);

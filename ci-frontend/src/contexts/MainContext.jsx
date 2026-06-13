import { useReducer, useContext, useEffect, createContext } from "react";

const initialState = {
  oficinas: [],
  page: 0,
  titleParam: "",
  headerSnackbar: {
    isOpen: false,
    message: "No results",
  },
  accountData: {
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    name: localStorage.getItem("name") || null,
    email: localStorage.getItem("email") || null,
    usuarioId: localStorage.getItem("usuarioId") || null,
    perfilId: localStorage.getItem("perfilId") || null,
    ra: localStorage.getItem("ra") || null,
  },
  oficinasVinculadas: [],
  isUpdating: false,
  selectedOficina: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_OFICINAS":
      return { ...state, oficinas: action.payload };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_TITLE_PARAM":
      return { ...state, titleParam: action.payload };
    case "SET_ACCOUNT_DATA":
      return { ...state, accountData: action.payload };
    case "SET_HEADER_SNACKBAR":
      return { ...state, headerSnackbar: action.payload };
    case "SET_OFICINAS_VINCULADAS":
      return { ...state, oficinasVinculadas: action.payload };
    case "SET_IS_UPDATING":
      return { ...state, isUpdating: action.payload };
    case "SET_SELECTED_OFICINA":
      return { ...state, selectedOficina: action.payload };
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
          console.log(res);
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

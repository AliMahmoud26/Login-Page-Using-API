import { useEffect, useReducer } from "react";
import axios from "axios";

const initialState = {
  email: '',
  password: '',
  token: '',
  message: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_EMAIL':
      return {...state, email: action.payload};
    case 'SET_PASSWORD':
      return {...state, password: action.payload};
    case 'SET_TOKEN':
      return {...state, token: action.payload};
    case 'SET_MESSAGE':
      return {...state, message: action.payload}
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (state.token) {
      localStorage.setItem("token", state.token); // Save token to local storage
    } else {
      localStorage.removeItem("token"); // Remove token from local storage on logout
    }
  }, [state.token]);


  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', state.email)
    formData.append('password', state.password)
    
    try {
      const response = await axios.post(
        "https://backend.profferdeals.com/api/admin/login", formData, {
          headers: {
            Accept: 'application/json',
          },
        }
      );
  
      if (response.status === 200) {
        const data = response.data;
        dispatch({type: 'SET_TOKEN', payload: data.token});
        dispatch({type: 'SET_MESSAGE', payload: 'Welcome Back Again'});
        localStorage.setItem('email', state.email);
      } else {
        dispatch({
          type: 'SET_MESSAGE',
          payload: 'Login failed, please check your credentials',
        });
      }
    } catch(error) {
      console.error('Error during login:', error.response?.data || error.message);
      dispatch({
        type: 'SET_MESSAGE',
        payload: 'An error occured, please try again later',
      });
    }
  }

  function handleLogout() {
    dispatch({type: 'LOGOUT'});
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  }

  return (
    <>
      {state.token ? (
        <div className="welcome-message">
          <h1>{state.message}</h1>
          <button className="wel-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="sign-up-form">
          <h2>Welcome Back</h2>
          <form onSubmit={handleSubmit} method="POST">
            <div className="email">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter Your Email"
                value={state.email}
                onChange={(e) =>
                  dispatch({ type: "SET_EMAIL", payload: e.target.value })
                }
                required
              />
            </div>

            <div className="password">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter Your Password"
                value={state.password}
                onChange={(e) =>
                  dispatch({ type: "SET_PASSWORD", payload: e.target.value })
                }
                required
              />
            </div>
            <button style={{ marginBottom: "1rem" }} type="submit" className="btn">
              Login
            </button>
          </form>

          {state.message && <p>{state.message}</p>}
        </div>
      )}
    </>
  );
}

export default App

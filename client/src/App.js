import './App.css';
import {BrowserRouter as Router , Route , Routes , Link} from "react-router-dom";
import Home from "./pages/Home"
import CreatePost from './pages/CreatePost';
import Post from "./pages/Post";
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthContext } from './helpers/AuthContext';
import { useState  , useEffect} from 'react';
import axios from 'axios';


function App() {
  const [authState , setAuthState] = useState({
      userName : "" ,
      id : 0,
      status : false,
    })

  useEffect(()=>{
    axios.get("http://localhost:3001/auth/auth" , {headers : {
      accessToken : localStorage.getItem("accessToken"),
    }}).then((response)=>{
      if(response.data.error){
        setAuthState({...authState , status : false});
      }
      else{
      setAuthState({
        userName : response.data.userName ,
        id : response.data.id,
        status : true,
      });
      }
    })
  } , []);

  const logout = () =>{
    localStorage.removeItem("accessToken");
    setAuthState({
      userName : "" ,
      id : 0,
      status : false,
    });
  }

  return (
    <div className='App'>
      <AuthContext.Provider value = {{authState , setAuthState}}>
      <Router>
        <div className="navbar">
          {
            !authState.status ? (
              <>
                <Link to = "/login">Login</Link>
                <Link to = "/register">Register</Link>
              </>
            ) : 
            (
              <>
              <Link to = "/createpost">Create a Post</Link>
              <Link to = "/">Home Page</Link>
              </>
            )
          }
          <div className="loggedInContainer">
            {authState.status && <h1>{authState.userName}</h1>}
            {authState.status && <button onClick={logout}>Logout</button>}
          </div>
        </div>
        
        <Routes>
          <Route path = "/" exact Component={Home}></Route>
          <Route path = "/createpost"  Component={CreatePost}></Route>
          <Route path = "/post/:id"  Component={Post}></Route>
          <Route path = "/login"  Component={Login}></Route>
          <Route path = "/register"  Component={Register}></Route>
          

        </Routes>
      </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;

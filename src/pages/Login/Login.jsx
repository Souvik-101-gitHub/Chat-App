import React, { useState } from 'react'
import './Login.css'
import { signup, login, resetPass } from '../../config/firebase';
import assets from '../../assets/assets'

function Login() {

  const [currState, setCurrState] = useState("Sign up");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password,setPassword] = useState("");

  const onSubmitHandler = (event) =>{
    event.preventDefault();

    if(currState === "Sign up"){
      signup(userName,email,password)
    } else {
      login(email,password)
    }
  }

  return (
    <div className="login">
    <img src={assets.chat_logo01} alt="" className='logo' /> 

      <div className={`container ${currState === "Sign up" ? "right-panel-active" : ""}`}>

        {/* SIGN IN */}
        <div className="form-container sign-in-container">
          <form onSubmit={onSubmitHandler}>
            <h2>Sign In</h2>

            <input
              type="email"
              placeholder="Email"
              className="form-input"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="form-input"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />

            <button type="submit">Sign In</button>

            <p className="switch-text">
              Don’t have an account?
              <span onClick={()=>setCurrState("Sign up")}> Sign Up</span>
            </p>
            {currState === "Login"? <p className='switch-text'>Forgot password? <span onClick={()=>resetPass(email)}>reset here</span></p> : null }
          </form>
        </div>

        {/* SIGN UP */}
        <div className="form-container sign-up-container">
          <form onSubmit={onSubmitHandler}>
            <h2>Create Account</h2>

            <input
              type="text"
              placeholder="Username"
              className="form-input"
              value={userName}
              onChange={(e)=>setUserName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="form-input"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="form-input"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />

            <button type="submit">Sign Up</button>
            <br />
            <div className="login-term">
              <input type="checkbox" />
              <p>Agree to the terms og use & privacy policy</p>
            </div>
                     

            <p className="switch-text">
              Already have an account?
              <span onClick={()=>setCurrState("Login")}> Sign In</span>
            </p>
          </form>
        </div>

        {/* OVERLAY */}
        <div className="overlay-container">
          <div className="overlay">

            <div className="overlay-panel overlay-left">
              <h2>Welcome Back!</h2>
              <p>To keep connected with us please login</p>
              <button className="ghost" onClick={()=>setCurrState("Login")}>
                Sign In
              </button>
            </div>

            <div className="overlay-panel overlay-right">
              <h2>Hello, Friend!</h2>
              <p>Enter your details and start journey with us</p>
              <button className="ghost" onClick={()=>setCurrState("Sign up")}>
                Sign Up
              </button>
              
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Login;



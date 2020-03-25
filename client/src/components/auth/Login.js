import React, { useState, useContext, useEffect } from "react";
import AlertContext from "../../context/alert/alertContext";
import AuthContext from "../../context/auth/authContext";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";

const Login = props => {
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);
  const { setAlert } = alertContext;
  const { login, error, clearErrors, isAuthenticated } = authContext;

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/");
    }
    if (error === "Invalid Credentials") {
      setAlert(error, "danger");
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);
  const [user, setUser] = useState({
    email: "",
    password: ""
  });
  const { email, password } = user;
  const onChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const onSubmit = e => {
    e.preventDefault();
    if (email === "" || password === "") {
      setAlert("Please Enter Your Login Credentials", "danger");
    } else {
      login({
        email,
        password
      });
    }
  };
  return (
    <Container maxWidth='sm'>
      <h1>
        Account <span className='text-primary'>Login</span>
      </h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          {/* <label htmlFor='email'>Email</label> */}
          {/* <input
            type='email'
            name='email'
            id=''
            value={email}
            onChange={onChange}
            required
          /> */}
          <TextField
            id='standard-basic'
            label='Email'
            type='email'
            name='email'
            value={email}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          {/* <input
            type='password'
            name='password'
            id=''
            value={password}
            onChange={onChange}
            
          /> */}

          <TextField
            id='standard-basic'
            label='Password'
            type='password'
            name='password'
            value={password}
            onChange={onChange}
          />
        </div>
        <input type='submit' variant='contained' color='primary' />
      </form>
    </Container>
  );
};

export default Login;

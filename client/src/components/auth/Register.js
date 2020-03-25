import React, { useState, useContext, useEffect } from "react";
import AlertContext from "../../context/alert/alertContext";
import AuthContext from "../../context/auth/authContext";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";

const Register = props => {
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);
  const { setAlert } = alertContext;
  const { register, error, clearErrors, isAuthenticated } = authContext;

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/");
    }
    if (error === "User Already exists") {
      setAlert(error, "danger");
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });
  const { name, email, password, password2 } = user;
  const onChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const onSubmit = e => {
    e.preventDefault();
    if (name === "" || email === "" || password === "") {
      setAlert("please Enter all fields", "danger");
    } else if (password !== password2) {
      setAlert("passwords do not match");
    } else {
      register({
        name,
        email,
        password
      });
    }
  };
  return (
    <Container maxWidth='sm'>
      <h1>
        Account <span className='text-primary'>Register</span>
      </h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <TextField
            id='standard-basic'
            label='Enter Name'
            type='text'
            name='name'
            value={name}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <TextField
            id='standard-basic'
            label='Enter Email'
            type='email'
            name='email'
            value={email}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <TextField
            id='standard-basic'
            label='Enter Password'
            type='password'
            name='password'
            value={password}
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <TextField
            id='standard-basic'
            label='Confirm Password'
            type='password'
            name='password2'
            value={password2}
            onChange={onChange}
          />
        </div>
        <input
          type='submit'
          value='Register'
          className='btn btn-primary btn-block'
        />
      </form>
    </Container>
  );
};
export default Register;

import isEmail from "validator/lib/isEmail";
import passwordValidator from "password-validator";
import store from "../store/configureStore";
import { setAlert, clearAlert } from "../actions/alert";
import { setUsername, setToken, deleteToken } from "../actions/user";
import { Connect } from "../actions/notification";
import authHeader from "../helpers/authHeader";
const validate = (username, email, password, repassword) => {
  if (!validateUsername(username)) {
    store.dispatch(
      setAlert(
        "Account coudn't be created!",
        "Username should have between 6 and 32 characters without spaces"
      )
    );
    return false;
  }

  if (!validateEmail(email)) {
    store.dispatch(
      setAlert("Account coudn't be created!", "Email is not valid")
    );
    return false;
  }

  if (!validatePassword(password, repassword)) {
    store.dispatch(
      setAlert(
        "Account coudn't be created!",
        "password should have between 6 and 32 characters without spaces, with at least one digit,one uppercase and one lowercase character"
      )
    );

    return false;
  }
  return true;
};

const validateEmail = email => {
  return isEmail(email);
};

const validateUsername = username => {
  const schema = new passwordValidator();
  schema
    .is()
    .min(6)
    .is()
    .max(32)
    .has()
    .not()
    .spaces();
  return schema.validate(username);
};

const validatePassword = (password, repassword) => {
  const schema = new passwordValidator();
  schema
    .is()
    .min(8) // Minimum length 8
    .is()
    .max(32) // Maximum length 32
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits() // Must have digits
    .has()
    .not()
    .spaces();

  return schema.validate(password) && password === repassword;
};

const validateLogin = (username, password) => {
  if (!validateUsername(username)) {
    store.dispatch(
      setAlert(
        "Username not valid!",
        "Username should have between 6 and 32 characters without spaces"
      )
    );
    return false;
  }

  if (!validatePassword(password, password)) {
    store.dispatch(
      setAlert(
        "Password not valid!",
        "password should have between 6 and 32 characters without spaces, with at least one digit,one uppercase and one lowercase character"
      )
    );
    return false;
  }
  return true;
};

const createAcount = async (username, email, password, repassword) => {
  if (!validate(username, email, password, repassword)) return;
  const formData = new FormData();
  formData.append("username", username);
  formData.append("email", email);
  formData.append("password", password);

  store.dispatch(clearAlert());
  //   this.setState((state, props) => ({ loading: true }));
  return await fetch("api/user/create", { method: "POST", body: formData })
    .then(res => {
      if (res.status === 200) return res.json();
      store.dispatch(
        setAlert("Account coudn't be created!", "Username alredy exists!")
      );
      throw new Error("Account creation failed");
    })
    .then(data => {
      store.dispatch(setToken(data.token));
      store.dispatch(setUsername(data.username));
      store.dispatch(Connect());

      return true;
    })
    .catch(er => console.log(er));
};

const loginSubmit = async (username, password) => {
  if (!validateLogin(username, password)) return;
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  store.dispatch(clearAlert());
  let result = await fetch("api/user/login", { method: "POST", body: formData })
    .then(res => {
      if (res.status === 200) return res.json();
      store.dispatch(setAlert("Couldn't login", "Login failed!"));
      throw new Error("Login failed");
    })
    .then(data => {
      store.dispatch(setToken(data.token));
      store.dispatch(setUsername(data.username));
      store.dispatch(Connect());
      return true;
    })
    .catch(er => console.log(er));
  return result;
};

const reconnect = () => {
  const token = authHeader();
  if (token) {
    fetch("api/user/reconnect", {
      method: "POST",
      headers: {
        ...token
      }
    })
      .then(res => {
        if (res.status === 200) return res.json();
        store.dispatch(deleteToken());
        throw new Error("reconnect failed");
      })
      .then(data => {
        store.dispatch(setUsername(data.username));
        store.dispatch(Connect());
      })
      .catch(er => console.log(er));
  }
};

export { createAcount, loginSubmit, reconnect };
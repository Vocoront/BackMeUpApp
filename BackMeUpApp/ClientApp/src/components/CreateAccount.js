import React from "react";

const CreateAccount = props => {
  return (
    <div>
      <div className="login">
        Username <input type="text" placeholder="Enter username" />
        Email <input type="email" placeholder="Enter email"/>
        Password <input type="password" placeholder="Enter password" />
        Confirm Password <input type="password" placeholder="Confirm password" />
        <div className="login--btn create-account--btn">
          Create Account
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;

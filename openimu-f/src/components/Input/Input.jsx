import React from "react";
import { FormattedMessage } from "react-intl";
import "./Input.css";

const Input = ({ error, name, register, label, unit }) => {
  return (
    <div>
      <div className="container">
        <label for={name}>
          <FormattedMessage id={label} />
        </label>
        <div className="inputContainer">
          <div className="childContainer">
            <input
              className={error ? "error" : ""}
              type="text"
              id={name}
              {...register(name)}
            />
            <div className="unitContainer">{!!unit ? unit : "  "}</div>
          </div>
          {error && <div className="errorMsg">{error.message}</div>}
        </div>
      </div>
    </div>
  );
};

export default Input;

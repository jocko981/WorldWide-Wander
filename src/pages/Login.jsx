import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Login.module.css";

import { useAuthContext } from "../contexts/AuthContext";

import PageNav from "../components/PageNav";
import Button from "../components/Button";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("jovannikolic17@gmail.com");
  const [password, setPassword] = useState("test");
  const { login, hasAuth } = useAuthContext();
  const navigate = useNavigate();
  //TODO: nav na logo sa /app na main page, display login button resi, error msg za fake login

  useEffect(
    function () {
      if (hasAuth) {
        navigate("/app", { replace: true });
        //page /login is removed from history stack with this
      }
    },
    [hasAuth, navigate]
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (email && password) {
      login(email, password);
    }
  }

  return (
    <main className={styles.login}>
      <PageNav />

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input type="email" id="email" value={email} />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} />
        </div>

        <div>
          <Button type="primary">Login</Button>
        </div>
      </form>
    </main>
  );
}

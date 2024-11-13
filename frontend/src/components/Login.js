// src/components/Login.js

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/posts");  // Redireciona para a página de posts após login
    } catch (err) {
      setError("Login ou senha incorretos. Tente novamente.");
    }
  };

  return (
    <div className={styles.container}>
      <h1>LOGIN</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          className={styles.inputField}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          className={styles.inputField}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
        />
        {error && <p className={styles.errorMessage}>{error}</p>}
        <div className={styles.submitButtonContainer}>
          <button type="submit" className={styles.submitButton}>Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;

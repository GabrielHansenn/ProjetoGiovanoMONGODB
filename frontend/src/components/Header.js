// src/components/Header.js

import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from './Header.module.css';
import logo from '../assets/logo.png';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.navbar}>
        <div className={styles.logoTitle}>
          <Link to="/" className={styles.logoTitleLink}>
            <h1>BuzzWave</h1>
          </Link>
          <img src={logo} alt="BuzzWave logo" className={styles.logo} />
        </div>
        <nav>
          <ul>
            <li>
              <Link to="/posts">Posts</Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link to="/create-post">Criar Post</Link>
                </li>
                <li>
                  <button onClick={logout} className={styles.logoutButton}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

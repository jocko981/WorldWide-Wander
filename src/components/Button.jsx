import styles from "./Button.module.css";

function Button({ children, onClick, type }) {
  return (
    <button className={`${styles.btn}${type ? ` ${styles[type]}` : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;

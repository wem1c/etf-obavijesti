import { useRef, useState } from "react";

import styles from "./Subscribe.module.css";

const Subscribe = () => {
  const inputEl = useRef(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("Zahtjev poslat. Čekam odgovor... ⌛");

    const res = await fetch("https://etf-obavijesti.vercel.app/api/subscribe", {
      body: JSON.stringify({
        email: inputEl.current.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const { error } = await res.json();

    if (error) {
      setMessage(`Error: ${error} 🛑`);
      return;
    }

    inputEl.current.value = "";
    setMessage("Dobićete potvrdni email na unijetoj adresi! ✅");
  };

  return (
    <section className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor='email-input' className={styles.label}>
          {"Email Adresa"}
        </label>
        <input
          id='email-input'
          name='email'
          placeholder='petar@email.com'
          ref={inputEl}
          required
          type='email'
        />
        <p className={styles.statusMessage}>
          <em>{message ? message : ``}</em>
        </p>
        <button className={styles.button} type='submit'>
          {"Pretplati se 💌"}
        </button>
      </form>
    </section>
  );
};

export default Subscribe;

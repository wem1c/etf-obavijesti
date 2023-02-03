import { useRef, useState } from "react";

const Subscribe = () => {
  const inputEl = useRef(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/subscribe", {
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
      setMessage(error);
      return;
    }

    inputEl.current.value = "";
    setMessage("Success! 🎉 You are now subscribed to the newsletter.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor='email-input'>{"Email Address"}</label>
      <input
        id='email-input'
        name='email'
        placeholder='you@awesome.com'
        ref={inputEl}
        required
        type='email'
      />
      <div>
        {message
          ? message
          : `I'll only send emails when new content is posted. No spam.`}
      </div>
      <button type='submit'>{"Subscribe 💌"}</button>
    </form>
  );
};

export default Subscribe;

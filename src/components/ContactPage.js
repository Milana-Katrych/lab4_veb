import { useState } from 'react';

function ContactPage() {
  const [notification, setNotification] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setNotification("Your message has been sent! We'll get back to you soon 😊");
    e.target.reset();
    setTimeout(() => setNotification(''), 5000);
  };

  return (
    <div>
      <h2>About us and contacts</h2>
      <p>Hey 👋 We're ApartLive, and we're here to make renting an apartment feel less like a chore and more like an adventure.</p>
      <p>Based in Lviv (Ukraine), we connect cool people with even cooler places to stay — from chill weekend getaways to long-term cozy corners.</p>
      <p>Whether you're a student, a traveler, or just need a break from your parents (we get it 😅), we've got you.</p>
      <p>What makes us different?</p>
      <p>✨ Easy booking</p>
      <p>🗝️ Safe, comfy spaces</p>
      <p>📍Top locations</p>
      <p>💬 Friendly support that actually replies</p>
      <p>We're not just a rental service. We're your next chapter.</p>
      <img src="Photos/собачка2.webp"></img>
      <form onSubmit={handleSubmit}>
        <label>Your name:</label>
        <input type="text" required />
        <label>Your e-mail:</label>
        <input type="email" required />
        <label>Your message:</label>
        <textarea required></textarea>
        <button type="submit">Submit</button>
      </form>
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
}

export default ContactPage;
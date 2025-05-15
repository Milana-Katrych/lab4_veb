import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateEmail, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth, db } from '../firebase';

function ProfilePage() {
  const user = auth.currentUser;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(user ? user.email : '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setEmail(userData.email || user.email);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotification('');

    try {
      if (email !== user.email) {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);

        await updateEmail(user, email);
      }

      await updateDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
      });

      setNotification('Profile updated successfully!');
      setTimeout(() => setNotification(''), 5000);
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) {
    return <div className="no-apartments">Please log in to view your profile.</div>;
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Your Profile</h2>
        <label>First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <label>Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password (required to change email):</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your current password"
          required
        />
        <button type="submit" className="auth-button">Update Profile</button>
        {error && <p className="auth-error">{error}</p>}
        {notification && <p className="auth-notification">{notification}</p>}
      </form>
    </div>
  );
}

export default ProfilePage;
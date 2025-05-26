import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setNotification('Successfully logged in!');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await setDoc(doc(db, 'users', user.uid), {
          firstName,
          lastName,
          email,
        });

        setNotification('Account created successfully!');
      }
      setTimeout(() => setNotification(''), 5000);
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {!isLogin && (
          <>
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
          </>
        )}
        <button type="submit" className={`auth-button ${isLogin ? 'login' : 'register'}`}>
          {isLogin ? 'Login' : 'Register'}
        </button>
        <p>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            className="auth-toggle"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setNotification('');
            }}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
        {error && <p className="auth-error">{error}</p>}
        {notification && <p className="auth-notification">{notification}</p>}
      </form>
    </div>
  );
}

export default AuthPage;
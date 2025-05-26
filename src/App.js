import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc, updateDoc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import AvailableApartments from './components/AvailableApartments';
import BookedApartmentsList from './components/BookedApartmentsList';
import ContactPage from './components/ContactPage';
import AuthPage from './components/AuthPage';
import ProfilePage from './components/ProfilePage';
import './App.css';

function App() {
  const [apartments, setApartments] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchApartments = async () => {
      const querySnapshot = await getDocs(collection(db, 'aparts'));
      const apartmentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setApartments(apartmentsData);
    };
    fetchApartments();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setApartments((prev) =>
          prev.map((apt) => ({ ...apt, booked: false }))
        );
      }
    });
    return () => unsubscribe();
  }, []);

  const handleBook = async (index) => {
    if (!user) {
      alert('Please log in to book an apartment.');
      return;
    }
    const apartmentId = apartments[index].id;
    const apartmentRef = doc(db, 'aparts', apartmentId);

    await setDoc(doc(db, `users/${user.uid}/bookings`, apartmentId), {
      apartmentId,
      timestamp: new Date(),
    });

    setApartments((prev) =>
      prev.map((apt, i) =>
        i === index ? { ...apt, booked: true } : apt
      )
    );
  };

  const handleCancel = async (index) => {
    if (!user) {
      alert('Please log in to cancel a booking.');
      return;
    }
    const apartmentId = apartments[index].id;
    const bookingRef = doc(db, `users/${user.uid}/bookings`, apartmentId);

    await deleteDoc(bookingRef);

    setApartments((prev) =>
      prev.map((apt, i) =>
        i === index ? { ...apt, booked: false } : apt
      )
    );
  };

  return (
    <BrowserRouter>
      <header>
        <h1>ApartLive</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/bookings">My bookings</Link>
            </li>
            <li>
              <Link to="/contact">Contact us</Link>
            </li>
            {user && (
              <li>
                <Link to="/profile">Profile</Link>
              </li>
            )}
            <li>
              {user ? (
                <button className="auth-button" onClick={() => auth.signOut()}>Logout</button>
              ) : (
                <Link to="/auth">Login/Register</Link>
              )}
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<AvailableApartments apartments={apartments} onBook={handleBook} />} />
          <Route path="/bookings" element={<BookedApartmentsList apartments={apartments} onCancel={handleCancel} />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
      <footer>
        <p>phone: +380999999999</p>
        <p>e-mail: nine9@gmail.com</p>
      </footer>
    </BrowserRouter>
  );
}

export default App;
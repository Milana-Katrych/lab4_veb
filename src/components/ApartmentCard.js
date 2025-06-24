import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Timestamp } from 'firebase/firestore';

function ApartmentCard({ apt, index, onBook, onCancel, isBooked }) {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, `reviews/${apt.id}/review_id`), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const reviewsData = querySnapshot.docs.map((docSnap) => {
          const reviewData = docSnap.data();
          return {
            ...reviewData,
            firstName: reviewData.firstName || 'Unknown',
            lastName: reviewData.lastName || '',
          };
        });
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    if (apt.id) fetchReviews();
  }, [apt.id]);

  const handlePrev = () => {
    setCurrentPhoto((prev) => (prev === 0 ? apt.photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentPhoto((prev) => (prev === apt.photos.length - 1 ? 0 : prev + 1));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to leave a review.');
      console.error('User not authenticated:', user);
      return;
    }
    if (!isBooked) {
      alert('You can only leave a review for booked apartments.');
      return;
    }
    if (!reviewText.trim()) {
      alert('Review text cannot be empty.');
      return;
    }
    try {
      console.log('User:', user.uid, 'Attempting to add review for apartment:', apt.id);
      const reviewRef = collection(db, `reviews/${apt.id}/review_id`);
      console.log('Review ref created:', reviewRef.path);
      console.log('Auth state:', auth.currentUser);

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : { firstName: 'Unknown', lastName: '' };

      const docRef = await addDoc(reviewRef, {
        userId: user.uid,
        text: reviewText,
        timestamp: Timestamp.fromDate(new Date()), // Store as Firestore Timestamp
        firstName: userData.firstName || 'Unknown',
        lastName: userData.lastName || '',
      });

      console.log('Review added with ID:', docRef.id);
      setReviewText('');
      const q = query(collection(db, `reviews/${apt.id}/review_id`), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const reviewsData = querySnapshot.docs.map((docSnap) => {
        const reviewData = docSnap.data();
        return {
          ...reviewData,
          firstName: reviewData.firstName || 'Unknown',
          lastName: reviewData.lastName || '',
        };
      });
      setReviews(reviewsData);
    } catch (err) {
      console.error('Error adding review:', err);
      alert('Failed to add review: ' + err.message);
    }
  };

  const getFormattedDate = (timestamp) => {
    if (!timestamp) return 'No date';
    let date;
    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else if (typeof timestamp === 'object' && 'seconds' in timestamp) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      console.warn('Invalid timestamp format:', timestamp);
      return 'Invalid date';
    }
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="apartment-move">
      <div className="apart-photos">
        <div className="photo">
          <img
            src={apt.photos[currentPhoto]}
            alt={`${apt.name} ${currentPhoto + 1}`}
          />
          <button className="prev" onClick={handlePrev}>
            ❮
          </button>
          <button className="next" onClick={handleNext}>
            ❯
          </button>
        </div>
      </div>
      <div className="apart-info">
        <h3>{apt.name}</h3>
        <p>{apt.rooms} room{apt.rooms > 1 ? 's' : ''}</p>
        <p>{apt.price} uah per night</p>
        <details>
          <summary>Features</summary>
          <ul>
            {apt.features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        </details>
        {user && isBooked && (
          <form onSubmit={handleReviewSubmit} style={{ marginTop: '20px' }}>
            <label>Leave a review:</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            />
            <button type="submit">Submit Review</button>
          </form>
        )}
        <details style={{ marginTop: '20px' }}>
          <summary>Reviews</summary>
          {reviews.length > 0 ? (
            <ul>
              {reviews.map((review, i) => (
                <li key={i}>
                  <p>
                    <strong>{review.firstName} {review.lastName}</strong> (
                    {getFormattedDate(review.timestamp)}):
                  </p>
                  <p>{review.text}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews yet 😢</p>
          )}
        </details>
        {isBooked ? (
          <button className="book" onClick={() => onCancel(index)}>
            Cancel
          </button>
        ) : (
          <button className="book" onClick={() => onBook(index)}>
            Book
          </button>
        )}
      </div>
    </div>
  );
}

export default ApartmentCard;
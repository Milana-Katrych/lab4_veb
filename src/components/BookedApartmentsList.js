import ApartmentCard from './ApartmentCard';

function BookedApartmentsList({ apartments, onCancel }) {
  const bookedApartments = apartments.filter((apt) => apt.booked);

  if (bookedApartments.length === 0) {
    return (
      <div className="no-bookings-container">
        <p>You haven't made any bookings yet.</p>
        <p>Start exploring cozy apartments in Lviv and book your perfect stay!</p>
        <img src="Photos/собачка1.webp" alt="No bookings" />
        <p>P.S. We're pet-friendly 🥹</p>
      </div>
    );
  }

  return (
    <div className="bookings-box">
      {bookedApartments.map((apt) => (
        <ApartmentCard
          key={apt.id}
          apt={apt}
          index={apartments.findIndex((a) => a.id === apt.id)}
          onCancel={onCancel}
          isBooked={true}
        />
      ))}
    </div>
  );
}

export default BookedApartmentsList;
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ApartmentCard from './ApartmentCard';
import InteractiveMap from './InteractiveMap';

function AvailableApartments({ apartments, onBook }) {
  const [filters, setFilters] = useState({
    price: 'all',
    rooms: 'all',
    type: 'all',
    sort: 'none',
  });

  const handleFilterChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };

  const filteredApartments = apartments.filter((apt) => {
    if (apt.booked) return false;
    if (filters.price !== 'all') {
      if (filters.price === 'low' && apt.price > 2500) return false;
      if (filters.price === 'high' && apt.price <= 2500) return false;
    }
    if (filters.rooms !== 'all' && apt.rooms !== parseInt(filters.rooms)) return false;
    if (filters.type !== 'all' && apt.type !== filters.type) return false;
    return true;
  });

  const sortedApartments = [...filteredApartments].sort((a, b) => {
    if (filters.sort === 'price-low') return a.price - b.price;
    if (filters.sort === 'price-high') return b.price - a.price;
    return 0;
  });

  const isFilterEmpty = (filterName, filterValue) => {
    if (!Array.isArray(apartments)) return true;

    let temp = apartments.filter((apt) => {
      if (apt.booked) return false;

      if (filterName !== 'price') {
        if (filters.price !== 'all') {
          if (filters.price === 'low' && apt.price > 2500) return false;
          if (filters.price === 'high' && apt.price <= 2500) return false;
        }
      }
      if (filterName !== 'rooms') {
        if (filters.rooms !== 'all' && apt.rooms !== parseInt(filters.rooms)) return false;
      }
      if (filterName !== 'type') {
        if (filters.type !== 'all' && apt.type !== filters.type) return false;
      }

      if (filterName === 'price' && filterValue !== 'all') {
        if (filterValue === 'low' && apt.price > 2500) return false;
        if (filterValue === 'high' && apt.price <= 2500) return false;
      }
      if (filterName === 'rooms' && filterValue !== 'all') {
        if (apt.rooms !== parseInt(filterValue)) return false;
      }
      if (filterName === 'type' && filterValue !== 'all') {
        if (apt.type !== filterValue) return false;
      }
      return true;
    });

    return temp.length === 0;
  };

  return (
    <div className="available-apartments">
      <InteractiveMap apartments={apartments} onBook={onBook} />
      <h2>Recommended apartments</h2>
      <div className="filters">
        <div className="filter-group">
          <h3>Price</h3>
          <button
            className={filters.price === 'all' ? 'active' : ''}
            onClick={() => handleFilterChange('price', 'all')}
            disabled={isFilterEmpty('price', 'all')}
          >
            All
          </button>
          <button
            className={filters.price === 'low' ? 'active' : ''}
            onClick={() => handleFilterChange('price', 'low')}
            disabled={isFilterEmpty('price', 'low')}
          >
            Up to 2500 UAH
          </button>
          <button
            className={filters.price === 'high' ? 'active' : ''}
            onClick={() => handleFilterChange('price', 'high')}
            disabled={isFilterEmpty('price', 'high')}
          >
            Above 2500 UAH
          </button>
        </div>
        <div className="filter-group">
          <h3>Rooms</h3>
          <button
            className={filters.rooms === 'all' ? 'active' : ''}
            onClick={() => handleFilterChange('rooms', 'all')}
            disabled={isFilterEmpty('rooms', 'all')}
          >
            All
          </button>
          <button
            className={filters.rooms === '1' ? 'active' : ''}
            onClick={() => handleFilterChange('rooms', '1')}
            disabled={isFilterEmpty('rooms', '1')}
          >
            1 Room
          </button>
          <button
            className={filters.rooms === '2' ? 'active' : ''}
            onClick={() => handleFilterChange('rooms', '2')}
            disabled={isFilterEmpty('rooms', '2')}
          >
            2 Rooms
          </button>
        </div>
        <div className="filter-group">
          <h3>Type</h3>
          <button
            className={filters.type === 'all' ? 'active' : ''}
            onClick={() => handleFilterChange('type', 'all')}
            disabled={isFilterEmpty('type', 'all')}
          >
            All
          </button>
          <button
            className={filters.type === 'Apartment' ? 'active' : ''}
            onClick={() => handleFilterChange('type', 'Apartment')}
            disabled={isFilterEmpty('type', 'Apartment')}
          >
            Apartment
          </button>
          <button
            className={filters.type === 'Studio' ? 'active' : ''}
            onClick={() => handleFilterChange('type', 'Studio')}
            disabled={isFilterEmpty('type', 'Studio')}
          >
            Studio
          </button>
        </div>
        <div className="filter-group">
          <h3>Sort by</h3>
          <button
            className={filters.sort === 'none' ? 'active' : ''}
            onClick={() => handleFilterChange('sort', 'none')}
          >
            Default
          </button>
          <button
            className={filters.sort === 'price-low' ? 'active' : ''}
            onClick={() => handleFilterChange('sort', 'price-low')}
          >
            Price: Low to High
          </button>
          <button
            className={filters.sort === 'price-high' ? 'active' : ''}
            onClick={() => handleFilterChange('sort', 'price-high')}
          >
            Price: High to Low
          </button>
        </div>
      </div>
      {sortedApartments.length === 0 ? (
        <div className="no-apartments">
          <img src="Photos/собачка3.jpg" alt="No apartments available" />
          <p>
            We are short of apartments 😔<br />
            Check back later or <Link to="/contact">contact us</Link>!
          </p>
        </div>
      ) : (
        <div className="apartments-box">
          {sortedApartments.map((apt, i) => (
            <ApartmentCard
              key={apt.id}
              apt={apt}
              index={apartments.findIndex((a) => a.id === apt.id)}
              onBook={onBook}
              isBooked={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AvailableApartments;
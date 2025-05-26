import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function InteractiveMap({ apartments, onBook }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([49.8429, 24.0311], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);
    }

    const customIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: null,
    });

    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstance.current.removeLayer(layer);
      }
    });

    apartments.forEach((apt, index) => {
      if (!apt.booked) {
        const marker = L.marker(apt.coordinates, { icon: customIcon }).addTo(mapInstance.current);
        marker.bindPopup(`
          <div class="map-popup">
            <h3>${apt.name}</h3>
            <img src="${apt.photos[0]}" alt="${apt.name}" style="width: 100px; height: auto; border-radius: 5px; margin-bottom: 10px;" />
            <p>${apt.rooms} room${apt.rooms > 1 ? 's' : ''}</p>
            <p>${apt.price} uah per night</p>
            <button class="book" data-index="${index}">Book</button>
          </div>
        `);

        marker.on('popupopen', () => {
          const bookButton = document.querySelector(`.map-popup .book[data-index="${index}"]`);
          if (bookButton) {
            bookButton.addEventListener('click', () => {
              onBook(index);
            });
          }
        });
      }
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            mapInstance.current.removeLayer(layer);
          }
        });
      }
    };
  }, [apartments, onBook]);

  return <div id="map" ref={mapRef}></div>;
}

export default InteractiveMap;
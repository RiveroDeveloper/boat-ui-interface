// Inicializar el mapa con Leaflet centrado en la primera posición
const map = L.map('map').setView([40.7128, -74.0060], 15);

// Agregar capa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Añadir un marcador para la ubicación GPS inicial
const marker = L.marker([40.7128, -74.0060]).addTo(map);

// Conectar con el servidor WebSocket
const socket = io();

// Escuchar datos de ubicación en tiempo real desde el servidor
socket.on('gpsData', ({ longitude, latitude }) => {
  marker.setLatLng([latitude, longitude]); // Actualizar la posición del marcador
  map.setView([latitude, longitude], map.getZoom()); // Centrar el mapa en la nueva posición
});

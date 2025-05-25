/**
 * SERENA Boat Interface - Main JavaScript Controller
 * Handles real-time data updates, navigation, and controls
 */

class BoatInterface {
  constructor() {
    this.socket = io();
    this.map = null;
    this.marker = null;
    this.trail = [];
    this.maxTrailLength = 100;
    this.boatData = null;
    this.currentPanel = 'navigation';
    
    this.init();
  }

  init() {
    this.initializeMap();
    this.setupEventListeners();
    this.startClock();
    this.connectToBoat();
  }

  // Initialize Leaflet map
  initializeMap() {
    // Initialize map
    this.map = L.map('map', {
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      dragging: true,
      touchZoom: true
    }).setView([40.7128, -74.0060], 15);

    // Add map tiles with dark theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors, © CARTO',
      maxZoom: 19
    }).addTo(this.map);

    // Create custom boat icon
    const boatIcon = L.divIcon({
      className: 'boat-marker',
      html: `<div style="
        width: 20px; 
        height: 20px; 
        background: #06b6d4; 
        border: 3px solid #ffffff; 
        border-radius: 50%; 
        box-shadow: 0 0 10px rgba(6, 182, 212, 0.7);
        position: relative;
      ">
        <div style="
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-bottom: 8px solid #06b6d4;
        "></div>
      </div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    // Add initial marker
    this.marker = L.marker([40.7128, -74.0060], { icon: boatIcon }).addTo(this.map);
    
    // Add click event to map
    this.map.on('click', (e) => {
      console.log(`Map clicked at: ${e.latlng.lat}, ${e.latlng.lng}`);
    });
  }

  // Setup all event listeners
  setupEventListeners() {
    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchPanel(btn.dataset.page));
    });

    // Control buttons
    document.getElementById('engineBtn').addEventListener('click', () => this.toggleEngine());
    document.getElementById('autopilotBtn').addEventListener('click', () => this.toggleAutopilot());
    document.getElementById('emergencyBtn').addEventListener('click', () => this.emergencyStop());

    // Socket events
    this.socket.on('boatData', (data) => this.updateBoatData(data));
    this.socket.on('connect', () => this.updateConnectionStatus(true));
    this.socket.on('disconnect', () => this.updateConnectionStatus(false));
  }

  // Start the real-time clock
  startClock() {
    const updateClock = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
      document.getElementById('currentTime').textContent = timeString;
    };

    updateClock();
    setInterval(updateClock, 1000);
  }

  // Connect to boat systems
  connectToBoat() {
    console.log('🚤 Connecting to boat systems...');
    this.updateConnectionStatus(true);
  }

  // Switch between interface panels
  switchPanel(panelName) {
    // Hide all panels
    document.querySelectorAll('.content-panel').forEach(panel => {
      panel.style.display = 'none';
    });

    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    // Show selected panel
    const targetPanel = document.getElementById(`${panelName}Panel`);
    if (targetPanel) {
      targetPanel.style.display = 'block';
      this.currentPanel = panelName;
    }

    // Add active class to selected nav button
    const activeBtn = document.querySelector(`[data-page="${panelName}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }

    // Refresh map if switching to navigation
    if (panelName === 'navigation' && this.map) {
      setTimeout(() => this.map.invalidateSize(), 100);
    }
  }

  // Update boat data from server
  updateBoatData(data) {
    this.boatData = data;
    this.updateGPS(data.gps);
    this.updateNavigation(data.navigation);
    this.updateEngine(data.engine);
    this.updateElectrical(data.electrical);
    this.updateEnvironment(data.environment);
    this.updateFuel(data.fuel);
    this.updateSystemStatus(data.status);
  }

  // Update GPS display and map
  updateGPS(gps) {
    const lat = parseFloat(gps.latitude).toFixed(6);
    const lng = parseFloat(gps.longitude).toFixed(6);

    // Update coordinate display
    document.getElementById('latitude').textContent = `${lat}°`;
    document.getElementById('longitude').textContent = `${lng}°`;

    // Update map marker position
    if (this.marker) {
      const newLatLng = [gps.latitude, gps.longitude];
      this.marker.setLatLng(newLatLng);
      
      // Add to trail
      this.trail.push(newLatLng);
      if (this.trail.length > this.maxTrailLength) {
        this.trail.shift();
      }

      // Update map view (smooth follow)
      this.map.setView(newLatLng, this.map.getZoom());
    }
  }

  // Update navigation data
  updateNavigation(nav) {
    const speed = parseFloat(nav.speed).toFixed(1);
    const heading = Math.round(nav.heading);
    const course = Math.round(nav.course);
    const depth = parseFloat(nav.depth).toFixed(1);

    document.getElementById('currentSpeed').textContent = `${speed} kt`;
    document.getElementById('heading').textContent = `${heading}°`;
    document.getElementById('speedDisplay').innerHTML = `${speed}<span class="data-unit">kt</span>`;
    document.getElementById('course').innerHTML = `${course}<span class="data-unit">°</span>`;
    document.getElementById('depth').innerHTML = `${depth}<span class="data-unit">m</span>`;
  }

  // Update engine data
  updateEngine(engine) {
    const rpm = Math.round(engine.rpm);
    const temp = Math.round(engine.temperature);
    const hours = Math.round(engine.hours);
    const oilPressure = Math.round(engine.oilPressure);
    const fuelFlow = parseFloat(engine.fuelFlow).toFixed(1);

    document.getElementById('engineRPM').textContent = rpm;
    document.getElementById('engineTemp').textContent = `${temp}°`;
    document.getElementById('engineHours').innerHTML = `${hours}<span class="data-unit">h</span>`;
    document.getElementById('oilPressure').innerHTML = `${oilPressure}<span class="data-unit">PSI</span>`;
    document.getElementById('fuelFlow').innerHTML = `${fuelFlow}<span class="data-unit">L/h</span>`;
  }

  // Update electrical system data
  updateElectrical(electrical) {
    const voltage = parseFloat(electrical.batteryVoltage).toFixed(1);
    const level = Math.round(electrical.batteryLevel);
    const current = parseFloat(electrical.current).toFixed(1);

    document.getElementById('batteryVoltage').textContent = `${voltage}V`;
    document.getElementById('batteryPercentage').textContent = `${level}%`;
    document.getElementById('batteryCurrent').textContent = `${current}A`;

    // Update battery visual level
    const batteryLevelElement = document.getElementById('batteryLevel');
    if (batteryLevelElement) {
      batteryLevelElement.style.height = `${level}%`;
      
      // Change color based on level
      if (level > 50) {
        batteryLevelElement.style.background = 'linear-gradient(to top, var(--success), var(--warning))';
      } else if (level > 20) {
        batteryLevelElement.style.background = 'linear-gradient(to top, var(--warning), var(--danger))';
      } else {
        batteryLevelElement.style.background = 'var(--danger)';
      }
    }
  }

  // Update environmental data
  updateEnvironment(env) {
    const airTemp = Math.round(env.airTemperature);
    const waterTemp = Math.round(env.waterTemperature);
    const humidity = Math.round(env.humidity);
    const windSpeed = Math.round(env.windSpeed);
    const windDir = this.getWindDirection(env.windDirection);
    const pressure = Math.round(env.barometricPressure);

    document.getElementById('airTemp').textContent = `${airTemp}°`;
    document.getElementById('waterTemp').textContent = `${waterTemp}°`;
    document.getElementById('humidity').textContent = `${humidity}%`;
    document.getElementById('windSpeed').innerHTML = `${windSpeed}<span class="data-unit">kt</span>`;
    document.getElementById('windDirection').textContent = windDir;
    document.getElementById('pressure').innerHTML = `${pressure}<span class="data-unit">mb</span>`;
  }

  // Update fuel data
  updateFuel(fuel) {
    const level = Math.round(fuel.level);
    document.getElementById('fuelLevel').innerHTML = `${level}<span class="data-unit">%</span>`;
  }

  // Update system status indicators
  updateSystemStatus(status) {
    const statusElements = {
      engineStatus: status.engineRunning,
      autopilotStatus: status.autopilot,
      anchorStatus: status.anchor,
      navigationStatus: status.navigation
    };

    Object.entries(statusElements).forEach(([elementId, isActive]) => {
      const element = document.getElementById(elementId);
      if (element) {
        element.style.background = isActive ? 'var(--success)' : 'var(--danger)';
      }
    });

    // Update engine button text
    const engineBtn = document.getElementById('engineBtn');
    if (engineBtn) {
      engineBtn.textContent = status.engineRunning ? 'Stop Engine' : 'Start Engine';
      engineBtn.classList.toggle('active', status.engineRunning);
    }

    // Update autopilot button
    const autopilotBtn = document.getElementById('autopilotBtn');
    if (autopilotBtn) {
      autopilotBtn.classList.toggle('active', status.autopilot);
    }
  }

  // Control functions
  toggleEngine() {
    const isRunning = this.boatData?.status?.engineRunning || false;
    this.socket.emit('setEngine', !isRunning);
    console.log(`Engine ${!isRunning ? 'started' : 'stopped'}`);
  }

  toggleAutopilot() {
    const isActive = this.boatData?.status?.autopilot || false;
    console.log(`Autopilot ${!isActive ? 'activated' : 'deactivated'}`);
    // Add autopilot toggle logic here
  }

  emergencyStop() {
    this.socket.emit('setEngine', false);
    this.socket.emit('setSpeed', 0);
    console.log('🚨 Emergency stop activated!');
    
    // Show emergency notification
    this.showNotification('Emergency Stop Activated!', 'danger');
  }

  // Update connection status
  updateConnectionStatus(connected) {
    const statusElement = document.getElementById('connectionStatus');
    const statusDot = document.getElementById('systemStatus');
    
    if (connected) {
      statusElement.textContent = 'Connected';
      statusDot.className = 'status-dot online';
    } else {
      statusElement.textContent = 'Disconnected';
      statusDot.className = 'status-dot offline';
    }
  }

  // Utility functions
  getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--${type === 'danger' ? 'danger' : 'success'});
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      z-index: 10000;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Initialize the boat interface when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.boatInterface = new BoatInterface();
  console.log('⚓ SERENA Boat Interface initialized');
}); 
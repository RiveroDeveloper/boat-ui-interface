const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;

app.use(express.static('public'));
app.use(express.static('templates'));
app.use('/css', express.static('Clases Css'));
app.use('/js', express.static('Clases JavaScript'));

// Enhanced boat data simulation
class BoatDataSimulator {
  constructor() {
    // Initial position (somewhere in a harbor/bay)
    this.gps = {
      latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
      longitude: -74.0060 + (Math.random() - 0.5) * 0.01
    };
    
    // Navigation data
    this.navigation = {
      speed: 0, // knots
      heading: Math.random() * 360, // degrees
      course: Math.random() * 360, // degrees
      depth: 15 + Math.random() * 85 // meters
    };
    
    // Engine data
    this.engine = {
      rpm: 0,
      temperature: 75 + Math.random() * 15, // Celsius
      oilPressure: 30 + Math.random() * 20, // PSI
      fuelFlow: 0, // L/h
      hours: 1250 + Math.random() * 500
    };
    
    // Electrical system
    this.electrical = {
      batteryVoltage: 12.6 + Math.random() * 0.4,
      batteryLevel: 85 + Math.random() * 15, // percentage
      current: 0, // amperes
      alternatorVoltage: 0
    };
    
    // Environmental data
    this.environment = {
      airTemperature: 20 + Math.random() * 15,
      waterTemperature: 18 + Math.random() * 8,
      humidity: 60 + Math.random() * 30,
      barometricPressure: 1013 + Math.random() * 20,
      windSpeed: Math.random() * 25, // knots
      windDirection: Math.random() * 360 // degrees
    };
    
    // Fuel system
    this.fuel = {
      level: 75 + Math.random() * 20, // percentage
      rate: 0, // L/h
      range: 0 // nautical miles
    };
    
    // System status
    this.status = {
      engineRunning: false,
      autopilot: false,
      anchor: false,
      navigation: true,
      bilgePump: false
    };
    
    this.lastUpdate = Date.now();
  }
  
  // Simulate realistic boat movement and data changes
  update() {
    const now = Date.now();
    const deltaTime = (now - this.lastUpdate) / 1000; // seconds
    this.lastUpdate = now;
    
    // Update GPS position based on speed and heading
    if (this.navigation.speed > 0) {
      const distanceNM = (this.navigation.speed * deltaTime) / 3600; // nautical miles
      const latChange = distanceNM * Math.cos(this.navigation.heading * Math.PI / 180) / 60;
      const lonChange = distanceNM * Math.sin(this.navigation.heading * Math.PI / 180) / 60;
      
      this.gps.latitude += latChange;
      this.gps.longitude += lonChange;
    }
    
    // Engine simulation
    if (this.status.engineRunning) {
      // Engine warming up/cooling down
      const targetTemp = 85 + (this.engine.rpm / 100);
      this.engine.temperature += (targetTemp - this.engine.temperature) * deltaTime * 0.1;
      
      // RPM affects other systems
      this.engine.fuelFlow = (this.engine.rpm / 1000) * 8 + Math.random() * 2;
      this.fuel.rate = this.engine.fuelFlow;
      
      // Alternator charging
      this.electrical.alternatorVoltage = 13.8 + Math.random() * 0.3;
      this.electrical.current = -5 - (this.engine.rpm / 500); // negative = charging
      
      // Battery charging when engine running
      if (this.electrical.batteryLevel < 100) {
        this.electrical.batteryLevel += deltaTime * 0.5;
      }
    } else {
      // Engine cooling down
      this.engine.temperature += (20 - this.engine.temperature) * deltaTime * 0.05;
      this.engine.fuelFlow = 0;
      this.fuel.rate = 0;
      this.electrical.alternatorVoltage = 0;
      
      // Battery drain when engine off
      this.electrical.current = 2 + Math.random(); // positive = draining
      this.electrical.batteryLevel -= deltaTime * 0.1;
    }
    
    // Update battery voltage based on level and load
    const baseVoltage = 11.8 + (this.electrical.batteryLevel / 100) * 1.2;
    this.electrical.batteryVoltage = baseVoltage - (this.electrical.current * 0.1);
    
    // Environmental changes (slow)
    this.environment.windSpeed += (Math.random() - 0.5) * 0.5;
    this.environment.windDirection += (Math.random() - 0.5) * 5;
    this.environment.airTemperature += (Math.random() - 0.5) * 0.1;
    
    // Keep values in realistic ranges
    this.navigation.speed = Math.max(0, Math.min(35, this.navigation.speed));
    this.engine.rpm = Math.max(0, Math.min(4000, this.engine.rpm));
    this.electrical.batteryLevel = Math.max(0, Math.min(100, this.electrical.batteryLevel));
    this.fuel.level = Math.max(0, Math.min(100, this.fuel.level));
    this.environment.windSpeed = Math.max(0, Math.min(50, this.environment.windSpeed));
    this.environment.windDirection = ((this.environment.windDirection % 360) + 360) % 360;
    
    // Calculate fuel range
    if (this.fuel.rate > 0) {
      this.fuel.range = (this.fuel.level / 100 * 200) / this.fuel.rate * this.navigation.speed;
    } else {
      this.fuel.range = 0;
    }
    
    return this.getAllData();
  }
  
  // Get all boat data
  getAllData() {
    return {
      timestamp: new Date().toISOString(),
      gps: this.gps,
      navigation: this.navigation,
      engine: this.engine,
      electrical: this.electrical,
      environment: this.environment,
      fuel: this.fuel,
      status: this.status
    };
  }
  
  // Control methods for testing
  setEngineState(running) {
    this.status.engineRunning = running;
    if (running) {
      this.engine.rpm = 800 + Math.random() * 200; // idle RPM
    } else {
      this.engine.rpm = 0;
      this.navigation.speed = 0;
    }
  }
  
  setSpeed(speed) {
    this.navigation.speed = Math.max(0, Math.min(35, speed));
    if (speed > 0) {
      this.engine.rpm = 800 + (speed / 35) * 3000; // RPM based on speed
    }
  }
  
  setHeading(heading) {
    this.navigation.heading = ((heading % 360) + 360) % 360;
  }
}

// Initialize boat simulator
const boatSimulator = new BoatDataSimulator();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Send initial data
  socket.emit('boatData', boatSimulator.getAllData());
  
  // Handle control commands from client
  socket.on('setEngine', (running) => {
    boatSimulator.setEngineState(running);
    console.log(`Engine ${running ? 'started' : 'stopped'}`);
  });
  
  socket.on('setSpeed', (speed) => {
    boatSimulator.setSpeed(speed);
    console.log(`Speed set to ${speed} knots`);
  });
  
  socket.on('setHeading', (heading) => {
    boatSimulator.setHeading(heading);
    console.log(`Heading set to ${heading}°`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Send updated boat data every second
setInterval(() => {
  const data = boatSimulator.update();
  io.emit('boatData', data);
}, 1000);

server.listen(PORT, () => {
  console.log(`⚓ SERENA Boat Interface Server running on http://localhost:${PORT}`);
  console.log(`📊 Simulating comprehensive boat data...`);
});

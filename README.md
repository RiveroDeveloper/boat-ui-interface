# ⚓ SERENA - Advanced Boat Interface System

A modern, real-time boat monitoring and control interface with comprehensive data simulation. SERENA provides a professional-grade dashboard for monitoring navigation, engine parameters, electrical systems, environmental conditions, and boat controls.

![SERENA Interface](https://img.shields.io/badge/Status-Active-brightgreen) ![Node.js](https://img.shields.io/badge/Node.js-v14+-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Live Demo

**[🌐 Access SERENA Live Interface](https://serena-boat-interface.onrender.com/)**

Experience the full boat monitoring system with real-time data simulation, interactive controls, and professional marine interface.

## 🚤 Features

### **Real-Time Monitoring**
- **GPS Navigation**: Live position tracking with interactive map
- **Engine Diagnostics**: RPM, temperature, oil pressure, fuel flow
- **Electrical System**: Battery voltage, current, charging status
- **Environmental Data**: Air/water temperature, wind speed/direction, barometric pressure
- **Fuel Management**: Level monitoring and consumption tracking

### **Advanced Interface**
- **Modern UI Design**: Glass-morphism design with dark theme
- **Responsive Layout**: CSS Grid-based responsive design
- **Real-Time Updates**: WebSocket-based live data streaming
- **Multi-Panel Navigation**: Seamless switching between monitoring panels
- **Interactive Controls**: Engine start/stop, autopilot, emergency controls

### **Data Simulation**
- **Realistic Boat Behavior**: Physics-based movement and system interactions
- **Comprehensive Sensors**: 20+ simulated boat parameters
- **Dynamic Responses**: Systems respond realistically to controls
- **Environmental Simulation**: Weather and water conditions

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/serena-boat-interface.git
   cd serena-boat-interface
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Access the interface**
   Open your browser and navigate to: `http://localhost:3000`

### Development Mode
For development with auto-restart:
```bash
npm run dev
```

## 🎮 Usage

### **Navigation Panel**
- View real-time GPS position on interactive map
- Monitor speed, heading, and course
- Track boat movement with position trail
- See current coordinates and navigation data

### **Temperature Panel**
- Monitor air and water temperatures
- Track engine temperature
- View humidity levels
- Environmental condition overview

### **Battery Panel**
- Visual battery level indicator
- Voltage and current monitoring
- Charging status display
- Electrical system health

### **Control Interface**
- **Engine Controls**: Start/stop engine with real-time feedback
- **System Status**: Visual indicators for all boat systems
- **Emergency Stop**: Immediate engine shutdown and speed reduction
- **Data Monitoring**: Comprehensive real-time data display

## 🏗️ Architecture

### **Backend (Node.js + Express)**
```
server.js                 # Main server file
├── BoatDataSimulator     # Comprehensive boat data simulation
├── Express Server        # Static file serving and API endpoints
├── Socket.io Server      # Real-time WebSocket communication
└── Control Handlers      # Boat control command processing
```

### **Frontend (Vanilla JS + CSS)**
```
templates/
├── index.html           # Main interface template
Clases Css/
├── styles.css          # Modern UI styling with CSS Grid
└── fonts.css           # Font configurations
Clases JavaScript/
└── main.js             # Main interface controller
```

### **Data Flow**
1. **Simulation Engine** generates realistic boat data
2. **WebSocket Server** broadcasts data to connected clients
3. **Frontend Interface** receives and displays real-time updates
4. **User Controls** send commands back to server
5. **Simulation responds** to control inputs realistically

## 📊 Simulated Data Parameters

### **GPS & Navigation**
- Latitude/Longitude coordinates
- Speed over ground (knots)
- Heading and course
- Water depth

### **Engine Systems**
- RPM (0-4000)
- Engine temperature (°C)
- Oil pressure (PSI)
- Fuel flow rate (L/h)
- Engine hours

### **Electrical Systems**
- Battery voltage (V)
- Battery level (%)
- Current draw/charge (A)
- Alternator voltage

### **Environmental**
- Air temperature (°C)
- Water temperature (°C)
- Humidity (%)
- Wind speed/direction
- Barometric pressure (mb)

### **Fuel System**
- Fuel level (%)
- Fuel consumption rate
- Estimated range

## 🎨 Design Features

### **Modern UI Elements**
- **Glass-morphism**: Translucent panels with backdrop blur
- **Gradient Backgrounds**: Subtle color transitions
- **Animated Elements**: Smooth transitions and hover effects
- **Responsive Grid**: Adapts to different screen sizes

### **Color Scheme**
- **Primary**: Deep blue (#1e3a8a)
- **Secondary**: Bright blue (#3b82f6)
- **Accent**: Cyan (#06b6d4)
- **Background**: Dark slate (#0f172a)

### **Typography**
- **Interface**: Inter font family
- **Data Display**: JetBrains Mono (monospace)
- **Responsive sizing**: Scales with viewport

## 🔧 Configuration

### **Server Configuration**
```javascript
const PORT = 3000;  // Server port
```

### **Simulation Parameters**
Modify `BoatDataSimulator` class in `server.js`:
- Initial GPS position
- Engine specifications
- Battery capacity
- Environmental ranges

### **Update Frequency**
```javascript
setInterval(() => {
  // Update frequency: 1000ms (1 second)
}, 1000);
```

## 🚀 Development

### **Adding New Features**

1. **New Data Parameters**:
   - Add to `BoatDataSimulator` class
   - Update frontend display logic
   - Add UI elements in HTML

2. **New Controls**:
   - Add button/control in HTML
   - Add event listener in `main.js`
   - Add server handler in `server.js`

3. **New Panels**:
   - Create new panel HTML structure
   - Add navigation button
   - Update panel switching logic

### **File Structure**
```
serena-boat-interface/
├── server.js                    # Main server application
├── package.json                 # Node.js dependencies and scripts
├── README.md                    # This file
├── templates/
│   ├── index.html              # Main interface template
│   ├── temperature.html        # Temperature panel (legacy)
│   └── batteries.html          # Battery panel (legacy)
├── Clases Css/
│   ├── styles.css              # Main stylesheet
│   └── fonts.css               # Font definitions
├── Clases JavaScript/
│   ├── main.js                 # Main interface controller
│   ├── index.js                # Legacy time/speed functions
│   ├── map.js                  # Legacy map functions
│   └── batteries.js            # Legacy battery functions
├── templates/Imagenes/         # Interface icons and images
└── public/                     # Static assets (served by Express)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Technologies Used

- **Backend**: Node.js, Express.js, Socket.io
- **Frontend**: Vanilla JavaScript, CSS3, HTML5
- **Mapping**: Leaflet.js with CartoDB dark tiles
- **Real-time Communication**: WebSocket (Socket.io)
- **Styling**: CSS Grid, Flexbox, CSS Custom Properties

# Solar Calculator

A comprehensive web-based tool for calculating solar energy system requirements for homes and businesses.

## Overview

This Solar Calculator provides customizable solar energy system calculations with three different modes to accommodate users with varying levels of expertise:

- **Basic Mode**: Appliance-based calculator for detailed energy usage analysis
- **Simple Mode**: Streamlined interface with predefined templates for quick estimates
- **Advanced Mode**: Detailed calculations using geographical data and advanced parameters

The calculator helps users determine the appropriate solar panel size, battery capacity, and inverter requirements based on their specific energy needs and location.

## Features

### Basic Calculator Mode
- Detailed appliance-based energy calculation
- Add unlimited appliances with customizable wattage and usage hours
- Calculate total load, daily energy requirements, and system specifications
- Save and load configurations

### Simple Calculator Mode
- User-friendly interface for quick solar sizing
- Predefined home templates based on number of bedrooms
- Visual selection of key parameters
- Multilingual support (English and Tok Pisin)
- Voice guidance for accessibility

### Advanced Calculator Mode
- Location-based solar calculations with map integration
- Detailed technical parameters and system sizing
- Visual panel orientation tool with 3D modeling
- Solar production statistics with detailed charts
- Monthly and hourly energy production estimates
- Financial savings calculator with multi-currency support
- Environmental impact assessment

## Technical Details

### Calculation Methods

The calculator uses established formulas for solar energy system design:

- **Energy Consumption**: `kWh = (Wattage × Hours × Quantity) ÷ 1000`
- **Solar Panel Sizing**: `Panel capacity = Daily energy usage ÷ Peak sun hours`
- **Battery Sizing**: `Battery capacity = Daily energy × Reserve days`
- **Inverter Sizing**: `Inverter capacity = Total simultaneous wattage × Safety factor`

Advanced calculations include location-specific parameters:
- Global Tilted Irradiation (GTI)
- Optimal panel tilt and orientation
- System performance ratio
- Self-sufficiency percentage

### Technologies Used

- HTML5, CSS3, and JavaScript
- Responsive design for mobile and desktop use
- Interactive charts for data visualization
- Local storage for saving user configurations
- Web Speech API for voice guidance
- Leaflet.js for map integration
- Chart.js for data visualization

## Installation and Usage

1. Clone the repository
```bash
git clone https://github.com/QUT-Capstone-Project-24se2-T208/solar-calculator.git
```

2. Open the index.html file in your web browser or host the files on a web server.

3. Choose the calculation mode that best suits your needs.

4. Follow the step-by-step interface to input your energy usage and requirements.

5. Review the generated results for solar system specifications.

## Project Structure

```
solar-calculator/
├── index.html                  # Main entry point
├── css/                        # Style sheets
│   ├── style.css               # Main styles
│   ├── basic-calculator.css    # Basic mode styles
│   ├── simple-calculator.css   # Simple mode styles
│   └── advanced-calculator.css # Advanced mode styles
├── js/                         # JavaScript files
│   ├── basic-calculator.js     # Basic calculator logic
│   ├── simple-calculator.js    # Simple calculator logic
│   ├── advanced-calculator.js  # Advanced calculator logic
│   └── appliances-module.js    # Shared appliance data
├── assets/                     # Images and resources
│   ├── appliances/             # Appliance icons
│   ├── logo/                   # Logo files
│   └── ui/                     # UI elements
└── README.md                   # This file
```

## Browser Compatibility

The calculator is compatible with all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Future Enhancements

- Integration with solar panel product databases
- Cost estimation for complete solar installations
- Weather API integration for more accurate local data
- Additional language support
- Mobile app versions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Solar irradiation data from [Global Solar Atlas](https://globalsolaratlas.info)
- Icon assets from [FontAwesome](https://fontawesome.com)
- Map data from [OpenStreetMap](https://www.openstreetmap.org)

## Contact

For questions or feedback, please contact sjun0500@gmail.com.

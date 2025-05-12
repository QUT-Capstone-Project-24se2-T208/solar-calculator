# Solar System Calculator

This web application provides a comprehensive tool to calculate the required solar system based on various appliances and usage patterns. 

Live demo available at https://solar-calculator-chi.vercel.app/

## Overview

Our project aims to provide a solution to the people of Papua New Guinea and Solomon Islands who require simple and accessible information regarding solar power systems. The web page provides immediate results and educational elements to assist users in their consideration to move to a solar-powered home.

## Features

- **Three Calculator Modes**:
  - **Assistive Mode**: Easy 3-step process with voice-over instructions and Tok Pisin language support
  - **Standard Mode**: Detailed appliance-based calculations with customizable usage patterns
  - **Advanced Mode**: Professional-grade solar system design with location-specific data
- **Solar System Estimation**:
  - Calculates required solar panels, inverter size, and battery capacity
  - Provides estimated savings and environmental benefits

## Getting Started

1. **Choose a Calculator Mode**:
   - Use Assistive Mode for beginners and quick estimates
   - Use Standard Mode for detailed appliance-based calculations
   - Use Advanced Mode for professional-grade system design

2. **Follow the Step-by-Step Process**:
   - Enter your location and energy usage details
   - Configure your system preferences
   - Review results and request a quote

3. **Access the Application**:
   - Live demo available at https://solar-calculator-chi.vercel.app/

## Usage Guide

### Assistive Mode

1. Select your home type and get quick solar recommendations
2. Voice-over instructions guide you through the process
3. Available in Tok Pisin language for maximum accessibility

### Standard Mode

#### Add Appliance

1. Select appliances from the Appliance Menus
2. Confirm selected appliances appear on the results tab
3. Repeat until all appliances in your home are selected

#### Create Custom Appliances

1. Scroll to the bottom of the appliance menu and select **Custom Appliance**
2. Configure the custom appliance in the results tab
3. Enter the **Quantity**, **Running Watts**, and **Hours per Day**

#### Viewing Results

1. Results appear in the **System Requirements** section
2. Review information about solar panels, inverter size, and battery capacity
3. Adjust parameters like simultaneous usage, reserve days, and sun hours

### Advanced Mode

1. **Set Location**: Use the map to select your location or enter coordinates
2. **Configure Usage**: Set your daily energy consumption and cost
3. **Choose System Type**: Select the installation environment (residential, commercial, etc.)
4. **Panel Settings**: Adjust orientation and tilt for optimal performance
5. **Review Results**: Analyze estimated output, savings, and environmental benefits

### Uploading Roof Images

1. Navigate to the quote request section
2. Click the "Upload Images" button to select roof images from your computer
3. Add multiple images to help with the assessment process

### Requesting a Quote

1. Fill in your contact information in the quote request form
2. Review your system specifications
3. Add any additional comments or requirements
4. Submit your request for a professional assessment

## API

This website uses data available from the Solargis database.

### Example API Query

```JavaScript
// The URL to fetch solar data for a specific latitude and longitude
const url = 'https://api.globalsolaratlas.info/data/lta?loc=-6.487254,145.156558';

// Function to fetch the data
async function fetchSolarData() {
  try {
    const response = await fetch(url);
    
    // If the response is successful, convert it to JSON
    if (response.ok) {
      const data = await response.json();
      console.log('Solar Data:', data);
    } else {
      console.error('Error fetching data:', response.status);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Call the function
fetchSolarData();
```

## Technologies Used

- HTML5, CSS3, and JavaScript
- Node.js and Express for the backend
- Nodemailer for email functionality
- Chart.js for data visualization
- Web APIs for geolocation and solar data

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Solar irradiation data from [Global Solar Atlas](https://globalsolaratlas.info)
- Icon assets from [FontAwesome](https://fontawesome.com)
- Map data from [OpenStreetMap](https://www.openstreetmap.org)

## Contact

For questions or feedback, please contact s296.lee@connect.qut.edu.au
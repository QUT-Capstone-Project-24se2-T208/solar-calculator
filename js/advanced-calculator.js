document.addEventListener("DOMContentLoaded", () => {
  // Step navigation elements
  const stepItems = document.querySelectorAll('.step-item');
  const stepContents = document.querySelectorAll('.step-content');
  const nextButtons = document.querySelectorAll('.next-btn');
  const prevButtons = document.querySelectorAll('.prev-btn');
  const calculateButton = document.getElementById('calculate-btn');
  const resetDefaultsButton = document.getElementById('reset-defaults');
  
  // Current step tracker
  let currentStep = 1;
  
  // Initialize step indicator
  updateStepIndicator();
  
  // Disable step navigation (click events removed)
  stepItems.forEach(item => {
    item.style.cursor = 'default'; // Change cursor style
    // No click event is added
  });
  
  // Add click event for next buttons
  nextButtons.forEach(button => {
    button.addEventListener('click', function() {
      const currentStepElement = this.closest('.step-content');
      const currentStepId = currentStepElement ? currentStepElement.id : '';
      
      // Handle Location to Energy Usage transition
      if (currentStepId === 'step-1') {
        const { lat, lng } = marker.getLatLng();
        showLoadingSpinner('Loading solar data for your location...');
        
        // Fetch solar data before proceeding
        fetchOpta(lat, lng)
          .then(() => {
            updatePanelDefaults(lat, lng);
            saveOriginalPanelSettings();
            hideLoadingSpinner();
            navigateToStep(currentStep + 1);
          })
          .catch(error => {
            console.error("Error loading location data:", error);
            hideLoadingSpinner();
            showErrorPopup(
              'Data Fetch Failed',
              'Unable to load solar data for this location. Please check your internet connection or try a different location.'
            );
          });
      } else if (currentStepId === 'step-4') {
        // For Panel Settings step, trigger calculate button instead
        document.getElementById('panel-calculate-btn').click();
      } else {
        // Regular navigation for other steps
        navigateToStep(currentStep + 1);
      }
    });
  });
  
  // Add click event for previous buttons
  prevButtons.forEach(button => {
    button.addEventListener('click', function() {
      navigateToStep(currentStep - 1);
    });
  });
  
  // Function to navigate between steps
  function navigateToStep(stepNumber) {
    // Validate step number
    if (stepNumber < 1 || stepNumber > stepItems.length) {
      return;
    }
    
    // Hide all step contents
    stepContents.forEach(content => {
      content.classList.remove('active');
    });
    
    // Show current step content
    document.getElementById(`step-${stepNumber}`).classList.add('active');
    
    // Update current step
    currentStep = stepNumber;
    
    // Update step indicator
    updateStepIndicator();
    
    // Smooth scroll to the top of the calculator container
    document.querySelector('.calculator-container').scrollIntoView({
      behavior: 'smooth'
    });
  }
  
  // Function to update step indicator
  function updateStepIndicator() {
    stepItems.forEach(item => {
      const itemStep = parseInt(item.getAttribute('data-step'));
      
      // Remove all states
      item.classList.remove('active', 'completed');
      
      // Add appropriate state
      if (itemStep === currentStep) {
        item.classList.add('active');
      } else if (itemStep < currentStep) {
        item.classList.add('completed');
      }
    });
  }
  
  // Loading spinner functions
  function showLoadingSpinner(message = 'Loading...') {
    document.getElementById('loading-message').textContent = message;
    document.getElementById('loading-overlay').style.display = 'flex';
  }

  function hideLoadingSpinner() {
    document.getElementById('loading-overlay').style.display = 'none';
  }
  
  // Store original panel settings for reset functionality
  let originalPanelSettings = {
    tilt: 0,
    azimuth: 0
  };

  function saveOriginalPanelSettings() {
    originalPanelSettings.tilt = document.getElementById("tilt").value;
    originalPanelSettings.azimuth = document.getElementById("azimuth").value;
  }
  
  // ----- Solar Calculator Functionality -----

  // Initialize map
  
  const map = L.map("map").setView([-6.487254, 145.156558], 5);

  const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: 'Solar data from <a href="https://globalsolaratlas.info">Global Solar Atlas 2.0</a>'
  }).addTo(map);

  const satelliteLayer = L.tileLayer("https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    maxZoom: 19,
    attribution: 'Map data © Google | Solar data from <a href="https://globalsolaratlas.info">Global Solar Atlas 2.0</a>'
  });

  let marker = L.marker([-6.487254, 145.156558], { draggable: true }).addTo(map);

  let latestOpta = 20;
  let latestPvoutCsi = 4.5; // Default value for PVOUT_CSI in kWh/kWp
  let latestAnnualOutput = 0;
  
  // Country data with electricity rates and currency symbols
  const countryData = {
    AU: { 
      name: "Australia", 
      rate: 0.28, 
      currency: "AUD", 
      symbol: "$", 
      avgMonthlyBill: 120,
      flag: "🇦🇺",
      exchangeRate: 1.0 // Base currency (1 AUD = 1 AUD)
    },
    US: { 
      name: "United States", 
      rate: 0.15, 
      currency: "USD", 
      symbol: "$", 
      avgMonthlyBill: 115,
      flag: "🇺🇸",
      exchangeRate: 0.66 // 1 USD = 0.66 AUD
    },
    GB: { 
      name: "United Kingdom", 
      rate: 0.21, 
      currency: "GBP", 
      symbol: "£", 
      avgMonthlyBill: 85,
      flag: "🇬🇧",
      exchangeRate: 0.51 // 1 GBP = 0.51 AUD
    },
    JP: { 
      name: "Japan", 
      rate: 0.26, 
      currency: "JPY", 
      symbol: "¥", 
      avgMonthlyBill: 8000,
      flag: "🇯🇵",
      exchangeRate: 100.52 // 1 JPY = 100.52 AUD (inverse rate)
    },
    KR: { 
      name: "South Korea", 
      rate: 0.11, 
      currency: "KRW", 
      symbol: "₩", 
      avgMonthlyBill: 60000,
      flag: "🇰🇷",
      exchangeRate: 880.41 // 1 KRW = 880.41 AUD (inverse rate)
    },
    DE: { 
      name: "Germany", 
      rate: 0.37, 
      currency: "EUR", 
      symbol: "€", 
      avgMonthlyBill: 95,
      flag: "🇩🇪",
      exchangeRate: 0.60 // 1 EUR = 0.60 AUD
    },
    FR: { 
      name: "France", 
      rate: 0.20, 
      currency: "EUR", 
      symbol: "€", 
      avgMonthlyBill: 75,
      flag: "🇫🇷",
      exchangeRate: 0.60 // 1 EUR = 0.60 AUD
    },
    IT: { 
      name: "Italy", 
      rate: 0.25, 
      currency: "EUR", 
      symbol: "€", 
      avgMonthlyBill: 80,
      flag: "🇮🇹",
      exchangeRate: 0.60 // 1 EUR = 0.60 AUD
    },
    ES: { 
      name: "Spain", 
      rate: 0.28, 
      currency: "EUR", 
      symbol: "€", 
      avgMonthlyBill: 85,
      flag: "🇪🇸",
      exchangeRate: 0.60 // 1 EUR = 0.60 AUD
    },
    CA: { 
      name: "Canada", 
      rate: 0.13, 
      currency: "CAD", 
      symbol: "$", 
      avgMonthlyBill: 100,
      flag: "🇨🇦",
      exchangeRate: 0.89 // 1 CAD = 0.89 AUD
    },
    CN: { 
      name: "China", 
      rate: 0.08, 
      currency: "CNY", 
      symbol: "¥", 
      avgMonthlyBill: 300,
      flag: "🇨🇳",
      exchangeRate: 4.71 // 1 CNY = 4.71 AUD (inverse rate)
    },
    IN: { 
      name: "India", 
      rate: 0.08, 
      currency: "INR", 
      symbol: "₹", 
      avgMonthlyBill: 1000,
      flag: "🇮🇳",
      exchangeRate: 54.85 // 1 INR = 54.85 AUD (inverse rate)
    },
    BR: { 
      name: "Brazil", 
      rate: 0.17, 
      currency: "BRL", 
      symbol: "R$", 
      avgMonthlyBill: 200,
      flag: "🇧🇷",
      exchangeRate: 3.35 // 1 BRL = 3.35 AUD (inverse rate)
    },
    ZA: { 
      name: "South Africa", 
      rate: 0.15, 
      currency: "ZAR", 
      symbol: "R", 
      avgMonthlyBill: 1500,
      flag: "🇿🇦",
      exchangeRate: 12.17 // 1 ZAR = 12.17 AUD (inverse rate)
    },
    PG: { 
      name: "Papua New Guinea", 
      rate: 0.39, 
      currency: "PGK", 
      symbol: "K", 
      avgMonthlyBill: 300,
      flag: "🇵🇬",
      exchangeRate: 2.35 // 1 PGK = 2.35 AUD (inverse rate)
    }
  };
  
  // Default country
  let currentCountry = "US";

  async function fetchOpta(lat, lng) {
    try {
      const response = await fetch(`https://api.globalsolaratlas.info/data/lta?loc=${lat},${lng}`);
      const data = await response.json();
      
      // Extract OPTA (Optimal Tilt Angle)
      latestOpta = data?.annual?.data?.OPTA || 20;
      
      // Extract PVOUT_CSI (Clear-Sky Irradiation) - daily value
      if (data?.annual?.data?.PVOUT_CSI) {
        // Convert annual value to daily average (divide by 365)
        latestPvoutCsi = data.annual.data.PVOUT_CSI / 365;
        console.log("Daily PVOUT_CSI: ", latestPvoutCsi, "kWh/kWp/day");
      }
      
      // If PVOUT_CSI is not available, try to use GTI as fallback
      else if (data?.annual?.data?.GTI) {
        // GTI is typically in kWh/m²/year, convert to daily and apply efficiency factor
        const dailyGti = data.annual.data.GTI / 365;
        // Apply approximate 17% conversion efficiency
        latestPvoutCsi = dailyGti * 0.17;
        console.log("Estimated Daily PVOUT_CSI from GTI: ", latestPvoutCsi, "kWh/kWp/day");
      }
      
    } catch (error) {
      console.error("Failed to fetch solar data:", error);
    }
  }
  
  // Function to detect country based on lat/lng
  function detectCountry(lat, lng) {
    // Simple country detection based on coordinates
    // This is a simplified version - in a real app, you'd use a more accurate geolocation service
    
    // Australia
    if (lat < -10 && lat > -45 && lng > 110 && lng < 155) {
      return "AU";
    }
    // Papua New Guinea
    else if (lng > 140 && lng < 155 && lat > -12 && lat < 1) {
      return "PG";
    }
    // Japan
    else if (lat > 30 && lat < 46 && lng > 129 && lng < 146) {
      return "JP";
    }
    // South Korea
    else if (lat > 33 && lat < 39 && lng > 124 && lng < 132) {
      return "KR";
    }
    // China
    else if (lat > 18 && lat < 54 && lng > 73 && lng < 135) {
      return "CN";
    }
    // India
    else if (lat > 6 && lat < 36 && lng > 68 && lng < 98) {
      return "IN";
    }
    // UK
    else if (lat > 49 && lat < 59 && lng > -8 && lng < 2) {
      return "GB";
    }
    // Germany
    else if (lat > 47 && lat < 55 && lng > 5 && lng < 16) {
      return "DE";
    }
    // France
    else if (lat > 41 && lat < 51 && lng > -5 && lng < 10) {
      return "FR";
    }
    // Italy
    else if (lat > 36 && lat < 48 && lng > 6 && lng < 19) {
      return "IT";
    }
    // Spain
    else if (lat > 36 && lat < 44 && lng > -10 && lng < 4) {
      return "ES";
    }
    // Canada
    else if (lat > 41 && lat < 84 && lng > -141 && lng < -52) {
      return "CA";
    }
    // Brazil
    else if (lat > -34 && lat < 6 && lng > -74 && lng < -34) {
      return "BR";
    }
    // South Africa
    else if (lat > -35 && lat < -22 && lng > 16 && lng < 33) {
      return "ZA";
    }
    // Default to US for any other location
    else {
      return "US";
    }
  }
  
  // Function to update currency display
  function updateCurrencyDisplay() {
    document.getElementById("currency-symbol").textContent = countryData[currentCountry].currency;
    document.getElementById("currency-symbol-bill").textContent = countryData[currentCountry].symbol;
  }
  
  function updatePanelDefaults(lat, lng) {
    const systemType = document.getElementById("system-type").value;
    const tiltInput = document.getElementById("tilt");
    const azimuthInput = document.getElementById("azimuth");
    const sizeInput = document.getElementById("system-size");
    const billInput = document.getElementById("electric-bill");
    const dailyUsageInput = document.getElementById("daily-usage");
    
    // Detect country
    currentCountry = detectCountry(lat, lng);
    
    // Update currency display
    updateCurrencyDisplay();

    // Set panel orientation based on hemisphere
    if (systemType === "hydroMountedLargeScale") {
      tiltInput.value = 10;
    } else {
      tiltInput.value = latestOpta.toFixed(1);
    }

    if (lat > 1) azimuthInput.value = 180;
    else if (lat < -1) azimuthInput.value = 0;
    else azimuthInput.value = 90;

    // Set system size based on daily usage (this will be updated later)
    updateRecommendedSize();

    // Set electricity bill to average for the country
    billInput.value = countryData[currentCountry].avgMonthlyBill;
    
    // Update electricity rate used in calculations
    updateDailyUsage();

    // Update the sliders
    updateSliders();
    
    // Update the 3D panel model
    updatePanelModel();

    console.log("Updated Tilt:", tiltInput.value, "Azimuth:", azimuthInput.value);
  }
  
  // Function to calculate recommended system size based on daily usage and solar irradiation
  function updateRecommendedSize() {
    const dailyUsage = parseFloat(document.getElementById("daily-usage").value) || 0;
    const sizeInput = document.getElementById("system-size");
    const recommendedNote = document.getElementById("recommended-size-note");
    
    // Calculate recommended size using PVOUT_CSI: 
    // Daily usage / daily production per kWp
    // We also add a 1.3 factor to account for system losses and provide buffer
    let recommendedSize = (dailyUsage * 1.3) / latestPvoutCsi;
    
    // Round to one decimal place
    recommendedSize = Math.round(recommendedSize * 10) / 10;
    
    // Set minimum size
    if (recommendedSize < 1) recommendedSize = 1;
    
    // Update system size input
    sizeInput.value = recommendedSize;
    
    // Update recommendation note
    if (dailyUsage > 0) {
      // Keep it simple and clear
      recommendedNote.textContent = `(Recommended size: ${recommendedSize} kWp)`;
    } else {
      recommendedNote.textContent = "";
    }
  }

  async function handleLocationChange(lat, lng) {
    // Only update location without fetching data
    console.log(`Location set to: ${lat}, ${lng}`);
  }

  // Modified map click event - only set marker position without fetching
  map.on("click", (e) => {
    const { lat, lng } = e.latlng;
    marker.setLatLng([lat, lng]);
    map.setView([lat, lng]);
    console.log(`Pin set to Lat: ${lat}, Lng: ${lng}`);
    // No immediate fetch call here
  });

  marker.on("dragend", () => {
    const { lat, lng } = marker.getLatLng();
    console.log(`Marker moved to Lat: ${lat}, Lng: ${lng}`);
    // No immediate fetch call here
  });

  // Create and add satellite toggle button
  const satelliteToggleContainer = document.getElementById("satellite-toggle-container");
  const satelliteToggleButton = document.createElement("button");
  satelliteToggleButton.innerHTML = '<i class="fas fa-satellite"></i> Toggle Satellite View';
  satelliteToggleButton.classList.add("prev-btn");
  satelliteToggleContainer.appendChild(satelliteToggleButton);

  let isSatellite = false;
  satelliteToggleButton.addEventListener("click", () => {
    if (!isSatellite) {
      map.removeLayer(osmLayer);
      satelliteLayer.addTo(map);
    } else {
      map.removeLayer(satelliteLayer);
      osmLayer.addTo(map);
    }
    isSatellite = !isSatellite;
  });

  map.on("mousemove", (e) => {
    const coords = `Lat: ${e.latlng.lat.toFixed(5)}, Lng: ${e.latlng.lng.toFixed(5)}`;
    document.getElementById("cursor-coordinates").textContent = coords;
  });

  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("searchResults");

  // Enhance search container with an icon
  const searchContainer = document.querySelector('.search-container');
  const searchIcon = document.createElement('i');
  searchIcon.className = 'fas fa-search search-icon';
  searchContainer.appendChild(searchIcon);
  
  // Modify map click event to include reverse geocoding
  map.on("click", async (e) => {
    const { lat, lng } = e.latlng;
    marker.setLatLng([lat, lng]);
    map.setView([lat, lng]);
    
    // Perform reverse geocoding to get the address
    try {
      await reverseGeocode(lat, lng);
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    }
  });
  
  // Improved reverse geocoding function
  async function reverseGeocode(lat, lng) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=en`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data.display_name) {
        // Format address to ensure English-only output
        let address = data.display_name;
        
        // Format the address if address details are available
        if (data.address) {
          // Create a clean address from English components only
          const addressParts = [];
          
          // Add most important location parts in order of specificity
          if (data.address.road) addressParts.push(data.address.road);
          if (data.address.suburb) addressParts.push(data.address.suburb);
          if (data.address.city) addressParts.push(data.address.city);
          if (data.address.county) addressParts.push(data.address.county);
          if (data.address.state || data.address.state_district) 
            addressParts.push(data.address.state || data.address.state_district);
          if (data.address.country) addressParts.push(data.address.country);
          
          // Only use the constructed address if we have enough parts
          if (addressParts.length >= 2) {
            address = addressParts.join(', ');
          }
        }
        
        // Update search input with the formatted address
        searchInput.value = address;
        
        return address;
      } else {
        throw new Error("No address found");
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      throw error;
    }
  }

  // Enhance performSearch function
  const performSearch = async () => {
    const query = searchInput.value.trim();
    if (query.length < 3) {
      searchResults.innerHTML = "";
      return;
    }

    searchResults.innerHTML = `<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Searching...</div>`;
    
    // Add a small delay to show the loading indicator
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Added accept-language=en parameter to ensure English results
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&accept-language=en&limit=5`;

    try {
      const response = await fetch(url);
      const results = await response.json();
      searchResults.innerHTML = "";

      if (!results.length) {
        searchResults.innerHTML = `<div class="no-results"><i class="fas fa-search"></i> No results found</div>`;
        return;
      }

      // Map result categories to icons
      const categoryIcons = {
        building: 'fa-building',
        highway: 'fa-road',
        residential: 'fa-home',
        commercial: 'fa-store',
        industrial: 'fa-industry',
        default: 'fa-map-marker-alt'
      };

      results.forEach((result) => {
        // Format address to ensure it's clean and English-only
        let displayName = result.display_name;
        
        // Remove any potential non-English postal codes or format issues
        displayName = displayName.replace(/\(\d+\)/g, '').trim();
        
        const item = document.createElement("div");
        item.classList.add("search-item");
        
        // Determine the appropriate icon based on result type
        const category = result.category || 'default';
        const iconClass = categoryIcons[category] || categoryIcons.default;
        
        item.innerHTML = `
          <i class="fas ${iconClass}" style="margin-right: 8px; color: #3498db;"></i>
          <span>${displayName}</span>
        `;

        item.addEventListener("click", () => {
          const lat = parseFloat(result.lat);
          const lon = parseFloat(result.lon);

          map.setView([lat, lon], 13);
          marker.setLatLng([lat, lon]);
          searchInput.value = displayName;
          searchResults.innerHTML = "";

          console.log(`Location set: ${lat}, ${lon}`);
        });

        searchResults.appendChild(item);
      });
    } catch (error) {
      console.error("Search failed:", error);
      searchResults.innerHTML = `<div class="no-results"><i class="fas fa-exclamation-triangle"></i> Search failed. Try again.</div>`;
    }
  };

  // Handle search input focus and blur events
  searchInput.addEventListener('focus', () => {
    // If there are 3 or more characters, show the search results
    if (searchInput.value.trim().length >= 3) {
      performSearch();
    }
  });

  // Close search results when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchContainer.contains(e.target)) {
      searchResults.innerHTML = '';
    }
  });

  // Improve debounce function
  const debounce = (func, delay = 300) => {
    let debounceTimer;
    return (...args) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const debouncedSearch = debounce(performSearch, 300);
  searchInput.addEventListener("input", debouncedSearch);

  // Energy Usage and Appliances Section
  
  // Toggle show/hide appliance calculator
  const showApplianceCalculatorBtn = document.getElementById('show-appliance-calculator');
  const applianceSection = document.querySelector('.appliance-section');
  const applyApplianceUsageBtn = document.getElementById('apply-appliance-usage');
  
  showApplianceCalculatorBtn.addEventListener('click', function() {
    if (applianceSection.style.display === 'none' || !applianceSection.style.display) {
      applianceSection.style.display = 'block';
      this.innerHTML = '<i class="fas fa-times"></i> Hide Appliance Calculator';
    } else {
      applianceSection.style.display = 'none';
      this.innerHTML = '<i class="fas fa-calculator"></i> Calculate with Appliances';
    }
  });
  
  /// Apply appliance usage to daily usage input
  applyApplianceUsageBtn.addEventListener('click', function() {
  const totalUsage = document.getElementById('total-daily-usage').textContent;
  document.getElementById('daily-usage').value = totalUsage;
  
  // Update recommended system size
  updateRecommendedSize();
  
  // Hide appliance section
  applianceSection.style.display = 'none';
  showApplianceCalculatorBtn.innerHTML = '<i class="fas fa-calculator"></i> Calculate with Appliances';
  
  const dailyUsageInput = document.getElementById('daily-usage');
  dailyUsageInput.style.backgroundColor = '#ebf7f2';

  // Scroll to the daily usage input field
  dailyUsageInput.scrollIntoView({ behavior: 'smooth', block: 'center' });

  setTimeout(() => {
    dailyUsageInput.style.backgroundColor = '';
  }, 1500);

  const feedbackMsg = document.createElement('div');
  feedbackMsg.className = 'feedback-message';
  feedbackMsg.textContent = 'Daily usage updated successfully!';
  feedbackMsg.style.color = '#27ae60';
  feedbackMsg.style.fontSize = '14px';
  feedbackMsg.style.marginTop = '5px';
  
  const dailyUsageParent = dailyUsageInput.parentElement;

  const existingMsg = document.querySelector('.feedback-message');
  if (existingMsg) {
    existingMsg.remove();
  }
  
  dailyUsageParent.appendChild(feedbackMsg);
  
  setTimeout(() => {
    feedbackMsg.remove();
  }, 3000);
  });
  
  // Initialize empty array for selected appliances
  let selectedAppliances = [];
  
  // Populate appliance grid
  const applianceGrid = document.getElementById('appliance-grid');
  const selectedAppliancesList = document.getElementById('selected-appliances-list');
  const dailyUsageInput = document.getElementById('daily-usage');
  
  // Appliance data from the provided information
  const applianceData = window.AppliancesModule.appliancesData.map(appliance => ({
    title: appliance.title,
    wattage: appliance.wattage, 
    hour: appliance.hours,
    category: appliance.category,
    image: appliance.image
  }));
  
  // Generate appliance items
  applianceData.forEach(appliance => {
    const applianceItem = document.createElement('div');
    applianceItem.classList.add('appliance-item');
    applianceItem.dataset.category = appliance.category;
    applianceItem.dataset.title = appliance.title;
    applianceItem.dataset.wattage = appliance.wattage;
    applianceItem.dataset.hour = appliance.hour;
    
    applianceItem.innerHTML = `
      <img src="${appliance.image}" alt="${appliance.title}">
      <div class="appliance-label">${appliance.title}</div>
    `;
    
    applianceItem.addEventListener('click', function() {
      const isSelected = this.classList.contains('selected');
      
      if (isSelected) {
        // Remove from selection
        this.classList.remove('selected');
        removeSelectedAppliance(appliance.title);
      } else {
        // Add to selection
        this.classList.add('selected');
        addSelectedAppliance({
          title: appliance.title,
          wattage: appliance.wattage,
          hour: appliance.hour,
          quantity: 1
        });
      }
    });
    
    applianceGrid.appendChild(applianceItem);
  });
  
  // Category filter functionality
  const categoryButtons = document.querySelectorAll('.category-btn');
  
  categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      
      // Update active button
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Filter appliances
      const applianceItems = document.querySelectorAll('.appliance-item');
      
      applianceItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
  
  // Appliance search functionality
  const applianceSearch = document.getElementById('appliance-search');
  
  applianceSearch.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase().trim();
    const applianceItems = document.querySelectorAll('.appliance-item');
    
    applianceItems.forEach(item => {
      const title = item.dataset.title.toLowerCase();
      
      if (title.includes(searchTerm)) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
  
  // Add selected appliance to list
  function addSelectedAppliance(appliance) {
    // Check if already in list
    const existingIndex = selectedAppliances.findIndex(a => a.title === appliance.title);
    
    if (existingIndex !== -1) {
      return; // Already in list
    }
    
    // Add to array
    selectedAppliances.push(appliance);
    
    // Update UI
    updateSelectedAppliancesList();
    updateDailyUsage();
  }
  
  // Remove selected appliance from list
  function removeSelectedAppliance(title) {
    // Remove from array
    selectedAppliances = selectedAppliances.filter(a => a.title !== title);
    
    // Update UI
    updateSelectedAppliancesList();
    updateDailyUsage();
  }
  
  // Custom appliance functionality
function initCustomApplianceFeature() {
  const addCustomApplianceBtn = document.getElementById('add-custom-appliance');
  const customApplianceForm = document.querySelector('.custom-appliance-form');
  const saveCustomApplianceBtn = document.getElementById('save-custom-appliance');
  
  // Show/hide custom appliance form
  if (addCustomApplianceBtn) {
    addCustomApplianceBtn.addEventListener('click', function() {
      if (customApplianceForm.style.display === 'none') {
        customApplianceForm.style.display = 'block';
        this.innerHTML = '<i class="fas fa-times"></i> Cancel';
      } else {
        customApplianceForm.style.display = 'none';
        this.innerHTML = '<i class="fas fa-plus-circle"></i> Add Custom Appliance';
      }
    });
  }
  
  // Save custom appliance
  if (saveCustomApplianceBtn) {
    saveCustomApplianceBtn.addEventListener('click', function() {
      const nameInput = document.getElementById('custom-appliance-name');
      const wattageInput = document.getElementById('custom-appliance-wattage');
      const hoursInput = document.getElementById('custom-appliance-hours');
      
      const name = nameInput.value.trim();
      const wattage = parseInt(wattageInput.value) || 100;
      const hours = parseFloat(hoursInput.value) || 2;
      
      if (!name) {
        alert('Please enter an appliance name');
        return;
      }
      
      // Create custom appliance and add to selection
      const customAppliance = {
        title: name,
        wattage: wattage,
        hour: hours,
        quantity: 1,
        isCustom: true
      };
      
      // Add to selection array
      selectedAppliances.push(customAppliance);
      
      // Update UI
      updateSelectedAppliancesList();
      updateDailyUsage();
      
      // Reset form and hide
      nameInput.value = '';
      wattageInput.value = '100';
      hoursInput.value = '2';
      customApplianceForm.style.display = 'none';
      addCustomApplianceBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Add Custom Appliance';
    });
  }
  }

  // Update the selected appliances list UI
  function updateSelectedAppliancesList() {
    selectedAppliancesList.innerHTML = '';
    
    if (selectedAppliances.length === 0) {
      selectedAppliancesList.innerHTML = '<div class="no-results">No appliances selected</div>';
      return;
    }
    
    selectedAppliances.forEach(appliance => {
      const dailyUsage = ((appliance.wattage * appliance.hour * appliance.quantity) / 1000).toFixed(2);
      
      const item = document.createElement('div');
      item.classList.add('selected-appliance-item');
      
      // For custom appliances, use an editable input for the name
      const nameContent = appliance.isCustom ? 
        `<input type="text" class="custom-appliance-name-edit" value="${appliance.title}" data-title="${appliance.title}">` :
        `<span class="selected-appliance-name">${appliance.title}</span>`;
      
      item.innerHTML = `
        ${nameContent}
        <div class="selected-appliance-controls">
          <label>Qty: <input type="number" min="1" value="${appliance.quantity}" class="appliance-quantity" data-title="${appliance.title}"></label>
          <label>W: <input type="number" min="1" value="${appliance.wattage}" class="appliance-wattage" data-title="${appliance.title}"></label>
          <label>Hrs: <input type="number" min="0.1" max="24" step="0.1" value="${appliance.hour}" class="appliance-hours" data-title="${appliance.title}"></label>
        </div>
        <span class="selected-appliance-usage">${dailyUsage} kWh/day</span>
        <span class="remove-appliance" data-title="${appliance.title}">
          <i class="fas fa-times"></i>
        </span>
      `;
      
      selectedAppliancesList.appendChild(item);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-appliance').forEach(button => {
      button.addEventListener('click', function() {
        const title = this.getAttribute('data-title');
        
        // Deselect the corresponding grid item
        const gridItem = Array.from(document.querySelectorAll('.appliance-item'))
          .find(item => item.dataset.title === title);
          
        if (gridItem) {
          gridItem.classList.remove('selected');
        }
        
        removeSelectedAppliance(title);
      });
    });
    
    // Add event listeners to custom appliance name edit fields
    document.querySelectorAll('.custom-appliance-name-edit').forEach(input => {
      input.addEventListener('change', function() {
        const oldTitle = this.getAttribute('data-title');
        const newTitle = this.value.trim();
        
        if (!newTitle) {
          this.value = oldTitle;
          return;
        }
        
        // Update appliance title in the array
        const applianceIndex = selectedAppliances.findIndex(a => a.title === oldTitle);
        if (applianceIndex !== -1) {
          selectedAppliances[applianceIndex].title = newTitle;
          
          // Update data-title attributes for related inputs
          const applianceItem = this.closest('.selected-appliance-item');
          const inputs = applianceItem.querySelectorAll('[data-title]');
          inputs.forEach(element => {
            element.setAttribute('data-title', newTitle);
          });
          
          this.setAttribute('data-title', newTitle);
        }
      });
    });
    
    // Add event listeners to quantity inputs
    document.querySelectorAll('.appliance-quantity').forEach(input => {
      input.addEventListener('change', function() {
        const title = this.getAttribute('data-title');
        const quantity = parseInt(this.value) || 1;
        
        // Update appliance quantity
        const applianceIndex = selectedAppliances.findIndex(a => a.title === title);
        if (applianceIndex !== -1) {
          selectedAppliances[applianceIndex].quantity = quantity;
          updateDailyUsage();
          
          // Update usage display without rebuilding the whole list
          const usageElement = this.closest('.selected-appliance-item').querySelector('.selected-appliance-usage');
          const appliance = selectedAppliances[applianceIndex];
          const dailyUsage = ((appliance.wattage * appliance.hour * appliance.quantity) / 1000).toFixed(2);
          usageElement.textContent = `${dailyUsage} kWh/day`;
        }
      });
    });
    
    // Add event listeners to wattage inputs
    document.querySelectorAll('.appliance-wattage').forEach(input => {
      input.addEventListener('change', function() {
        const title = this.getAttribute('data-title');
        const wattage = parseInt(this.value) || 1;
        
        // Update appliance wattage
        const applianceIndex = selectedAppliances.findIndex(a => a.title === title);
        if (applianceIndex !== -1) {
          selectedAppliances[applianceIndex].wattage = wattage;
          updateDailyUsage();
          
          // Update usage display
          const usageElement = this.closest('.selected-appliance-item').querySelector('.selected-appliance-usage');
          const appliance = selectedAppliances[applianceIndex];
          const dailyUsage = ((appliance.wattage * appliance.hour * appliance.quantity) / 1000).toFixed(2);
          usageElement.textContent = `${dailyUsage} kWh/day`;
        }
      });
    });
    
    // Add event listeners to hours inputs
    document.querySelectorAll('.appliance-hours').forEach(input => {
      input.addEventListener('change', function() {
        const title = this.getAttribute('data-title');
        const hours = parseFloat(this.value) || 0.1;
        
        // Update appliance hours
        const applianceIndex = selectedAppliances.findIndex(a => a.title === title);
        if (applianceIndex !== -1) {
          selectedAppliances[applianceIndex].hour = hours;
          updateDailyUsage();
          
          // Update usage display
          const usageElement = this.closest('.selected-appliance-item').querySelector('.selected-appliance-usage');
          const appliance = selectedAppliances[applianceIndex];
          const dailyUsage = ((appliance.wattage * appliance.hour * appliance.quantity) / 1000).toFixed(2);
          usageElement.textContent = `${dailyUsage} kWh/day`;
        }
      });
    });
  }
  
  // Calculate and update total daily usage
  function updateDailyUsage() {
    let totalDailyUsage = 0;
    
    selectedAppliances.forEach(appliance => {
      const dailyUsage = appliance.wattage * appliance.hour * appliance.quantity / 1000;
      totalDailyUsage += dailyUsage;
    });
    
    // Update total display
    document.getElementById('total-daily-usage').textContent = totalDailyUsage.toFixed(2);
    
    // Update estimated bill
    const electricityRate = countryData[currentCountry].rate;
    const monthlyBill = totalDailyUsage * 30 * electricityRate;
    document.getElementById('estimated-monthly-bill').textContent = monthlyBill.toFixed(2);
  }
  
  // Update daily usage when input changes
  dailyUsageInput.addEventListener('input', function() {
    const dailyUsage = parseFloat(this.value) || 0;
    
    // Update recommended system size
    updateRecommendedSize();
    
    // Update estimated bill
    const electricityRate = countryData[currentCountry].rate;
    const monthlyBill = dailyUsage * 30 * electricityRate;
    document.getElementById('estimated-monthly-bill').textContent = monthlyBill.toFixed(2);
  });
  
  // Update estimated bill when electric bill rate changes
  document.getElementById('electric-bill').addEventListener('input', function() {
    const dailyUsage = parseFloat(dailyUsageInput.value) || 0;
    const customRate = parseFloat(this.value) / (dailyUsage * 30); // Calculate custom rate
    const monthlyBill = parseFloat(this.value);
    document.getElementById('estimated-monthly-bill').textContent = monthlyBill.toFixed(2);
  });

  initCustomApplianceFeature();
  
  // Initialize UI elements
  updateSelectedAppliancesList();
  
  // Connect energy usage to system sizing
  dailyUsageInput.addEventListener('change', updateRecommendedSize);
  
  // ----- Panel Settings Visualization -----
  
  // Initialize noUiSlider for azimuth
  const azimuthSlider = document.getElementById('azimuth-slider');
  const azimuthInput = document.getElementById('azimuth');
  
  noUiSlider.create(azimuthSlider, {
    start: [0],
    connect: 'lower',
    step: 1,
    range: {
      'min': 0,
      'max': 359
    },
    format: {
      to: function (value) {
        return Math.round(value);
      },
      from: function (value) {
        return parseInt(value);
      }
    }
  });
  
  // Initialize noUiSlider for tilt
  const tiltSlider = document.getElementById('tilt-slider');
  const tiltInput = document.getElementById('tilt');
  
  noUiSlider.create(tiltSlider, {
    start: [10],
    connect: 'lower',
    step: 1,
    range: {
      'min': 0,
      'max': 90
    },
    format: {
      to: function (value) {
        return Math.round(value);
      },
      from: function (value) {
        return parseInt(value);
      }
    }
  });
  
  // Connect sliders to inputs
  azimuthSlider.noUiSlider.on('update', (values, handle) => {
    azimuthInput.value = values[handle];
    updatePanelModel();
    updateSunPosition(); // Update sun position when slider changes
  });
  
  tiltSlider.noUiSlider.on('update', (values, handle) => {
    tiltInput.value = values[handle];
    updatePanelModel();
    updateSunPosition(); // Update sun position when slider changes
  });
  
  // Connect inputs to sliders
  azimuthInput.addEventListener('change', function() {
    let value = parseInt(this.value);
    // Ensure value is within range
    if (isNaN(value)) value = 0;
    if (value < 0) value = 0;
    if (value > 359) value = 359;
    
    azimuthSlider.noUiSlider.set(value);
    updatePanelModel();
    updateSunPosition(); // Update sun position when input changes
  });
  
  tiltInput.addEventListener('change', function() {
    let value = parseInt(this.value);
    // Ensure value is within range
    if (isNaN(value)) value = 0;
    if (value < 0) value = 0;
    if (value > 90) value = 90;
    
    tiltSlider.noUiSlider.set(value);
    updatePanelModel();
    updateSunPosition(); // Update sun position when input changes
  });
  
  // Function to update sliders when values change programmatically
  function updateSliders() {
    azimuthSlider.noUiSlider.set(azimuthInput.value);
    tiltSlider.noUiSlider.set(tiltInput.value);
  }

  // Enhanced panel visualization with column and shadow
  function enhancePanelVisualization() {
    const panelVisualization = document.querySelector('.panel-visualization');
    
    // Don't modify if already enhanced
    if (document.querySelector('.panel-column')) return;
    
    // Remove old stand if exists
    const oldStand = document.querySelector('.panel-stand');
    if (oldStand) {
      oldStand.parentNode.removeChild(oldStand);
    }
    
    // Add panel column (replaces stand)
    const panelColumn = document.createElement('div');
    panelColumn.classList.add('panel-column');
    panelVisualization.appendChild(panelColumn);
    
    // Add panel shadow
    const panelShadow = document.createElement('div');
    panelShadow.classList.add('panel-shadow');
    panelVisualization.appendChild(panelShadow);
    
    // Add panel base/ground if not exists
    if (!document.querySelector('.panel-base')) {
      const panelBase = document.createElement('div');
      panelBase.classList.add('panel-base');
      panelVisualization.appendChild(panelBase);
    }
    
    // Enhance panel surface with grid cells
    const panelSurface = document.querySelector('.panel-surface');
    
    // Create solar panel grid pattern if not already done
    if (!document.querySelector('.panel-grid')) {
      const panelGrid = document.createElement('div');
      panelGrid.classList.add('panel-grid');
      
      // Create 3x4 grid of cells
      for (let i = 0; i < 12; i++) {
        const cell = document.createElement('div');
        cell.classList.add('panel-cell');
        panelGrid.appendChild(cell);
      }
      
      // Replace original panel surface with enhanced version
      panelSurface.innerHTML = '';
      panelSurface.appendChild(panelGrid);
    }
    
    // Add tilt angle indicator (but no axis labels)
    if (!document.querySelector('.tilt-indicator')) {
      const tiltIndicator = document.createElement('div');
      tiltIndicator.classList.add('tilt-indicator');
      
      const tiltArc = document.createElement('div');
      tiltArc.classList.add('tilt-arc');
      
      const tiltLine = document.createElement('div');
      tiltLine.classList.add('tilt-line');
      tiltArc.appendChild(tiltLine);
      
      const tiltValue = document.createElement('div');
      tiltValue.classList.add('tilt-value');
      tiltValue.textContent = '0°';
      
      tiltIndicator.appendChild(tiltArc);
      tiltIndicator.appendChild(tiltValue);
      
      panelVisualization.appendChild(tiltIndicator);
    }
    
    // Update initial positions
    updatePanelModel();
    updateSunPosition();
  }

  // Updated function to update 3D panel model with column and shadow
  function updatePanelModel() {
    const azimuth = parseInt(document.getElementById('azimuth').value);
    const tilt = parseInt(document.getElementById('tilt').value);
    
    const panelModel = document.getElementById('panel-model');
    const panelColumn = document.querySelector('.panel-column');
    const panelShadow = document.querySelector('.panel-shadow');
    const tiltLine = document.querySelector('.tilt-line');
    const tiltValue = document.querySelector('.tilt-value');
    
    // Update panel model rotation
    panelModel.style.transform = `translate(-50%, -80%) rotateX(${tilt * (60 / 90)}deg) rotateZ(${azimuth}deg)`;
    
    // Update panel column position based on azimuth
    if (panelColumn) {
      // Only rotate around Z-axis (vertical) based on azimuth
      panelColumn.style.transform = `translateX(-50%) rotateZ(${azimuth}deg)`;
    }
    
    // Update shadow based on tilt
    if (panelShadow) {
      // Scale shadow size based on tilt (more vertical = smaller shadow)
      const shadowWidth = 160 - (tilt / 90) * 60; // Decrease width as tilt increases
      const shadowOpacity = 0.7 - (tilt / 90) * 0.4; // Decrease opacity as tilt increases
      
      // Move shadow closer to the base as tilt increases
      const shadowBottom = 85 - (tilt / 90) * 30;
      
      panelShadow.style.width = `${shadowWidth}px`;
      panelShadow.style.opacity = shadowOpacity;
      panelShadow.style.bottom = `${shadowBottom}px`;
      panelShadow.style.transform = `translateX(-50%) rotateZ(${azimuth}deg)`;
    }
    
    // Update tilt indicator
    if (tiltLine) {
      tiltLine.style.transform = `rotate(${tilt}deg)`;
    }
    
    if (tiltValue) {
      tiltValue.textContent = `${tilt}°`;
    }
  }

  // Update sun position based on panel angles - Fixed position to avoid overlapping
  function updateSunPosition() {
    const sunIndicator = document.getElementById('sun-indicator');
    if (!sunIndicator) return;
    
    // Fixed position to avoid overlapping with base
    sunIndicator.style.left = '75%';
    sunIndicator.style.top = '25%';
  }

  // Add reset button to panel settings
  function addResetButton() {
    const panelControls = document.querySelector('.panel-controls');
    
    // Create reset button if it doesn't exist
    if (!document.getElementById('reset-panel-settings')) {
      const resetButton = document.createElement('button');
      resetButton.id = 'reset-panel-settings';
      resetButton.classList.add('prev-btn');
      resetButton.innerHTML = '<i class="fas fa-undo"></i> Reset to Optimal Settings';
      
      resetButton.addEventListener('click', function() {
        // Reset to original values
        document.getElementById("tilt").value = originalPanelSettings.tilt;
        document.getElementById("azimuth").value = originalPanelSettings.azimuth;
        
        // Update sliders
        updateSliders();
        
        // Update panel model and sun position
        updatePanelModel();
        updateSunPosition();
      });
      
      // Add to panel controls
      panelControls.appendChild(resetButton);
    }
  }
  
  // System Type Selection with default sizing
  const systemTypeCards = document.querySelectorAll('.system-type-card');
  const systemTypeSelect = document.getElementById('system-type');

  systemTypeCards.forEach(card => {
    card.addEventListener('click', function() {
      const value = this.getAttribute('data-value');
      
      // Update hidden select value
      systemTypeSelect.value = value;
      
      // Update visual selection
      systemTypeCards.forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      
      // Update panel defaults based on new system type
      const { lat, lng } = marker.getLatLng();
      updatePanelDefaults(lat, lng);
      
      // Trigger change event for compatibility with existing code
      const event = new Event('change');
      systemTypeSelect.dispatchEvent(event);
    });
  });

  // Set initial selected system type
  systemTypeCards[0].classList.add('selected');
  
  // Variables for charts
  let monthlyProductionChart;
  
  // Panel Settings Calculate Button functionality
  const panelCalculateBtn = document.getElementById('panel-calculate-btn');
  if (panelCalculateBtn) {
    panelCalculateBtn.addEventListener("click", () => {
      showLoadingSpinner('Calculating solar system results...');
      
      const latlng = marker.getLatLng();
      const systemType = document.getElementById("system-type").value;
      const azimuth = parseFloat(document.getElementById("azimuth").value);
      const tilt = parseFloat(document.getElementById("tilt").value);
      const size = parseFloat(document.getElementById("system-size").value);
      const dailyUsage = parseFloat(document.getElementById("daily-usage").value);
      const electricBill = parseFloat(document.getElementById("electric-bill").value);
      const electricityRate = countryData[currentCountry].rate;

      const apiUrl = `https://api.globalsolaratlas.info/data/pvcalc?loc=${latlng.lat},${latlng.lng}`;

      const payload = {
        type: systemType,
        orientation: {
          azimuth: azimuth,
          tilt: tilt
        },
        systemSize: {
          type: "capacity",
          value: size
        },
        // Request hourly data to get more accurate results
        hourlyOutputs: true
      };

      console.log("Requesting Solargis Data:", payload);

      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          return response.json();
        })
        .then((data) => {
          const annualData = data?.annual?.data;
          const monthlyData = data?.monthly?.data;
          const monthlyHourlyData = data?.['monthly-hourly']?.data; // Get monthly-hourly data
      
          if (!annualData || !monthlyData) throw new Error("Invalid response data");
      
          const annualOutput = annualData.PVOUT_total;
          const electricityRate = countryData[currentCountry].rate;
          const co2Saving20Years = annualOutput * 0.0007 * 20;
          const monthlyPVOUT = monthlyData.PVOUT_total;
          const GTI = annualData.GTI;
          
          // Calculate more accurate daily average using monthly-hourly data if available
          let dailyAverageOutput = (annualOutput / 365).toFixed(1);
          
          if (monthlyHourlyData && monthlyHourlyData.PVOUT_total) {
            // Get more accurate daily average from hourly data
            const hourlyTotal = calculateTotalFromHourlyData(monthlyHourlyData.PVOUT_total);
            if (hourlyTotal > 0) {
              dailyAverageOutput = (hourlyTotal / 365).toFixed(1);
              console.log("Using monthly-hourly data for daily average:", dailyAverageOutput);
            }
          }
          
          // Modified monthly savings calculation logic
          let monthlySavings;
          let annualSavings;
          
          // Currency exchange rate calculation
          if (currentCountry === "KR" || currentCountry === "JP" || currentCountry === "CN" || 
              currentCountry === "IN" || currentCountry === "ZA" || currentCountry === "BR") {
            // Currencies with larger denominations (KRW, JPY, INR, etc.)
            monthlySavings = (annualOutput / 12) * electricityRate * countryData[currentCountry].exchangeRate;
            annualSavings = annualOutput * electricityRate * countryData[currentCountry].exchangeRate;
          } else {
            // Other currencies (USD, EUR, AUD, etc.)
            monthlySavings = (annualOutput / 12) * electricityRate;
            annualSavings = annualOutput * electricityRate;
          }
      
          let convertedMonthlySavings;
          let convertedYearlySavings;
      
          if (currentCountry === "AU") {
            convertedMonthlySavings = monthlySavings; // No conversion needed for AUD
            convertedYearlySavings = convertedMonthlySavings * 12;
          } else if (currentCountry === "KR" || currentCountry === "JP" || currentCountry === "CN" || 
                    currentCountry === "IN" || currentCountry === "ZA" || currentCountry === "BR") {
            // Convert large denomination currencies to AUD
            convertedMonthlySavings = monthlySavings / countryData[currentCountry].exchangeRate;
            convertedYearlySavings = convertedMonthlySavings * 12;
          } else {
            // Convert other currencies to AUD
            convertedMonthlySavings = monthlySavings / countryData[currentCountry].exchangeRate;
            convertedYearlySavings = convertedMonthlySavings * 12;
          }
          
          // Set currency symbol and flag based on current country
          const currencySymbol = countryData[currentCountry].symbol;
          const countryFlag = countryData[currentCountry].flag;
          
          // Update basic results
          document.getElementById("annual-output").textContent = annualOutput.toFixed(1);
          document.getElementById("monthly-savings").textContent = monthlySavings.toFixed(0);
          document.getElementById("co2-saving").textContent = co2Saving20Years.toFixed(1);
          document.getElementById("gti").textContent = GTI ? `${GTI.toFixed(1)} kWh/m²` : "-";
          
          // Update country flag and display converted savings
          document.getElementById("country-flag").textContent = countryFlag;
          document.getElementById("currency-symbol-result").textContent = currencySymbol;
          document.getElementById("converted-savings").textContent = convertedMonthlySavings.toFixed(0);
          document.getElementById("converted-yearly-savings").textContent = convertedYearlySavings.toFixed(0);
      
          
          // Show/hide converted savings based on currency
          const convertedSavingsContainer = document.getElementById("converted-savings-container");
          if (currentCountry === "AU") {
            convertedSavingsContainer.style.display = "none";
          } else {
            convertedSavingsContainer.style.display = "block";
          }
          
          // Calculate and update additional results
          const annualSavingsFormatted = (annualSavings).toFixed(0);
          const co2EquivalentTrees = Math.round(co2Saving20Years * 45); // 1 ton CO2 ≈ 45 trees
          
          // Calculate system efficiency
          const systemEfficiency = ((annualOutput / (GTI * size)) * 100).toFixed(1);
          const performanceRatio = (systemEfficiency / 100 * 1.2).toFixed(2); // Performance ratio
          
          // Calculate energy self-sufficiency
          const dailyUsageValue = parseFloat(document.getElementById("daily-usage").value) || 0;
          const selfSufficiency = dailyUsageValue > 0 
            ? Math.min(100, ((dailyAverageOutput / dailyUsageValue) * 100).toFixed(0)) 
            : 0;
          
          // Update additional result displays
          document.getElementById("daily-average-output").textContent = `${dailyAverageOutput} kWh/day`;
          document.getElementById("annual-savings").textContent = `${currencySymbol}${annualSavingsFormatted} per year`;
          document.getElementById("co2-equivalent").textContent = `Equivalent to ${co2EquivalentTrees} trees planted`;
          document.getElementById("system-efficiency").textContent = systemEfficiency;
          document.getElementById("performance-ratio").textContent = `Performance ratio: ${performanceRatio}`;
          
          // Update technical details
          const systemTypeText = document.getElementById("system-type").options[document.getElementById("system-type").selectedIndex].text;
          document.getElementById("result-system-type").textContent = systemTypeText;
          document.getElementById("result-system-size").textContent = `${size} kWp`;
          document.getElementById("result-orientation").textContent = getAzimuthDirection(azimuth);
          document.getElementById("result-tilt").textContent = `${tilt}°`;
          document.getElementById("self-sufficiency").textContent = `${selfSufficiency}%`;
          document.getElementById("location-value").textContent = `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`;
          document.getElementById("bill-savings-value").textContent = `${currencySymbol}${monthlySavings.toFixed(0)}`;
          
          // Update self-sufficiency meter
          const sufficiencyFill = document.getElementById("sufficiency-fill");
          const sufficiencyText = document.getElementById("sufficiency-text");
          const selfSufficiencyText = document.getElementById("self-sufficiency-text");
          
          if (sufficiencyFill && sufficiencyText && selfSufficiencyText) {
            // Parse the percentage value to ensure it's just a number
            const sufficiencyValue = parseInt(selfSufficiency);
            sufficiencyFill.style.width = `${sufficiencyValue}%`;
            sufficiencyText.textContent = `${selfSufficiency}%`;
            selfSufficiencyText.textContent = `${selfSufficiency}%`;
            
            // Adjust meter color based on sufficiency level
            if (selfSufficiency < 30) {
              sufficiencyFill.style.background = '#3498db';
            } else if (selfSufficiency < 70) {
              sufficiencyFill.style.background = 'linear-gradient(90deg, #3498db, #2ecc71)';
            } else {
              sufficiencyFill.style.background = '#2ecc71';
            }
          }
          
          // Update monthly production chart
          updateMonthlyProductionChart(monthlyPVOUT);
          
          // Update hourly profile chart using the unified approach
          if (monthlyHourlyData && monthlyHourlyData.PVOUT_total) {
            // Use the updated method with monthly-hourly data
            updateHourlyProfileChartsWithMonthlyHourly(monthlyHourlyData, size);
          } else if (data?.hourly?.data?.PVOUT_hourly) {
            // Use hourly data if monthly-hourly isn't available
            updateHourlyProfileCharts(data.hourly.data.PVOUT_hourly, size);
          } else {
            // Use sample data if no real hourly data is available
            generateSampleHourlyData(monthlyPVOUT, size);
          }
          
          // Initialize tooltips
          initializeTooltips();
          
          hideLoadingSpinner();
          // Navigate to results step
          navigateToStep(5);
        })
        .catch((error) => {
          console.error("Calculation failed:", error);
          hideLoadingSpinner();
          showErrorPopup(
            'Calculation Failed', 
            'Unable to calculate solar results for this location. Please check your inputs and try again, or select a different location.'
          );
        });
      });
      }
      
      // Initialize tooltips function
      function initializeTooltips() {
        // Initialize tooltips using tippy.js
        if (typeof tippy !== 'undefined') {
          tippy('.tooltip-container', {
            content: (reference) => reference.getAttribute('data-tooltip'),
            arrow: true,
            placement: 'top',
            theme: 'light',
            maxWidth: 300
          });
        }
      }
      
      // Helper function to calculate total from hourly data
      function calculateTotalFromHourlyData(hourlyData) {
        if (!Array.isArray(hourlyData)) return 0;
        
        return hourlyData.reduce((sum, value) => {
          if (value !== null && !isNaN(value)) {
            return sum + value;
          }
          return sum;
        }, 0);
      }
      
      // Function to convert azimuth angle to direction text
      function getAzimuthDirection(azimuth) {
        // Convert azimuth angle to direction text
        if (azimuth >= 337.5 || azimuth < 22.5) return "North (0°)";
        if (azimuth >= 22.5 && azimuth < 67.5) return "Northeast (45°)";
        if (azimuth >= 67.5 && azimuth < 112.5) return "East (90°)";
        if (azimuth >= 112.5 && azimuth < 157.5) return "Southeast (135°)";
        if (azimuth >= 157.5 && azimuth < 202.5) return "South (180°)";
        if (azimuth >= 202.5 && azimuth < 247.5) return "Southwest (225°)";
        if (azimuth >= 247.5 && azimuth < 292.5) return "West (270°)";
        if (azimuth >= 292.5 && azimuth < 337.5) return "Northwest (315°)";
        return `Custom (${azimuth}°)`;
      }
      
      // Enhanced function to update monthly production chart
      function updateMonthlyProductionChart(monthlyPVOUT) {
        const ctx = document.getElementById('monthly-production-chart');
        
        if (!ctx) return;
        
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June', 
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        // Destroy existing chart if it exists
        if (monthlyProductionChart) {
          monthlyProductionChart.destroy();
        }
        
        // Create new chart with enhanced visuals
        monthlyProductionChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: months,
            datasets: [{
              label: 'Monthly Energy Production (kWh)',
              data: monthlyPVOUT,
              backgroundColor: function(context) {
                const value = context.dataset.data[context.dataIndex];
                const max = Math.max(...context.dataset.data);
                const alpha = 0.6 + (value / max) * 0.4;
                return `rgba(52, 152, 219, ${alpha})`;
              },
              borderColor: '#2980b9',
              borderWidth: 1,
              borderRadius: 5,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.parsed.y.toFixed(1)} kWh`;
                  },
                  afterLabel: function(context) {
                    const daysInMonth = getDaysInMonth(context.dataIndex);
                    const dailyAvg = (context.parsed.y / daysInMonth).toFixed(1);
                    return `Daily Average: ${dailyAvg} kWh/day`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Energy Production (kWh)'
                }
              }
            }
          }
        });
      }
      
      // Helper function to get days in month
      function getDaysInMonth(monthIndex) {
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return daysInMonth[monthIndex];
      }
      
      // Variables for the unified hourly chart
      let unifiedHourlyChart;
      
      // Function to create and display the unified hourly chart
      function createUnifiedHourlyChart(monthlyHourlyData, systemSize) {
        const ctx = document.getElementById('unified-hourly-chart');
        
        if (!ctx) return;
        
        // Get the initial month from the selector
        const monthSelector = document.getElementById('month-selector');
        const selectedMonth = parseInt(monthSelector.value);
        
        // Extract hourly data for the selected month
        const hourlyValues = extractMonthlyHourlyProfile(monthlyHourlyData, selectedMonth, systemSize);
        
        // Destroy existing chart if any
        if (unifiedHourlyChart) {
          unifiedHourlyChart.destroy();
        }
        
        // Create new unified chart
        unifiedHourlyChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: Array.from({length: 24}, (_, i) => i),
            datasets: [{
              label: 'Power Output',
              data: hourlyValues,
              borderColor: '#e74c3c',
              backgroundColor: 'rgba(231, 76, 60, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 5
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: false,
                text: 'Power Output (Wh)',
                font: {
                  size: 16,
                  weight: 'bold'
                }
              },
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.parsed.y.toFixed(1)} Wh`;
                  }
                }
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Hour of Day'
                },
                ticks: {
                  callback: function(value, index, values) {
                    return value;
                  },
                  font: {
                    size: 12
                  }
                },
                grid: {
                  color: 'rgba(200, 200, 200, 0.2)'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Power Output (Wh)'
                },
                beginAtZero: true,
                ticks: {
                  font: {
                    size: 12
                  }
                },
                grid: {
                  color: 'rgba(200, 200, 200, 0.2)'
                }
              }
            },
            hover: {
              mode: 'nearest',
              intersect: false
            },
            animation: {
              duration: 1000
            }
          }
        });
        
        return unifiedHourlyChart;
      }
      
      // Helper function to get month name
      function getMonthName(monthIndex) {
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June', 
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthIndex];
      }
      
      // Add event listener for month selector
      function setupMonthSelector(monthlyHourlyData, systemSize) {
        const monthSelector = document.getElementById('month-selector');
        
        if (!monthSelector) return;
        
        // Set default to current month
        const currentMonth = new Date().getMonth();
        monthSelector.value = currentMonth;
        
        monthSelector.addEventListener('change', function() {
          const selectedMonth = parseInt(this.value);
          updateUnifiedHourlyChart(monthlyHourlyData, selectedMonth, systemSize);
        });
        
        // Initial chart creation
        createUnifiedHourlyChart(monthlyHourlyData, systemSize);
      }
      
      // Function to update the unified hourly chart
      function updateUnifiedHourlyChart(monthlyHourlyData, month, systemSize) {
        if (!unifiedHourlyChart) return;
        
        // Get the hourly data for the selected month
        const hourlyValues = extractMonthlyHourlyProfile(monthlyHourlyData, month, systemSize);
        
        // Update chart data and title
        unifiedHourlyChart.data.datasets[0].data = hourlyValues;
        unifiedHourlyChart.options.plugins.title.text = getMonthName(month) + ' - Average Hourly Power Output';
        
        // Update the chart
        unifiedHourlyChart.update();
      }
      
      // Function to update hourly profile charts with monthly-hourly data
      function updateHourlyProfileChartsWithMonthlyHourly(monthlyHourlyData, systemSize) {
        // Create the unified hourly chart
        createUnifiedHourlyChart(monthlyHourlyData, systemSize);
        
        // Set up the month selector
        setupMonthSelector(monthlyHourlyData, systemSize);
      }
      
      // Function to update hourly profile charts with hourly data
      function updateHourlyProfileCharts(hourlyData, systemSize) {
        // Process hourly data into monthly-hourly format
        const processedMonthlyHourlyData = processHourlyDataToMonthlyHourly(hourlyData);
        
        // Create and set up the unified hourly chart
        createUnifiedHourlyChart(processedMonthlyHourlyData, systemSize);
        setupMonthSelector(processedMonthlyHourlyData, systemSize);
      }
      
      // Function to process hourly data into monthly-hourly format
      function processHourlyDataToMonthlyHourly(hourlyData) {
        if (!Array.isArray(hourlyData) || hourlyData.length === 0) {
          return generateSampleMonthlyHourlyData();
        }
        
        // Create an empty array for all months (12 months, each with 24 hours)
        const monthlyHourlyOutput = {
          PVOUT_total: new Array(12).fill(null).map(() => new Array(24).fill(0))
        };
        
        // Count the number of data points for each month/hour for averaging
        const dataPointCounts = new Array(12).fill(null).map(() => new Array(24).fill(0));
        
        // Process hourly data
        hourlyData.forEach(point => {
          if (point && point.time && point.value !== undefined) {
            const date = new Date(point.time);
            const month = date.getMonth();
            const hour = date.getHours();
            
            monthlyHourlyOutput.PVOUT_total[month][hour] += point.value;
            dataPointCounts[month][hour]++;
          }
        });
        
        // Calculate averages for each hour in each month
        for (let month = 0; month < 12; month++) {
          for (let hour = 0; hour < 24; hour++) {
            if (dataPointCounts[month][hour] > 0) {
              monthlyHourlyOutput.PVOUT_total[month][hour] /= dataPointCounts[month][hour];
            }
          }
        }
        
        return monthlyHourlyOutput;
      }
      
      // Function to generate sample hourly data
      function generateSampleHourlyData(monthlyOutput, systemSize) {
        // Generate sample monthly-hourly data
        const sampleMonthlyHourlyData = generateSampleMonthlyHourlyData();
        
        // Scale the sample data to match the monthly output
        for (let month = 0; month < 12; month++) {
          const totalMonthlyOutput = monthlyOutput[month];
          const currentTotal = sampleMonthlyHourlyData.PVOUT_total[month].reduce((sum, val) => sum + val, 0) * 30; // Based on 30 days
          
          // Calculate scaling factor
          const scaleFactor = totalMonthlyOutput / (currentTotal || 1);
          
          // Apply scaling
          sampleMonthlyHourlyData.PVOUT_total[month] = sampleMonthlyHourlyData.PVOUT_total[month].map(val => val * scaleFactor);
        }
        
        // Create and set up the unified hourly chart
        createUnifiedHourlyChart(sampleMonthlyHourlyData, systemSize);
        setupMonthSelector(sampleMonthlyHourlyData, systemSize);
      }
      
      // Helper function to generate sample monthly-hourly data
      function generateSampleMonthlyHourlyData() {
        const monthlyHourlyData = {
          PVOUT_total: new Array(12).fill(null).map((_, month) => {
            // Adjust sunrise/sunset times based on season
            const isSummerHalf = month >= 3 && month <= 8;
            const sunriseHour = isSummerHalf ? 5 : 7;
            const sunsetHour = isSummerHalf ? 19 : 17;
            const peakHour = isSummerHalf ? 12 : 11;
            
            // Seasonal factor adjustment (higher in summer, lower in winter)
            const seasonalFactor = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5];
            const factor = seasonalFactor[month];
            
            // Generate hourly data for this month
            return Array.from({length: 24}, (_, hour) => {
              if (hour < sunriseHour || hour > sunsetHour) {
                return 0; // No output before sunrise or after sunset
              }
              
              // Generate a normal distribution curve based on sun height
              const dist = Math.exp(-Math.pow(hour - peakHour, 2) / 8);
              
              // Scale output based on seasonal factor (system size will be applied later)
              return dist * factor * 200;
            });
          })
        };
        
        return monthlyHourlyData;
      }
      
      // Function to extract hourly profile data from monthly-hourly data
      function extractMonthlyHourlyProfile(monthlyHourlyData, month, systemSize) {
        // Check if we have PVOUT_total data available
        if (monthlyHourlyData && monthlyHourlyData.PVOUT_total && Array.isArray(monthlyHourlyData.PVOUT_total)) {
          // monthlyHourlyData.PVOUT_total is a 2D array where each entry is an array of 24 hourly values for a month
          // We can directly access the month's hourly data if available
          if (monthlyHourlyData.PVOUT_total[month] && Array.isArray(monthlyHourlyData.PVOUT_total[month])) {
            // Get the hourly data for this specific month
            const monthHourlyData = monthlyHourlyData.PVOUT_total[month];
            
            // Process the hourly values and scale by system size if needed
            return monthHourlyData.map(value => {
              // Handle null values
              if (value === null || value === undefined || isNaN(value)) {
                return 0;
              }
              
              // Scale by system size if not already scaled
              return value * systemSize;
            });
          }
        }
        
        console.warn("Could not find valid hourly data for month", month);
        
        // Fallback to sample data if extraction fails
        return generateSampleHourlyDataForMonth(month, systemSize);
      }
      
      // Generate sample hourly data for a specific month
      function generateSampleHourlyDataForMonth(month, systemSize) {
        // Adjust sunrise/sunset times based on season
        const isSummerHalf = month >= 3 && month <= 8;
        const sunriseHour = isSummerHalf ? 5 : 7;
        const sunsetHour = isSummerHalf ? 19 : 17;
        const peakHour = isSummerHalf ? 12 : 11;
        
        // Seasonal factor adjustment (higher in summer, lower in winter)
        const seasonalFactor = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5];
        const factor = seasonalFactor[month];
        
        // Generate hourly data
        return Array.from({length: 24}, (_, hour) => {
          if (hour < sunriseHour || hour > sunsetHour) {
            return 0; // No output before sunrise or after sunset
          }
          
          // Generate a normal distribution curve based on sun height
          const dist = Math.exp(-Math.pow(hour - peakHour, 2) / 8);
          
          // Scale output based on system size and seasonal factor
          return dist * factor * systemSize * 200;
        });
      }
      
      // Event listeners for PDF export and share buttons
      function ActionButtons() {
        const exportPdfBtn = document.getElementById('export-pdf');
        
        if (exportPdfBtn) {
          exportPdfBtn.addEventListener('click', function() {
            // Show loading spinner
            showLoadingSpinner('Preparing PDF layout...');
            
            // Create a new window for the print layout
            const printWindow = window.open('', '_blank', 'width=800,height=600');
            
            if (!printWindow) {
              hideLoadingSpinner();
              alert('Please allow popup windows to generate your PDF.');
              return;
            }
            
            // Get results data
            const annualOutput = document.getElementById('annual-output').textContent;
            const monthlySavings = document.getElementById('monthly-savings').textContent;
            const co2Saving = document.getElementById('co2-saving').textContent;
            const gti = document.getElementById('gti').textContent;
            const dailyAverageOutput = document.getElementById('daily-average-output').textContent;
            const annualSavings = document.getElementById('annual-savings').textContent;
            const co2Equivalent = document.getElementById('co2-equivalent').textContent;
            const systemEfficiency = document.getElementById('system-efficiency').textContent;
            const performanceRatio = document.getElementById('performance-ratio').textContent;
            const systemType = document.getElementById('result-system-type').textContent;
            const systemSize = document.getElementById('result-system-size').textContent;
            const orientation = document.getElementById('result-orientation').textContent;
            const tilt = document.getElementById('result-tilt').textContent;
            const selfSufficiency = document.getElementById('self-sufficiency').textContent;
            const location = document.getElementById('location-value').textContent;
            
            // Get country and currency information
            const currencySymbol = document.getElementById('currency-symbol-result').textContent;
            const countryFlag = document.getElementById('country-flag').textContent;
            
            // Check if there's converted savings information
            let convertedSavings = '';
            let convertedYearlySavings = '';
            const convertedSavingsContainer = document.getElementById('converted-savings-container');
            
            if (convertedSavingsContainer && convertedSavingsContainer.style.display !== 'none') {
              convertedSavings = document.getElementById('converted-savings').textContent;
              convertedYearlySavings = document.getElementById('converted-yearly-savings').textContent;
            }
            
            // Get inputs data
            const dailyUsage = document.getElementById('daily-usage').value;
            const electricBill = document.getElementById('electric-bill').value;
            const azimuth = document.getElementById('azimuth').value;
            const tiltValue = document.getElementById('tilt').value;
            
            // Get date information for the printed report
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString();
            const formattedTime = currentDate.toLocaleTimeString();
            
            // Path to logo (update this with the actual path to your logo)
            const logoPath = 'assets/logo/logo.png';
            
            // Write the print layout HTML with space for the logo
            printWindow.document.write(`
              <!DOCTYPE html>
              <html>
              <head>
                <title>Solar Calculator Results - ${formattedDate}</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    color: #333;
                    line-height: 1.5;
                    margin: 0;
                    padding: 20px;
                  }
                  
                  .print-container {
                    max-width: 800px;
                    margin: 0 auto;
                  }
                  
                  .print-header {
                    padding-bottom: 20px;
                    border-bottom: 2px solid #3498db;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                  }
                  
                  .header-logo {
                    flex: 0 0 150px;
                    height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 20px;
                  }
                  
                  .header-logo img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                  }
                  
                  .header-content {
                    flex: 1;
                    margin-left: 50px;
                    text-align: left;
                  }
                  
                  .print-logo {
                    font-size: 24px;
                    font-weight: bold;
                    color: #1a3755;
                    margin-bottom: 5px;
                  }
                  
                  .print-subtitle {
                    color: #666;
                    font-size: 16px;
                  }
                  
                  .print-date {
                    color: #777;
                    font-size: 14px;
                    margin-top: 10px;
                  }
                  
                  .print-section {
                    margin-bottom: 30px;
                  }
                  
                  .section-title {
                    color: #1a3755;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 5px;
                    font-size: 18px;
                    margin-bottom: 15px;
                  }
                  
                  .inputs-section {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    margin-bottom: 20px;
                  }
                  
                  .input-item {
                    flex: 1;
                    min-width: 180px;
                    background-color: #f9f9f9;
                    padding: 10px 15px;
                    border-radius: 8px;
                    border-left: 4px solid #3498db;
                  }
                  
                  .input-label {
                    font-weight: bold;
                    margin-bottom: 5px;
                    color: #555;
                  }
                  
                  .input-value {
                    font-size: 16px;
                  }
                  
                  .results-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    margin-bottom: 25px;
                  }
                  
                  .result-card {
                    flex: 1;
                    min-width: 200px;
                    border: 1px solid #ddd;
                    padding: 15px;
                    border-radius: 8px;
                    background-color: #f5f9ff;
                    text-align: center;
                  }
                  
                  .result-name {
                    font-weight: bold;
                    color: #1a3755;
                    margin-bottom: 10px;
                    font-size: 16px;
                  }
                  
                  .result-value {
                    font-size: 22px;
                    color: #3498db;
                    margin-bottom: 5px;
                    font-weight: bold;
                  }
                  
                  .result-description {
                    color: #777;
                    font-size: 13px;
                  }
                  
                  .production-section {
                    background-color: #f9f9f9;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                  }
                  
                  .production-title {
                    font-size: 16px;
                    font-weight: bold;
                    color: #1a3755;
                    margin-bottom: 10px;
                  }
                  
                  .production-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                  }
                  
                  .production-item {
                    flex: 1;
                    min-width: 200px;
                    background-color: white;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                  }
                  
                  .technical-details {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 15px;
                    margin-bottom: 25px;
                  }
                  
                  .tech-item {
                    background-color: #f5f9ff;
                    padding: 12px 15px;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                  }
                  
                  .tech-label {
                    font-weight: bold;
                    color: #555;
                    margin-bottom: 5px;
                    font-size: 14px;
                  }
                  
                  .tech-value {
                    font-size: 16px;
                    color: #333;
                  }
                  
                  .sufficiency-section {
                    background-color: #f9f9f9;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    text-align: center;
                  }
                  
                  .sufficiency-title {
                    font-size: 16px;
                    font-weight: bold;
                    color: #1a3755;
                    margin-bottom: 10px;
                  }
                  
                  .sufficiency-value {
                    font-size: 24px;
                    color: #27ae60;
                    font-weight: bold;
                    margin-bottom: 5px;
                  }
                  
                  .sufficiency-meter {
                    height: 20px;
                    background-color: #ecf0f1;
                    border-radius: 10px;
                    margin: 10px 0;
                    overflow: hidden;
                  }
                  
                  .sufficiency-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #3498db, #2ecc71);
                    width: 50%;
                  }
                  
                  .print-footer {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 14px;
                    color: #777;
                    padding-top: 15px;
                    border-top: 1px solid #ddd;
                  }
                  
                  .print-actions {
                    text-align: center;
                    margin-top: 30px;
                  }
                  
                  .print-button {
                    background-color: #3498db;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    font-size: 16px;
                    border-radius: 5px;
                    cursor: pointer;
                  }
                  
                  .print-button:hover {
                    background-color: #2980b9;
                  }
                  
                  .disclaimer {
                    font-size: 12px;
                    color: #777;
                    font-style: italic;
                    margin-top: 20px;
                  }

                  .savings-disclaimer {
                    background-color: #f8f9fa;
                    border-left: 4px solid #f1c40f;
                    padding: 12px 15px;
                    font-size: 14px;
                    color: #666;
                    margin-top: 10px;
                    margin-bottom: 20px;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    border-radius: 0 4px 4px 0;
                  }

                  .country-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 16px;
                  }
                  
                  .country-flag {
                    font-size: 24px;
                  }
                  
                  @media print {
                    .print-actions {
                      display: none;
                    }
                    
                    body {
                      padding: 0;
                      margin: 0;
                    }
                    
                    .print-container {
                      max-width: 100%;
                    }
                  }
                </style>
              </head>
              <body>
                <div class="print-container">
                  <div class="print-header">
                    <div class="header-logo">
                      <img src="${logoPath}" alt="Solar Logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'150\\' height=\\'80\\'><rect width=\\'150\\' height=\\'80\\' fill=\\'%23f8f8f8\\'/><text x=\\'75\\' y=\\'40\\' font-family=\\'Arial\\' font-size=\\'12\\' fill=\\'%23666\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'>SOLAR LOGO</text></svg>';">
                    </div>
                    <div class="header-content">
                      <div class="print-logo">Advanced Solar Calculator</div>
                      <div class="print-subtitle">Your Personalized Solar System Recommendation</div>
                      <div class="print-date">Generated on ${formattedDate} at ${formattedTime}</div>
                    </div>
                  </div>
                  
                  <div class="print-section">
                    <div class="section-title">System Location & Settings</div>
                    <div class="inputs-section">
                      <div class="input-item">
                        <div class="input-label">Location</div>
                        <div class="input-value">${location}</div>
                      </div>
                      <div class="input-item">
                        <div class="input-label">System Type</div>
                        <div class="input-value">${systemType}</div>
                      </div>
                      <div class="input-item">
                        <div class="input-label">Panel Orientation</div>
                        <div class="input-value">${orientation}</div>
                      </div>
                      <div class="input-item">
                        <div class="input-label">Panel Tilt</div>
                        <div class="input-value">${tilt}</div>
                      </div>
                    </div>
                    
                    <div class="country-info">
                      <span>Electricity calculations in ${currencySymbol}</span>
                    </div>
                  </div>
                  
                  <div class="print-section">
                    <div class="section-title">Solar Production Results</div>
                    
                    <div class="results-grid">
                      <div class="result-card">
                        <div class="result-name">Annual Energy Production</div>
                        <div class="result-value">${annualOutput} kWh</div>
                        <div class="result-description">Total energy produced per year</div>
                      </div>
                      
                      <div class="result-card">
                        <div class="result-name">Daily Average Production</div>
                        <div class="result-value">${dailyAverageOutput}</div>
                        <div class="result-description">Average energy produced each day</div>
                      </div>
                      
                      <div class="result-card">
                        <div class="result-name">System Size</div>
                        <div class="result-value">${systemSize}</div>
                        <div class="result-description">Total solar capacity</div>
                      </div>
                    </div>
                    
                    <div class="sufficiency-section">
                      <div class="sufficiency-title">Energy Self-Sufficiency</div>
                      <div class="sufficiency-value">${selfSufficiency}</div>
                      <div class="sufficiency-meter">
                        <div class="sufficiency-fill" style="width: ${selfSufficiency.replace('%', '')}%"></div>
                      </div>
                      <div class="description">Percentage of your energy needs covered by solar</div>
                    </div>
                  </div>
                  
                  <div class="print-section">
                    <div class="section-title">Financial Benefits</div>
                    
                    <div class="results-grid">
                      <div class="savings-disclaimer">
                        <i class="fas fa-info-circle"></i> 
                        Savings estimates vary based on electricity rates, local policies, seasonal changes, and utility billing practices.
                      </div>
                      <div class="result-card">
                        <div class="result-name">Monthly Savings</div>
                        <div class="result-value">${currencySymbol}${monthlySavings}</div>
                        <div class="result-description">Average monthly bill reduction<br>
                        </div>
                      </div>
                      
                      <div class="result-card">
                        <div class="result-name">Annual Savings</div>
                        <div class="result-value">${annualSavings}</div>
                        <div class="result-description">Total yearly savings</div>
                      </div>
                      
                      ${convertedSavings ? `
                      <div class="result-card">
                        <div class="result-name">Converted Savings (AUD)</div>
                        <div class="result-value">AUD ${convertedSavings}</div>
                        <div class="result-description">Monthly savings in Australian Dollars</div>
                      </div>
                      ` : ''}
                    </div>
                  </div>
                  
                  <div class="print-section">
                    <div class="section-title">Environmental Impact</div>
                    
                    <div class="results-grid">
                      <div class="result-card">
                        <div class="result-name">CO₂ Reduction</div>
                        <div class="result-value">${co2Saving} tons</div>
                        <div class="result-description">CO₂ emissions avoided over 20 years</div>
                      </div>
                      
                      <div class="result-card">
                        <div class="result-name">Environmental Equivalent</div>
                        <div class="result-value">${co2Equivalent.replace('Equivalent to ', '')}</div>
                        <div class="result-description">Environmental impact comparison</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="print-section">
                    <div class="section-title">Technical Details</div>
                    
                    <div class="technical-details">
                      <div class="tech-item">
                        <div class="tech-label">Global Tilted Irradiation (GTI)</div>
                        <div class="tech-value">${gti}</div>
                      </div>
                      
                      <div class="tech-item">
                        <div class="tech-label">System Efficiency</div>
                        <div class="tech-value">${systemEfficiency}%</div>
                      </div>
                      
                      <div class="tech-item">
                        <div class="tech-label">Performance Ratio</div>
                        <div class="tech-value">${performanceRatio}</div>
                      </div>
                      
                      <div class="tech-item">
                        <div class="tech-label">Daily Energy Usage</div>
                        <div class="tech-value">${dailyUsage} kWh/day</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="print-footer">
                    This solar system recommendation is based on the parameters you selected.
                    For a detailed professional assessment, please contact a solar installation expert.
                  </div>
                  
                  <div class="disclaimer">
                    Note: Actual energy production and savings may vary based on specific environmental conditions, 
                    equipment selection, and changes in electricity rates.
                  </div>
                  
                  <div class="print-actions">
                    <button class="print-button" onclick="window.print();">Print This Page</button>
                  </div>
                </div>
                
                <script>
                  // Auto-print once everything is loaded
                  window.onload = function() {
                    // Small delay to ensure styles are applied
                    setTimeout(function() {
                      // Notify the opener window that printing is ready
                      window.opener.postMessage('print_ready', '*');
                    }, 500);
                  }
                </script>
              </body>
              </html>
            `);
            
            // Close the document to finish loading
            printWindow.document.close();
            
            // Set up message listener for when printing is ready
            window.addEventListener('message', function messageHandler(e) {
              if (e.data === 'print_ready') {
                // Remove the event listener to prevent multiple calls
                window.removeEventListener('message', messageHandler);
                
                // Hide the loading spinner
                hideLoadingSpinner();
              }
            });
          });
        }
      }

      // pdf button
      ActionButtons();
      
      // Initialize the appliance grid with default items
      document.getElementById('selected-appliances-list').innerHTML = '<div class="no-results">No appliances selected</div>';
      
      // Set default state for system type cards
      document.querySelector(`.system-type-card[data-value="${systemTypeSelect.value}"]`).classList.add('selected');
      
      // Initialize with hidden appliance calculator
      applianceSection.style.display = 'none';
      
      
      // Set initial currency display
      updateCurrencyDisplay();
      
      // Initial recommended size update
      updateRecommendedSize();
      
      // Enhance panel visualization and add reset button
      enhancePanelVisualization();
      addResetButton();
      
      // Hide any axis labels that might be in the HTML
      setTimeout(() => {
        // Remove axis lines and labels
        const panelAxes = document.querySelectorAll('.panel-axis');
        panelAxes.forEach(axis => {
          if (axis) axis.style.display = 'none';
        });
        
        const axisLabels = document.querySelectorAll('.axis-label');
        axisLabels.forEach(label => {
          if (label) label.style.display = 'none';
        });
        
        // Fix the sun position to avoid overlap
        const sunIndicator = document.getElementById('sun-indicator');
        if (sunIndicator) {
          sunIndicator.style.left = '75%';
          sunIndicator.style.top = '25%';
        }
        
        // Remove Results Calculate button if it exists
        const resultsCalculateBtn = document.querySelector('#step-5 .calculate-btn');
        if (resultsCalculateBtn && resultsCalculateBtn.id !== 'panel-calculate-btn') {
          if (resultsCalculateBtn.parentNode) {
            resultsCalculateBtn.parentNode.removeChild(resultsCalculateBtn);
          }
        }
      
        // Initialize tooltips on page load
        initializeTooltips();
      }, 500);
      
      // Initial panel model update
      updatePanelModel();
      updateSunPosition();
      
      // Add input validation initialization
      initInputValidation();
    });

  function initInputValidation() {
    // Find all numeric input fields
    validateNumericInputs();

    // Setup validation for custom appliance form
    setupCustomApplianceValidation();

    // Setup validation for system configuration inputs
    setupSystemConfigValidation();

    // Setup observers for newly added elements
    observeDynamicInputs();
  }

  function validateNumericInputs() {
    // General usage inputs
    const allNumericInputs = document.querySelectorAll('input[type="number"]');
    
    allNumericInputs.forEach(input => {
      if (input.classList.contains('appliance-quantity')) {
        setupQuantityValidation(input);
      } else if (input.classList.contains('appliance-wattage')) {
        setupWattageValidation(input);
      } else if (input.classList.contains('location-lat') || input.classList.contains('location-lng')) {
        setupCoordinateValidation(input);
      } else if (input.classList.contains('panel-efficiency')) {
        setupEfficiencyValidation(input);
      } else if (input.id === 'avg-sun-hours') {
        setupSunHoursValidation(input);
      } else if (input.id === 'battery-days') {
        setupBatteryDaysValidation(input);
      } else if (input.id === 'system-losses') {
        setupLossesValidation(input);
      } else if (input.id === 'daily-usage') {
        setupDailyUsageValidation(input);
      } else if (input.id === 'electric-bill') {
        setupElectricBillValidation(input);
      } else if (input.id === 'system-size') {
        setupSystemSizeValidation(input);
      } else if (input.id === 'azimuth') {
        setupAzimuthValidation(input);
      } else if (input.id === 'tilt') {
        setupTiltValidation(input);
      } else {
        // Default validation for any other numeric inputs
        setupDefaultNumericValidation(input);
      }
    });
  }

  function setupQuantityValidation(input) {
    input.setAttribute('min', '1');
    input.setAttribute('max', '99');
    
    input.addEventListener('input', function() {
      let value = parseInt(this.value);
      
      // Ensure positive integer
      if (isNaN(value) || value < 1) {
        value = 1;
      }
      
      // Reasonable maximum
      if (value > 99) {
        value = 99;
      }
      
      // Ensure whole number
      value = Math.floor(value);
      
      // Update if changed
      if (this.value != value) {
        this.value = value;
      }
    });
  }

  function setupWattageValidation(input) {
    input.setAttribute('min', '1');
    input.setAttribute('max', '100000');
    
    input.addEventListener('input', function() {
      let value = parseInt(this.value);
      
      // Ensure positive number
      if (isNaN(value) || value < 1) {
        value = 1;
      }
      
      // Reasonable maximum (100kW)
      if (value > 100000) {
        value = 100000;
      }
      
      // Ensure whole number for wattage
      value = Math.floor(value);
      
      // Update if changed
      if (this.value != value) {
        this.value = value;
      }
    });
  }

  function setupCustomApplianceValidation() {
    const nameInput = document.getElementById('custom-appliance-name');
    const wattageInput = document.getElementById('custom-appliance-wattage');
    const hoursInput = document.getElementById('custom-appliance-hours');
    
    if (nameInput) {
      nameInput.addEventListener('input', function() {
        if (this.value.trim() === '') {
          this.value = 'Custom Appliance';
        }
      });
    }
    
    if (wattageInput) {
      wattageInput.setAttribute('min', '1');
      wattageInput.setAttribute('max', '100000');
      
      wattageInput.addEventListener('input', function() {
        let value = parseInt(this.value);
        
        // Ensure positive number
        if (isNaN(value) || value < 1) {
          value = 1;
        }
        
        // Reasonable maximum (100kW)
        if (value > 100000) {
          value = 100000;
        }
        
        // Update if changed
        if (this.value != value) {
          this.value = value;
        }
      });
    }
    
    if (hoursInput) {
      hoursInput.setAttribute('min', '0.1');
      hoursInput.setAttribute('max', '24');
      hoursInput.setAttribute('step', '0.1');
      
      hoursInput.addEventListener('input', function() {
        let value = parseFloat(this.value);
        
        // Ensure positive number
        if (isNaN(value) || value < 0.1) {
          value = 0.1;
        }
        
        // Maximum hours per day
        if (value > 24) {
          value = 24;
        }
        
        // Round to 1 decimal
        value = Math.round(value * 10) / 10;
        
        // Update if changed
        if (this.value != value) {
          this.value = value;
        }
      });
    }
  }

  function setupSystemConfigValidation() {
    // Location coordinates validation
    const latInput = document.getElementById('location-lat');
    const lngInput = document.getElementById('location-lng');
    
    if (latInput) {
      setupCoordinateValidation(latInput, true);
    }
    
    if (lngInput) {
      setupCoordinateValidation(lngInput, false);
    }
    
    // Panel efficiency validation
    const efficiencyInput = document.getElementById('panel-efficiency');
    if (efficiencyInput) {
      setupEfficiencyValidation(efficiencyInput);
    }
    
    // Sun hours validation
    const sunHoursInput = document.getElementById('avg-sun-hours');
    if (sunHoursInput) {
      setupSunHoursValidation(sunHoursInput);
    }
    
    // Battery days validation
    const batteryDaysInput = document.getElementById('battery-days');
    if (batteryDaysInput) {
      setupBatteryDaysValidation(batteryDaysInput);
    }
    
    // System losses validation
    const lossesInput = document.getElementById('system-losses');
    if (lossesInput) {
      setupLossesValidation(lossesInput);
    }
  }

  function setupCoordinateValidation(input, isLatitude) {
    const min = isLatitude ? -90 : -180;
    const max = isLatitude ? 90 : 180;
    
    input.setAttribute('min', min);
    input.setAttribute('max', max);
    input.setAttribute('step', '0.000001');
    
    input.addEventListener('input', function() {
      let value = parseFloat(this.value);
      
      // Check bounds
      if (isNaN(value)) {
        value = 0;
      } else if (value < min) {
        value = min;
      } else if (value > max) {
        value = max;
      }
      
      // Limit to 6 decimal places
      value = Math.round(value * 1000000) / 1000000;
      
      // Update if changed
      if (this.value != value) {
        this.value = value;
      }
    });
  }

  function setupEfficiencyValidation(input) {
    input.setAttribute('min', '5');
    input.setAttribute('max', '30');
    input.setAttribute('step', '0.1');
    
    input.addEventListener('input', function() {
      let value = parseFloat(this.value);
      
      // Check bounds (real-world panel efficiency range)
      if (isNaN(value) || value < 5) {
        value = 5;
      } else if (value > 30) {
        value = 30;
      }
      
      // Round to 1 decimal
      value = Math.round(value * 10) / 10;
      
      // Update if changed
      if (this.value != value) {
        this.value = value;
      }
    });
  }

  function setupSunHoursValidation(input) {
    input.setAttribute('min', '1');
    input.setAttribute('max', '12');
    input.setAttribute('step', '0.1');
    
    input.addEventListener('input', function() {
      let value = parseFloat(this.value);
      
      // Check bounds
      if (isNaN(value) || value < 1) {
        value = 1;
      } else if (value > 12) {
        value = 12;
      }
      
      // Round to 1 decimal
      value = Math.round(value * 10) / 10;
      
      // Update if changed
      if (this.value != value) {
        this.value = value;
      }
    });
  }

  function setupBatteryDaysValidation(input) {
    input.setAttribute('min', '0.5');
    input.setAttribute('max', '14');
    input.setAttribute('step', '0.5');
    
    input.addEventListener('input', function() {
      let value = parseFloat(this.value);
      
      // Check bounds
      if (isNaN(value) || value < 0.5) {
        value = 0.5;
      } else if (value > 14) {
        value = 14;
      }
      
      // Round to 1 decimal
      value = Math.round(value * 10) / 10;
      
      // Update if changed
      if (this.value != value) {
        this.value = value;
      }
    });
  }

  function setupLossesValidation(input) {
    input.setAttribute('min', '5');
    input.setAttribute('max', '40');
    input.setAttribute('step', '1');
    
    input.addEventListener('input', function() {
      let value = parseFloat(this.value);
      
      // Check bounds
      if (isNaN(value) || value < 5) {
        value = 5;
      } else if (value > 40) {
        value = 40;
      }
      
      // Round to whole number
      value = Math.round(value);
      
      // Update if changed
      if (this.value != value) {
        this.value = value;
      }
    });
  }

  function setupDailyUsageValidation(input) {
    input.setAttribute('min', '0.1');
    input.setAttribute('max', '1000');
    input.setAttribute('step', '0.1');
    
    input.addEventListener('input', function() {
      let value = parseFloat(this.value);
      
      // Check for negative values or NaN
      if (isNaN(value) || value <= 0) {
        if (value < 0) {
          showErrorPopup('Daily usage cannot be negative', 'Please enter a positive value for your daily electricity usage.');
        }
        value = 0.1;
      } else if (value > 1000) {
        showErrorPopup('Value exceeds maximum', 'Daily usage cannot exceed 1000 kWh. For larger systems, please contact us directly.');
        value = 1000;
      }
      
      // Round to 1 decimal place
      value = Math.round(value * 10) / 10;
      
      // Update if changed
      if (this.value != value) {
        this.value = value;
      }
    });
  }

  function setupElectricBillValidation(input) {
    input.setAttribute('min', '1');
    input.setAttribute('max', '10000');
    
    input.addEventListener('input', function() {
      let value = parseFloat(this.value);
      
      // Check for negative values or NaN
      if (isNaN(value) || value <= 0) {
        if (value < 0) {
          showErrorPopup('Electric bill cannot be negative', 'Please enter a positive value for your monthly electric bill.');
        }
        value = 1;
      } else if (value > 10000) {
        showErrorPopup('Value exceeds maximum', 'Monthly bill amount cannot exceed 10,000. For larger bills, please contact us directly.');
        value = 10000;
      }
      
      // Round to whole number
      value = Math.round(value);
      
      // Update if changed
      if (this.value != value) {
        this.value = value;
      }
    });
  }

  function setupSystemSizeValidation(input) {
    input.setAttribute('min', '0.5');
    input.setAttribute('max', '1000');
    input.setAttribute('step', '0.1');
    
    input.addEventListener('input', function() {
      let value = parseFloat(this.value);
      
      // Check for negative values or NaN
      if (isNaN(value) || value < 0.5) {
        if (value < 0) {
          showErrorPopup('System size cannot be negative', 'Please enter a positive value for your solar system size.');
        }
        value = 0.5;
      } else if (value > 1000) {
        showErrorPopup('Value exceeds maximum', 'System size cannot exceed 1000 kWp. For larger systems, please contact us directly.');
        value = 1000;
      }
      
      // Round to 1 decimal place
      value = Math.round(value * 10) / 10;
      
      // Update if changed
      if (this.value != value) {
        this.value = value;
      }
    });
  }

  function setupAzimuthValidation(input) {
    input.setAttribute('min', '0');
    input.setAttribute('max', '359');
    
    input.addEventListener('input', function() {
      let value = parseInt(this.value);
      
      // Wrap around negative values instead of showing error
      if (isNaN(value)) {
        value = 0;
      } else if (value < 0) {
        value = 360 + (value % 360); // Convert negative to positive equivalent
      } else if (value >= 360) {
        value = value % 360;
      }
      
      // Ensure whole number
      value = Math.floor(value);
      
      // Update if changed
      if (this.value != value) {
        this.value = value;
      }
    });
  }

  function setupTiltValidation(input) {
    input.setAttribute('min', '0');
    input.setAttribute('max', '90');
    
    input.addEventListener('input', function() {
      let value = parseInt(this.value);
      
      // Check for negative values or NaN
      if (isNaN(value) || value < 0) {
        if (value < 0) {
          showErrorPopup('Tilt angle cannot be negative', 'Please enter a value between 0° and 90° for panel tilt.');
        }
        value = 0;
      } else if (value > 90) {
        showErrorPopup('Invalid tilt angle', 'Tilt angle cannot exceed 90°. Please enter a value between 0° and 90°.');
        value = 90;
      }
      
      // Ensure whole number
      value = Math.floor(value);
      
      // Update if changed
      if (this.value != value) {
        this.value = value;
      }
    });
  }

  function setupDefaultNumericValidation(input) {
    // Get min/max from attributes or set defaults
    const min = parseFloat(input.getAttribute('min')) || 0;
    const max = parseFloat(input.getAttribute('max')) || 9999;
    
    input.addEventListener('input', function() {
      let value = parseFloat(this.value);
      
      // Check for negative values or NaN
      if (isNaN(value)) {
        value = min;
      } else if (value < min) {
        if (min > 0 && value < 0) {
          showErrorPopup('Invalid negative value', 'Please enter a positive value.');
        }
        value = min;
      } else if (value > max) {
        showErrorPopup('Value exceeds maximum', `Please enter a value below ${max}.`);
        value = max;
      }
      
      // Update if changed
      if (this.value != value) {
        this.value = value;
      }
    });
  }

  function observeDynamicInputs() {
    // Watch for new appliances added to the list
    const appliancesList = document.getElementById('selected-appliances-list');
    if (appliancesList) {
      const observer = new MutationObserver(function(mutations) {
        validateNumericInputs();
      });
      
      observer.observe(appliancesList, { childList: true, subtree: true });
    }
  }

  // Initialize validation when document is loaded
  document.addEventListener("DOMContentLoaded", () => {
    // ... existing initialization code ...
    
    // Initialize input validation
    initInputValidation();
  });

  // Function to show error popup
  function showErrorPopup(title, message) {
    // Check if popup already exists to prevent duplicates
    if (document.querySelector('.error-popup-overlay')) {
      return;
    }
    
    // Create popup elements
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'error-popup-overlay';
    
    const popupContainer = document.createElement('div');
    popupContainer.className = 'error-popup-container';
    
    // Popup content
    popupContainer.innerHTML = `
      <div class="error-popup-header">
        <h3>${title}</h3>
        <button class="error-popup-close">&times;</button>
      </div>
      <div class="error-popup-content">
        <div class="error-icon">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <p>${message}</p>
        <button class="error-popup-ok-btn">OK</button>
      </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .error-popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        backdrop-filter: blur(5px);
        animation: fadeIn 0.2s ease-out;
      }
      
      .error-popup-container {
        background-color: #fff;
        width: 90%;
        max-width: 450px;
        border-radius: 10px;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        animation: slideDown 0.3s ease-out;
      }
      
      .error-popup-header {
        background: linear-gradient(45deg, #e74c3c, #c0392b);
        color: white;
        padding: 15px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .error-popup-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
      }
      
      .error-popup-close {
        background: transparent;
        border: none;
        color: white;
        font-size: 22px;
        cursor: pointer;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s;
      }
      
      .error-popup-close:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      
      .error-popup-content {
        padding: 25px;
        text-align: center;
      }
      
      .error-icon {
        font-size: 48px;
        color: #e74c3c;
        margin-bottom: 15px;
      }
      
      .error-popup-content p {
        margin-bottom: 20px;
        color: #2c3e50;
        font-size: 16px;
        line-height: 1.5;
      }
      
      .error-popup-ok-btn {
        background-color: #3498db;
        color: white;
        border: none;
        padding: 10px 25px;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        transition: background 0.2s;
      }
      
      .error-popup-ok-btn:hover {
        background-color: #2980b9;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideDown {
        from { 
          transform: translateY(-20px);
          opacity: 0;
        }
        to { 
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      @media (max-width: 768px) {
        .error-popup-container {
          width: 95%;
        }
        
        .error-popup-content {
          padding: 20px;
        }
        
        .error-icon {
          font-size: 40px;
        }
      }
    `;
    
    // Append to DOM
    document.head.appendChild(style);
    popupOverlay.appendChild(popupContainer);
    document.body.appendChild(popupOverlay);
    
    // Add event listener to close button
    const closeBtn = popupContainer.querySelector('.error-popup-close');
    closeBtn.addEventListener('click', function() {
      popupOverlay.remove();
    });
    
    // Add event listener to OK button
    const okBtn = popupContainer.querySelector('.error-popup-ok-btn');
    okBtn.addEventListener('click', function() {
      popupOverlay.remove();
    });
    
    // Close on overlay click
    popupOverlay.addEventListener('click', function(e) {
      if (e.target === popupOverlay) {
        popupOverlay.remove();
      }
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
      if (document.body.contains(popupOverlay)) {
        popupOverlay.remove();
      }
    }, 5000);
  }
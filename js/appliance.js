/**
 * Shared appliances data module for both Assistive and Standard calculator modes
 * This file contains the common appliance data and functions to generate the appliance grid
 */

// Define the appliances data
const appliancesData = [
  // LIGHTING
  {
    category: "lighting",
    wattage: 100,
    hours: 5,
    title: "LED Lights (10x)",
    titleId: "appliance-led-lights",
    image: "assets/lightbulb.png",
    energy: "low"
  },
  {
    category: "lighting",
    wattage: 11,
    hours: 8,
    title: "Lights",
    titleId: "appliance-lights",
    image: "assets/lightbulb.png",
    energy: "low"
  },
  // KITCHEN
  {
    category: "kitchen",
    wattage: 175,
    hours: 8,
    title: "Fridge/Freezer - Large",
    titleId: "appliance-fridge-freezer-large",
    image: "assets/fridge-large.png",
    energy: "medium"
  },
  {
    category: "kitchen",
    wattage: 150,
    hours: 6,
    title: "Freezer - Chest",
    titleId: "appliance-freezer-chest",
    image: "assets/freezer-chest.png",
    energy: "medium"
  },
  {
    category: "kitchen",
    wattage: 1800,
    hours: 0.5,
    title: "Microwave",
    titleId: "appliance-microwave",
    image: "assets/microwave.png",
    energy: "medium"
  },
  {
    category: "kitchen",
    wattage: 1800,
    hours: 1,
    title: "Dishwasher",
    titleId: "appliance-dishwasher",
    image: "assets/dishwasher.png",
    energy: "high"
  },
  {
    category: "kitchen",
    wattage: 3400,
    hours: 1,
    title: "Electric Oven",
    titleId: "appliance-electric-oven",
    image: "assets/oven.png",
    energy: "high"
  },
  {
    category: "kitchen",
    wattage: 20,
    hours: 1,
    title: "Gas Oven",
    titleId: "appliance-gas-oven",
    image: "assets/oven.png",
    energy: "low"
  },
  {
    category: "kitchen",
    wattage: 2200,
    hours: 0.5,
    title: "Kettle",
    titleId: "appliance-kettle",
    image: "assets/electric-kettle.png",
    energy: "medium"
  },
  {
    category: "kitchen",
    wattage: 1500,
    hours: 0.2,
    title: "Toaster",
    titleId: "appliance-toaster",
    image: "assets/toaster.png",
    energy: "medium"
  },
  // COOLING
  {
    category: "cooling",
    wattage: 40,
    hours: 5,
    title: "Fan - Ceiling",
    titleId: "appliance-fan-ceiling",
    image: "assets/ceiling-fan.png",
    energy: "low"
  },
  {
    category: "cooling",
    wattage: 1800,
    hours: 4,
    title: "Air Conditioner - Large",
    titleId: "appliance-air-conditioner-large",
    image: "assets/air-conditioner-large.png",
    energy: "high"
  },
  {
    category: "cooling",
    wattage: 850,
    hours: 4,
    title: "Air Conditioner - Small",
    titleId: "appliance-air-conditioner-small",
    image: "assets/air-conditioner-small.png",
    energy: "medium"
  },
  // ENTERTAINMENT
  {
    category: "entertainment",
    wattage: 120,
    hours: 4,
    title: "TV (LED)",
    titleId: "appliance-tv-led",
    image: "assets/tv.png",
    energy: "low"
  },
  {
    category: "entertainment",
    wattage: 140,
    hours: 1,
    title: "Gaming Console",
    titleId: "appliance-gaming",
    image: "assets/game-console.png",
    energy: "low"
  },
  // WORK & LEISURE
  {
    category: "work-leisure",
    wattage: 200,
    hours: 4,
    title: "Laptop / Computers",
    titleId: "appliance-laptop-computers",
    image: "assets/computer.png",
    energy: "medium"
  },
  {
    category: "work-leisure",
    wattage: 1350,
    hours: 0.2,
    title: "Coffee Machine",
    titleId: "appliance-coffee-machine",
    image: "assets/coffee-machine.png",
    energy: "medium"
  },
  {
    category: "work-leisure",
    wattage: 2000,
    hours: 1,
    title: "Electric Stovetop - Large",
    titleId: "appliance-electric-stovetop-large",
    image: "assets/oven.png",
    energy: "high"
  },
  {
    category: "work-leisure",
    wattage: 1200,
    hours: 1,
    title: "Electric Stovetop - Small",
    titleId: "appliance-electric-stovetop-small",
    image: "assets/oven.png",
    energy: "medium"
  },
  {
    category: "work-leisure",
    wattage: 10,
    hours: 24,
    title: "Modem / Internet",
    titleId: "appliance-modem-internet",
    image: "assets/game-console.png",
    energy: "low"
  },
  // LAUNDRY
  {
    category: "laundry",
    wattage: 500,
    hours: 1,
    title: "Washing Machine",
    titleId: "appliance-washing-machine",
    image: "assets/washing-machine.png",
    energy: "medium"
  },
  {
    category: "laundry",
    wattage: 2500,
    hours: 1,
    title: "Dryer",
    titleId: "appliance-dryer",
    image: "assets/dryer.png",
    energy: "high"
  },
  {
    category: "laundry",
    wattage: 2000,
    hours: 0.1,
    title: "Hair Dryer",
    titleId: "appliance-hair-dryer",
    image: "assets/hairdryer.png",
    energy: "medium"
  },
  // GENERAL
  {
    category: "general",
    wattage: 240,
    hours: 1,
    title: "Charging for Common Power Tools",
    titleId: "appliance-power-tools-charging",
    image: "assets/charging-comon.png",
    energy: "medium"
  },
  {
    category: "general",
    wattage: 650,
    hours: 1,
    title: "Pressure Pump",
    titleId: "appliance-pressure-pump",
    image: "assets/pressure-pump.png",
    energy: "medium"
  },
  {
    category: "general",
    wattage: 1,
    hours: 1,
    title: "Custom Appliance",
    titleId: "appliance-custom",
    image: "assets/custom.png",
    energy: "low",
    isCustom: true // Mark this as a custom appliance for special handling
  }
];

// Counter for custom appliances
let customApplianceCount = 0;

/**
 * Loads the appliances grid in the specified container
 * @param {string} mode - 'assistive' or 'standard'
 * @param {string} containerId - The ID of the container to load the grid into
 */
function loadAppliancesGrid(mode, containerId) {
  const container = document.getElementById(containerId);
  let appliances;
  
  // Filter appliances based on mode
  if (mode === 'assistive') {
    appliances = appliancesData.filter(appliance => !appliance.modeStandard);
  } else {
    // Default to all appliances for basic mode
    appliances = appliancesData;
  }
  
  if (!container) return;
  
  // Clear the container
  container.innerHTML = '';
  
  // Create the master "Add Custom Appliance" card
  const customTemplateIndex = appliances.findIndex(appliance => appliance.isCustom);
  const customTemplate = customTemplateIndex !== -1 ? appliances[customTemplateIndex] : null;
  
  // Generate the HTML for standard appliances (excluding custom)
  appliances.forEach(appliance => {
    // Skip the custom appliance as we'll add it at the end
    if (appliance.isCustom) return;
    
    const applianceCard = document.createElement('div');
    applianceCard.className = 'appliance-card';
    applianceCard.dataset.category = appliance.category;
    applianceCard.dataset.wattage = appliance.wattage;
    applianceCard.dataset.hours = appliance.hours;
    applianceCard.dataset.title = appliance.title;
    
    applianceCard.innerHTML = `
      <div class="energy-indicator energy-${appliance.energy}"></div>
      <img src="${appliance.image}" alt="${appliance.title}" class="appliance-icon">
      <div class="appliance-name" id="${appliance.titleId}">${appliance.title}</div>
      <div class="quantity-control">
        <button class="quantity-btn minus-btn">-</button>
        <div class="quantity-value">0</div>
        <button class="quantity-btn plus-btn">+</button>
      </div>
    `;
    
    container.appendChild(applianceCard);
  });
  
  // If we have a custom template, add it as a special card at the end
  if (customTemplate) {
    const customCard = document.createElement('div');
    customCard.className = 'appliance-card custom-template';
    customCard.dataset.category = customTemplate.category;
    customCard.dataset.title = customTemplate.title;
    customCard.dataset.isCustomTemplate = 'true';
    
    customCard.innerHTML = `
      <div class="energy-indicator energy-${customTemplate.energy}"></div>
      <img src="${customTemplate.image}" alt="${customTemplate.title}" class="appliance-icon">
      <div class="appliance-name" id="${customTemplate.titleId}">${customTemplate.title}</div>
      <div class="add-custom-btn">
        <button class="add-custom-appliance">+</button>
      </div>
    `;
    
    container.appendChild(customCard);
    
    // Add event listener for the add custom appliance button
    const addCustomBtn = customCard.querySelector('.add-custom-appliance');
    
    // Use a one-time event handler to prevent duplicate handlers
    addCustomBtn.addEventListener('click', function handleAddCustom() {
      addCustomApplianceCard(container);
    });
  }
  
  // Attach event listeners for regular appliance cards
  attachQuantityListeners(container);
}

/**
 * Attach event listeners to quantity buttons for regular appliances
 * @param {HTMLElement} container - The container element
 */
function attachQuantityListeners(container) {
  const minusBtns = container.querySelectorAll('.appliance-card:not(.custom-appliance):not(.custom-template) .minus-btn');
  const plusBtns = container.querySelectorAll('.appliance-card:not(.custom-appliance):not(.custom-template) .plus-btn');
  
  minusBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const valueEl = this.nextElementSibling;
      let value = parseInt(valueEl.textContent);
      if (value > 0) {
        value--;
        valueEl.textContent = value;
        
        const card = this.closest('.appliance-card');
        if (value === 0) {
          card.classList.remove('selected');
        }
      }
    });
  });
  
  plusBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const valueEl = this.previousElementSibling;
      let value = parseInt(valueEl.textContent);
      value++;
      valueEl.textContent = value;
      
      const card = this.closest('.appliance-card');
      card.classList.add('selected');
    });
  });
}

// Validate custom appliance inputs when added
function validateCustomApplianceInput(card) {
  if (!card) return;
  
  // Get custom appliance inputs
  const wattageInput = card.querySelector('.custom-wattage');
  const hoursInput = card.querySelector('.custom-hours');
  const nameInput = card.querySelector('.editable-appliance-name');
  
  // Validate wattage input
  if (wattageInput) {
    wattageInput.setAttribute('min', '1');
    wattageInput.setAttribute('max', '100000'); // 100kW reasonable max
    
    wattageInput.addEventListener('input', function() {
      let value = parseInt(this.value);
      
      // Check for negative or zero values
      if (isNaN(value) || value < 1) {
        value = 1;
      }
      
      // Check for unreasonable high values
      if (value > 100000) {
        value = 100000;
      }
      
      // Ensure whole numbers for wattage
      value = Math.floor(value);
      
      // Update input value if it was adjusted
      if (this.value != value) {
        this.value = value;
      }
    });
  }
  
  // Validate hours input
  if (hoursInput) {
    hoursInput.setAttribute('min', '0.1');
    hoursInput.setAttribute('max', '24');
    hoursInput.setAttribute('step', '0.1');
    
    hoursInput.addEventListener('input', function() {
      let value = parseFloat(this.value);
      
      // Check for negative values
      if (isNaN(value) || value < 0.1) {
        value = 0.1;
      }
      
      // Limit to 24 hours per day
      if (value > 24) {
        value = 24;
      }
      
      // Round to 1 decimal place for readability
      value = Math.round(value * 10) / 10;
      
      // Update input value if it was adjusted
      if (this.value != value) {
        this.value = value;
      }
    });
  }
  
  // Validate name input
  if (nameInput) {
    nameInput.addEventListener('input', function() {
      if (this.value.trim() === '') {
        this.value = 'Custom Appliance';
      }
    });
  }
}

/**
 * Add a new custom appliance card to the grid
 * @param {HTMLElement} container - The container element
 */
function addCustomApplianceCard(container) {
  // Increment custom appliance counter
  customApplianceCount++;
  
  // Create a new custom appliance card
  const newCard = document.createElement('div');
  newCard.className = 'appliance-card custom-appliance selected';
  newCard.dataset.category = 'general';
  newCard.dataset.wattage = '1';
  newCard.dataset.hours = '1';
  newCard.dataset.title = `Custom Appliance ${customApplianceCount}`;
  
  // Generate HTML with editable name field
  newCard.innerHTML = `
    <div class="energy-indicator energy-low"></div>
    <img src="assets/custom.png" alt="Custom Appliance" class="appliance-icon">
    <div class="appliance-name-container">
      <input type="text" class="editable-appliance-name" value="Custom Appliance ${customApplianceCount}" placeholder="Enter name">
    </div>
    <div class="appliance-settings">
      <div class="setting-row">
        <label>Watts:</label>
        <input type="number" class="custom-wattage" value="1" min="1">
      </div>
      <div class="setting-row">
        <label>Hours:</label>
        <input type="number" class="custom-hours" value="1" min="0.1" max="24" step="0.1">
      </div>
    </div>
    <div class="quantity-control">
      <button class="quantity-btn minus-btn">-</button>
      <div class="quantity-value">1</div>
      <button class="quantity-btn plus-btn">+</button>
      <button class="quantity-btn remove-btn"><i class="fa fa-trash"></i></button>
    </div>
  `;
  
  // Find the custom template card to insert before it
  const templateCard = container.querySelector('.custom-template');
  
  if (templateCard) {
    container.insertBefore(newCard, templateCard);
  } else {
    // If no template card found, just append to the end
    container.appendChild(newCard);
  }
  
  // Add event listeners to the new card
  // For minus button
  const minusBtn = newCard.querySelector('.minus-btn');
  minusBtn.addEventListener('click', function() {
    const valueEl = this.nextElementSibling;
    let value = parseInt(valueEl.textContent);
    if (value > 0) {
      value--;
      valueEl.textContent = value;
      
      if (value === 0) {
        newCard.classList.remove('selected');
      }
    }
  });

  // For plus button
  const plusBtn = newCard.querySelector('.plus-btn');
  plusBtn.addEventListener('click', function() {
    const valueEl = this.previousElementSibling;
    let value = parseInt(valueEl.textContent);
    value++;
    valueEl.textContent = value;
    newCard.classList.add('selected');
  });
  
  // For remove button
  const removeBtn = newCard.querySelector('.remove-btn');
  removeBtn.addEventListener('click', function() {
    newCard.remove();
  });
  
  // For editable name field
  const nameField = newCard.querySelector('.editable-appliance-name');
  nameField.addEventListener('input', function() {
    newCard.dataset.title = this.value;
  });
  
  // For custom wattage field
  const wattageField = newCard.querySelector('.custom-wattage');
  wattageField.addEventListener('input', function() {
    newCard.dataset.wattage = this.value;
  });
  
  // For custom hours field
  const hoursField = newCard.querySelector('.custom-hours');
  hoursField.addEventListener('input', function() {
    newCard.dataset.hours = this.value;
  });
  
  // Apply validation to this new custom appliance card
  validateCustomApplianceInput(newCard);
  
  // Return the new card
  return newCard;
}

// Export functions and data for use in other scripts
window.AppliancesModule = {
  loadAppliancesGrid,
  appliancesData,
  addCustomApplianceCard
};
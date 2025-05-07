document.addEventListener("DOMContentLoaded", function() {
  // Add custom appliance counter at the top with other state variables
  let customApplianceCount = 0;
  
  // ----------- LANGUAGE SYSTEM -----------
  
  // Default language is English - always
  let currentLanguage = 'en';
  
  // Language translations
  const translations = {
    en: {
      // Header and navigation
      'main-title': 'Solar Calculator - Simple Mode',
      'main-subtitle': 'Find the right solar system for your home',
      'main-title-bar': 'Solar Calculator - Simple Mode',
      'main-subtitle-bar': 'Find the right solar system for your home',
      'listen-text': 'Listen to Instructions',
      'stop-text': 'Stop Audio',
      'step1-label': '1. Select Home Type',
      'step2-label': '2. Select Appliances',
      'step3-label': '3. Get Results',
      'next-button-text': 'Next',
      'back-button-text': 'Back',
      'next-button-text-2': 'Next',
      'back-button-text-2': 'Back',
      'print-button-text': 'Print Results',
      'template-title': 'Quick Templates',
      'template-subtitle': 'Select a template based on home size',
      'template-1bed': '1 Bedroom',
      'template-2bed': '2 Bedrooms',
      'template-3bed': '3 Bedrooms',
      'template-4bed': '4+ Bedrooms',
      
      // Step 1 - Home Type
      'home-type-question': 'What type of home do you have?',
      'home-type-subtitle': 'Select the option that best matches your home',
      'bedroom1-label': '1 Bedroom',
      'bedroom2-label': '2 Bedrooms',
      'bedroom3-label': '3 Bedrooms',
      'bedroom4-label': '4+ Bedrooms',
      'sunlight-question': 'How much sunlight do you get?',
      'less-sun-label': 'Less Sun',
      'average-sun-label': 'Average Sun',
      'more-sun-label': 'More Sun',
      'backup-question': 'How long should backup power last?',
      'half-day-label': 'Half Day',
      'one-day-label': '1 Day',
      'two-days-label': '2 Days',
      
      // Step 2 - Appliances
      'appliances-title': 'Select your appliances',
      'appliances-subtitle': 'Tap on the appliances you use regularly',
      'category-all': 'All',
      'category-lighting': 'Lights',
      'category-kitchen': 'Kitchen',
      'category-cooling': 'Cooling',
      'category-entertainment': 'Entertainment',
      'category-work-leisure': 'Work & Leisure',
      'category-laundry': 'Laundry',
      'category-general': 'General',
      
      // Lighting
      'appliance-led-lights': 'LED Lights (10x)',
      'appliance-lights': 'Lights',
      
      // Kitchen
      'appliance-fridge-freezer-large': 'Fridge/Freezer - Large',
      'appliance-freezer-chest': 'Freezer - Chest',
      'appliance-microwave': 'Microwave',
      'appliance-dishwasher': 'Dishwasher',
      'appliance-electric-oven': 'Electric Oven',
      'appliance-gas-oven': 'Gas Oven',
      'appliance-kettle': 'Kettle',
      'appliance-toaster': 'Toaster',
      
      // Cooling
      'appliance-fan-ceiling': 'Fan - Ceiling',
      'appliance-air-conditioner-large': 'Air Conditioner - Large',
      'appliance-air-conditioner-small': 'Air Conditioner - Small',
      
      // Entertainment
      'appliance-tv-led': 'TV (LED)',
      'appliance-gaming': 'Gaming Console',
      
      // Work & Leisure
      'appliance-laptop-computers': 'Laptop / Computers',
      'appliance-coffee-machine': 'Coffee Machine',
      'appliance-electric-stovetop-large': 'Electric Stovetop - Large',
      'appliance-electric-stovetop-small': 'Electric Stovetop - Small',
      'appliance-modem-internet': 'Modem/Internet',
      
      // Laundry
      'appliance-washing-machine': 'Washing Machine',
      'appliance-dryer': 'Dryer',
      'appliance-hair-dryer': 'Hair Dryer',
      
      // General
      'appliance-power-tools-charging': 'Charging for Common Power Tools',
      'appliance-pressure-pump': 'Pressure Pump',
      'appliance-custom': 'Custom Appliance',
      
      // Step 3 - Results
      'results-title': 'Your Solar Power Results',
      'results-subtitle': 'Here\'s what you need for your home',
      'result-solar-panels': 'Solar Panels',
      'solar-panel-desc': 'These capture sunlight to power your home',
      'result-battery': 'Battery',
      'battery-desc': 'Stores energy for use when there\'s no sun',
      'result-system-size': 'System Size',
      'system-size-desc': 'Powers all your selected appliances',
      'selected-title': 'Your Selected Appliances:',
      'total-title': 'Total Daily Energy Use:',
      'template-applied': 'Template Applied',
      'warning-text': 'These estimates may not be exact. Actual energy usage can vary based on specific models and usage patterns.',
      
      // New audio guide translations
      'voice-guide-title': 'Voice Guide Available',
      'voice-guide-message': 'Each step has voice instructions to help you',
      'step1-voice': 'Step 1: Home Type',
      'step2-voice': 'Step 2: Appliances',
      'step3-voice': 'Step 3: Results',
      
      // Audio instructions (kept the same)
      'home-audio': 'Welcome to the Solar Calculator. In this first step, select your home type, how much sunlight you get, and how long you need backup power to last.',
      'appliances-audio': 'Now, select the appliances you use in your home. Tap the plus button to add appliances, or minus to remove them.',
      'results-audio': 'Here are your results. This shows the solar panels, battery, and system size you need based on your selections.',
    
      'energy-legend-title': 'Energy Consumption Guide',
      'energy-low-text': 'Low Energy: Efficient appliances',
      'energy-medium-text': 'Medium Energy: Standard consumption',
      'energy-high-text': 'High Energy: Power-intensive appliances',
      'legend-show-text': 'Show Energy Guide',
      'legend-hide-text': 'Hide Energy Guide'
    },
    tok: {
      // Header and navigation
      'main-title': 'Solar Kalkulator - Isi Moud',
      'main-subtitle': 'Painim gutpela solar sistem bilong haus bilong yu',
      'main-title-bar': 'Solar Kalkulator - Isi Moud',
      'main-subtitle-bar': 'Painim gutpela solar sistem bilong haus bilong yu',
      'listen-text': 'Harim Toktok',
      'stop-text': 'Stopim Toktok',
      'step1-label': '1. Makim Haus Kaen',
      'step2-label': '2. Makim Ol Applaens',
      'step3-label': '3. Kisim Risalts',
      'next-button-text': 'Go het',
      'back-button-text': 'Go bek',
      'next-button-text-2': 'Go het',
      'back-button-text-2': 'Go bek',
      'print-button-text': 'Printim Result',
      'template-title': 'Kwik Tamplat',
      'template-subtitle': 'Makim tamplat bilong haus bikpela',
      'template-1bed': '1 Rum',
      'template-2bed': '2 Rum',
      'template-3bed': '3 Rum',
      'template-4bed': '4+ Rum',
      
      // Step 1 - Home Type
      'home-type-question': 'Wanem kain haus yu gat?',
      'home-type-subtitle': 'Makim haus we em i wankain olsem haus bilong yu',
      'bedroom1-label': '1 Rum',
      'bedroom2-label': '2 Rum',
      'bedroom3-label': '3 Rum',
      'bedroom4-label': '4+ Rum',
      'sunlight-question': 'Hamas san yu save kisim?',
      'less-sun-label': 'Liklik San',
      'average-sun-label': 'Namel San',
      'more-sun-label': 'Planti San',
      'backup-question': 'Hamas taim yu laikim pawa i stap?',
      'half-day-label': 'Hap De',
      'one-day-label': '1 De',
      'two-days-label': '2 De',
      
      // Step 2 - Appliances
      'appliances-title': 'Makim ol samting lektrik',
      'appliances-subtitle': 'Paitim ol samting lektrik yu save yusim long haus',
      'category-all': 'Olgeta',
      'category-lighting': 'Lait',
      'category-kitchen': 'Kuk Haus',
      'category-cooling': 'Kol Samting',
      'category-entertainment': 'Lukluk Samting',
      'category-work-leisure': 'Wok & Malolo',
      'category-laundry': 'Wasim Klos',
      'category-general': 'Narapela Samting',
      
      // Lighting
      'appliance-led-lights': 'LED Lait (10x)',
      'appliance-lights': 'Lait',
      
      // Kitchen
      'appliance-fridge-freezer-large': 'Bikpela Fris/Frisa',
      'appliance-freezer-chest': 'Bokis Frisa',
      'appliance-microwave': 'Maekroweiv',
      'appliance-dishwasher': 'Wasim Plet Masin',
      'appliance-electric-oven': 'Oven Lektrik',
      'appliance-gas-oven': 'Oven Ges',
      'appliance-kettle': 'Ketol',
      'appliance-toaster': 'Tosta',
      
      // Cooling
      'appliance-fan-ceiling': 'Fan Bilong Ruf',
      'appliance-air-conditioner-large': 'Bikpela Ea Kondisena',
      'appliance-air-conditioner-small': 'Liklik Ea Kondisena',
      
      // Entertainment
      'appliance-tv-led': 'TV (LED)',
      'appliance-gaming': 'Pilai Gem',
      
      // Work & Leisure
      'appliance-laptop-computers': 'Lepkop / Kompyuta',
      'appliance-coffee-machine': 'Masin Kopi',
      'appliance-electric-stovetop-large': 'Bikpela Stov Lektrik',
      'appliance-electric-stovetop-small': 'Liklik Stov Lektrik',
      'appliance-modem-internet': 'Modem/Intanet',
      
      // Laundry
      'appliance-washing-machine': 'Wasim Masin',
      'appliance-dryer': 'Draia',
      'appliance-hair-dryer': 'Draia Bilong Gras',
      
      // General
      'appliance-power-tools-charging': 'Sasim Tul Bilong Wok',
      'appliance-pressure-pump': 'Pam Bilong Wara',
      'appliance-custom': 'Narapela Samting Lektrik',
      
      // Step 3 - Results
      'results-title': 'Solar Pawa Result bilong Yu',
      'results-subtitle': 'Dispela em samting yu nidim bilong haus bilong yu',
      'result-solar-panels': 'Solar Panel',
      'solar-panel-desc': 'Ol i kisim san na tanim i go long pawa',
      'result-battery': 'Betri',
      'battery-desc': 'Holim pawa bilong yusim taim i nogat san',
      'result-system-size': 'Bikpela bilong Sistem',
      'system-size-desc': 'Givim pawa long ol samting lektrik yu makim',
      'selected-title': 'Ol Samting Lektrik Yu Makim:',
      'total-title': 'Bikpela Pawa Yusim long Wanpela De:',
      'template-applied': 'Samting Lektrik I Redi Nau',
      'warning-text': 'Ol dispela namba em i no stret olgeta. Tru pawa yus bilong yu inap long senis long wanem kain masin yu gat na olsem wanem yu save yusim.',
      
      // New audio guide translations
      'voice-guide-title': 'Gaid Bilong Harim i Stap',
      'voice-guide-message': 'Olgeta step i gat toktok bilong helpim yu',
      'step1-voice': 'Step 1: Makim Haus Kaen',
      'step2-voice': 'Step 2: Makim Ol Applaens',
      'step3-voice': 'Step 3: Kisim Risalts',
      
      // Audio instructions (kept the same)
      'home-audio': 'Welkam long Solar Kalkulator. Long dispela hap, makim wanem kain haus bilong yu, hamas san yu kisim, na hamas taim yu laikim pawa i stap.',
      'appliances-audio': 'Nau, makim ol samting lektrik yu save yusim long haus. Paitim plus botun bilong putim samting, o minus long rausim.',
      'results-audio': 'Dispela em result bilong yu. Em i soim ol solar panel, betri, na bikpela bilong sistem yu nidim long ol samting yu makim.',
    
      // Energy indicator translations
      'energy-legend-title': 'Gaid bilong Pawa Yus',
      'energy-low-text': 'Liklik Pawa: Gut samting lektrik',
      'energy-medium-text': 'Namel Pawa: Nomol samting lektrik', 
      'energy-high-text': 'Bikpela Pawa: Samting i yusim planti pawa',
      'legend-show-text': 'Soim Pawa Gaid',
      'legend-hide-text': 'Haitim Pawa Gaid'
    }
  };

  // Set the UI language
  const setLanguage = (lang) => {
    currentLanguage = lang;
    
    // Update all text elements with translations
    Object.keys(translations[lang]).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        element.textContent = translations[lang][key];
      }
    });
  
    // Save language preference
    localStorage.setItem('preferredLanguage', lang);
    
    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.lang === lang) {
        btn.classList.add('active');
      }
    });
  };
  
  // Initialize language based on saved preference or default to English
  const initializeLanguage = () => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else {
      setLanguage('en'); // Default to English
    }
  };
  
  // Setup language buttons
  const langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(button => {
    button.addEventListener('click', function() {
      const lang = this.dataset.lang;
      setLanguage(lang);
    });
  });
  
  // ----------- AUDIO SYSTEM -----------

  let audioPlaying = false;
  
  // Create a visual indicator for when audio is playing
  function createAudioStatusIndicator() {
    // Create the indicator element if it doesn't exist
    let audioIndicator = document.getElementById('audio-status-indicator');
    if (!audioIndicator) {
      audioIndicator = document.createElement('div');
      audioIndicator.id = 'audio-status-indicator';
      audioIndicator.className = 'audio-status-indicator';
      document.body.appendChild(audioIndicator);
      
      // Add styles for the audio indicator
      const style = document.createElement('style');
      style.textContent = `
        .audio-status-indicator {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: rgba(52, 152, 219, 0.9);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 10px;
          transform: translateY(100px);
          transition: transform 0.3s ease;
        }
        
        .audio-status-indicator.visible {
          transform: translateY(0);
        }
        
        .audio-status-indicator .wave {
          display: flex;
          align-items: center;
          height: 20px;
        }
        
        .audio-status-indicator .wave .bar {
          width: 3px;
          margin: 0 2px;
          background-color: white;
          animation: wave 1s infinite ease-in-out;
        }
        
        .audio-status-indicator .wave .bar:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .audio-status-indicator .wave .bar:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        .audio-status-indicator .wave .bar:nth-child(4) {
          animation-delay: 0.6s;
        }
        
        @keyframes wave {
          0%, 100% {
            height: 6px;
          }
          50% {
            height: 18px;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    return audioIndicator;
  }

  // Show the audio indicator with step-specific message
  function showAudioStatusIndicator(step) {
    const audioIndicator = createAudioStatusIndicator();
    
    // Determine the message based on the step
    let message = translations[currentLanguage][`step${step}-voice`] || 'Voice guide playing';
    
    audioIndicator.innerHTML = `
      <div class="wave">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
      <span>${message}</span>
    `;
    
    // Show the indicator
    setTimeout(() => {
      audioIndicator.classList.add('visible');
    }, 10);
  }

  // Hide the audio indicator
  function hideAudioStatusIndicator() {
    const audioIndicator = document.getElementById('audio-status-indicator');
    if (audioIndicator) {
      audioIndicator.classList.remove('visible');
    }
  }

  // Enhanced playAudio function with step detection
  const playAudio = (audioKey) => {
    // Stop any currently playing audio
    stopAudio();
    
    // Determine which step audio is being played
    let step = null;
    if (audioKey === 'home-audio') {
      step = 1;
    } else if (audioKey === 'appliances-audio') {
      step = 2;
    } else if (audioKey === 'results-audio') {
      step = 3;
    }
    
    // Show the audio indicator
    if (step) {
      showAudioStatusIndicator(step);
    }
    
    // In a real implementation, you would have actual audio files
    // For demo, we'll use the Web Speech API
    
    const message = translations[currentLanguage][audioKey];
    // Check if browser supports speech synthesis
    if ('speechSynthesis' in window) {
      // Create a new speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance(message);
      
      // Set the language based on current selection
      if (currentLanguage === 'en') {
        utterance.lang = 'en-US';
      } else if (currentLanguage === 'tok') {
        utterance.lang = 'en-US'; // Fallback since Tok Pisin not widely supported
      } else {
        utterance.lang = 'en-US'; // Fallback
      }
      
      // Set flag when audio starts
      utterance.onstart = () => {
        audioPlaying = true;
      };
      
      // Set flag when audio ends
      utterance.onend = () => {
        audioPlaying = false;
        // Hide the audio indicator when audio ends
        hideAudioStatusIndicator();
      };
      
      // Speak the message
      speechSynthesis.cancel(); // Cancel any ongoing speech
      speechSynthesis.speak(utterance);
    } else {
      console.log('Speech synthesis not supported in this browser');
      // Fallback alert for browsers without speech synthesis
      alert(message);
    }
  };

  // Enhanced stopAudio function
  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      audioPlaying = false;
      // Hide the audio indicator
      hideAudioStatusIndicator();
    }
  };

  // Listen button functionality
  const listenButton = document.getElementById('listen-button');
  if (listenButton) {
    listenButton.addEventListener('click', function() {
      // Play the appropriate audio based on current step
      if (currentStep === 1) {
        playAudio('home-audio');
      } else if (currentStep === 2) {
        playAudio('appliances-audio');
      } else if (currentStep === 3) {
        playAudio('results-audio');
      }
    });
  }

  // Stop audio button functionality
  const stopAudioButton = document.getElementById('stop-audio-button');
  if (stopAudioButton) {
    stopAudioButton.addEventListener('click', stopAudio);
  }

  // Add click event listeners to all step audio buttons
  const stepAudioButtons = document.querySelectorAll('.step-audio-btn');
  stepAudioButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const audioKey = this.dataset.audio;
      // Call the existing playAudio function with the specific audio key
      playAudio(audioKey);
    });
  });

  const legendToggleBtn = document.getElementById('legend-toggle-btn');
  const energyLegend = document.querySelector('.energy-indicator-legend');

  if (legendToggleBtn && energyLegend) {
    legendToggleBtn.addEventListener('click', function() {
      energyLegend.classList.toggle('expanded');
      
      // Update the toggle button text
      const toggleText = document.getElementById('legend-toggle-text');
      if (toggleText) {
        if (energyLegend.classList.contains('expanded')) {
          toggleText.textContent = translations[currentLanguage]['legend-hide-text'] || 'Hide Energy Guide';
        } else {
          toggleText.textContent = translations[currentLanguage]['legend-show-text'] || 'Show Energy Guide';
        }
      }
    });
  }

  function autoExpandEnergyLegend() {
    const energyLegend = document.querySelector('.energy-indicator-legend');
    if (energyLegend) {
      if (window.innerWidth <= 768) {
        energyLegend.classList.add('expanded');
      } else {
        energyLegend.classList.remove('expanded');
      }
    }
  }
  
  autoExpandEnergyLegend();
  
  window.addEventListener('resize', autoExpandEnergyLegend);

  // Function to initialize energy indicator tooltips
  function initializeEnergyTooltips() {
    // Add tooltip functionality to all energy indicators
    const energyIndicators = document.querySelectorAll('.energy-indicator');
    
    energyIndicators.forEach(indicator => {
      // Get the parent appliance card
      const applianceCard = indicator.closest('.appliance-card');
      if (!applianceCard) return;
      
      // Create tooltip element if it doesn't exist
      let tooltip = applianceCard.querySelector('.energy-tooltip');
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'energy-tooltip';
        applianceCard.appendChild(tooltip);
      }
      
      // Determine energy level from class
      let energyLevel = '';
      if (indicator.classList.contains('energy-low')) {
        energyLevel = translations[currentLanguage]['energy-low-text'] || 'Low Energy: Efficient appliance';
      } else if (indicator.classList.contains('energy-medium')) {
        energyLevel = translations[currentLanguage]['energy-medium-text'] || 'Medium Energy: Standard consumption';
      } else if (indicator.classList.contains('energy-high')) {
        energyLevel = translations[currentLanguage]['energy-high-text'] || 'High Energy: Power-intensive appliance';
      }
      
      // Set tooltip text
      tooltip.textContent = energyLevel;
      
      // Show tooltip on hover
      indicator.addEventListener('mouseenter', () => {
        tooltip.style.display = 'block';
        
        // Position the tooltip
        const applianceRect = applianceCard.getBoundingClientRect();
        tooltip.style.top = '10px';
        tooltip.style.right = '10px';
        
        // Ensure tooltip is visible within viewport
        setTimeout(() => {
          const tooltipRect = tooltip.getBoundingClientRect();
          if (tooltipRect.right > window.innerWidth) {
            tooltip.style.right = 'auto';
            tooltip.style.left = '10px';
          }
        }, 0);
      });
      
      // Hide tooltip when not hovering
      indicator.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    });
  }

  // Add CSS for tooltips
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .energy-tooltip {
      position: absolute;
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 100;
      display: none;
      white-space: nowrap;
      pointer-events: none;
      top: 10px;
      right: 10px;
      animation: fadeIn 0.2s;
    }
    
    .energy-tooltip::after {
      content: '';
      position: absolute;
      top: -5px;
      right: 10px;
      border-width: 0 5px 5px;
      border-style: solid;
      border-color: transparent transparent rgba(0, 0, 0, 0.8);
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    /* Make the energy indicator have a slightly larger hit area for better UX */
    .energy-indicator {
      cursor: pointer;
    }
  `;
  document.head.appendChild(styleElement);

  // Call this function after appliances are loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Wait a short time to ensure all appliances are loaded
    setTimeout(initializeEnergyTooltips, 500);
    
    // Also initialize tooltips when category is changed since this can reload appliances
    const categories = document.querySelectorAll('.category');
    categories.forEach(category => {
      category.addEventListener('click', function() {
        setTimeout(initializeEnergyTooltips, 300);
      });
    });
  });
 
  // ----------- CALCULATOR FUNCTIONALITY -----------
  
  // Cache DOM elements
  const steps = document.querySelectorAll('.step');
  const stepContents = document.querySelectorAll('.step-content');
  const homeOptions = document.querySelectorAll('.home-option');
  const sunlightOptions = document.querySelectorAll('.sunlight-option');
  const backupOptions = document.querySelectorAll('.backup-option');
  const categories = document.querySelectorAll('.category');
  
  // Navigation buttons
  const toStep2Button = document.getElementById('to-step-2');
  const backToStep1Button = document.getElementById('to-step-1');
  const toStep3Button = document.getElementById('to-step-3');
  const backToStep2Button = document.getElementById('back-to-step-2');
  const printResultsButton = document.getElementById('print-results');
  
  // State variables
  let currentStep = 1;
  let selectedHomeType = null;
  let selectedSunlight = 5; // Default: Average Sun
  let selectedBackup = 1; // Default: 1 Day
  
  // Show loading spinner
  function showLoadingSpinner(message = 'Calculating...') {
    document.getElementById('loading-message').textContent = message;
    document.getElementById('loading-overlay').style.display = 'flex';
  }
 
  // Hide loading spinner
  function hideLoadingSpinner() {
    document.getElementById('loading-overlay').style.display = 'none';
  }
 
  // Show notification
  function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'notification';
      notification.className = 'notification';
      document.body.appendChild(notification);
      
      // Add styles for notification
      const style = document.createElement('style');
      style.textContent = `
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background-color: #3498db;
          color: white;
          padding: 15px 25px;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          z-index: 1000;
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(-20px);
        }
        .notification.show {
          opacity: 1;
          transform: translateY(0);
        }
      `;
      document.head.appendChild(style);
    }
    
    // Set message and show notification
    notification.textContent = message;
    notification.classList.add('show');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }
 
  // Navigate between steps
  function navigateToStep(stepNumber) {
    // Hide all step contents
    stepContents.forEach(content => {
      content.classList.remove('active');
    });
    
    // Show the selected step content
    document.getElementById(`step-${stepNumber}`).classList.add('active');
    
    // Update step indicators
    steps.forEach(step => {
      const stepNum = parseInt(step.dataset.step);
      step.classList.remove('active', 'completed');
      
      if (stepNum === stepNumber) {
        step.classList.add('active');
      } else if (stepNum < stepNumber) {
        step.classList.add('completed');
      }
    });
    
    // Update current step
    currentStep = stepNumber;
    
    // Note: Removed automatic audio playback
    
    // Scroll to the active step section
    const activeStepElement = document.querySelector(`.step[data-step="${stepNumber}"]`);
    if (activeStepElement) {
      // Smooth scroll to the step with some offset to account for fixed header
      const headerOffset = 300; // Adjust this value based on your header height
      const elementPosition = activeStepElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
 
  // Calculate total energy usage
  function calculateTotalEnergy() {
    let totalEnergy = 0;
    
    // Loop through all appliance cards
    const applianceCards = document.querySelectorAll('.appliance-card:not(.custom-template)');
    applianceCards.forEach(card => {
      const quantityEl = card.querySelector('.quantity-value');
      if (!quantityEl) return;
      
      const quantity = parseInt(quantityEl.textContent);
      if (quantity > 0) {
        // For custom appliances with editable fields, get values from inputs
        let wattage, hours;
        
        if (card.classList.contains('custom-appliance')) {
          wattage = parseInt(card.querySelector('.custom-wattage').value) || 1;
          hours = parseFloat(card.querySelector('.custom-hours').value) || 1;
        } else {
          wattage = parseInt(card.dataset.wattage) || 1;
          hours = parseFloat(card.dataset.hours) || 1;
        }
        
        // Calculate kWh for this appliance
        const kwh = (wattage * quantity * hours) / 1000;
        totalEnergy += kwh;
      }
    });
    
    return totalEnergy;
  }
 
  // Get selected appliances
  function getSelectedAppliances() {
    const appliances = [];
    const applianceCards = document.querySelectorAll('.appliance-card:not(.custom-template)');
    
    applianceCards.forEach(card => {
      const quantityEl = card.querySelector('.quantity-value');
      if (!quantityEl) return;
      
      const quantity = parseInt(quantityEl.textContent);
      if (quantity > 0) {
        let name, wattage, hours;
        
        if (card.classList.contains('custom-appliance')) {
          const nameEl = card.querySelector('.editable-appliance-name');
          name = nameEl ? nameEl.value : 'Custom Appliance';
          wattage = parseInt(card.querySelector('.custom-wattage').value) || 1;
          hours = parseFloat(card.querySelector('.custom-hours').value) || 1;
        } else {
          const nameEl = card.querySelector('.appliance-name');
          name = nameEl ? nameEl.textContent : card.dataset.title;
          wattage = parseInt(card.dataset.wattage) || 1;
          hours = parseFloat(card.dataset.hours) || 1;
        }
        
        appliances.push({
          name: name,
          quantity: quantity,
          wattage: wattage,
          hours: hours,
          kwh: (wattage * quantity * hours) / 1000
        });
      }
    });
    
    return appliances;
  }
  
  // Calculate final results
  function calculateResults() {
    showLoadingSpinner('Calculating your solar system...');
    
    setTimeout(() => {
      // Get total energy usage
      const totalEnergy = calculateTotalEnergy();
      document.getElementById('total-kwh-value').textContent = totalEnergy.toFixed(1);
      
      // Get selected appliances
      const appliances = getSelectedAppliances();
      
      // Clear previous selected appliances
      const selectedAppliancesList = document.getElementById('selected-appliances-list');
      selectedAppliancesList.innerHTML = '';
      
      // Add selected appliances to the list
      appliances.forEach(appliance => {
        const applianceItem = document.createElement('div');
        applianceItem.className = 'appliance-item';
        
        // Find the matching card to get the image source
        let imgSrc = 'assets/custom.png';
        if (!appliance.name.includes('Custom')) {
          const matchingCard = Array.from(document.querySelectorAll('.appliance-card:not(.custom-appliance)')).find(card => {
            const nameEl = card.querySelector('.appliance-name');
            return nameEl && nameEl.textContent === appliance.name;
          });
          
          if (matchingCard) {
            const iconEl = matchingCard.querySelector('.appliance-icon');
            if (iconEl) {
              imgSrc = iconEl.src;
            }
          }
        }
        
        applianceItem.innerHTML = `
          <img src="${imgSrc}" alt="${appliance.name}" class="item-icon">
          <div class="item-details">
            <div class="item-name">${appliance.name}</div>
            <div class="item-quantity">Quantity: ${appliance.quantity}</div>
          </div>
        `;
        
        selectedAppliancesList.appendChild(applianceItem);
      });
      
      // Calculate solar panel size based on total energy and sunlight hours
      const solarPanelSize = totalEnergy / selectedSunlight;
      
      // Calculate battery capacity based on total energy and backup days
      const batteryCapacity = totalEnergy * selectedBackup;
      
      // Calculate system size (inverter) based on home type
      let systemSize = selectedHomeType;
      
      // Determine appropriate solar panel recommendation
      let solarText = '';
      if (solarPanelSize <= 0.5) {
        solarText = '2 panels';
      } else if (solarPanelSize <= 1) {
        solarText = '4 panels';
      } else if (solarPanelSize <= 2) {
        solarText = '6 panels';
      } else if (solarPanelSize <= 3) {
        solarText = '9 panels';
      } else if (solarPanelSize <= 4) {
        solarText = '12 panels';
      } else if (solarPanelSize <= 5) {
        solarText = '15 panels';
      } else {
        solarText = '20+ panels';
      }
      
      // Determine appropriate battery recommendation
      let batteryText = '';
      if (batteryCapacity <= 1) {
        batteryText = 'Small (1kWh)';
      } else if (batteryCapacity <= 2) {
        batteryText = 'Small (2kWh)';
      } else if (batteryCapacity <= 5) {
        batteryText = 'Medium (5kWh)';
      } else if (batteryCapacity <= 10) {
        batteryText = 'Medium (10kWh)';
      } else if (batteryCapacity <= 15) {
        batteryText = 'Large (15kWh)';
      } else {
        batteryText = 'Very Large (20kWh+)';
      }
      
      // Determine appropriate system size recommendation
      let systemText = '';
      if (systemSize === 30) {
        systemText = 'Small (3kVA)';
      } else if (systemSize === 50) {
        systemText = 'Medium (5kVA)';
      } else if (systemSize === 70) {
        systemText = 'Large (10kVA)';
      } else if (systemSize === 90) {
        systemText = 'Extra Large (15kVA)';
      } else {
        systemText = 'Medium (5kVA)';
      }
      
      // Update result values
      document.getElementById('solar-panel-value').textContent = solarText;
      document.getElementById('battery-value').textContent = batteryText;
      document.getElementById('system-size-value').textContent = systemText;
      
      hideLoadingSpinner();
    }, 1500);
  }
  
  // Initialize option selections
  
  // Home type selection based on bedroom count
  homeOptions.forEach(option => {
    option.addEventListener('click', function() {
      homeOptions.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
      selectedHomeType = parseInt(this.dataset.usage);
      
      // Auto-apply template based on bedroom selection
      const homeType = this.dataset.homeType;
      if (homeType === 'bedroom1') {
        applyTemplate(1);
      } else if (homeType === 'bedroom2') {
        applyTemplate(2);
      } else if (homeType === 'bedroom3') {
        applyTemplate(3);
      } else if (homeType === 'bedroom4') {
        applyTemplate(4);
      }
    });
  });
  
  // Sunlight selection
  sunlightOptions.forEach(option => {
    option.addEventListener('click', function() {
      sunlightOptions.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
      selectedSunlight = parseFloat(this.dataset.sun);
    });
  });
  
  // Backup selection
  backupOptions.forEach(option => {
    option.addEventListener('click', function() {
      backupOptions.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
      selectedBackup = parseFloat(this.dataset.backup);
    });
  });
  
  // Default selections
  sunlightOptions[1].classList.add('selected'); // Average sun
  backupOptions[1].classList.add('selected'); // 1 day
  
  // Category filtering
  categories.forEach(category => {
    category.addEventListener('click', function() {
      categories.forEach(cat => cat.classList.remove('active'));
      this.classList.add('active');
      
      const selectedCategory = this.dataset.category;
      const applianceCards = document.querySelectorAll('.appliance-card');
      
      applianceCards.forEach(card => {
        if (selectedCategory === 'all' || card.dataset.category === selectedCategory) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
  
  // Apply Template for Room Sizes
  function applyTemplate(bedrooms) {
    // Show loading spinner
    showLoadingSpinner(`Loading template for ${bedrooms} bedroom(s)...`);
    
    // Reset all appliance quantities to 0
    document.querySelectorAll('.appliance-card:not(.custom-template)').forEach(card => {
      // Remove any existing custom appliances
      if (card.classList.contains('custom-appliance')) {
        card.remove();
      } else {
        // Reset quantity for standard appliances
        const quantityEl = card.querySelector('.quantity-value');
        if (quantityEl) {
          quantityEl.textContent = '0';
        }
        card.classList.remove('selected');
      }
    });
    
    // Reset custom appliance counter
    customApplianceCount = 0;
    
    setTimeout(() => {
      // Define appliance templates based on bedrooms
      const applianceTemplates = {
        1: [
          { title: "Lights", quantity: 3 },
          { title: "Fridge/Freezer - Large", quantity: 1 },
          { title: "Fan - Ceiling", quantity: 1 },
          { title: "TV (LED)", quantity: 1 },
          { title: "Air Conditioner - Small", quantity: 1 },
          { title: "Microwave", quantity: 1 },
          { title: "Modem/Internet", quantity: 1 },
          { title: "Washing Machine", quantity: 1 }
        ],
        2: [
          { title: "Lights", quantity: 5 },
          { title: "Fridge/Freezer - Large", quantity: 1 },
          { title: "Fan - Ceiling", quantity: 2 },
          { title: "TV (LED)", quantity: 1 },
          { title: "Air Conditioner - Small", quantity: 1 },
          { title: "Microwave", quantity: 1 },
          { title: "Modem/Internet", quantity: 1 },
          { title: "Laptop / Computers", quantity: 1 },
          { title: "Washing Machine", quantity: 1 }
        ],
        3: [
          { title: "Lights", quantity: 8 },
          { title: "Fridge/Freezer - Large", quantity: 1 },
          { title: "Fan - Ceiling", quantity: 3 },
          { title: "TV (LED)", quantity: 1 },
          { title: "Air Conditioner - Large", quantity: 1 },
          { title: "Microwave", quantity: 1 },
          { title: "Kettle", quantity: 1 },
          { title: "Toaster", quantity: 1 },
          { title: "Modem/Internet", quantity: 1 },
          { title: "Laptop / Computers", quantity: 2 },
          { title: "Washing Machine", quantity: 1 }
        ],
        4: [
          { title: "Lights", quantity: 12 },
          { title: "Fridge/Freezer - Large", quantity: 1 },
          { title: "Fan - Ceiling", quantity: 4 },
          { title: "TV (LED)", quantity: 2 },
          { title: "Air Conditioner - Large", quantity: 1 },
          { title: "Air Conditioner - Small", quantity: 1 },
          { title: "Microwave", quantity: 1 },
          { title: "Kettle", quantity: 1 },
          { title: "Toaster", quantity: 1 },
          { title: "Modem/Internet", quantity: 1 },
          { title: "Laptop / Computers", quantity: 2 },
          { title: "Washing Machine", quantity: 1 },
          { title: "Dryer", quantity: 1 },
          { title: "Gaming Console", quantity: 1 }]
        };
        
        // Apply the template
        const template = applianceTemplates[bedrooms] || applianceTemplates[4]; // Default to 4+ for any larger number
        
        // Find and update each appliance card with the correct quantity using data-title instead of name
        template.forEach(item => {
          const cards = document.querySelectorAll('.appliance-card:not(.custom-template)');
          cards.forEach(card => {
            // Use data-title attribute to match appliances instead of innerText
            if (card.dataset.title === item.title) {
              const quantityEl = card.querySelector('.quantity-value');
              if (quantityEl) {
                quantityEl.textContent = item.quantity.toString();
                if (item.quantity > 0) {
                  card.classList.add('selected');
                }
              }
            }
          });
        });
        
        // Show notification instead of navigating to next step
        hideLoadingSpinner();
        showNotification(translations[currentLanguage]['template-applied']);
      }, 1000);
    }
    
    // Navigation button events
    toStep2Button.addEventListener('click', function() {
      // Validate home type selection
      if (selectedHomeType === null) {
        alert(translations[currentLanguage]['home-type-question']);
        return;
      }
      navigateToStep(2);
    });
    
    backToStep1Button.addEventListener('click', function() {
      navigateToStep(1);
    });
    
    toStep3Button.addEventListener('click', function() {
      // Check if at least one appliance is selected
      const hasSelectedAppliances = Array.from(document.querySelectorAll('.appliance-card:not(.custom-template)')).some(card => {
        const quantityEl = card.querySelector('.quantity-value');
        return quantityEl && parseInt(quantityEl.textContent) > 0;
      });
      
      if (!hasSelectedAppliances) {
        alert(translations[currentLanguage]['appliances-title']);
        return;
      }
      
      navigateToStep(3);
      calculateResults(); // Calculate results when navigating to step 3
    });

    function setupEnhancedPrinting() {
      // Get the print button element
      const printButton = document.getElementById('print-results');
      
      if (printButton) {
        // Replace the current click handler with our enhanced version
        printButton.removeEventListener('click', window.print);
        
        printButton.addEventListener('click', function() {
          // Show loading spinner while preparing print layout
          showLoadingSpinner('Preparing print layout...');
          
          // Create a new window for the print layout
          const printWindow = window.open('', '_blank', 'width=800,height=600');
          
          if (!printWindow) {
            hideLoadingSpinner();
            alert('Please allow popup windows to print your results.');
            return;
          }
          
          // Get selected appliances and results data
          const appliances = getSelectedAppliances();
          const totalEnergy = calculateTotalEnergy();
          const solarPanelValue = document.getElementById('solar-panel-value').textContent;
          const batteryValue = document.getElementById('battery-value').textContent;
          const systemSizeValue = document.getElementById('system-size-value').textContent;
          
          // Get date information for the printed report
          const currentDate = new Date();
          const formattedDate = currentDate.toLocaleDateString();
          const formattedTime = currentDate.toLocaleTimeString();
          
          // Determine home type selection
          let homeType = 'Unknown';
          document.querySelectorAll('.home-option.selected').forEach(option => {
            const label = option.querySelector('.home-label');
            if (label) {
              homeType = label.textContent;
            }
          });
          
          // Determine sunlight selection
          let sunlight = 'Average';
          document.querySelectorAll('.sunlight-option.selected').forEach(option => {
            const label = option.querySelector('.sunlight-label');
            if (label) {
              sunlight = label.textContent;
            }
          });
          
          // Determine backup selection
          let backup = '1 Day';
          document.querySelectorAll('.backup-option.selected').forEach(option => {
            const label = option.querySelector('.backup-label');
            if (label) {
              backup = label.textContent;
            }
          });
          
          // Path to TEPNG logo (update this with the actual path to your logo)
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
                
                .accuracy-note {
                  display: flex;
                  align-items: center;
                  gap: 10px;
                  background-color: #fff3cd;
                  border: 1px solid #ffeeba;
                  color: #856404;
                  padding: 10px 15px;
                  border-radius: 6px;
                  margin: 15px 0;
                  font-size: 14px;
                }
                
                .note-icon {
                  color: #f39c12;
                  font-size: 18px;
                  flex-shrink: 0;
                }
                
                .total-energy {
                  background-color: #1a3755;
                  color: white;
                  padding: 15px;
                  border-radius: 8px;
                  text-align: center;
                  margin-bottom: 20px;
                }
                
                .total-title {
                  font-size: 16px;
                  margin-bottom: 5px;
                }
                
                .total-value {
                  font-size: 22px;
                  font-weight: bold;
                }
                
                .appliances-list {
                  border: 1px solid #ddd;
                  border-radius: 8px;
                  overflow: hidden;
                }
                
                .appliances-header {
                  background-color: #f1f1f1;
                  padding: 10px 15px;
                  font-weight: bold;
                  display: grid;
                  grid-template-columns: 3fr 1fr 1fr 1fr 1fr;
                  border-bottom: 1px solid #ddd;
                }
                
                .appliance-item {
                  padding: 10px 15px;
                  display: grid;
                  grid-template-columns: 3fr 1fr 1fr 1fr 1fr;
                  border-bottom: 1px solid #eee;
                }
                
                .appliance-item:last-child {
                  border-bottom: none;
                }
                
                .appliance-item:nth-child(even) {
                  background-color: #f9f9f9;
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
                    <img src="${logoPath}" alt="TEPNG Logo" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'150\\' height=\\'80\\'><rect width=\\'150\\' height=\\'80\\' fill=\\'%23f8f8f8\\'/><text x=\\'75\\' y=\\'40\\' font-family=\\'Arial\\' font-size=\\'12\\' fill=\\'%23666\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'>TEPNG LOGO</text></svg>';">
                  </div>
                  <div class="header-content">
                    <div class="print-logo">Solar Power Calculator</div>
                    <div class="print-subtitle">Your Personalized Solar System Recommendation</div>
                    <div class="print-date">Generated on ${formattedDate} at ${formattedTime}</div>
                  </div>
                </div>
                
                <div class="print-section">
                  <div class="section-title">Your Inputs</div>
                  <div class="inputs-section">
                    <div class="input-item">
                      <div class="input-label">Home Type</div>
                      <div class="input-value">${homeType}</div>
                    </div>
                    <div class="input-item">
                      <div class="input-label">Sunlight Level</div>
                      <div class="input-value">${sunlight}</div>
                    </div>
                    <div class="input-item">
                      <div class="input-label">Backup Duration</div>
                      <div class="input-value">${backup}</div>
                    </div>
                  </div>
                </div>
                
                <div class="print-section">
                  <div class="section-title">Recommended Solar System</div>
                  
                  <div class="results-grid">
                    <div class="result-card">
                      <div class="result-name">Solar Panels</div>
                      <div class="result-value">${solarPanelValue}</div>
                      <div class="result-description">Capture sunlight to power your home</div>
                    </div>
                    
                    <div class="result-card">
                      <div class="result-name">Battery Capacity</div>
                      <div class="result-value">${batteryValue}</div>
                      <div class="result-description">Stores energy for use when there's no sun</div>
                    </div>
                    
                    <div class="result-card">
                      <div class="result-name">System Size</div>
                      <div class="result-value">${systemSizeValue}</div>
                      <div class="result-description">Powers all your selected appliances</div>
                    </div>
                  </div>
                  
                  <div class="accuracy-note">
                    <div class="note-icon"><i class="fas fa-exclamation-triangle"></i></div>
                    <div class="note-text">These estimates may not be exact. Actual energy usage can vary based on specific models and usage patterns.</div>
                  </div>
                  
                  <div class="total-energy">
                    <div class="total-title">Total Daily Energy Use</div>
                    <div class="total-value">${totalEnergy.toFixed(1)} kWh</div>
                  </div>
                </div>
                
                <div class="print-section">
                  <div class="section-title">Selected Appliances (${appliances.length})</div>
                  
                  <div class="appliances-list">
                    <div class="appliances-header">
                      <div>Appliance</div>
                      <div style="text-align:center">Quantity</div>
                      <div style="text-align:center">Wattage</div>
                      <div style="text-align:center">Hours/Day</div>
                      <div style="text-align:center">kWh/Day</div>
                    </div>
                    
                    ${appliances.map(app => `
                      <div class="appliance-item">
                        <div>${app.name}</div>
                        <div style="text-align:center">${app.quantity}</div>
                        <div style="text-align:center">${app.wattage}W</div>
                        <div style="text-align:center">${app.hours}</div>
                        <div style="text-align:center">${app.kwh.toFixed(2)}</div>
                      </div>
                    `).join('')}
                  </div>
                </div>
                
                <div class="print-footer">
                  This solar system recommendation is based on the appliances and options you selected. 
                  For a detailed professional assessment, please contact a solar installation expert.
                </div>
                
                <div class="disclaimer">
                  Note: Actual energy usage may vary based on specific product models, usage patterns, and environmental factors.
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
    
    backToStep2Button.addEventListener('click', function() {
      navigateToStep(2);
    });

    setupEnhancedPrinting();

    
    // ----------- INITIALIZATION -----------
    
    // Load shared appliances grid
    if (window.AppliancesModule) {
      // Set global synchronization between modules
      window.customApplianceCounter = 0;
      window.AppliancesModule.loadAppliancesGrid('simple', 'appliance-grid-container');
    } else {
      console.error('Appliances module not loaded!');
    }
    
    // Initialize language
    initializeLanguage();  
  });
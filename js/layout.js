document.addEventListener("DOMContentLoaded", () => {
  // Define function to load header and footer first
  function loadHeaderAndFooter() {
    // Load header component
    fetch('components/header.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('header-placeholder').innerHTML = data;
        
        // Initialize menu functionality after header is loaded
        initializeHeaderMenu();
      })
      .catch(error => {
        console.error('Error loading header:', error);
        document.getElementById('header-placeholder').innerHTML = '<p>Unable to load header</p>';
      });
    
    // Load footer component
    fetch('components/footer.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
      })
      .catch(error => {
        console.error('Error loading footer:', error);
        document.getElementById('footer-placeholder').innerHTML = '<p>Unable to load footer</p>';
      });
  }
  
  // Load header/footer components first
  loadHeaderAndFooter();
  
  // Set active mode based on current page
  const modeOptions = document.querySelectorAll('.mode-option');
  const modeSlider = document.querySelector('.mode-slider');
  let touchStartX = 0;
  let touchEndX = 0;
  
  if (modeOptions.length > 0 && modeSlider) {
    // Get current page filename
    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    
    // Set correct position for the slider based on current page
    if (currentPage.includes('assistive')) {
      // Set Assistive mode as active
      modeOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-mode') === 'assistive') {
          option.classList.add('active');
        }
      });
      modeSlider.style.left = '0';
    } 
    else if (currentPage.includes('advanced')) {
      // Set Advanced mode as active
      modeOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-mode') === 'advanced') {
          option.classList.add('active');
        }
      });
      modeSlider.style.left = '66.66%';
    }
    else {
      // Default to Standard mode
      modeOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-mode') === 'standard') {
          option.classList.add('active');
        }
      });
      modeSlider.style.left = '33.33%';
    }
  }
  
  // Mode Switch Functionality
  if (modeOptions.length > 0) {
    // Click handler for mode options
    modeOptions.forEach(option => {
      option.addEventListener('click', function() {
        const mode = this.dataset.mode;
        updateModeSelection(mode);
      });
    });
  }

  // Function to update mode selection and redirect if needed
  function updateModeSelection(mode) {
    // Update active class and slider position
    modeOptions.forEach(option => {
      option.classList.remove('active');
      if (option.getAttribute('data-mode') === mode) {
        option.classList.add('active');
      }
    });
    
    // Move slider
    if (mode === 'assistive') {
      modeSlider.style.left = '0';
      // Redirect after animation has time to complete (1 second)
      setTimeout(() => { window.location.href = 'assistive.html'; }, 1000);
    } else if (mode === 'standard') {
      modeSlider.style.left = '33.33%';
      // Redirect to standard mode
      setTimeout(() => { window.location.href = 'standard.html'; }, 1000);
    } else if (mode === 'advanced') {
      modeSlider.style.left = '66.66%';
      // Redirect after animation has time to complete (1 second)
      setTimeout(() => { window.location.href = 'advanced.html'; }, 1000);
    }
  }

  // Touch swipe functionality
  const modeSwitch = document.querySelector('.mode-switch');
  
  if (modeSwitch) { // Check if modeSwitch exists on this page
    modeSwitch.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    });

    modeSwitch.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
  }

  function handleSwipe() {
    // Calculate swipe distance
    const swipeDistance = touchEndX - touchStartX;
    
    // Get current active mode
    let currentMode = 'standard';
    modeOptions.forEach(option => {
      if (option.classList.contains('active')) {
        currentMode = option.getAttribute('data-mode');
      }
    });
    
    // Determine direction and mode change
    if (swipeDistance > 50) { // Right swipe
      if (currentMode === 'advanced') {
        updateModeSelection('standard');
      } else if (currentMode === 'standard') {
        updateModeSelection('assistive');
      }
    } else if (swipeDistance < -50) { // Left swipe
      if (currentMode === 'assistive') {
        updateModeSelection('standard');
      } else if (currentMode === 'standard') {
        updateModeSelection('advanced');
      }
    }
  }
});

// Initialize header menu functionality
function initializeHeaderMenu() {
  // Mobile menu toggle button
  const menuToggle = document.getElementById('menu-toggle');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  
  if (menuToggle && navbarCollapse) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      
      // If we're opening the menu
      if (!navbarCollapse.classList.contains('active')) {
        // Make it visible first, then add the active class for smooth animation
        navbarCollapse.style.display = 'block';
        
        // Force a reflow to ensure the initial state is applied
        navbarCollapse.offsetHeight;
        
        // Then add the active class for the animation
        setTimeout(() => {
          navbarCollapse.classList.add('active');
        }, 10);
        
        // Change toggle button text with smooth rotation
        this.style.transform = 'rotate(90deg)';
        setTimeout(() => {
          this.innerHTML = '&times;'; // X icon
          this.style.transform = 'rotate(0deg)';
        }, 150);
      } else {
        // If we're closing, remove active, then hide after animation completes
        navbarCollapse.classList.remove('active');
        
        // Change toggle button text with smooth rotation
        this.style.transform = 'rotate(90deg)';
        setTimeout(() => {
          this.innerHTML = '&#9776;'; // Hamburger icon
          this.style.transform = 'rotate(0deg)';
        }, 150);
        
        // Hide the menu after the animation is complete
        setTimeout(() => {
          if (!navbarCollapse.classList.contains('active')) {
            navbarCollapse.style.display = 'none';
          }
        }, 300); // Match this with the CSS transition time
      }
    });
  }
  
  // Dropdown menu for mobile - smoother toggle
  const solutionLink = document.getElementById('solution-link');
  const solutionSubmenu = document.getElementById('solution-submenu');
  
  if (solutionLink && solutionSubmenu) {
    solutionLink.addEventListener('click', function(event) {
      // Only prevent default on mobile
      if (window.innerWidth <= 1100) {
        event.preventDefault();
        
        // Toggle active class for animation
        solutionSubmenu.classList.toggle('active');
        
        // Rotate the dropdown arrow
        const arrow = this.querySelector('::after');
        if (arrow) {
          if (solutionSubmenu.classList.contains('active')) {
            arrow.style.transform = 'rotate(180deg)';
          } else {
            arrow.style.transform = 'rotate(0deg)';
          }
        }
      }
    });
  }
  
  // Reset menu state when window is resized, with smoother transitions
  window.addEventListener('resize', function() {
    if (window.innerWidth > 1100) {
      if (navbarCollapse) {
        // Reset the mobile menu
        navbarCollapse.classList.remove('active');
        navbarCollapse.style.display = 'block'; // Always show on desktop
      }
      
      if (menuToggle) {
        menuToggle.classList.remove('active');
        menuToggle.innerHTML = '&#9776;';
        menuToggle.style.transform = 'rotate(0deg)';
      }
      
      // Close all submenus smoothly
      const allSubmenus = document.querySelectorAll('.sub-menu');
      allSubmenus.forEach(submenu => {
        submenu.classList.remove('active');
      });
    }
  });
  
  // Close menu when clicking outside, with animation
  document.addEventListener('click', function(event) {
    const isMenuArea = event.target.closest('.navbar') || event.target.closest('#menu-toggle');
    if (!isMenuArea && navbarCollapse && navbarCollapse.classList.contains('active')) {
      // Remove active class first for animation
      navbarCollapse.classList.remove('active');
      
      // Update toggle button
      if (menuToggle) {
        menuToggle.classList.remove('active');
        menuToggle.style.transform = 'rotate(90deg)';
        setTimeout(() => {
          menuToggle.innerHTML = '&#9776;';
          menuToggle.style.transform = 'rotate(0deg)';
        }, 150);
      }
      
      // Hide the element after animation completes
      setTimeout(() => {
        if (!navbarCollapse.classList.contains('active')) {
          navbarCollapse.style.display = 'none';
        }
      }, 300);
    }
  });
}

// Video Tutorial Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Tutorial video configuration - Configure separate video IDs for mobile and desktop
  const tutorialVideos = {
    assistive: {
      mobile: "td_aGcI5N0E", 
      desktop: "BeVBQLOzAh4" 
    },
    standard: {
      mobile: "aMaCDWhZ7JE", 
      desktop: "aMp8rzCm8Mc"  
    },
    advanced: {
      mobile: "PO6DQTnPZ6g",
      desktop: "3kAm4iaYDt4"
    }
  };

  // Determine which calculator page we're on
  const isAssistivePage = window.location.pathname.includes("assistive.html");
  const isStandardPage = window.location.pathname.includes("standard.html");
  const isAdvancedPage = window.location.pathname.includes("advanced.html");
  
  // Elements
  const tutorialOverlay = document.getElementById('tutorialOverlay');
  const tutorialVideo = document.getElementById('tutorialVideo');
  const openTutorialBtn = document.getElementById('openTutorialBtn');
  const closeTutorialBtn = document.getElementById('closeTutorialBtn');
  const gotItBtn = document.getElementById('gotItBtn');
  const dontShowAgain = document.getElementById('dontShowAgain');
  
  // Only proceed if we're on a calculator page with tutorial elements
  if (tutorialOverlay && tutorialVideo && openTutorialBtn) {
    // Select mobile or desktop video based on screen size
    let isMobile = window.innerWidth <= 768;
    let videoType = isMobile ? 'mobile' : 'desktop';
    let videoId;
    let storageKey = '';
    
    if (isAssistivePage) {
      videoId = tutorialVideos.assistive[videoType];
      storageKey = 'assistiveTutorialShown';
    } else if (isStandardPage) {
      videoId = tutorialVideos.standard[videoType];
      storageKey = 'standardTutorialShown';
    } else if (isAdvancedPage) {
      videoId = tutorialVideos.advanced[videoType];
      storageKey = 'advancedTutorialShown';
    }
    
    // Update video ID when screen size changes
    window.addEventListener('resize', function() {
      const newIsMobile = window.innerWidth <= 768;
      if (newIsMobile !== isMobile) {
        isMobile = newIsMobile;
        videoType = isMobile ? 'mobile' : 'desktop';
        
        if (isAssistivePage) {
          videoId = tutorialVideos.assistive[videoType];
        } else if (isStandardPage) {
          videoId = tutorialVideos.standard[videoType];
        } else if (isAdvancedPage) {
          videoId = tutorialVideos.advanced[videoType];
        }
        
        // Reload video if tutorial is active when screen size changes
        if (tutorialOverlay.classList.contains('active')) {
          loadVideo();
        }
      }
    });
    
    // Add tooltip to open tutorial button
    const tooltipSpan = document.createElement('span');
    tooltipSpan.classList.add('tutorial-tooltip');
    tooltipSpan.textContent = 'View Tutorial';
    openTutorialBtn.appendChild(tooltipSpan);
    
    // Function to load the YouTube video
    const loadVideo = () => {
      if (videoId) {
        tutorialVideo.src = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1&modestbranding=1&showinfo=0&controls=1`;
      } else {
        tutorialVideo.src = 'about:blank';
        console.warn('No tutorial video ID available for this mode and device type');
      }
    };
    
    // Function to show the tutorial popup
    const showTutorial = () => {
      if (videoId) {
        tutorialOverlay.classList.add('active');
        loadVideo();
      } else {
        console.warn('Cannot show tutorial - no video ID available');
      }
    };
    
    // Function to hide the tutorial popup
    const hideTutorial = () => {
      tutorialOverlay.classList.remove('active');
      tutorialVideo.src = 'about:blank'; // Stop the video
    };
    
    // Function to save tutorial preferences
    const saveTutorialPreference = () => {
      if (dontShowAgain && dontShowAgain.checked) {
        localStorage.setItem(storageKey, 'true');
      }
    };
    
    // Event Listeners
    openTutorialBtn.addEventListener('click', showTutorial);
    
    closeTutorialBtn.addEventListener('click', () => {
      saveTutorialPreference();
      hideTutorial();
    });
    
    gotItBtn.addEventListener('click', () => {
      saveTutorialPreference();
      hideTutorial();
    });
    
    // Add direct event listener for checkbox
    if (dontShowAgain) {
      dontShowAgain.addEventListener('change', function() {
        if (this.checked) {
          localStorage.setItem(storageKey, 'true');
        } else {
          localStorage.removeItem(storageKey);
        }
      });
    }
    
    // Close when clicking outside the tutorial container
    tutorialOverlay.addEventListener('click', function(event) {
      if (event.target === tutorialOverlay) {
        saveTutorialPreference();
        hideTutorial();
      }
    });
  }
});
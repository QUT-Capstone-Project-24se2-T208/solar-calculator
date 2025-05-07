document.addEventListener("DOMContentLoaded", function() {
  // Mode switching functionality for tabs
  const modeTabs = document.querySelectorAll('.mode-tab');
  const modeContents = document.querySelectorAll('.mode-content');
  
  modeTabs.forEach((tab) => {
    tab.addEventListener('click', function() {
      const mode = this.getAttribute('data-mode');
      
      // Remove active class from all tabs and contents
      modeTabs.forEach(t => t.classList.remove('active'));
      modeContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      this.classList.add('active');
      document.querySelector(`.mode-content[data-mode="${mode}"]`).classList.add('active');
    });
  });
  
  // Navigation functionality
  const navLinks = document.querySelectorAll('.navigation-links a');
  
  // Update the active link in navigation based on current scroll position
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    // Find the current active section
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    // Update nav link active state
    navLinks.forEach(link => {
      link.parentElement.classList.remove('active');
      
      const href = link.getAttribute('href').substring(1); // Remove the # from href
      if (href === currentSection) {
        link.parentElement.classList.add('active');
      }
    });
  }
  
  // Call updateActiveNavLink on scroll
  window.addEventListener('scroll', updateActiveNavLink);
  
  // Initial call to set the active nav link
  updateActiveNavLink();
  
  // Add smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70, // 70px offset for fixed header
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Function to show loading spinner
  window.showLoadingSpinner = function(message = 'Loading...') {
    document.getElementById('loading-message').textContent = message;
    document.getElementById('loading-overlay').style.display = 'flex';
  }
  
  // Function to hide loading spinner
  window.hideLoadingSpinner = function() {
    document.getElementById('loading-overlay').style.display = 'none';
  }
  
  // Add intersection observer for animation effects
  if ('IntersectionObserver' in window) {
    const elements = document.querySelectorAll('.feature-item, .calculator-card, .about-sems-content, .about-sems-image, .triangle-item, .two-columns');
    
    const options = {
      root: null,
      threshold: 0.1,
      rootMargin: "0px"
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    elements.forEach(element => {
      element.classList.add('fade-in-element');
      observer.observe(element);
    });
  }

  // FAQ Toggle Functionality
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Check if this item is already active
      const isActive = item.classList.contains('active');
      
      // Close all FAQ items
      faqItems.forEach(faqItem => {
        faqItem.classList.remove('active');
      });
      
      // If the clicked item wasn't active, open it
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Initialize the first FAQ item as open
  if (faqItems.length > 0) {
    faqItems[0].classList.add('active');
  }
});

// Add CSS for animation
(function() {
  const style = document.createElement('style');
  style.textContent = `
    .fade-in-element {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }
    
    .fade-in-element.animated {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);
})(); 
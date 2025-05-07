document.addEventListener('DOMContentLoaded', function() {
    // Detect which calculator mode we're in
    const isSimpleMode = document.querySelector('.mode-option[data-mode="simple"].active') !== null;
    const isBasicMode = document.querySelector('.mode-option[data-mode="basic"].active') !== null;
    
    // DOM Elements - Common
    // Change from const to let for floatingBtn because we reassign it in init()
    let floatingBtn = document.getElementById('quote-request-floating-btn');
    let quoteModal = document.getElementById('quote-request-modal');
    let quoteForm, closeBtn, overlay, imageUploadBox, imageInput, imagePreviewArea, successMessage, closeSuccessBtn;
    
    // Constants
    const API_ENDPOINT = 'https://solar-calculator-backend.onrender.com/api/send-quote-request';
    const RESULTS_SECTION_ID = isSimpleMode ? 'step-3' : null; // Only used in simple mode
    const SCROLL_THRESHOLD = 300; // Pixels from the top of results to show the button
    
    // Check if the modal exists, create it if not
    function ensureModalExists() {
        if (quoteModal) return true;
        
        // Create modal from scratch
        createQuoteModal();
        
        // Update element references
        quoteModal = document.getElementById('quote-request-modal');
        quoteForm = document.getElementById('quote-request-form');
        closeBtn = document.getElementById('quote-close-btn');
        overlay = document.querySelector('.quote-request-overlay');
        imageUploadBox = document.getElementById('image-upload-box');
        imageInput = document.getElementById('image-upload');
        imagePreviewArea = document.getElementById('image-preview-area');
        successMessage = document.getElementById('quote-success-message');
        closeSuccessBtn = document.getElementById('close-success-btn');
        
        return !!quoteModal;
    }
    
    // Function to create quote request modal from scratch
    function createQuoteModal() {
        if (document.getElementById('quote-request-modal')) {
            return; // Modal already exists
        }
        
        const modalHTML = `
            <div id="quote-request-modal" class="quote-request-modal">
                <div class="quote-request-overlay"></div>
                <div class="quote-request-container">
                    <div class="quote-request-header">
                        <h2 id="quote-title">Request a Solar Quote</h2>
                        <button class="quote-request-close-btn" id="quote-close-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="quote-request-content">
                        <form id="quote-request-form" class="quote-request-form">
                            <div class="quote-form-section">
                                <h3 id="system-details-title">Your Solar System</h3>
                                <div class="system-details-section">
                                    <div class="system-detail-item">
                                        <div class="system-detail-icon">
                                            <img src="assets/solar-panel.png" alt="Solar Panels">
                                        </div>
                                        <div class="system-detail-content">
                                            <span class="system-detail-label" id="solar-panels-label">Solar Panels:</span>
                                            <span class="system-detail-value" id="quote-solar-panel-value">...</span>
                                            <input type="hidden" id="solar-panels" name="solar-panels">
                                        </div>
                                    </div>
                                    
                                    <div class="system-detail-item">
                                        <div class="system-detail-icon">
                                            <img src="assets/battery-capacity.png" alt="Battery">
                                        </div>
                                        <div class="system-detail-content">
                                            <span class="system-detail-label" id="battery-label">Battery:</span>
                                            <span class="system-detail-value" id="quote-battery-value">...</span>
                                            <input type="hidden" id="battery" name="battery">
                                        </div>
                                    </div>
                                    
                                    <div class="system-detail-item">
                                        <div class="system-detail-icon">
                                            <img src="assets/inverter.png" alt="System Size">
                                        </div>
                                        <div class="system-detail-content">
                                            <span class="system-detail-label" id="system-size-label">System Size:</span>
                                            <span class="system-detail-value" id="quote-system-size-value">...</span>
                                            <input type="hidden" id="system-size" name="system-size">
                                        </div>
                                    </div>
                                    
                                    <div class="system-detail-item">
                                        <div class="system-detail-icon">
                                            <i class="fas fa-bolt"></i>
                                        </div>
                                        <div class="system-detail-content">
                                            <span class="system-detail-label" id="total-energy-label">Daily Energy:</span>
                                            <span class="system-detail-value" id="quote-total-kwh-value">...</span> kWh
                                            <input type="hidden" id="daily-energy" name="daily-energy">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="quote-form-section">
                                <h3 id="personal-details-title">Your Contact Details</h3>
                                <div class="form-group">
                                    <label for="name" id="name-label">Name <span class="required">*</span></label>
                                    <input type="text" id="name" name="name" required>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="email" id="email-label">Email <span class="email-required">*</span></label>
                                        <input type="email" id="email" name="email">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="phone" id="phone-label">Phone Number <span class="phone-required" style="display: none;">*</span></label>
                                        <input type="tel" id="phone" name="phone">
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="address" id="address-label">Installation Address</label>
                                    <textarea id="address" name="address" rows="2"></textarea>
                                </div>
                                
                                <div class="form-group">
                                    <label id="contact-preference-label">Preferred Contact Method <span class="required">*</span></label>
                                    <div class="contact-options">
                                        <label class="contact-option">
                                            <input type="radio" name="contact-method" value="email" checked>
                                            <span class="contact-radio"></span>
                                            <span id="contact-email">Email</span>
                                        </label>
                                        <label class="contact-option">
                                            <input type="radio" name="contact-method" value="phone">
                                            <span class="contact-radio"></span>
                                            <span id="contact-phone">Phone Call</span>
                                        </label>
                                        <label class="contact-option">
                                            <input type="radio" name="contact-method" value="sms">
                                            <span class="contact-radio"></span>
                                            <span id="contact-sms">Message</span>
                                        </label>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label id="timeline-label">When are you planning to install?</label>
                                    <div class="timeline-options">
                                        <label class="timeline-option">
                                            <input type="radio" name="purchase-timeline" value="now" checked>
                                            <span class="timeline-radio"></span>
                                            <span id="timeline-now">Now</span>
                                        </label>
                                        <label class="timeline-option">
                                            <input type="radio" name="purchase-timeline" value="3months">
                                            <span class="timeline-radio"></span>
                                            <span id="timeline-3months">3 Months</span>
                                        </label>
                                        <label class="timeline-option">
                                            <input type="radio" name="purchase-timeline" value="6months">
                                            <span class="timeline-radio"></span>
                                            <span id="timeline-6months">6 Months</span>
                                        </label>
                                        <label class="timeline-option">
                                            <input type="radio" name="purchase-timeline" value="just-looking">
                                            <span class="timeline-radio"></span>
                                            <span id="timeline-looking">Just Looking</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="quote-form-section">
                                <h3 id="image-upload-title">Upload Images</h3>
                                <p class="upload-helper-text" id="image-upload-help">Upload images of your roof or installation area</p>
                                
                                <div class="image-upload-container">
                                    <div class="image-upload-box" id="image-upload-box">
                                        <i class="fas fa-cloud-upload-alt"></i>
                                        <span id="upload-instruction">Tap to upload or drop images here</span>
                                        <span class="file-types" id="file-types">(JPG, PNG, up to 5MB each)</span>
                                        <input type="file" id="image-upload" name="images[]" multiple accept="image/jpeg, image/png" class="file-input">
                                    </div>
                                    
                                    <div class="image-preview-area" id="image-preview-area">
                                        <!-- Image previews will appear here -->
                                    </div>
                                </div>
                            </div>
                            
                            <div class="quote-form-section">
                                <h3 id="comments-title">Additional Comments</h3>
                                <div class="form-group">
                                    <textarea id="comments" name="comments" rows="3" placeholder="Any additional information or questions?"></textarea>
                                </div>
                            </div>
                            
                            <div class="quote-form-section">
                                <div class="consent-checkbox">
                                    <label class="checkbox-container">
                                        <input type="checkbox" id="privacy-consent" name="privacy-consent" required>
                                        <span class="checkmark"></span>
                                        <span id="privacy-label">I agree to the <a href="#" id="privacy-link">Privacy Policy</a> and consent to being contacted about my solar quote request.</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div class="quote-form-actions">
                                <button type="submit" class="submit-button" id="submit-quote">
                                    <i class="fas fa-paper-plane"></i> <span id="submit-text">Send Quote Request</span>
                                </button>
                            </div>
                        </form>
                        
                        <div id="quote-success-message" class="quote-success-message" style="display: none;">
                            <div class="success-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <h3 id="success-title">Quote Request Sent!</h3>
                            <p id="success-message">Thank you for your request. Our team will contact you soon with a detailed quote for your solar system.</p>
                            <button id="close-success-btn" class="close-success-btn">
                                <span id="close-text">Close</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // Function to create a floating quote request button
    function ensureFloatingButtonExists() {
        if (floatingBtn) return;
        
        const btnHTML = `
            <div id="quote-request-floating-btn" class="quote-request-floating-btn">
                <i class="fas fa-file-invoice-dollar"></i>
                <span>Request a Quote</span>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', btnHTML);
    }
    
    // Function to create a blur overlay for basic mode
    function addBlurOverlayToBasicMode() {
      if (!isBasicMode) return;
      
      const resultsGrid = document.querySelector('.results-grid');
      if (!resultsGrid) return;
      
      // Check if blur overlay already exists
      if (resultsGrid.querySelector('.results-blur-overlay')) return;
      
      // Add position relative to the results grid for proper overlay positioning
      resultsGrid.style.position = 'relative';
      
      // Create the blur overlay
      const blurOverlay = document.createElement('div');
      blurOverlay.className = 'results-blur-overlay';
      blurOverlay.innerHTML = `
          <div class="blur-message">
              <i class="fas fa-lock"></i>
              <h3>System Requirements</h3>
              <p>Get a quote to view your results for solar system requirements</p>
              <button id="request-reveal-btn" class="reveal-button">
                  <i class="fas fa-file-invoice-dollar"></i> Request a Quote
              </button>
          </div>
      `;
      
      // Insert the overlay into the results grid instead of the results panel
      resultsGrid.appendChild(blurOverlay);
      
      // Add click event to the reveal button
      document.getElementById('request-reveal-btn').addEventListener('click', openQuoteModal);
    }
    
    // Function to sanitize filenames
    function sanitizeFilename(filename) {
        const lastDotIndex = filename.lastIndexOf('.');
        const extension = lastDotIndex > 0 ? filename.slice(lastDotIndex) : '';
        
        const timestamp = new Date().getTime();
        const randomString = Math.random().toString(36).substring(2, 8);
        
        return `image_${timestamp}_${randomString}${extension}`;
    }
    
    // Show/hide floating button based on scroll position (for Simple mode)
    function handleScroll() {
        if (!isSimpleMode || !floatingBtn) return;
        
        const resultsSection = document.getElementById(RESULTS_SECTION_ID);
        
        if (resultsSection) {
            const resultsSectionTop = resultsSection.getBoundingClientRect().top;
            const resultsSectionBottom = resultsSection.getBoundingClientRect().bottom;
            
            // Show button when results section is in view and we've scrolled past the threshold
            if (resultsSectionTop < window.innerHeight && resultsSectionBottom > 0 && resultsSectionTop < SCROLL_THRESHOLD) {
                floatingBtn.classList.add('visible');
            } else {
                floatingBtn.classList.remove('visible');
            }
        }
    }
    
    // Open quote request modal
    function openQuoteModal() {
        ensureModalExists();
        
        // Get calculator results
        populateSystemDetails();
        
        // Show modal
        quoteModal.style.display = 'block';
        
        // Add body class to prevent background scrolling
        document.body.classList.add('modal-open');
    }
    
    // Close quote request modal
    function closeQuoteModal() {
        if (!quoteModal) return;
        
        quoteModal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
    
    // Populate system details from calculator results
    function populateSystemDetails() {
        try {
            let solarPanelValue, batteryValue, systemSizeValue, totalKwhValue;
            
            // Get values based on the active mode
            if (isSimpleMode) {
                solarPanelValue = document.getElementById('solar-panel-value').textContent;
                batteryValue = document.getElementById('battery-value').textContent;
                systemSizeValue = document.getElementById('system-size-value').textContent;
                totalKwhValue = document.getElementById('total-kwh-value').textContent;
            } else if (isBasicMode) {
                solarPanelValue = document.getElementById('solar-panel-size').textContent;
                batteryValue = document.getElementById('battery-capacity').textContent;
                systemSizeValue = document.getElementById('inverter-size').textContent;
                totalKwhValue = document.getElementById('total-kwh-per-day').textContent;
            }
            
            // Update the form fields
            document.getElementById('quote-solar-panel-value').textContent = solarPanelValue;
            document.getElementById('quote-battery-value').textContent = batteryValue;
            document.getElementById('quote-system-size-value').textContent = systemSizeValue;
            document.getElementById('quote-total-kwh-value').textContent = totalKwhValue;
            
            // Update hidden inputs for form submission
            document.getElementById('solar-panels').value = solarPanelValue;
            document.getElementById('battery').value = batteryValue;
            document.getElementById('system-size').value = systemSizeValue;
            document.getElementById('daily-energy').value = totalKwhValue;
        } catch (error) {
            console.error('Error populating system details:', error);
        }
    }
    
    // Handle image uploads
    function handleImageUpload(files) {
        if (!imagePreviewArea) return;
        
        // Check if we have files
        if (!files || files.length === 0) return;
        
        // Check maximum number of files (limit to 5)
        if (imagePreviewArea.children.length + files.length > 5) {
            alert('You can upload a maximum of 5 images.');
            return;
        }
        
        // Create a set of existing file names to check for duplicates
        const existingFiles = new Set();
        Array.from(imagePreviewArea.querySelectorAll('.image-preview img')).forEach(img => {
            existingFiles.add(img.alt); // Using alt which contains filename
        });
        
        // Process each file
        Array.from(files).forEach(file => {
            // Check for duplicate files by name
            if (existingFiles.has(file.name)) {
                console.log('Skipping duplicate file:', file.name);
                return;
            }
            
            // Validate file type
            if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
                alert('Only JPEG and PNG images are allowed.');
                return;
            }
            
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size should not exceed 5MB.');
                return;
            }
            
            // Add to tracking set
            existingFiles.add(file.name);
            
            // Create preview
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Create preview container
                const previewContainer = document.createElement('div');
                previewContainer.className = 'image-preview';
                previewContainer.dataset.fileName = file.name;
                
                // Create image
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = file.name;
                img.dataset.fileSize = file.size;
                previewContainer.appendChild(img);
                
                // Create remove button
                const removeBtn = document.createElement('div');
                removeBtn.className = 'remove-image';
                removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                
                // Add click event to remove button
                removeBtn.addEventListener('click', function() {
                    previewContainer.remove();
                });
                
                previewContainer.appendChild(removeBtn);
                imagePreviewArea.appendChild(previewContainer);
            };
            
            reader.readAsDataURL(file);
        });
    }
    
    // Setup image upload functionality
    function setupImageUpload() {
        if (!imageUploadBox || !imageInput || !imagePreviewArea) return;
        
        // Prevent default behavior for dragover and drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            imageUploadBox.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Add highlighting when dragging over
        ['dragenter', 'dragover'].forEach(eventName => {
            imageUploadBox.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            imageUploadBox.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            imageUploadBox.classList.add('highlight');
        }
        
        function unhighlight() {
            imageUploadBox.classList.remove('highlight');
        }
        
        // Handle drop event
        imageUploadBox.addEventListener('drop', function(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleImageUpload(files);
        });
        
        // Handle click to upload
        imageUploadBox.addEventListener('click', function() {
            imageInput.click();
        });
        
        // Handle file selection
        imageInput.addEventListener('change', function() {
            handleImageUpload(this.files);
            
            // Reset file input to prevent the browser from automatically
            // including this in form submissions
            this.value = '';
        });
    }
    
    // XMLHttpRequest for form data submission
    function sendViaXHR(formData) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', API_ENDPOINT, true);
            
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve({ success: true, data: response });
                    } catch (e) {
                        resolve({ success: true, data: xhr.responseText });
                    }
                } else {
                    reject({ success: false, error: `Server responded with status: ${xhr.status}` });
                }
            };
            
            xhr.onerror = function() {
                reject({ success: false, error: 'Request failed' });
            };
            
            xhr.send(formData);
        });
    }
    
    // Show error message
    function showError(message) {
        alert(`Error: ${message || 'An error occurred while sending your request. Please try again later.'}`);
    }
    
    // Setup form submission
    function setupFormSubmission() {
        if (!quoteForm) return;
        
        const contactMethodRadios = document.querySelectorAll('input[name="contact-method"]');
        const phoneInput = document.getElementById('phone');
        const emailInput = document.getElementById('email');
        const phoneRequiredSpan = document.querySelector('.phone-required');
        const emailRequiredSpan = document.querySelector('.email-required');
        
        if (contactMethodRadios.length > 0 && phoneInput && emailInput) {
            // Set initial state based on default selection (usually email)
            updateContactFieldRequirements();
            
            // Add change event listeners to contact method radios
            contactMethodRadios.forEach(radio => {
                radio.addEventListener('change', updateContactFieldRequirements);
            });
        }
        
        // Function to update field requirements based on contact method
        function updateContactFieldRequirements() {
            const selectedMethod = document.querySelector('input[name="contact-method"]:checked');
            
            if (selectedMethod) {
                // Reset both fields first
                phoneInput.removeAttribute('required');
                emailInput.removeAttribute('required');
                
                // Hide both required indicators
                if (phoneRequiredSpan) phoneRequiredSpan.style.display = 'none';
                if (emailRequiredSpan) emailRequiredSpan.style.display = 'inline';
                
                // Make the appropriate field required based on selection
                if (selectedMethod.value === 'phone' || selectedMethod.value === 'sms') {
                    phoneInput.setAttribute('required', '');
                    if (phoneRequiredSpan) phoneRequiredSpan.style.display = 'inline';
                    if (emailRequiredSpan) emailRequiredSpan.style.display = 'none';
                } else if (selectedMethod.value === 'email') {
                    emailInput.setAttribute('required', '');
                    if (emailRequiredSpan) emailRequiredSpan.style.display = 'inline';
                    if (phoneRequiredSpan) phoneRequiredSpan.style.display = 'none';
                }
            }
        }
        
        // Modify the form to prevent default file inputs from being submitted
        if (imageInput) {
            imageInput.setAttribute('data-upload', 'true');
            imageInput.removeAttribute('name');
        }
        
        // Form submission handler
        quoteForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate form
            if (!this.checkValidity()) {
                return;
            }
            
            // Show loading state
            const submitButton = document.getElementById('submit-quote');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            
            try {
                // Create a fresh FormData object
                const formData = new FormData();
                
                // Add form fields
                const inputs = this.querySelectorAll('input:not([type="file"]), select, textarea');
                inputs.forEach(input => {
                    if (input.type === 'radio' || input.type === 'checkbox') {
                        if (input.checked) {
                            formData.append(input.name, input.value);
                        }
                    } else if (input.name) {
                        formData.append(input.name, input.value);
                    }
                });
                
                // Process images
                const imagePreviewElements = imagePreviewArea.querySelectorAll('.image-preview img');
                const processedSources = new Set();
                let imageCount = 0;
                
                imagePreviewElements.forEach((img) => {
                    // Skip if already processed this image source
                    if (processedSources.has(img.src)) {
                        return;
                    }
                    
                    // Mark as processed
                    processedSources.add(img.src);
                    
                    if (img.src.startsWith('data:')) {
                        const [header, data] = img.src.split(',');
                        const mimeMatch = header.match(/data:([^;]+);/);
                        const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
                        
                        const binary = atob(data);
                        const array = [];
                        for (let i = 0; i < binary.length; i++) {
                            array.push(binary.charCodeAt(i));
                        }
                        
                        const blob = new Blob([new Uint8Array(array)], { type: mime });
                        const safeFilename = sanitizeFilename(mime.split('/')[1] || 'png');
                        formData.append('image', blob, safeFilename);
                        
                        imageCount++;
                    }
                });
                
                // Send form data
                const result = await sendViaXHR(formData);
                
                // Handle success
                if (result.success) {
                    // Show success message
                    quoteForm.style.display = 'none';
                    successMessage.style.display = 'block';
                    
                    // Reset form
                    quoteForm.reset();
                    imagePreviewArea.innerHTML = '';
                    
                    // For basic mode: Remove the blur overlay to reveal results
                    if (isBasicMode) {
                        const blurOverlay = document.querySelector('.results-grid .results-blur-overlay');
                        if (blurOverlay) {
                            blurOverlay.classList.add('fade-out');
                            setTimeout(() => {
                                blurOverlay.remove();
                            }, 500);
                        }
                        
                        // Add Print This Page button
                        addPrintButtonAfterAdvancedMode();
                    }
                } else {
                    showError(result.error);
                }
            } catch (error) {
                console.error('Error in form submission:', error);
                showError(error.error || error.message || 'Failed to send request');
            } finally {
                // Reset button state
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    }
    
    // Add Quote Request button to navigation buttons (for Simple mode)
    function addQuoteRequestButton() {
        if (!isSimpleMode) return;
        
        // Find the navigation buttons container in step 3
        const navButtons = document.querySelector('#step-3 .navigation-buttons');
        
        if (navButtons && !document.getElementById('request-quote-btn')) {
            // Create quote request button
            const quoteButton = document.createElement('button');
            quoteButton.id = 'request-quote-btn';
            quoteButton.className = 'nav-button quote-button';
            
            // Set button text based on language
            const buttonText = typeof window.currentLanguage !== 'undefined' && window.currentLanguage === 'tok' ? 
                'Askim long Praim' : 'Request a Quote';
            
            quoteButton.innerHTML = `<i class="fas fa-file-invoice-dollar"></i> <span>${buttonText}</span>`;
            
            // Insert button between Back and Print buttons
            const printButton = document.getElementById('print-results');
            if (printButton) {
                navButtons.insertBefore(quoteButton, printButton);
            }
            
            // Add click event
            quoteButton.addEventListener('click', openQuoteModal);
        }
    }
    
    // Initialize modal and event listeners
    function setupModalEventListeners() {
        if (!ensureModalExists()) return;
        
        // Set up event listeners for the modal
        closeBtn.addEventListener('click', closeQuoteModal);
        overlay.addEventListener('click', closeQuoteModal);
        closeSuccessBtn.addEventListener('click', function() {
            successMessage.style.display = 'none';
            quoteForm.style.display = 'block';
            closeQuoteModal();
        });
        
        // Setup image upload
        setupImageUpload();
        
        // Setup form submission
        setupFormSubmission();
    }

    function setupQuoteButtonListener() {
        const quoteButton = document.getElementById('request-quote-btn');
        if (quoteButton) {
          quoteButton.addEventListener('click', openQuoteModal);
          console.log('Quote request button listener set up');
        }
      }
    
    // Initialize the quote request functionality based on mode
    function init() {
        // Check if we need to create floating button for Simple mode
        if (isSimpleMode && !floatingBtn) {
            ensureFloatingButtonExists();
            
            // Update the floatingBtn reference
            // This was causing the error - we need to update the reference
            floatingBtn = document.getElementById('quote-request-floating-btn');
            
            // Set up event listener for the floating button
            if (floatingBtn) {
                floatingBtn.addEventListener('click', openQuoteModal);
            }
            
            // Start monitoring scroll position for showing/hiding floating button
            window.addEventListener('scroll', handleScroll);
            
            // Initial check of scroll position
            handleScroll();
            
            // Add quote request button to step 3 navigation
            addQuoteRequestButton();
        }
        
        // For Basic mode, add blur overlay to system requirements
        if (isBasicMode) {
            addBlurOverlayToBasicMode();
            
            // Add Print This Page button during initialization
            initPrintButton();
        }
        
        // Setup modal and events
        setupModalEventListeners();

        // Setup the new quote button listener
        setupQuoteButtonListener();
        
        console.log(`Quote request initialized in ${isSimpleMode ? 'Simple' : isBasicMode ? 'Basic' : 'Unknown'} mode`);
    }
    
    // Delay initialization slightly to ensure DOM is fully ready
    setTimeout(init, 100);

    // Add Print This Page button after the Advanced Mode button
    function addPrintButtonAfterAdvancedMode() {
        // Find the advanced mode button container
        const tipsContent = document.querySelector('.tips-content');
        if (!tipsContent) return;
        
        const advancedModeBtn = document.querySelector('.advanced-mode-btn');
        if (!advancedModeBtn) return;
        
        // Check if print button already exists
        if (document.getElementById('print-page-btn')) return;
        
        // Create print button
        const printButton = document.createElement('a');
        printButton.id = 'print-page-btn';
        printButton.className = 'advanced-mode-btn print-button';
        printButton.href = '#';
        printButton.innerHTML = '<i class="fas fa-print"></i> Print Results';
        printButton.style.marginTop = '10px';
        printButton.style.backgroundColor = '#2c3e50';
        
        // Insert the print button after the advanced mode button
        advancedModeBtn.parentNode.insertBefore(printButton, advancedModeBtn.nextSibling);
        
        // Add click event listener for print functionality
        printButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check if a quote has been requested (check if blur overlay is removed)
            const blurOverlay = document.querySelector('.results-grid .results-blur-overlay');
            
            if (blurOverlay && isBasicMode) {
                // Show popup message
                showQuoteRequestPrompt();
            } else {
                // Proceed with printing
                openPrintableWindow();
            }
        });
    }

    // Function to show a prompt asking user to request a quote first
    function showQuoteRequestPrompt() {
        // Create modal overlay
        const promptOverlay = document.createElement('div');
        promptOverlay.className = 'quote-prompt-overlay';
        promptOverlay.style.position = 'fixed';
        promptOverlay.style.top = '0';
        promptOverlay.style.left = '0';
        promptOverlay.style.width = '100%';
        promptOverlay.style.height = '100%';
        promptOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        promptOverlay.style.zIndex = '9999';
        promptOverlay.style.display = 'flex';
        promptOverlay.style.justifyContent = 'center';
        promptOverlay.style.alignItems = 'center';
        
        // Create prompt box
        const promptBox = document.createElement('div');
        promptBox.className = 'quote-prompt-box';
        promptBox.style.backgroundColor = 'white';
        promptBox.style.borderRadius = '8px';
        promptBox.style.padding = '25px';
        promptBox.style.maxWidth = '450px';
        promptBox.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        
        // Prompt content
        promptBox.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <i class="fas fa-info-circle" style="font-size: 36px; color: #3498db;"></i>
            </div>
            <h3 style="margin-top: 0; color: #2c3e50; text-align: center;">View Full Results</h3>
            <p style="margin-bottom: 25px; color: #555; line-height: 1.5;">
                To view and print the complete system details, please request a quote first. 
                This helps us provide you with the most accurate information for your solar system.
            </p>
            <div style="display: flex; justify-content: space-between;">
                <button id="prompt-cancel-btn" style="padding: 10px 15px; border: 1px solid #ddd; background-color: #f1f1f1; border-radius: 5px; cursor: pointer; flex: 1; margin-right: 10px;">
                    Cancel
                </button>
                <button id="prompt-request-btn" style="padding: 10px 15px; border: none; background-color: #3498db; color: white; border-radius: 5px; cursor: pointer; flex: 1.5;">
                    Request a Quote
                </button>
            </div>
        `;
        
        // Append to DOM
        promptOverlay.appendChild(promptBox);
        document.body.appendChild(promptOverlay);
        
        // Add event listeners
        document.getElementById('prompt-cancel-btn').addEventListener('click', function() {
            promptOverlay.remove();
        });
        
        document.getElementById('prompt-request-btn').addEventListener('click', function() {
            promptOverlay.remove();
            openQuoteModal();
        });
        
        // Close on overlay click
        promptOverlay.addEventListener('click', function(e) {
            if (e.target === promptOverlay) {
                promptOverlay.remove();
            }
        });
    }

    // Initialize the Print This Page button during page load
    function initPrintButton() {
        if (isBasicMode) {
            // Find the advanced mode button
            const advancedModeBtn = document.querySelector('.advanced-mode-btn');
            if (advancedModeBtn && !document.getElementById('print-page-btn')) {
                addPrintButtonAfterAdvancedMode();
            }
        }
    }

    // Function to open a new window with formatted content for printing
    function openPrintableWindow() {
        // Get the necessary result data
        const inverterSize = document.getElementById('inverter-size').textContent;
        const solarPanelSize = document.getElementById('solar-panel-size').textContent;
        const batteryCapacity = document.getElementById('battery-capacity').textContent;
        const totalLoad = document.getElementById('total-load-kw').textContent;
        const totalEnergy = document.getElementById('total-kwh-per-day').textContent;
        
        // Get appliance data
        const applianceRows = document.querySelectorAll('#appliance-list tr');
        let applianceHTML = '';
        
        applianceRows.forEach(row => {
            const applianceName = row.querySelector('.appliance-title').tagName === 'INPUT' 
                ? row.querySelector('.appliance-title').value 
                : row.querySelector('.appliance-title').textContent;
            
            const quantity = row.querySelector('.quantity').value;
            const wattage = row.querySelector('.wattage').value;
            const hours = row.querySelector('.hours-per-day').value;
            const kwhPerDay = row.querySelector('.daily-kwh').textContent;
            
            applianceHTML += `
                <tr>
                    <td>${applianceName}</td>
                    <td>${quantity}</td>
                    <td>${wattage} W</td>
                    <td>${hours} hrs</td>
                    <td>${kwhPerDay} kWh</td>
                </tr>
            `;
        });
        
        // Current date for report
        const today = new Date();
        const dateString = today.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Create HTML content for the new window
        const printContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Solar System Report - ${dateString}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        padding-bottom: 20px;
                        border-bottom: 2px solid #3498db;
                    }
                    .logo {
                        max-width: 200px;
                        margin-bottom: 10px;
                    }
                    h1 {
                        color: #2c3e50;
                        margin: 0;
                        font-size: 24px;
                    }
                    .date {
                        color: #7f8c8d;
                        font-size: 14px;
                        margin-top: 5px;
                    }
                    .summary-section, .appliances-section {
                        margin-bottom: 30px;
                    }
                    h2 {
                        color: #2c3e50;
                        font-size: 18px;
                        border-bottom: 1px solid #eee;
                        padding-bottom: 10px;
                        margin-top: 30px;
                    }
                    .summary-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 20px;
                        margin-top: 20px;
                    }
                    .summary-item {
                        background-color: #f8f9fa;
                        border-radius: 8px;
                        padding: 15px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                    }
                    .summary-label {
                        font-size: 14px;
                        color: #7f8c8d;
                        margin-bottom: 5px;
                    }
                    .summary-value {
                        font-size: 18px;
                        font-weight: bold;
                        color: #2c3e50;
                    }
                    .consumption-box {
                        background-color: #f1f9fe;
                        border-radius: 8px;
                        padding: 15px;
                        display: flex;
                        justify-content: space-between;
                        margin-top: 20px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                    }
                    .consumption-item {
                        text-align: center;
                        flex: 1;
                    }
                    .consumption-label {
                        font-size: 14px;
                        color: #7f8c8d;
                    }
                    .consumption-value {
                        font-size: 22px;
                        font-weight: bold;
                        color: #3498db;
                        margin-top: 5px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th {
                        background-color: #f1f1f1;
                        color: #2c3e50;
                        font-weight: 600;
                        text-align: left;
                        padding: 12px;
                    }
                    td {
                        padding: 12px;
                        border-bottom: 1px solid #eee;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    .footer {
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #3498db;
                        text-align: center;
                        font-size: 14px;
                        color: #7f8c8d;
                    }
                    .contact-info {
                        margin-top: 10px;
                    }
                    .print-button {
                        background-color: #3498db;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                        margin-top: 20px;
                        display: block;
                        width: 200px;
                        margin: 20px auto;
                        text-align: center;
                    }
                    .print-button:hover {
                        background-color: #2980b9;
                    }
                    @media print {
                        .print-button {
                            display: none;
                        }
                        body {
                            padding: 0;
                            margin: 0;
                        }
                        .page-break {
                            page-break-before: always;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <!-- Company logo would be here -->
                    <h1>Solar System Requirements Report</h1>
                    <div class="date">Generated on ${dateString}</div>
                </div>
                
                <div class="summary-section">
                    <h2>Recommended System Configuration</h2>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <div class="summary-label">Inverter Size</div>
                            <div class="summary-value">${inverterSize}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Solar Panels</div>
                            <div class="summary-value">${solarPanelSize}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Battery Capacity</div>
                            <div class="summary-value">${batteryCapacity}</div>
                        </div>
                    </div>
                    
                    <div class="consumption-box">
                        <div class="consumption-item">
                            <div class="consumption-label">Potential Load</div>
                            <div class="consumption-value">${totalLoad} kW</div>
                        </div>
                        <div class="consumption-item">
                            <div class="consumption-label">Daily Energy Consumption</div>
                            <div class="consumption-value">${totalEnergy} kWh</div>
                        </div>
                    </div>
                </div>
                
                <div class="appliances-section">
                    <h2>Appliance Details</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Appliance</th>
                                <th>Quantity</th>
                                <th>Power</th>
                                <th>Hours/Day</th>
                                <th>Energy/Day</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${applianceHTML}
                        </tbody>
                    </table>
                </div>
                
                <div class="footer">
                    <p>This report is generated based on the information provided in the Solar Calculator.</p>
                    <p>For a detailed quote and personalized consultation, please contact us.</p>
                    <div class="contact-info">
                        <p>Email: info@tepng.com | Phone: +675 123 4567</p>
                    </div>
                </div>
                
                <button class="print-button" onclick="window.print();">Print This Page</button>
            </body>
            </html>
        `;
        
        // Open new window and write content
        const printWindow = window.open('', '_blank', 'width=1000,height=800');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
    }
});
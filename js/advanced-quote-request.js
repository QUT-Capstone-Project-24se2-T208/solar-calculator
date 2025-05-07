document.addEventListener('DOMContentLoaded', function() {
    // Detect which calculator mode we're in
    const isAdvancedMode = document.querySelector('.mode-option[data-mode="advanced"].active') !== null;
    
    if (!isAdvancedMode) return; // Only run this code in advanced mode
    
    // DOM Elements - Common
    let floatingBtn = document.getElementById('quote-request-floating-btn');
    let quoteModal = document.getElementById('quote-request-modal');
    let quoteForm, closeBtn, overlay, imageUploadBox, imageInput, imagePreviewArea, successMessage, closeSuccessBtn;
    
    // Constants
    const API_ENDPOINT = 'https://solar-calculator-backend.onrender.com/api/send-quote-request';
    const RESULTS_SECTION_ID = 'step-5'; // The results step in advanced mode
    
    // Flag to track if the results popup has been shown
    let resultsPopupShown = false;
    
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
                                            <span class="system-detail-label" id="solar-panels-label">System Type:</span>
                                            <span class="system-detail-value" id="quote-system-type-value">...</span>
                                            <input type="hidden" id="system-type-input" name="system-type">
                                        </div>
                                    </div>
                                    
                                    <div class="system-detail-item">
                                        <div class="system-detail-icon">
                                            <i class="fas fa-compass"></i>
                                        </div>
                                        <div class="system-detail-content">
                                            <span class="system-detail-label" id="battery-label">Panel Orientation:</span>
                                            <span class="system-detail-value" id="quote-orientation-value">...</span>
                                            <input type="hidden" id="orientation" name="orientation">
                                        </div>
                                    </div>
                                    
                                    <div class="system-detail-item">
                                        <div class="system-detail-icon">
                                            <img src="assets/inverter.png" alt="System Size">
                                        </div>
                                        <div class="system-detail-content">
                                            <span class="system-detail-label" id="system-size-label">System Size:</span>
                                            <span class="system-detail-value" id="quote-system-size-value">...</span>
                                            <input type="hidden" id="system-size-result" name="system-size">
                                        </div>
                                    </div>
                                    
                                    <div class="system-detail-item">
                                        <div class="system-detail-icon">
                                            <i class="fas fa-bolt"></i>
                                        </div>
                                        <div class="system-detail-content">
                                            <span class="system-detail-label" id="total-energy-label">Annual Output:</span>
                                            <span class="system-detail-value" id="quote-annual-output-value">...</span>
                                            <input type="hidden" id="annual-output-result" name="annual-output">
                                        </div>
                                    </div>
                                    
                                    <div class="system-detail-item">
                                        <div class="system-detail-icon">
                                            <i class="fas fa-coins"></i>
                                        </div>
                                        <div class="system-detail-content">
                                            <span class="system-detail-label">Monthly Savings:</span>
                                            <span class="system-detail-value" id="quote-monthly-savings-value">...</span>
                                            <input type="hidden" id="monthly-savings-result" name="monthly-savings">
                                        </div>
                                    </div>
                                    
                                    <div class="system-detail-item">
                                        <div class="system-detail-icon">
                                            <i class="fas fa-plug"></i>
                                        </div>
                                        <div class="system-detail-content">
                                            <span class="system-detail-label">Daily Electricity Usage:</span>
                                            <span class="system-detail-value" id="quote-daily-usage-value">...</span>
                                            <input type="hidden" id="daily-usage-input" name="daily-usage">
                                        </div>
                                    </div>
                                    
                                    <div class="system-detail-item">
                                        <div class="system-detail-icon">
                                            <i class="fas fa-file-invoice-dollar"></i>
                                        </div>
                                        <div class="system-detail-content">
                                            <span class="system-detail-label">Monthly Electricity Bill:</span>
                                            <span class="system-detail-value" id="quote-electric-bill-value">...</span>
                                            <input type="hidden" id="electric-bill-input" name="electric-bill">
                                        </div>
                                    </div>
                                    
                                    <div class="system-detail-item">
                                        <div class="system-detail-icon">
                                            <i class="fas fa-angle-up"></i>
                                        </div>
                                        <div class="system-detail-content">
                                            <span class="system-detail-label">Panel Tilt:</span>
                                            <span class="system-detail-value" id="quote-tilt-value">...</span>
                                            <input type="hidden" id="tilt-input" name="tilt">
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
                                    <label for="location-coordinates" id="coordinates-label">Location Coordinates</label>
                                    <input type="text" id="location-coordinates" name="location-coordinates" readonly>
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

    // Create Results Popup Modal
    function createResultsPopup() {
        // Check if popup already exists
        if (document.getElementById('results-popup')) return;
        
        const popupHTML = `
            <div id="results-popup" class="results-popup">
                <div class="results-popup-overlay"></div>
                <div class="results-popup-container">
                    <div class="results-popup-header">
                        <h2>Ready to Install Solar?</h2>
                        <button class="popup-close-btn" id="popup-close-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="results-popup-content">
                        <div class="popup-icon">
                            <i class="fas fa-solar-panel"></i>
                        </div>
                        <p>Your custom solar solution could save you <strong><span id="popup-savings">$0</span></strong> monthly.</p>
                        <p>Would you like to request a detailed quote from our solar experts?</p>
                        <div class="popup-actions">
                            <button class="popup-request-btn" id="popup-request-btn">
                                <i class="fas fa-file-invoice-dollar"></i> Get a Quote
                            </button>
                            <button class="popup-later-btn" id="popup-later-btn">
                                Maybe Later
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', popupHTML);
        
        // Add event listeners
        document.getElementById('popup-close-btn').addEventListener('click', hideResultsPopup);
        document.getElementById('popup-later-btn').addEventListener('click', hideResultsPopup);
        document.getElementById('popup-request-btn').addEventListener('click', function() {
            hideResultsPopup();
            openQuoteModal();
        });
    }
    
    // Show Results Popup
    function showResultsPopup() {
        // Don't show if already shown in this session
        if (resultsPopupShown) return;
        
        // Create the popup if it doesn't exist
        createResultsPopup();
        
        // Update savings value
        const savingsValue = document.getElementById('monthly-savings').textContent || '0';
        const currencySymbol = document.getElementById('currency-symbol-result').textContent || '$';
        document.getElementById('popup-savings').textContent = currencySymbol + savingsValue;
        
        // Show popup with animation
        const popup = document.getElementById('results-popup');
        popup.style.display = 'block';
        
        // Add class for animation after a short delay
        setTimeout(() => {
            popup.classList.add('show');
        }, 10);
        
        // Mark as shown
        resultsPopupShown = true;
    }
    
    // Hide Results Popup
    function hideResultsPopup() {
        const popup = document.getElementById('results-popup');
        if (!popup) return;
        
        popup.classList.remove('show');
        
        // Remove after animation completes
        setTimeout(() => {
            popup.style.display = 'none';
        }, 300);
    }
    
    // Function to sanitize filenames
    function sanitizeFilename(filename) {
        const lastDotIndex = filename.lastIndexOf('.');
        const extension = lastDotIndex > 0 ? filename.slice(lastDotIndex) : '';
        
        const timestamp = new Date().getTime();
        const randomString = Math.random().toString(36).substring(2, 8);
        
        return `image_${timestamp}_${randomString}${extension}`;
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
            // Get values from advanced calculator results
            const systemType = document.getElementById('result-system-type').textContent;
            const orientation = document.getElementById('result-orientation').textContent;
            const systemSize = document.getElementById('result-system-size').textContent;
            
            // Extract numeric values for savings and output
            const annualOutput = document.getElementById('annual-output').textContent;
            const monthlySavings = document.getElementById('monthly-savings').textContent;
            const currencySymbol = document.getElementById('currency-symbol-result').textContent || '$';
            
            const coordinates = document.getElementById('location-value').textContent;
            
            // Get additional values needed for the form
            const dailyUsage = document.getElementById('daily-usage').value;
            const electricBill = document.getElementById('electric-bill').value;
            const tilt = document.getElementById('tilt').value;
            
            // Set display values (with units)
            document.getElementById('quote-system-type-value').textContent = systemType || 'Not specified';
            document.getElementById('quote-orientation-value').textContent = orientation || 'Not specified';
            document.getElementById('quote-system-size-value').textContent = systemSize || 'Not calculated';
            document.getElementById('quote-annual-output-value').textContent = annualOutput + ' kWh/year';
            document.getElementById('location-coordinates').value = coordinates;
            document.getElementById('quote-monthly-savings-value').textContent = currencySymbol + monthlySavings;
            document.getElementById('quote-daily-usage-value').textContent = dailyUsage + ' kWh/day';
            document.getElementById('quote-electric-bill-value').textContent = currencySymbol + electricBill;
            document.getElementById('quote-tilt-value').textContent = tilt + '°';
            
            // Set hidden input values (without units for clean data)
            document.getElementById('system-type-input').value = systemType;
            document.getElementById('orientation').value = orientation;
            document.getElementById('system-size-result').value = systemSize;
            document.getElementById('annual-output-result').value = annualOutput + ' kWh/year';
            document.getElementById('monthly-savings-result').value = currencySymbol + " " + monthlySavings;
            document.getElementById('daily-usage-input').value = dailyUsage + ' kWh';
            document.getElementById('electric-bill-input').value = currencySymbol + " " + electricBill;
            document.getElementById('tilt-input').value = tilt + '°';
            
            console.log('System details populated:', {
                systemType,
                orientation,
                systemSize,
                annualOutput,
                monthlySavings,
                dailyUsage,
                electricBill,
                tilt
            });
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
    
    // Monitor step navigation to show popup when reaching results
    function monitorStepNavigation() {
        // Find the Calculate button that navigates to results
        const calculateBtn = document.getElementById('panel-calculate-btn');
        
        if (calculateBtn) {
            // Create a wrapper for the original click handler
            const originalClickHandler = calculateBtn.onclick;
            calculateBtn.onclick = null;
            
            calculateBtn.addEventListener('click', function(e) {
                // Set a flag to show the popup after calculation completes
                window.showQuotePopupAfterCalc = true;
                
                // Let the original handler run
                if (typeof originalClickHandler === 'function') {
                    originalClickHandler.call(this, e);
                }
            });
        }
        
        // Check when results become visible
        const resultsStep = document.getElementById(RESULTS_SECTION_ID);
        if (resultsStep) {
            // Use MutationObserver to detect when the results step becomes active
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && 
                        mutation.attributeName === 'class' && 
                        resultsStep.classList.contains('active') &&
                        window.showQuotePopupAfterCalc) {
                        
                        // Clear the flag
                        window.showQuotePopupAfterCalc = false;
                        
                        // Show popup after a delay to let results load
                        setTimeout(showResultsPopup, 1500);
                    }
                });
            });
            
            // Start observing the results step
            observer.observe(resultsStep, { attributes: true });
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
    
    // Initialize the quote request functionality
    function init() {
        // Check if we need to create floating button
        if (!floatingBtn) {
            ensureFloatingButtonExists();
            
            // Update the floatingBtn reference
            floatingBtn = document.getElementById('quote-request-floating-btn');
            
            // Set up event listener for the floating button
            if (floatingBtn) {
                floatingBtn.addEventListener('click', openQuoteModal);
                
                // Start monitoring scroll position to show the button when results are visible
                window.addEventListener('scroll', function() {
                    const resultsSection = document.getElementById(RESULTS_SECTION_ID);
                    
                    if (resultsSection && resultsSection.classList.contains('active')) {
                        floatingBtn.classList.add('visible');
                    } else {
                        floatingBtn.classList.remove('visible');
                    }
                });
            }
        }
        
        // Setup modal and events
        setupModalEventListeners();
        
        // Monitor step navigation for showing the popup
        monitorStepNavigation();
        
        // Change Share Results button to Request Quote
        // setupQuoteRequestButton();
        
        console.log('Advanced mode quote request initialized');
    }
    
    // Delay initialization slightly to ensure DOM is fully ready
    setTimeout(init, 500);
});
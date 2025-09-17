// Shared JavaScript utilities for signature pad documentation
class SignaturePadDocs {
    constructor() {
        this.pads = {};
        this.isLibraryLoaded = false;
    }

    async init() {
        if (this.isLibraryLoaded) return;
        
        // Wait for library to be available (it should already be loaded by HTML)
        await this.waitForLibrary();
        this.isLibraryLoaded = true;
    }

    async waitForLibrary() {
        // Wait for SignaturePad to be available (loaded by HTML script tag)
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50; // 5 seconds max wait
            
            const checkLibrary = () => {
                if (typeof window.SignaturePad !== 'undefined') {
                    console.log('✅ SignaturePad library is available');
                    resolve();
                } else if (attempts++ < maxAttempts) {
                    setTimeout(checkLibrary, 100);
                } else {
                    console.error('❌ SignaturePad library not found after waiting');
                    reject(new Error('SignaturePad library not available'));
                }
            };
            
            checkLibrary();
        });
    }

    createSignaturePad(containerId, options = {}) {
        let canvas = document.getElementById(containerId);
        let container = null;
        
        // If we have a container div, create or find the canvas inside it
        if (canvas && canvas.tagName !== 'CANVAS') {
            container = canvas;
            canvas = container.querySelector('canvas');
            
            // If no canvas exists in the container, create one
            if (!canvas) {
                canvas = document.createElement('canvas');
                canvas.id = containerId + '-canvas';
                canvas.className = 'signature-canvas';
                
                // Set canvas dimensions based on container size
                const rect = container.getBoundingClientRect();
                canvas.width = rect.width || 400;
                canvas.height = rect.height || 200;
                
                // Clear any placeholder content
                container.innerHTML = '';
                container.appendChild(canvas);
            }
        }
        
        if (!canvas) {
            console.error(`Canvas with ID ${containerId} not found`);
            return null;
        }

        // Ensure we have a canvas element
        if (canvas.tagName !== 'CANVAS') {
            console.error(`Element with ID ${containerId} is not a canvas`);
            return null;
        }

        // Wait for SignaturePad to be available
        if (typeof window.SignaturePad === 'undefined') {
            console.error('SignaturePad library not loaded');
            return null;
        }
        
        const defaultOptions = {
            backgroundColor: options.backgroundColor || options.background || 'rgb(255, 255, 255)',
            penColor: options.penColor || options.color || 'rgb(0, 0, 0)',
            minWidth: options.minWidth || 0.5,
            maxWidth: options.maxWidth || 2.5,
            throttle: options.throttle || 16,
            minDistance: options.minDistance || 5,
            velocityFilterWeight: options.velocityFilterWeight || 0.7,
            dotSize: options.dotSize || 1.0
        };

        const finalOptions = { ...defaultOptions, ...options };

        try {
            const pad = new window.SignaturePad(canvas, finalOptions);
            this.pads[containerId] = pad;
            
            // Add convenience methods to the pad instance
            pad.clear = function() {
                window.SignaturePad.prototype.clear.call(this);
                // Update status after clearing
                if (container) container.classList.remove('has-content');
                signatureDocs.updateStatus(containerId, this);
            };
            
            // Set up event handlers if available
            if (pad.addEventListener) {
                pad.addEventListener('beginStroke', () => {
                    this.updateStatus(containerId, pad);
                    if (container) container.classList.add('has-content');
                });
                
                pad.addEventListener('endStroke', () => {
                    this.updateStatus(containerId, pad);
                });
            }
            
            // Initialize status
            this.updateStatus(containerId, pad);
            
            console.log(`✅ Signature pad created for canvas: ${containerId}`);
            return pad;
        } catch (error) {
            console.error(`❌ Failed to create signature pad for ${containerId}:`, error);
            this.showError(containerId, 'Failed to initialize signature pad');
            return null;
        }
    }

    updateStatus(containerId, pad) {
        const statusElement = document.getElementById(`${containerId.replace('-pad', '-status')}`);
        if (!statusElement) return;

        if (pad.isEmpty()) {
            statusElement.textContent = 'Ready to sign';
        } else {
            statusElement.textContent = '✓ Signature captured';
        }
    }

    showError(containerId, message) {
        const statusElement = document.getElementById(`${containerId.replace('-pad', '-status')}`);
        if (statusElement) {
            statusElement.textContent = `❌ ${message}`;
        }
    }

    // Control functions for demo pads
    clearPad(containerId) {
        const pad = this.pads[containerId];
        if (pad) {
            pad.clear();
            this.updateStatus(containerId, pad);
            
            // Remove has-content class from container
            const container = document.getElementById(containerId);
            if (container) {
                container.classList.remove('has-content');
            }
        }
    }

    exportPNG(containerId, filename = 'signature.png') {
        const pad = this.pads[containerId];
        if (pad && !pad.isEmpty()) {
            const dataUrl = pad.toDataURL();
            this.downloadFile(dataUrl, filename);
        } else {
            alert('Please create a signature first!');
        }
    }

    exportSVG(containerId, filename = 'signature.svg') {
        const pad = this.pads[containerId];
        if (pad && !pad.isEmpty() && pad.toSVG) {
            const svgData = pad.toSVG();
            const blob = new Blob([svgData], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            this.downloadFile(url, filename);
        } else {
            alert('Please create a signature first!');
        }
    }

    exportJSON(containerId, filename = 'signature.json') {
        const pad = this.pads[containerId];
        if (pad && !pad.isEmpty() && pad.toData) {
            const jsonData = JSON.stringify(pad.toData(), null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            this.downloadFile(url, filename);
        } else {
            alert('Please create a signature first!');
        }
    }

    downloadFile(url, filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up blob URL if it was created
        if (url.startsWith('blob:')) {
            setTimeout(() => URL.revokeObjectURL(url), 100);
        }
    }
}

// Create global instance - available as both signatureDocs and signaturePads for compatibility
const signatureDocs = new SignaturePadDocs();

// Global signature pads manager for easy access across all pages
const signaturePads = {
    init: async function(padConfigs = []) {
        try {
            // Wait for the signature pad library to load
            await signatureDocs.init();
            
            // Initialize each configured pad
            padConfigs.forEach(config => {
                const { id, options = {} } = config;
                const pad = signatureDocs.createSignaturePad(id, options);
                // Make the pad accessible as a property (e.g., signaturePads.basic)
                this[id] = pad;
            });
            
            console.log('✅ All signature pads initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize signature pads:', error);
            return false;
        }
    },
    
    // Convenience methods that delegate to signatureDocs
    clear: function(id) {
        return signatureDocs.clearPad(id);
    },
    
    exportPNG: function(id, filename) {
        return signatureDocs.exportPNG(id, filename);
    },
    
    exportSVG: function(id, filename) {
        return signatureDocs.exportSVG(id, filename);
    },
    
    exportJSON: function(id, filename) {
        return signatureDocs.exportJSON(id, filename);
    },
    
    // Get a specific pad instance
    getPad: function(id) {
        return signatureDocs.pads[id];
    },
    
    // Check if a pad exists and is not empty
    isEmpty: function(id) {
        const pad = this.getPad(id);
        return !pad || pad.isEmpty();
    }
};
// Shared JavaScript utilities for signature pad documentation
class SignaturePadDocs {
    constructor() {
        this.pads = {};
        this.isLibraryLoaded = false;
    }

    async init() {
        if (this.isLibraryLoaded) return;
        await this.loadLibrary();
        this.isLibraryLoaded = true;
    }

    async loadLibrary() {
        return new Promise((resolve, reject) => {
            // Use the standard signature_pad library from CDN
            const script = document.createElement('script');
            script.onload = () => {
                console.log('✅ SignaturePad library loaded successfully');
                resolve();
            };
            script.onerror = () => {
                console.error('❌ Failed to load SignaturePad library');
                reject(new Error('Failed to load SignaturePad library'));
            };
            script.src = 'https://cdn.jsdelivr.net/npm/signature_pad@4.0.0/dist/signature_pad.umd.min.js';
            document.head.appendChild(script);
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
            
            // Set up event handlers if available
            if (pad.on) {
                pad.on('beginStroke', () => {
                    this.updateStatus(containerId, pad);
                    if (container) container.classList.add('has-content');
                });
                
                pad.on('endStroke', () => {
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

// Create global instance
const signatureDocs = new SignaturePadDocs();
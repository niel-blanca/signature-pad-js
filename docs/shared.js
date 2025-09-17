// Shared JavaScript utilities for signature pad documentation
class SignaturePadDocs {
    constructor() {
        this.pads = new Map();
        this.loadLibrary();
    }

    async loadLibrary() {
        return new Promise((resolve, reject) => {
            // Try to load from local dist first, then fallback to CDN
            const script = document.createElement('script');
            script.onload = () => {
                console.log('✅ SignaturePad library loaded successfully');
                resolve();
            };
            script.onerror = () => {
                console.log('⚠️ Local library failed, trying CDN...');
                this.loadFromCDN().then(resolve).catch(reject);
            };
            script.src = '../dist/signature-pad.js';
            document.head.appendChild(script);
        });
    }

    async loadFromCDN() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.onload = () => {
                console.log('✅ SignaturePad library loaded from CDN');
                resolve();
            };
            script.onerror = () => {
                console.error('❌ Failed to load SignaturePad library from CDN');
                reject(new Error('Failed to load SignaturePad library'));
            };
            script.src = 'https://unpkg.com/@niel-blanca/signature-pad@latest/dist/signature-pad.min.js';
            document.head.appendChild(script);
        });
    }

    createSignaturePad(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with ID ${containerId} not found`);
            return null;
        }

        const placeholder = container.querySelector('.signature-placeholder');
        
        const defaultOptions = {
            background: '#ffffff',
            color: '#000000',
            thickness: 2,
            guideline: false,
            guidelineColor: '#e5e7eb',
            onChange: (instance) => {
                this.updateStatus(containerId, instance);
                this.togglePlaceholder(placeholder, instance);
            }
        };

        const finalOptions = { ...defaultOptions, ...options };

        try {
            const pad = new SignaturePad(container, finalOptions);
            this.pads.set(containerId, pad);
            
            // Initialize status
            this.updateStatus(containerId, pad);
            
            console.log(`✅ Signature pad created for container: ${containerId}`);
            return pad;
        } catch (error) {
            console.error(`❌ Failed to create signature pad for ${containerId}:`, error);
            this.showError(containerId, 'Failed to initialize signature pad');
            return null;
        }
    }

    updateStatus(containerId, instance) {
        const statusElement = document.getElementById(`${containerId}-status`);
        if (!statusElement) return;

        if (instance.isEmpty()) {
            statusElement.className = 'status-indicator status-empty';
            statusElement.textContent = '📝 Signature pad is empty';
        } else {
            statusElement.className = 'status-indicator status-has-content';
            statusElement.textContent = '✅ Signature captured successfully';
        }
    }

    togglePlaceholder(placeholder, instance) {
        if (!placeholder) return;
        
        const container = instance.container;
        if (!instance.isEmpty()) {
            placeholder.style.display = 'none';
            container.classList.add('has-content');
        } else {
            placeholder.style.display = 'block';
            container.classList.remove('has-content');
        }
    }

    showError(containerId, message) {
        const statusElement = document.getElementById(`${containerId}-status`);
        if (statusElement) {
            statusElement.className = 'status-indicator status-error';
            statusElement.textContent = `❌ ${message}`;
        }
    }

    // Control functions for demo pads
    clearPad(containerId) {
        const pad = this.pads.get(containerId);
        if (pad) {
            pad.clear();
            this.hideOutput(containerId);
        }
    }

    undoPad(containerId) {
        const pad = this.pads.get(containerId);
        if (pad && pad.undo) {
            pad.undo();
        }
    }

    redoPad(containerId) {
        const pad = this.pads.get(containerId);
        if (pad && pad.redo) {
            pad.redo();
        }
    }

    toggleGuideline(containerId) {
        const pad = this.pads.get(containerId);
        if (pad && pad.toggleGuideline) {
            pad.toggleGuideline();
        }
    }

    setColor(containerId, color) {
        const pad = this.pads.get(containerId);
        if (pad) {
            pad.setColor(color);
        }
    }

    setThickness(containerId, thickness) {
        const pad = this.pads.get(containerId);
        if (pad) {
            pad.setThickness(thickness);
        }
    }

    // Export functions
    exportToPNG(containerId, filename = 'signature.png') {
        const pad = this.pads.get(containerId);
        if (!pad) return;

        if (pad.isEmpty()) {
            alert('Please draw something first! ✏️');
            return;
        }
        
        const dataURL = pad.toDataURL('image/png');
        this.showOutput(containerId, '🖼️ PNG Export', dataURL.substring(0, 100) + '...\n\n[Full data URL - click download to get complete file]');
        this.downloadFile(dataURL, filename);
    }

    exportToSVG(containerId, filename = 'signature.svg') {
        const pad = this.pads.get(containerId);
        if (!pad) return;

        if (pad.isEmpty()) {
            alert('Please draw something first! ✏️');
            return;
        }
        
        const svgData = pad.toSVG();
        this.showOutput(containerId, '⚡ SVG Export', svgData);
        
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        this.downloadFile(url, filename);
    }

    exportToJSON(containerId, filename = 'signature.json') {
        const pad = this.pads.get(containerId);
        if (!pad) return;

        if (pad.isEmpty()) {
            alert('Please draw something first! ✏️');
            return;
        }
        
        const jsonData = pad.toJSON();
        this.showOutput(containerId, '📄 JSON Export', jsonData);
        
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        this.downloadFile(url, filename);
    }

    downloadFile(url, filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        link.click();
        
        if (url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
        }
    }

    showOutput(containerId, title, content) {
        const section = document.getElementById(`${containerId}-output`);
        if (!section) return;

        const titleEl = section.querySelector('.output-title');
        const contentEl = section.querySelector('.output-content');
        
        if (titleEl) titleEl.textContent = title;
        if (contentEl) contentEl.textContent = content;
        
        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    hideOutput(containerId) {
        const section = document.getElementById(`${containerId}-output`);
        if (section) {
            section.style.display = 'none';
        }
    }

    // Navigation utilities
    setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === 'index.html' && href === './')) {
                link.classList.add('active');
            }
        });
    }

    // Smooth scrolling for navigation
    enableSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Global instance
const signaturePadDocs = new SignaturePadDocs();

// Wait for library to load and DOM to be ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await signaturePadDocs.loadLibrary();
        signaturePadDocs.setActiveNavLink();
        signaturePadDocs.enableSmoothScrolling();
        
        // Initialize any signature pads on the page
        if (typeof initSignaturePads === 'function') {
            initSignaturePads();
        }
        
        console.log('🖋️ Signature Pad Documentation Ready!');
    } catch (error) {
        console.error('❌ Failed to initialize signature pad documentation:', error);
    }
});

// Export for global use
window.signaturePadDocs = signaturePadDocs;
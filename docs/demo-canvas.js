// Dedicated Canvas Demo JavaScript - Full Featured Signature Pad Workspace

// Debug check
console.log('🔍 Demo-canvas.js loaded');
console.log('🔍 SignaturePad available:', typeof SignaturePad);

class SignatureCanvas {
    constructor() {
        this.signaturePad = null;
        this.undoStack = [];
        this.redoStack = [];
        this.memorySignature = null;
        this.currentCanvasSize = { width: 800, height: 450 };
        this.canvasSizes = [
            { width: 400, height: 225, label: "400×225" },
            { width: 600, height: 350, label: "600×350" },
            { width: 800, height: 450, label: "800×450" },
            { width: 1000, height: 550, label: "1000×550" },
            { width: 1200, height: 650, label: "1200×650" }
        ];
        this.currentSizeIndex = 2; // Start with 800×450
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.bindEvents();
        this.initializeSamplePreviews();
        console.log('🎨 Signature Canvas initialized');
    }

    setupCanvas() {
        // Ensure canvas container exists
        const canvasContainer = document.querySelector('.canvas-container');
        if (!canvasContainer) {
            console.error('Canvas container not found!');
            return;
        }

        // Create or get canvas element
        let canvas = document.getElementById('signature-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'signature-canvas';
            canvasContainer.appendChild(canvas);
        }

        // Create guidelines canvas
        let guidelinesCanvas = document.getElementById('guidelines-canvas');
        if (!guidelinesCanvas) {
            guidelinesCanvas = document.createElement('canvas');
            guidelinesCanvas.id = 'guidelines-canvas';
            canvasContainer.appendChild(guidelinesCanvas);
        }
        
        // Set initial canvas size
        this.setCanvasSize(this.currentCanvasSize.width, this.currentCanvasSize.height);
        
        try {
            // Initialize our signature pad
            this.signaturePad = new SignaturePad(canvas, {
                color: '#000000',
                background: '#ffffff',
                thickness: 2,
                smoothing: true,
                smoothingFactor: 0.7,
                onChange: () => {
                    this.updateStatus('Modified', 'active');
                },
                onStrokeStart: () => {
                    this.saveState();
                    this.redoStack = [];
                    this.updateStatus('Drawing...', 'active');
                },
                onStrokeEnd: () => {
                    this.updateStatus('Ready', 'ready');
                }
            });

            console.log('✅ SignaturePad initialized successfully');
            this.updateStatus('Ready', 'ready');
            
        } catch (error) {
            console.error('❌ Error initializing SignaturePad:', error);
            this.updateStatus('Error initializing canvas', 'warning');
        }

        // Handle window resize
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.resizeCanvas();
    }

    bindEvents() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'z':
                        e.preventDefault();
                        if (e.shiftKey) {
                            this.redo();
                        } else {
                            this.undo();
                        }
                        break;
                    case 's':
                        e.preventDefault();
                        this.downloadSignature('png');
                        break;
                    case 'n':
                        e.preventDefault();
                        this.clearCanvas();
                        break;
                }
            }
        });
    }

    setCanvasSize(width, height) {
        const canvas = document.getElementById('signature-canvas');
        const guidelinesCanvas = document.getElementById('guidelines-canvas');
        
        if (!canvas) return;
        
        this.currentCanvasSize = { width, height };
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        
        // Set guidelines canvas dimensions
        if (guidelinesCanvas) {
            guidelinesCanvas.width = width;
            guidelinesCanvas.height = height;
            guidelinesCanvas.style.width = width + 'px';
            guidelinesCanvas.style.height = height + 'px';
        }
        
        // Update info display
        document.getElementById('canvas-size-info').textContent = `${width} × ${height}px`;
        document.getElementById('zoom-info').textContent = `${width}×${height}`;
        
        console.log(`Canvas resized to: ${width}×${height}`);
    }

    resizeCanvas() {
        const canvas = document.getElementById('signature-canvas');
        if (!canvas) return;
        
        // Set canvas dimensions to match display size
        canvas.width = this.currentCanvasSize.width;
        canvas.height = this.currentCanvasSize.height;
        
        // Redraw if signature pad exists
        if (this.signaturePad) {
            // Our SignaturePad handles canvas resizing automatically
            console.log('Canvas resized to:', this.currentCanvasSize);
        }
    }

    zoomCanvas(direction) {
        if (direction === 'in' && this.currentSizeIndex < this.canvasSizes.length - 1) {
            this.currentSizeIndex++;
        } else if (direction === 'out' && this.currentSizeIndex > 0) {
            this.currentSizeIndex--;
        }
        
        const newSize = this.canvasSizes[this.currentSizeIndex];
        const data = this.signaturePad && !this.signaturePad.isEmpty() ? this.signaturePad.toDataURL() : null;
        
        this.setCanvasSize(newSize.width, newSize.height);
        
        if (data && this.signaturePad) {
            setTimeout(() => {
                this.signaturePad.fromDataURL(data);
            }, 100);
        }
    }

    // Pen Settings
    updatePenColor(color) {
        if (this.signaturePad) {
            this.signaturePad.setColor(color);
            document.getElementById('pen-color').value = color;
            
            // Update active color swatch
            document.querySelectorAll('.color-swatch').forEach(swatch => {
                swatch.classList.remove('active');
                if (swatch.dataset.color === color) {
                    swatch.classList.add('active');
                }
            });
            
            this.updateSamplePreviews(color);
            this.updateStatus(`Pen: ${color}`, 'info');
        }
    }

    updateSamplePreviews(color) {
        const samples = ['elegant', 'bold', 'cursive', 'minimal'];
        samples.forEach(sample => {
            const element = document.getElementById(`sample-${sample}`);
            if (element) {
                const path = element.querySelector('path');
                if (path) {
                    path.setAttribute('stroke', color);
                }
            }
        });
    }

    updateMinWidth(value) {
        if (this.signaturePad) {
            // Our SignaturePad uses thickness instead of minWidth/maxWidth
            this.signaturePad.setThickness(parseFloat(value));
            document.getElementById('min-width-value').textContent = value;
        }
    }

    updateMaxWidth(value) {
        if (this.signaturePad) {
            // Our SignaturePad uses thickness instead of minWidth/maxWidth  
            this.signaturePad.setThickness(parseFloat(value));
            document.getElementById('max-width-value').textContent = value;
        }
    }

    updateVelocityFilter(value) {
        if (this.signaturePad) {
            // Our SignaturePad uses smoothingFactor instead of velocityFilterWeight
            this.signaturePad.opts.smoothingFactor = parseFloat(value);
            document.getElementById('velocity-value').textContent = value;
        }
    }

    updateBackgroundColor(color) {
        if (this.signaturePad) {
            const currentData = this.signaturePad.isEmpty() ? null : this.signaturePad.toDataURL();
            
            this.signaturePad.setBackgroundColor(color);
            document.getElementById('bg-color').value = color;
            
            this.updateStatus(`Background: ${color}`, 'info');
        }
    }

    // Guidelines
    toggleGuidelines(enabled) {
        const guidelinesCanvas = document.getElementById('guidelines-canvas');
        
        if (enabled) {
            this.drawGuidelines();
            guidelinesCanvas.style.display = 'block';
            this.updateStatus('Guidelines enabled', 'info');
        } else {
            guidelinesCanvas.style.display = 'none';
            this.updateStatus('Guidelines disabled', 'info');
        }
    }

    updateGuidelineColor(color) {
        if (document.getElementById('show-guidelines').checked) {
            this.drawGuidelines();
        }
    }

    updateGuidelinePattern(pattern) {
        if (document.getElementById('show-guidelines').checked) {
            this.drawGuidelines();
        }
    }

    drawGuidelines() {
        const canvas = document.getElementById('guidelines-canvas');
        const mainCanvas = document.getElementById('signature-canvas');
        
        if (!canvas || !mainCanvas) return;
        
        canvas.width = mainCanvas.width;
        canvas.height = mainCanvas.height;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const color = document.getElementById('guideline-color')?.value || '#e2e8f0';
        const pattern = document.getElementById('guideline-pattern')?.value || 'solid';
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6;
        
        if (pattern === 'dashed') {
            ctx.setLineDash([5, 5]);
        } else if (pattern === 'dotted') {
            ctx.setLineDash([2, 3]);
        } else {
            ctx.setLineDash([]);
        }
        
        if (pattern === 'grid') {
            const spacing = 30;
            for (let x = spacing; x < canvas.width; x += spacing) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = spacing; y < canvas.height; y += spacing) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
        } else {
            const lineSpacing = canvas.height / 4;
            for (let i = 1; i < 4; i++) {
                const y = lineSpacing * i;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
            
            const centerY = canvas.height / 2;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            ctx.lineTo(canvas.width, centerY);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
        ctx.setLineDash([]);
    }

    // Actions
    clearCanvas() {
        if (this.signaturePad) {
            this.saveState();
            this.signaturePad.clear();
            this.updateStatus('Canvas cleared', 'ready');
        }
    }

    saveState() {
        // Our SignaturePad handles undo/redo internally, so we don't need manual state management
        if (this.signaturePad && this.undoStack.length < 50) {
            this.undoStack.push(this.signaturePad.toDataURL());
        }
    }

    undo() {
        if (this.signaturePad) {
            this.signaturePad.undo();
            this.updateStatus('Undo applied', 'info');
        }
    }

    redo() {
        if (this.signaturePad) {
            this.signaturePad.redo();
            this.updateStatus('Redo applied', 'info');
        }
    }

    saveToMemory() {
        if (this.signaturePad && !this.signaturePad.isEmpty()) {
            this.memorySignature = this.signaturePad.toDataURL();
            this.updateStatus('Saved to memory', 'success');
        } else {
            this.updateStatus('Nothing to save', 'warning');
        }
    }

    loadFromMemory() {
        if (this.memorySignature) {
            this.signaturePad.draw(this.memorySignature);
            this.updateStatus('Loaded from memory', 'success');
        } else {
            this.updateStatus('No signature in memory', 'warning');
        }
    }

    // Sample Signatures
    loadSampleSignature(type) {
        if (!this.signaturePad) return;
        
        this.signaturePad.clear();
        
        // Create sample signatures using our library's draw method
        const signatures = {
            elegant: {
                lines: [
                    [
                        { x: 50, y: 150 }, { x: 100, y: 120 }, { x: 150, y: 150 },
                        { x: 200, y: 180 }, { x: 250, y: 150 }, { x: 300, y: 120 },
                        { x: 350, y: 150 }
                    ]
                ]
            },
            bold: {
                lines: [
                    [
                        { x: 50, y: 180 }, { x: 80, y: 120 }, { x: 110, y: 180 },
                        { x: 140, y: 120 }, { x: 170, y: 180 }, { x: 200, y: 120 },
                        { x: 230, y: 180 }, { x: 260, y: 120 }, { x: 290, y: 180 }
                    ]
                ]
            },
            cursive: {
                lines: [
                    [
                        { x: 50, y: 160 }, { x: 70, y: 140 }, { x: 90, y: 160 },
                        { x: 110, y: 180 }, { x: 130, y: 160 }, { x: 150, y: 140 },
                        { x: 170, y: 160 }, { x: 190, y: 180 }, { x: 210, y: 160 },
                        { x: 230, y: 140 }, { x: 250, y: 160 }
                    ]
                ]
            },
            minimal: {
                lines: [
                    [
                        { x: 80, y: 150 }, { x: 200, y: 150 }
                    ],
                    [
                        { x: 140, y: 120 }, { x: 140, y: 180 }
                    ]
                ]
            }
        };

        const signatureData = signatures[type];
        if (signatureData) {
            try {
                // Use our library's draw method with JSON data
                const jsonData = JSON.stringify(signatureData);
                this.signaturePad.draw(jsonData);
                this.updateStatus(`${type} signature loaded`, 'success');
            } catch (error) {
                console.error('Error loading sample signature:', error);
                this.updateStatus(`Error loading ${type} signature`, 'warning');
            }
        }
    }

    // Presets
    applyPreset(preset) {
        const data = this.signaturePad && !this.signaturePad.isEmpty() ? this.signaturePad.toDataURL() : null;
        
        const presets = {
            professional: { pen: '#000000', bg: '#ffffff', thickness: 2 },
            creative: { pen: '#9333ea', bg: '#faf5ff', thickness: 3 },
            elegant: { pen: '#374151', bg: '#f9fafb', thickness: 1.5 },
            bold: { pen: '#dc2626', bg: '#fef2f2', thickness: 4 },
            minimal: { pen: '#6b7280', bg: '#ffffff', thickness: 1 },
            neon: { pen: '#ff00ff', bg: '#0a0a0a', thickness: 3, glow: true, neon: true }
        };

        const config = presets[preset];
        if (config) {
            this.signaturePad.setColor(config.pen);
            this.signaturePad.setBackgroundColor(config.bg);
            this.signaturePad.setThickness(config.thickness);

            // Apply special effects for neon preset
            if (config.neon) {
                this.applyTheme('neon');
                this.toggleGlowEffect(true);
                document.getElementById('glow-effect').checked = true;
            }

            // Update UI controls
            document.getElementById('pen-color').value = config.pen;
            document.getElementById('bg-color').value = config.bg;
            
            const minWidthInput = document.querySelector('input[oninput*="updateMinWidth"]');
            const maxWidthInput = document.querySelector('input[oninput*="updateMaxWidth"]');
            
            if (minWidthInput) {
                minWidthInput.value = config.thickness;
                document.getElementById('min-width-value').textContent = config.thickness;
            }
            if (maxWidthInput) {
                maxWidthInput.value = config.thickness;
                document.getElementById('max-width-value').textContent = config.thickness;
            }

            this.updateSamplePreviews(config.pen);

            if (data) {
                setTimeout(() => {
                    this.signaturePad.draw(data);
                }, 50);
            }

            this.updateStatus(`${preset} preset applied`, 'success');
        }
    }

    // 🚀 Modern Features
    toggleGlowEffect(enabled) {
        const container = document.querySelector('.canvas-container');
        if (enabled) {
            container.classList.add('glow-effect');
            this.updateStatus('Glow effect enabled', 'info');
        } else {
            container.classList.remove('glow-effect');
            this.updateStatus('Glow effect disabled', 'info');
        }
    }

    togglePressureSensitivity(enabled) {
        if (this.signaturePad) {
            this.signaturePad.opts.pressureSensitivity = enabled;
            this.updateStatus(`Pressure sensitivity ${enabled ? 'enabled' : 'disabled'}`, 'info');
        }
    }

    toggleStrokeAnimation(enabled) {
        if (this.signaturePad) {
            this.signaturePad.opts.strokeAnimation = enabled;
            this.updateStatus(`Stroke animation ${enabled ? 'enabled' : 'disabled'}`, 'info');
        }
    }

    updateBlendMode(mode) {
        const canvas = document.getElementById('signature-canvas');
        if (canvas) {
            canvas.style.mixBlendMode = mode;
            this.updateStatus(`Blend mode: ${mode}`, 'info');
        }
    }

    updateTexture(texture) {
        const canvas = document.getElementById('signature-canvas');
        if (canvas) {
            // Remove existing texture classes
            canvas.classList.remove('texture-rough', 'texture-pencil', 'texture-marker', 'texture-watercolor');
            
            // Add new texture class
            if (texture !== 'smooth') {
                canvas.classList.add(`texture-${texture}`);
            }
            
            if (this.signaturePad) {
                this.signaturePad.opts.texture = texture;
            }
            
            this.updateStatus(`Texture: ${texture}`, 'info');
        }
    }

    // 🎨 Theme System
    applyTheme(theme) {
        const container = document.querySelector('.canvas-container');
        const body = document.body;
        
        // Remove existing theme classes
        container.classList.remove('neon-mode', 'dark-mode', 'retro-mode');
        body.classList.remove('theme-dark', 'theme-neon', 'theme-retro');
        
        // Update theme buttons
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === theme) {
                btn.classList.add('active');
            }
        });
        
        // Apply theme
        switch (theme) {
            case 'dark':
                body.classList.add('theme-dark');
                container.classList.add('dark-mode');
                this.updateDarkTheme();
                break;
            case 'neon':
                body.classList.add('theme-neon');
                container.classList.add('neon-mode');
                this.updateNeonTheme();
                break;
            case 'retro':
                body.classList.add('theme-retro');
                container.classList.add('retro-mode');
                this.updateRetroTheme();
                break;
            default:
                this.updateLightTheme();
        }
        
        if (this.signaturePad) {
            this.signaturePad.opts.theme = theme;
        }
        
        this.updateStatus(`${theme} theme applied`, 'success');
    }

    updateLightTheme() {
        if (this.signaturePad) {
            this.signaturePad.setBackgroundColor('#ffffff');
        }
    }

    updateDarkTheme() {
        if (this.signaturePad) {
            this.signaturePad.setBackgroundColor('#1f2937');
            this.signaturePad.setColor('#ffffff');
        }
        document.getElementById('bg-color').value = '#1f2937';
        document.getElementById('pen-color').value = '#ffffff';
    }

    updateNeonTheme() {
        if (this.signaturePad) {
            this.signaturePad.setBackgroundColor('#0a0a0a');
            this.signaturePad.setColor('#ff00ff');
        }
        document.getElementById('bg-color').value = '#0a0a0a';
        document.getElementById('pen-color').value = '#ff00ff';
        this.toggleGlowEffect(true);
        document.getElementById('glow-effect').checked = true;
    }

    updateRetroTheme() {
        if (this.signaturePad) {
            this.signaturePad.setBackgroundColor('#fef3c7');
            this.signaturePad.setColor('#92400e');
        }
        document.getElementById('bg-color').value = '#fef3c7';
        document.getElementById('pen-color').value = '#92400e';
    }

    updateCanvasBackground() {
        // Our SignaturePad handles background automatically when setBackgroundColor is called
        if (this.signaturePad) {
            console.log('Background updated by SignaturePad');
        }
    }

    // Export Functions
    downloadSignature(format) {
        if (!this.signaturePad || this.signaturePad.isEmpty()) {
            this.updateStatus('Nothing to export', 'warning');
            return;
        }

        let dataURL, filename;
        switch (format) {
            case 'png':
                dataURL = this.signaturePad.toDataURL();
                filename = 'signature.png';
                break;
            case 'jpeg':
                dataURL = this.signaturePad.toDataURL('image/jpeg', 0.8);
                filename = 'signature.jpg';
                break;
            case 'svg':
                const svgData = this.signaturePad.toSVG();
                const blob = new Blob([svgData], { type: 'image/svg+xml' });
                dataURL = URL.createObjectURL(blob);
                filename = 'signature.svg';
                break;
        }

        const link = document.createElement('a');
        link.download = filename;
        link.href = dataURL;
        link.click();
        
        this.updateStatus(`${format.toUpperCase()} downloaded`, 'success');
    }

    exportData(format) {
        if (!this.signaturePad || this.signaturePad.isEmpty()) {
            this.updateStatus('Nothing to export', 'warning');
            return;
        }

        let data, output;
        switch (format) {
            case 'png':
                data = this.signaturePad.toDataURL();
                output = `PNG Data URL (${Math.round(data.length / 1024)}KB):\n${data.substring(0, 100)}...`;
                break;
            case 'jpeg':
                data = this.signaturePad.toDataURL('image/jpeg', 0.8);
                output = `JPEG Data URL (${Math.round(data.length / 1024)}KB):\n${data.substring(0, 100)}...`;
                break;
            case 'svg':
                data = this.signaturePad.toSVG();
                output = `SVG Vector Data (${Math.round(data.length / 1024)}KB):\n${data}`;
                break;
            case 'json':
                data = this.signaturePad.toJSON();
                output = `JSON Point Data (${Math.round(data.length / 1024)}KB):\n${data}`;
                break;
        }

        document.getElementById('data-output').textContent = output;
        this.updateStatus(`${format.toUpperCase()} data exported`, 'success');
    }

    // Code Export
    exportCode(type) {
        const currentSettings = {
            penColor: this.signaturePad?.opts?.color || '#000000',
            backgroundColor: this.signaturePad?.opts?.background || '#ffffff',
            thickness: this.signaturePad?.opts?.thickness || 2
        };

        let code = '';
        switch (type) {
            case 'html':
                code = `<!-- Signature Pad HTML -->
<div id="signature-container">
    <canvas id="signature-canvas"></canvas>
    <div class="controls">
        <button onclick="clearCanvas()">Clear</button>
        <button onclick="downloadSignature()">Download</button>
    </div>
</div>`;
                break;
            
            case 'css':
                code = `/* Signature Pad CSS */
#signature-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    padding: 20px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #f8fafc;
}

#signature-canvas {
    border: 2px solid #334155;
    border-radius: 8px;
    background: white;
    cursor: crosshair;
}

.controls {
    display: flex;
    gap: 10px;
}

.controls button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    background: #2563eb;
    color: white;
    cursor: pointer;
    transition: background 0.2s;
}

.controls button:hover {
    background: #1d4ed8;
}`;
                break;
            
            case 'js':
                code = `// Signature Pad JavaScript
// Include: <script src="../src/SignaturePad.js"></script>

let signaturePad;

function initSignaturePad() {
    const canvas = document.getElementById('signature-canvas');
    
    signaturePad = new SignaturePad(canvas, {
        color: '${currentSettings.penColor}',
        background: '${currentSettings.backgroundColor}',
        thickness: ${currentSettings.thickness},
        smoothing: true
    });
}

function clearCanvas() {
    if (signaturePad) {
        signaturePad.clear();
    }
}

function downloadSignature() {
    if (signaturePad && !signaturePad.isEmpty()) {
        const dataURL = signaturePad.toDataURL();
        const link = document.createElement('a');
        link.download = 'signature.png';
        link.href = dataURL;
        link.click();
    } else {
        alert('Please draw a signature first!');
    }
}

document.addEventListener('DOMContentLoaded', initSignaturePad);`;
                break;
                
            case 'complete':
                code = `Complete implementation with current settings:
Pen Color: ${currentSettings.penColor}
Background: ${currentSettings.backgroundColor}
Thickness: ${currentSettings.thickness}

Our SignaturePad.js Features:
- Smooth bezier curve drawing
- Built-in undo/redo functionality
- Touch pressure sensitivity
- SVG, PNG, JPEG, JSON export
- Dynamic color and thickness updates
- Performance optimized canvas rendering`;
                break;
        }

        document.getElementById('code-output').textContent = code;
        this.updateStatus(`${type.toUpperCase()} code exported`, 'success');
    }

    // Utility Functions
    updateStatus(message, type = 'info') {
        const statusEl = document.getElementById('canvas-status');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `status-indicator ${type}`;
        }
    }

    initializeSamplePreviews() {
        this.updateSamplePreviews('#000000');
    }

    // Storage
    saveToLocalStorage() {
        if (this.signaturePad && !this.signaturePad.isEmpty()) {
            const data = {
                signature: this.signaturePad.toDataURL(),
                json: this.signaturePad.toJSON(),
                settings: {
                    penColor: this.signaturePad.opts.color,
                    backgroundColor: this.signaturePad.opts.background,
                    thickness: this.signaturePad.opts.thickness
                }
            };
            
            localStorage.setItem('signatureCanvasDemo', JSON.stringify(data));
            this.updateStatus('Saved to browser storage', 'success');
        }
    }

    loadFromLocalStorage() {
        const stored = localStorage.getItem('signatureCanvasDemo');
        if (stored) {
            const data = JSON.parse(stored);
            
            if (data.json) {
                this.signaturePad.draw(data.json);
            } else if (data.signature) {
                this.signaturePad.draw(data.signature);
            }
            
            if (data.settings) {
                this.updatePenColor(data.settings.penColor);
                this.updateBackgroundColor(data.settings.backgroundColor);
                this.signaturePad.setThickness(data.settings.thickness);
            }
            
            this.updateStatus('Loaded from browser storage', 'success');
        } else {
            this.updateStatus('No saved signature found', 'warning');
        }
    }

    clearLocalStorage() {
        localStorage.removeItem('signatureCanvasDemo');
        this.updateStatus('Browser storage cleared', 'success');
    }
}

// Global instance
let signatureCanvas;

// Global functions for HTML event handlers
function updatePenColor(color) { signatureCanvas.updatePenColor(color); }
function selectColor(color) { signatureCanvas.updatePenColor(color); }
function updateMinWidth(value) { signatureCanvas.updateMinWidth(value); }
function updateMaxWidth(value) { signatureCanvas.updateMaxWidth(value); }
function updateVelocityFilter(value) { signatureCanvas.updateVelocityFilter(value); }
function updateBackgroundColor(color) { signatureCanvas.updateBackgroundColor(color); }
function toggleGuidelines(enabled) { signatureCanvas.toggleGuidelines(enabled); }
function updateGuidelineColor(color) { signatureCanvas.updateGuidelineColor(color); }
function updateGuidelinePattern(pattern) { signatureCanvas.updateGuidelinePattern(pattern); }
function zoomIn() { signatureCanvas.zoomCanvas('in'); }
function zoomOut() { signatureCanvas.zoomCanvas('out'); }
function clearCanvas() { signatureCanvas.clearCanvas(); }
function undoLast() { signatureCanvas.undo(); }
function redoLast() { signatureCanvas.redo(); }
function saveToMemory() { signatureCanvas.saveToMemory(); }
function loadFromMemory() { signatureCanvas.loadFromMemory(); }
function loadSampleSignature(type) { signatureCanvas.loadSampleSignature(type); }
function applyPreset(preset) { signatureCanvas.applyPreset(preset); }
function downloadSignature(format) { signatureCanvas.downloadSignature(format); }
function exportData(format) { signatureCanvas.exportData(format); }
function exportCode(type) { signatureCanvas.exportCode(type); }
function saveToLocalStorage() { signatureCanvas.saveToLocalStorage(); }
function loadFromLocalStorage() { signatureCanvas.loadFromLocalStorage(); }
function clearLocalStorage() { signatureCanvas.clearLocalStorage(); }

// 🚀 Modern Features Global Functions
function toggleGlowEffect(enabled) { signatureCanvas.toggleGlowEffect(enabled); }
function togglePressureSensitivity(enabled) { signatureCanvas.togglePressureSensitivity(enabled); }
function toggleStrokeAnimation(enabled) { signatureCanvas.toggleStrokeAnimation(enabled); }
function updateBlendMode(mode) { signatureCanvas.updateBlendMode(mode); }
function updateTexture(texture) { signatureCanvas.updateTexture(texture); }
function applyTheme(theme) { signatureCanvas.applyTheme(theme); }

// Navigation functions
function backToDocumentation() {
    window.location.href = 'index.html';
}

function forkOnGitHub() {
    window.open('https://github.com/niel-blanca/signature-pad-js/fork', '_blank');
}

// Initialize the canvas workspace when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if SignaturePad is available
    if (typeof SignaturePad === 'undefined') {
        console.error('❌ SignaturePad is not defined. Please check if SignaturePad.js is loaded properly.');
        const statusElement = document.getElementById('canvas-status');
        if (statusElement) {
            statusElement.textContent = 'Library Not Loaded';
            statusElement.className = 'status-indicator warning';
        }
        return;
    }
    
    try {
        signatureCanvas = new SignatureCanvas();
        console.log('🚀 Canvas workspace initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize canvas workspace:', error);
        // Fallback error message
        const statusElement = document.getElementById('canvas-status');
        if (statusElement) {
            statusElement.textContent = 'Initialization Error';
            statusElement.className = 'status-indicator warning';
        }
    }
});
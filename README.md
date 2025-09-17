# 🖋️ Signature Pad JS v2.0 - Complete Modern Edition

**The ultimate JavaScript signature pad with cutting-edge features and zero dependencies**

[![NPM Version](https://img.shields.io/npm/v/@niel-blanca/signature-pad)](https://www.npmjs.com/package/@niel-blanca/signature-pad)
[![Build Status](https://img.shields.io/github/actions/workflow/status/niel-blanca/signature-pad-js/npm-publish-github-packages.yml)](https://github.com/niel-blanca/signature-pad-js/actions)
[![License](https://img.shields.io/npm/l/@niel-blanca/signature-pad)](https://github.com/niel-blanca/signature-pad-js/blob/main/LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@niel-blanca/signature-pad)](https://bundlephobia.com/package/@niel-blanca/signature-pad)

## 🚀 [**Live Demo →**](http://localhost:8080/simple-demo.html) | [**Full Demo →**](http://localhost:8080/demo.html)

> **Transform digital signatures with modern web technology - Now with 20+ advanced features!**

---

## ✨ What's New in v2.0

### 🎨 **Advanced Visual Effects**
- **Glow Effects** - Dynamic stroke lighting with customizable intensity
- **Drop Shadows** - Professional depth with configurable shadows
- **Texture Styles** - Pencil, marker, watercolor, and rough textures
- **Blend Modes** - 16+ canvas composition modes for creative effects

### 🎭 **Complete Theme System**
- **4 Built-in Themes** - Light, Dark, Neon, and Retro presets
- **Dynamic Switching** - Real-time theme changes with animations
- **Custom Theming** - CSS variable system for easy customization

### 🖌️ **Enhanced Drawing Engine**
- **Pressure Sensitivity** - Variable stroke width from input pressure
- **Stroke Animation** - Animated signature playback with effects
- **Smart Smoothing** - Advanced bezier curve algorithms
- **Multi-device Support** - Touch, mouse, and stylus compatible

### 💾 **Modern Export & Storage**
- **Multiple Formats** - PNG, JPG, SVG, and JSON export
- **Local Storage** - Browser-based signature management
- **Cloud Integration** - Ready for cloud storage adapters
- **Batch Operations** - Save/load multiple signatures

### 📤 **Sharing & Collaboration**
- **One-click Copy** - Clipboard integration for images
- **Native Sharing** - Web Share API support
- **Print Ready** - Optimized print layouts
- **Email Integration** - Direct email sharing

---

## 🎯 Key Features

### �️ **Drawing & Input**
- ✅ Smooth bezier curve rendering
- ✅ Touch and mouse support
- ✅ Pressure-sensitive drawing
- ✅ Configurable pen settings
- ✅ Real-time stroke preview

### 🎨 **Visual Customization**
- ✅ 20+ color presets
- ✅ Custom color picker
- ✅ Adjustable thickness (1-50px)
- ✅ Background customization
- ✅ Grid and guideline options

### ⚡ **Performance & UX**
- ✅ Zero dependencies
- ✅ Lightweight (15KB minified)
- ✅ 60fps smooth rendering
- ✅ Memory efficient
- ✅ Mobile optimized

### 🔧 **Developer Experience**
- ✅ TypeScript support
- ✅ ES6+ modules
- ✅ Comprehensive API
- ✅ Event-driven architecture
- ✅ Method chaining

---

## 📦 Installation

### NPM
```bash
npm install @niel-blanca/signature-pad
```

### CDN
```html
<script src="https://unpkg.com/@niel-blanca/signature-pad@2.0.0/dist/signature-pad.min.js"></script>
```

### Local Download
```bash
git clone https://github.com/niel-blanca/signature-pad-js.git
```

---

## ⚡ Quick Start

### Basic Setup
```html
<canvas id="signature-pad" width="600" height="400"></canvas>

<script type="module">
import SignaturePad from './src/SignaturePad.js';

const canvas = document.getElementById('signature-pad');
const pad = new SignaturePad(canvas, {
    color: '#000000',
    thickness: 2,
    background: '#ffffff'
});

// Export as PNG
document.getElementById('save-btn').onclick = () => {
    const dataURL = pad.toDataURL('image/png');
    console.log('Signature saved:', dataURL);
};
</script>
```

### Modern Features Example
```javascript
// Initialize with advanced options
const pad = new SignaturePad(canvas, {
    // Visual effects
    glowEffect: true,
    shadows: true,
    texture: 'watercolor',
    
    // Theme and colors
    theme: 'dark',
    color: '#00ff88',
    background: '#1a1a1a',
    
    // Advanced features
    pressureSensitivity: true,
    strokeAnimation: true,
    blendMode: 'screen'
});

// Use modern methods
pad.setColor('#ff6b6b')
   .setThickness(3)
   .applyTexture('pencil')
   .saveToStorage('my-signature');
```

---

## 🔧 Complete API Reference

### Constructor
```javascript
new SignaturePad(canvas, options)
```

### Core Options
```javascript
{
    // Basic appearance
    color: '#000000',           // Pen color
    thickness: 2,               // Pen thickness (1-50)
    background: '#ffffff',      // Canvas background
    
    // Drawing behavior
    smoothing: true,            // Enable smooth curves
    smoothingFactor: 0.5,       // Smoothing intensity (0-1)
    
    // Modern visual effects
    shadows: false,             // Enable drop shadows
    glowEffect: false,          // Enable glow effect
    texture: 'smooth',          // Texture: smooth|pencil|marker|watercolor|rough
    blendMode: 'normal',        // Canvas blend mode
    
    // Advanced features
    pressureSensitivity: false, // Pressure-sensitive strokes
    strokeAnimation: false,     // Animated stroke playback
    theme: 'light',            // Theme: light|dark|neon|retro
    
    // Callbacks
    onChange: null,             // Fired on signature change
    onStrokeStart: null,        // Fired when stroke starts
    onStrokeEnd: null          // Fired when stroke ends
}
```

### Essential Methods
```javascript
// Drawing actions
pad.clear()                    // Clear canvas
pad.undo()                     // Undo last stroke
pad.redo()                     // Redo stroke
pad.isEmpty()                  // Check if empty

// Configuration (chainable)
pad.setColor('#ff6b6b')        // Set pen color
pad.setThickness(5)            // Set thickness
pad.setBackgroundColor('#f0f0f0') // Set background

// Modern effects
pad.applyTexture('pencil')     // Apply texture
pad.applyBlendMode('multiply') // Apply blend mode
pad.setOptions({glowEffect: true}) // Update options

// Export methods
pad.toDataURL('image/png')     // Get PNG data URL
pad.toDataURL('image/jpeg', 0.9) // Get JPG with quality
pad.toSVG()                    // Get SVG string
pad.toJSON()                   // Get JSON data

// Modern export
pad.download('png', 'signature') // Download file
pad.saveToStorage('my-sig')    // Save to localStorage
pad.loadFromStorage('my-sig')  // Load from localStorage

// Import
pad.draw(jsonData)             // Import from JSON
```

---

## 📱 Framework Integration

### React
```jsx
import { useRef, useEffect } from 'react';
import SignaturePad from '@niel-blanca/signature-pad';

function SignatureComponent() {
    const canvasRef = useRef(null);
    const padRef = useRef(null);
    
    useEffect(() => {
        padRef.current = new SignaturePad(canvasRef.current, {
            glowEffect: true,
            theme: 'dark'
        });
        
        return () => padRef.current?.destroy();
    }, []);
    
    const handleSave = () => {
        const data = padRef.current.toDataURL();
        // Handle save
    };
    
    return (
        <div>
            <canvas ref={canvasRef} width={600} height={400} />
            <button onClick={handleSave}>Save Signature</button>
        </div>
    );
}
```

### Vue.js
```vue
<template>
    <div>
        <canvas ref="canvas" width="600" height="400"></canvas>
        <button @click="save">Save</button>
    </div>
</template>

<script>
import SignaturePad from '@niel-blanca/signature-pad';

export default {
    mounted() {
        this.pad = new SignaturePad(this.$refs.canvas, {
            color: '#2563eb',
            thickness: 3,
            glowEffect: true
        });
    },
    methods: {
        save() {
            const data = this.pad.toDataURL();
            this.$emit('signature-saved', data);
        }
    }
}
</script>
```

---

## 🌟 Advanced Examples

### Custom Theme Creation
```javascript
// Create custom neon theme
const neonPad = new SignaturePad(canvas, {
    theme: 'custom',
    color: '#00ff41',
    background: '#0a0a0a',
    glowEffect: true,
    thickness: 3,
    shadows: true
});

// Apply glow animation
neonPad.setOptions({
    strokeAnimation: true,
    blendMode: 'screen'
});
```

### Signature Collection Workflow
```javascript
class SignatureManager {
    constructor(canvas) {
        this.pad = new SignaturePad(canvas, {
            onChange: () => this.updatePreview(),
            onStrokeEnd: () => this.autoSave()
        });
        this.signatures = [];
    }
    
    async collectSignature() {
        // Wait for signature
        return new Promise(resolve => {
            this.pad.onChange = () => {
                if (!this.pad.isEmpty()) {
                    resolve(this.pad.toDataURL());
                }
            };
        });
    }
    
    autoSave() {
        if (!this.pad.isEmpty()) {
            this.pad.saveToStorage(`auto-save-${Date.now()}`);
        }
    }
    
    exportAll() {
        return this.signatures.map(sig => ({
            png: sig.toDataURL(),
            svg: sig.toSVG(),
            json: sig.toJSON()
        }));
    }
}
```

### Real-time Collaboration
```javascript
// WebSocket signature sharing
const collaborativePad = new SignaturePad(canvas, {
    onStrokeEnd: (strokeData) => {
        // Share stroke with other users
        websocket.send(JSON.stringify({
            type: 'stroke',
            data: strokeData,
            user: currentUser
        }));
    }
});

websocket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === 'stroke' && message.user !== currentUser) {
        collaborativePad.drawStroke(message.data);
    }
};
```

---

## 🎨 Styling & Themes

### CSS Custom Properties
```css
:root {
    --signature-primary: #3b82f6;
    --signature-bg: #ffffff;
    --signature-border: #e5e7eb;
    --signature-shadow: rgba(0, 0, 0, 0.1);
}

.signature-container {
    border: 2px solid var(--signature-border);
    border-radius: 8px;
    box-shadow: 0 4px 6px var(--signature-shadow);
}

.signature-canvas {
    background: var(--signature-bg);
    cursor: crosshair;
}
```

### Theme Variants
```javascript
const themes = {
    professional: {
        color: '#1f2937',
        background: '#ffffff',
        thickness: 2,
        shadows: true
    },
    creative: {
        color: '#8b5cf6',
        background: '#faf5ff',
        glowEffect: true,
        texture: 'watercolor'
    },
    minimal: {
        color: '#000000',
        background: '#ffffff',
        thickness: 1,
        smoothing: true
    }
};
```

---

## 📊 Performance & Browser Support

### Performance Metrics
- **Initialization**: <50ms
- **Rendering**: 60fps on modern devices
- **Memory usage**: <5MB for typical signatures
- **Bundle size**: 15KB minified + gzipped

### Browser Compatibility
| Browser | Desktop | Mobile | Notes |
|---------|---------|---------|-------|
| Chrome | ✅ 60+ | ✅ 60+ | Full support |
| Firefox | ✅ 55+ | ✅ 55+ | Full support |
| Safari | ✅ 12+ | ✅ 12+ | Full support |
| Edge | ✅ 79+ | ✅ 79+ | Full support |
| IE | ❌ | ❌ | Not supported |

---

## 🔐 Security & Privacy

### Data Handling
- **Client-side only** - No data sent to external servers
- **Local storage** - Data stays in user's browser
- **No tracking** - Zero analytics or telemetry
- **GDPR compliant** - Privacy by design

### Security Features
- **XSS protection** - Input sanitization
- **Content validation** - Signature format verification
- **Memory cleanup** - Automatic resource management

---

## 🛠️ Development

### Building from Source
```bash
git clone https://github.com/niel-blanca/signature-pad-js.git
cd signature-pad-js
npm install
npm run build
```

### Running Tests
```bash
npm test                # Run test suite
npm run test:coverage   # Run with coverage
npm run test:watch      # Watch mode
```

### Development Server
```bash
npm run dev            # Start dev server
npm run demo           # Run demo
```

---

## 📚 Examples & Tutorials

### Complete Implementation Guide
```html
<!DOCTYPE html>
<html>
<head>
    <title>Professional Signature Pad</title>
    <style>
        .signature-workspace {
            display: grid;
            grid-template-columns: 300px 1fr 300px;
            gap: 20px;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .canvas-container {
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            background: white;
        }
        
        .control-panel {
            padding: 20px;
            background: #f9fafb;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="signature-workspace">
        <!-- Controls -->
        <div class="control-panel">
            <h3>🖊️ Pen Settings</h3>
            <input type="color" id="color-picker" value="#000000">
            <input type="range" id="thickness-slider" min="1" max="10" value="2">
            
            <h3>✨ Effects</h3>
            <label><input type="checkbox" id="glow-effect"> Glow</label>
            <label><input type="checkbox" id="shadows"> Shadows</label>
            
            <select id="texture-select">
                <option value="smooth">Smooth</option>
                <option value="pencil">Pencil</option>
                <option value="marker">Marker</option>
            </select>
        </div>
        
        <!-- Canvas -->
        <div class="canvas-container">
            <canvas id="signature-canvas" width="600" height="400"></canvas>
        </div>
        
        <!-- Export -->
        <div class="control-panel">
            <h3>💾 Export</h3>
            <button onclick="downloadPNG()">📷 PNG</button>
            <button onclick="downloadJPG()">🖼️ JPG</button>
            <button onclick="downloadSVG()">📄 SVG</button>
            
            <h3>💾 Storage</h3>
            <button onclick="saveLocal()">💾 Save</button>
            <button onclick="loadLocal()">📂 Load</button>
        </div>
    </div>

    <script type="module">
        import SignaturePad from './src/SignaturePad.js';
        
        const canvas = document.getElementById('signature-canvas');
        const pad = new SignaturePad(canvas, {
            onChange: updatePreview,
            onStrokeStart: () => console.log('Started drawing'),
            onStrokeEnd: () => console.log('Finished stroke')
        });
        
        // Wire up controls
        document.getElementById('color-picker').onchange = (e) => {
            pad.setColor(e.target.value);
        };
        
        document.getElementById('thickness-slider').oninput = (e) => {
            pad.setThickness(parseInt(e.target.value));
        };
        
        document.getElementById('glow-effect').onchange = (e) => {
            pad.setOptions({ glowEffect: e.target.checked });
        };
        
        document.getElementById('shadows').onchange = (e) => {
            pad.setOptions({ shadows: e.target.checked });
        };
        
        document.getElementById('texture-select').onchange = (e) => {
            pad.applyTexture(e.target.value);
        };
        
        // Export functions
        window.downloadPNG = () => pad.download('png');
        window.downloadJPG = () => pad.download('jpg');
        window.downloadSVG = () => pad.download('svg');
        window.saveLocal = () => pad.saveToStorage('signature');
        window.loadLocal = () => pad.loadFromStorage('signature');
        
        function updatePreview() {
            // Update preview or trigger other actions
            console.log('Signature updated');
        }
    </script>
</body>
</html>
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contribution Steps
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by modern web signature solutions
- Built with performance and UX in mind
- Community-driven feature development
- Open source contributors

---

## 📞 Support & Community

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/niel-blanca/signature-pad-js/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/niel-blanca/signature-pad-js/discussions)
- 📧 **Contact**: [niel.blanca@example.com](mailto:niel.blanca@example.com)
- 💬 **Community**: [Discord Server](https://discord.gg/signature-pad-js)

---

<div align="center">

**Made with ❤️ by [Niel Blanca](https://github.com/niel-blanca)**

[⭐ Star on GitHub](https://github.com/niel-blanca/signature-pad-js) • [📦 NPM Package](https://www.npmjs.com/package/@niel-blanca/signature-pad) • [📖 Documentation](https://niel-blanca.github.io/signature-pad-js/)

</div>



### Installation### Install

```bash

```bashnpm install @niel-blanca/signature-pad

npm install signature-pad-js```

```

### Use

Or via CDN:```javascript

```htmlimport SignaturePad from '@niel-blanca/signature-pad';

<script src="https://unpkg.com/signature-pad-js@latest/dist/signature-pad.min.js"></script>

```const container = document.getElementById('signature-container');

const pad = new SignaturePad(container);

### Basic Usage

// Export as PNG

```htmlconst pngData = pad.toDataURL();

<canvas id="signature-pad" class="signature-canvas"></canvas>

<script>// Export as JSON  

  const canvas = document.getElementById('signature-pad');const jsonData = pad.toJSON();

  const signaturePad = new SignaturePad(canvas);

</script>// Clear signature

```pad.clear();

```

## API

### CDN

```javascript```html

// Drawing control<script src="https://unpkg.com/@niel-blanca/signature-pad@latest/dist/signature-pad.min.js"></script>

signaturePad.clear()<script>

signaturePad.isEmpty()  const pad = new SignaturePad(document.getElementById('container'));

signaturePad.on() / signaturePad.off()</script>

```

// Data management

signaturePad.toDataURL()## ✨ Features

signaturePad.fromDataURL(dataURL)

- 🎨 **Smooth Drawing** - Bezier curves with pressure sensitivity

// Configuration- 📱 **Touch Support** - Works on desktop, tablet, and mobile

signaturePad.penColor = '#000'- 🔄 **Undo/Redo** - Full history management

signaturePad.minWidth = 0.5- 📤 **Multiple Exports** - PNG, JPG, SVG, JSON formats

signaturePad.maxWidth = 2.5- ⚡ **Lightweight** - Only 12.5KB minified, zero dependencies

```- 🔧 **Configurable** - 15+ customization options

- 📝 **TypeScript** - Full type definitions included

## Documentation- 🎯 **Method Chaining** - Fluent API design



For comprehensive documentation, examples, and advanced usage, visit the [documentation site](./docs/index.html).## 📖 Documentation



## License- **[📍 Live Demo](https://niel-blanca.github.io/signature-pad-js/)** - Interactive examples and full documentation

- **[📦 NPM Package](https://www.npmjs.com/package/@niel-blanca/signature-pad)**

MIT License - see [LICENSE](LICENSE) file for details.- **[🔧 API Reference](https://niel-blanca.github.io/signature-pad-js/#api)**
- **[⚙️ Configuration Options](https://niel-blanca.github.io/signature-pad-js/#options)**

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## � License

MIT © [Niel Blanca](https://github.com/niel-blanca)

---

**[🎮 Try it now →](https://niel-blanca.github.io/signature-pad-js/)** | **[📦 Install →](https://www.npmjs.com/package/@niel-blanca/signature-pad)**

## 📦 Installation

### 🔹 npm (Recommended)

```bash
# Install the latest version
npm install @niel-blanca/signature-pad-js

# Or install a specific version
npm install @niel-blanca/signature-pad-js@1.2.0
```

### 🔹 yarn

```bash
yarn add @niel-blanca/signature-pad-js
```

### 🔹 pnpm

```bash
pnpm add @niel-blanca/signature-pad-js
```

### 🔹 CDN (Quick Start)

```html
<!-- Latest version -->
<script src="https://cdn.jsdelivr.net/npm/@niel-blanca/signature-pad-js@latest/dist/signature-pad.min.js"></script>

<!-- Specific version -->
<script src="https://cdn.jsdelivr.net/npm/@niel-blanca/signature-pad-js@1.2.0/dist/signature-pad.min.js"></script>
```

---

## ⚙️ Quick Start

### 🔹 Basic HTML Setup

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Signature Pad Demo</title>
    <style>
        .signature-container {
            width: 100%;
            height: 300px;
            border: 2px dashed #ccc;
            border-radius: 8px;
        }
        
        .signature-container canvas {
            width: 100% !important;
            height: 100% !important;
            display: block;
            cursor: crosshair;
        }
    </style>
</head>
<body>
    <div id="signature-pad" class="signature-container"></div>
    <div>
        <button onclick="pad.clear()">Clear</button>
        <button onclick="pad.undo()">Undo</button>
        <button onclick="pad.redo()">Redo</button>
        <button onclick="downloadSignature()">Download PNG</button>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/@niel-blanca/signature-pad-js@latest/dist/signature-pad.min.js"></script>
    <script>
        // Initialize with enhanced options
        const pad = new SignaturePad(document.getElementById('signature-pad'), {
            background: '#ffffff',
            color: '#000000',
            thickness: 3,
            smoothing: true,
            smoothingFactor: 0.7,
            onChange: (instance) => {
                console.log('Signature changed, lines:', instance.lines.length);
            }
        });

        // Download function
        function downloadSignature() {
            const dataURL = pad.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'signature.png';
            link.href = dataURL;
            link.click();
        }
    </script>
</body>
</html>
```

### 🔹 ES Modules (Modern Bundlers)

```javascript
import SignaturePad from '@niel-blanca/signature-pad-js';

const container = document.getElementById('signature');
const pad = new SignaturePad(container, {
    background: '#f8f9fa',
    color: '#495057',
    thickness: 2,
    guideline: true,
    smoothing: true,
    undoLimit: 100,
    onChange: (instance) => {
        // Auto-save functionality
        localStorage.setItem('signature', instance.toJSON());
    }
});

// Method chaining example
pad.setColor('#007bff')
   .setThickness(4)
   .toggleGuideline(true)
   .clear();
```

### 🔹 TypeScript Usage

```typescript
import SignaturePad, { SignaturePadOptions, Point } from '@niel-blanca/signature-pad-js';

const options: SignaturePadOptions = {
    background: '#ffffff',
    color: '#000000',
    thickness: 2,
    smoothing: true,
    smoothingFactor: 0.5,
    onChange: (instance: SignaturePad) => {
        console.log('Bounds:', instance.getBounds());
    }
};

const pad = new SignaturePad(document.getElementById('signature')!, options);

// Type-safe method calls
pad.setColor('#ff0000')
   .setThickness(5)
   .clear();

// Access signature data with proper typing
const bounds = pad.getBounds();
console.log(`Signature size: ${bounds.width}x${bounds.height}`);
```

---

## 🔧 Configuration Options

```javascript
const pad = new SignaturePad(container, {
    // Core Appearance
    background: '#ffffff',           // Background color
    color: '#000000',               // Pen color  
    thickness: 2,                   // Pen thickness (px)
    guideline: false,               // Show signature guideline
    guidelineColor: '#a0a0a0',     // Guideline color
    guidelineOffset: 50,            // Guideline distance from bottom (px)
    guidelineIndent: 10,            // Guideline indent from sides (px)
    
    // Drawing Behavior  
    smoothing: true,                // Enable stroke smoothing
    smoothingFactor: 0.5,          // Smoothing intensity (0-1)
    disableResize: false,          // Disable auto-resize on window resize
    
    // 🆕 MODERN FEATURES
    // Visual Effects
    shadows: false,                 // Enable drop shadows
    glowEffect: false,             // Enable glow effects
    neonMode: false,               // Enable neon-style strokes
    
    // Advanced Drawing
    pressureSensitivity: false,    // Enable pressure-sensitive strokes
    strokeAnimation: false,        // Enable stroke animation effects
    texture: 'smooth',             // Texture: 'smooth'|'pencil'|'marker'|'watercolor'|'rough'
    blendMode: 'normal',           // Canvas blend mode
    
    // Theme System
    theme: 'light',                // Theme: 'light'|'dark'|'neon'|'retro'
    
    // Data Management
    undoLimit: 50,                 // Maximum undo/redo steps
    syncField: null,               // Input field to sync with
    syncFormat: 'JSON',            // Sync format: 'JSON'|'PNG'|'JPG'|'SVG'
    
    // Export Options
    svgStyles: false,              // Use CSS styles in SVG export
    
    // Event Callbacks
    onChange: null,                // Called when signature changes
    onStrokeStart: null,          // Called when stroke starts  
    onStrokeEnd: null             // Called when stroke ends
});
```

### 🎛️ Runtime Configuration

```javascript
// All methods support method chaining!
pad.setColor('#ff0000')                    // Change pen color
   .setThickness(5)                        // Change thickness
   .setBackgroundColor('#f0f0f0')         // Change background
   .setGuidelineColor('#cccccc')          // Change guideline color
   .toggleGuideline(true);                // Show/hide guideline

// Update smoothing
pad.opts.smoothingFactor = 0.8;           // More aggressive smoothing
pad.opts.smoothing = false;               // Disable smoothing completely
```

---

## 🎨 Styling

```css
.signature-box {
  width: 100%;
  height: 200px;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  background-color: #ffffff;
  position: relative;
  overflow: hidden;
}

.signature-box canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
  cursor: crosshair;
}
```

---

## ✨ Features

| Feature         | Description                             |
| --------------- | --------------------------------------- |
| ✅ Draw          | Smooth handwriting experience           |
| ✅ Undo/Redo     | Undo & redo strokes                     |
| ✅ Clear         | Reset pad                               |
| ✅ Export        | PNG, JPG, SVG, JSON                     |
| ✅ Sync Field    | Auto-bind signature to input            |
| ✅ Dynamic Color | Update pen/guideline color in real-time |
| ✅ Customizable  | Background, thickness, sync behavior    |

---

## 🔧 API Reference

### `new SignaturePad(container, options)`

**Options**

| Option           | Type      | Default  | Description                                |
| ---------------- | --------- | -------- | ------------------------------------------ |
| `color`          | `string`  | `'#000'` | Pen stroke color                           |
| `background`     | `string`  | `'#fff'` | Canvas background color                    |
| `thickness`      | `number`  | `2`      | Stroke width                               |
| `guideline`      | `boolean` | `false`  | Show writing guideline                     |
| `guidelineColor` | `string`  | `'#ccc'` | Guideline color                            |
| `syncField`      | `Element` | `null`   | Target field to auto-sync signature output |
| `syncFormat`     | `string`  | `'PNG'`  | One of `'PNG'`, `'SVG'`, `'JSON'`          |
| `disableResize`  | `boolean` | `false`  | Disable canvas resize on window resize     |
| `undoLimit`      | `number`  | `50`     | Max undo stack depth                       |

---

## 🧪 API Reference

### Core Methods

```javascript
// Drawing Management
pad.clear(trigger?)               // Clear signature (returns SignaturePad)
pad.undo()                       // Undo last stroke (returns SignaturePad)  
pad.redo()                       // Redo last undone stroke (returns SignaturePad)
pad.isEmpty()                    // Check if signature is empty (returns boolean)

// Data Export
pad.toJSON()                     // Export as enhanced JSON with metadata
pad.toDataURL(type?, quality?)   // Export as data URL (PNG/JPEG)
pad.toSVG()                      // Export as SVG with enhanced features

// Data Import  
pad.draw(data)                   // Import signature data (JSON/SVG/DataURL)

// Dynamic Configuration (All chainable!)
pad.setColor(color)              // Change pen color
pad.setThickness(thickness)      // Change pen thickness
pad.setBackgroundColor(color)    // Change background color
pad.setGuidelineColor(color)     // Change guideline color
pad.toggleGuideline(show?)       // Toggle guideline visibility

// Utility Methods
pad.getBounds()                  // Get signature bounding box
pad.destroy()                    // Clean up resources and event listeners

// 🆕 MODERN METHODS
// Visual Effects
pad.applyBlendMode('multiply')   // Apply blend mode effect
pad.applyTexture('pencil')       // Apply texture style

// Animation & Effects
pad.animateStroke(points, 1000, callback)  // Animate stroke drawing
```

### Modern Features Examples

```javascript
// Enable modern effects
pad.setOptions({
    glowEffect: true,
    pressureSensitivity: true,
    texture: 'watercolor',
    theme: 'neon'
});

// Apply dynamic effects
pad.applyBlendMode('screen')
   .applyTexture('marker')
   .setColor('#ff00ff');

// Animate signature playback
const strokeData = pad.toJSON();
pad.clear();
pad.animateStroke(strokeData.lines[0], 2000, () => {
    console.log('Animation complete!');
});
```

### Method Chaining Examples

```javascript
// Chainable configuration
pad.setColor('#007bff')
   .setThickness(4)
   .setBackgroundColor('#f8f9fa')
   .toggleGuideline(true)
   .clear();

// Batch operations
pad.clear()
   .setColor('#28a745')
   .setThickness(6);

// Import and configure
pad.draw(savedData)
   .setColor('#dc3545');
```

### Event Callbacks

```javascript
const pad = new SignaturePad(container, {
    onChange: (instance) => {
        console.log('Signature changed');
        saveSignature(instance.toJSON());
    },
    
    onStrokeStart: (instance) => {
        console.log('Started drawing');
        // Could disable save button, show loading, etc.
    },
    
    onStrokeEnd: (instance) => {
        console.log('Finished stroke');
        // Auto-save, validate, etc.
    }
});
```

### Advanced Usage

```javascript
// Get detailed signature information
const bounds = pad.getBounds();
console.log(`Signature: ${bounds.width}×${bounds.height}px`);

// Export with custom quality
const highQualityJpg = pad.toDataURL('image/jpeg', 0.95);
const compressedPng = pad.toDataURL('image/png');

// Enhanced JSON export includes metadata
const jsonData = JSON.parse(pad.toJSON());
console.log(`Lines: ${jsonData.lines.length}, Version: ${jsonData.version}`);

// Conditional operations
if (!pad.isEmpty()) {
    const svgData = pad.toSVG();
    downloadFile(svgData, 'signature.svg');
}

// Memory cleanup when done
pad.destroy();
```

---

## 🖼️ Framework Integration Examples

### React Component

```jsx
import { useRef, useEffect, useState } from 'react';
import SignaturePad from '@niel-blanca/signature-pad-js';

function SignaturePadComponent() {
    const containerRef = useRef(null);
    const padRef = useRef(null);
    const [signatureData, setSignatureData] = useState(null);

    useEffect(() => {
        if (containerRef.current) {
            padRef.current = new SignaturePad(containerRef.current, {
                background: '#ffffff',
                color: '#000000',
                smoothing: true,
                onChange: (instance) => {
                    setSignatureData(instance.toJSON());
                }
            });
        }

        return () => {
            if (padRef.current) {
                padRef.current.destroy();
            }
        };
    }, []);

    const handleClear = () => padRef.current?.clear();
    const handleUndo = () => padRef.current?.undo();
    const handleSave = () => {
        if (signatureData) {
            // Save to backend/localStorage
            console.log('Saving signature:', signatureData);
        }
    };

    return (
        <div>
            <div 
                ref={containerRef} 
                style={{ width: '100%', height: '300px', border: '1px solid #ccc' }}
            />
            <div>
                <button onClick={handleClear}>Clear</button>
                <button onClick={handleUndo}>Undo</button>
                <button onClick={handleSave}>Save</button>
            </div>
        </div>
    );
}
```

### Vue 3 Component

```vue
<template>
    <div>
        <div ref="signatureContainer" class="signature-container"></div>
        <div class="controls">
            <button @click="clear">Clear</button>
            <button @click="undo">Undo</button>
            <button @click="download">Download</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import SignaturePad from '@niel-blanca/signature-pad-js';

const signatureContainer = ref(null);
let pad = null;

onMounted(() => {
    pad = new SignaturePad(signatureContainer.value, {
        background: '#f8f9fa',
        color: '#495057',
        smoothing: true,
        onChange: (instance) => {
            // Emit to parent component
            emit('signatureChanged', instance.toJSON());
        }
    });
});

onUnmounted(() => {
    if (pad) {
        pad.destroy();
    }
});

const clear = () => pad?.clear();
const undo = () => pad?.undo();
const download = () => {
    if (pad && !pad.isEmpty()) {
        const dataURL = pad.toDataURL();
        const link = document.createElement('a');
        link.download = 'signature.png';
        link.href = dataURL;
        link.click();
    }
};

const emit = defineEmits(['signatureChanged']);
</script>

<style scoped>
.signature-container {
    width: 100%;
    height: 300px;
    border: 2px dashed #ccc;
    border-radius: 8px;
}
</style>
```

---

---

## 📁 File Structure

```
/dist
  └── signature-pad.min.js
/src
  └── SignaturePad.js
README.md
package.json
```

---

## 🚀 CDN Quickstart

```html
<div id="signature"></div>
<script src="https://cdn.jsdelivr.net/npm/@niel-blanca/signature-pad-js@1.1.0/dist/signature-pad.min.js"></script>
<script>
  const pad = new SignaturePad(document.getElementById('signature'));
</script>
```

---

## 🔄 Changelog

### **v1.2.0** 🚀 *Major Enhancement Release*

#### 🎨 **Drawing & Performance**
- **Smooth Bezier Curves**: Natural, curved strokes instead of jagged lines
- **Pressure Sensitivity**: Variable line width based on input pressure (when supported)
- **Configurable Smoothing**: Control stroke smoothing with `smoothing` and `smoothingFactor` options
- **Optimized Rendering**: Better performance with batched drawing and improved memory management
- **Debounced Resize**: Performance improvement for window resize handling

#### 🔧 **Enhanced API**
- **Method Chaining**: All configuration methods now return `SignaturePad` instance for chaining
- **New Dynamic Methods**: `setBackgroundColor()`, `setThickness()`, `toggleGuideline()`
- **Utility Methods**: `getBounds()` for signature dimensions, `destroy()` for cleanup
- **Enhanced JSON Export**: Now includes version and timestamp metadata
- **Better SVG Export**: Improved with proper stroke caps, dash support for guidelines

#### 📊 **Event System**
- **New Callbacks**: `onStrokeStart` and `onStrokeEnd` for granular event handling
- **Enhanced onChange**: More reliable triggering and better performance

#### 🔒 **Reliability & Security**
- **Comprehensive Error Handling**: Better validation and error messages
- **Input Sanitization**: Secure handling of imported data
- **Memory Management**: Proper cleanup to prevent memory leaks
- **Type Safety**: Enhanced TypeScript definitions

#### 🧪 **Developer Experience**
- **Modern Build Pipeline**: ESLint, Prettier, Jest testing
- **95%+ Test Coverage**: Comprehensive test suite
- **Enhanced Documentation**: Complete API reference and framework examples
- **Interactive Demo**: New demo.html with all features showcased

### **v1.1.0** *Feature Release*

- ✍️ Added `redo()` for stroke recovery
- 🎨 `setColor()` and `setGuidelineColor()` added for runtime color control
- 📸 `toDataURL('image/jpeg')` added for JPG export support
- ⚙️ Refactored core logic for better stability and performance

### **v1.0.0** *Initial Release*

- 🖋️ Basic signature drawing with canvas API
- 🧹 Clear functionality  
- 📤 PNG and SVG export
- 🎨 Customizable colors and thickness
- 📝 Field synchronization

---

## 📫 Feedback & Contributions

Have ideas, bugs, or feature requests?
Open an issue or contribute on GitHub:
👉 [github.com/niel-blanca/signature-pad-js](https://github.com/niel-blanca/signature-pad-js)
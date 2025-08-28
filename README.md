# 🖋️ Signature Pad JS

![NPM Version](https://img.shields.io/npm/v/@niel-blanca/signature-pad-js)
![Build Status](https://img.shields.io/github/actions/workflow/status/niel-blanca/signature-pad-js/npm-publish-github-packages.yml)
![Test Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen)
![License](https://img.shields.io/npm/l/@niel-blanca/signature-pad-js)
![Bundle Size](https://img.shields.io/bundlephobia/minzip/@niel-blanca/signature-pad-js)

![Signature Pad Demo](https://github.com/user-attachments/assets/ea1d4e48-b49d-45cc-824b-847436142eb1)

A **modern, lightweight, and feature-rich** signature pad built with **Vanilla JavaScript**. Offers smooth bezier curve drawing, pressure sensitivity, comprehensive export options, and an intuitive API with method chaining support.

> ⚡️ **Zero Dependencies** • 📱 **Touch Friendly** • 🎨 **Smooth Drawing** • ⚙️ **Highly Configurable**

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🎨 **Smooth Drawing** | Bezier curves with pressure sensitivity for natural strokes |
| 📱 **Modern Touch Support** | Pointer Events API with full touch and pen support |
| 🔄 **Undo/Redo System** | Full history management with configurable limits |
| 📤 **Multiple Export Formats** | PNG, JPG, SVG, JSON with customizable quality |
| 🎯 **Method Chaining** | Fluent API for better developer experience |
| ⚡ **High Performance** | Optimized rendering and memory management |
| 🔧 **Extensive Configuration** | 15+ options for complete customization |
| 📝 **TypeScript Support** | Full type definitions included |
| 🧪 **Comprehensive Testing** | 95%+ test coverage with Jest |
| 🚀 **Modern Build Pipeline** | ESLint, Prettier, automated CI/CD |

---

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
    // Appearance
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
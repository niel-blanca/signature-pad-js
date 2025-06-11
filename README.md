# 🖋️ Signature Pad JS

 ![image](https://github.com/user-attachments/assets/ea1d4e48-b49d-45cc-824b-847436142eb1)

A lightweight, dependency-free Signature Pad powered by the Canvas API and written in **Vanilla JavaScript**.
Offers smooth drawing, **undo**, **clear**, and **export** (PNG, SVG, JSON) with easy integration for modern web projects.

> ⚡️ No jQuery. No frameworks. Just clean and fast native JavaScript.

---

## 📦 Installation

### 🔹 Using npm (recommended)

```bash
npm install @niel-blanca/signature-pad-js@1.0.2
```

Or add directly to your `package.json`:

```json
"@niel-blanca/signature-pad-js": "^1.0.2"
```

### 🔹 CDN (for quick use)

```html
<script src="https://cdn.jsdelivr.net/npm/@niel-blanca/signature-pad-js@1.0.2/dist/signature-pad.min.js"></script>
```

---

## ⚙️ Usage Guide

### ✅ 1. HTML Markup

```html
<div id="signature" class="signature-container"></div>
<input type="hidden" id="signature-data" name="signature" />
```

> The hidden input is automatically synced with the drawn signature in your preferred format (e.g., PNG, SVG, JSON).

---

### ✅ 2. JavaScript Setup (ES Modules)

```js
import SignaturePad from '@niel-blanca/signature-pad-js';

const container = document.getElementById('signature');
const syncField = document.getElementById('signature-data');

const pad = new SignaturePad(container, {
  background: '#ffffff',  // Canvas background
  color: '#000000',       // Stroke color
  thickness: 2,           // Pen stroke thickness
  guideline: true,        // Show writing guideline
  syncField: syncField,   // Hidden field to sync with
  syncFormat: 'PNG'       // 'PNG', 'SVG', or 'JSON'
});
```

---

## 🎨 Styling

Add the following CSS to style your signature container:

```css
.signature-box {
    width: 100%;
    height: 200px;
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
    background-color: #ffffff;
    padding: 0;
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

You can also customize cursor style, guidelines, or shadows for enhanced UI/UX.

---

## ✨ Features

| Feature        | Description                           |
| -------------- | ------------------------------------- |
| ✅ Draw         | Smooth handwriting experience         |
| ✅ Undo         | Undo last stroke with `pad.undo()`    |
| ✅ Clear        | Reset pad using `pad.clear()`         |
| ✅ Export       | Get data in PNG, SVG, or JSON format  |
| ✅ Sync Field   | Automatically bind drawing to a field |
| ✅ Customizable | Adjust color, thickness, background   |

---

## 🔧 API Reference

### `new SignaturePad(container, options)`

* **container**: DOM element to render the canvas
* **options**: Configuration object

### Options

| Option       | Type      | Default  | Description                       |
| ------------ | --------- | -------- | --------------------------------- |
| `color`      | `string`  | `'#000'` | Stroke color                      |
| `background` | `string`  | `'#fff'` | Canvas background                 |
| `thickness`  | `number`  | `2`      | Stroke width                      |
| `guideline`  | `boolean` | `false`  | Show writing line                 |
| `syncField`  | `Element` | `null`   | Binds to hidden input             |
| `syncFormat` | `string`  | `'PNG'`  | One of `'PNG'`, `'SVG'`, `'JSON'` |

---

## 🧪 Common Methods

```js
pad.clear();       // Clears the canvas
pad.undo();        // Removes the last stroke
pad.getData();     // Returns drawing data (array of strokes)
pad.toDataURL();   // Returns Base64 PNG string
pad.toSVG();       // Returns SVG markup
```

---

## 🛡️ Best Practices

* Use `syncField` with form submissions for storing user signature.
* Use PNG format for backend uploads.
* Store SVG/JSON for vector-style auditing or re-editing.

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

## 🚀 CDN Quickstart (No Build Tools)

```html
<div id="signature"></div>
<script src="https://cdn.jsdelivr.net/npm/@niel-blanca/signature-pad-js@1.0.2/dist/signature-pad.min.js"></script>
<script>
  const container = document.getElementById('signature');
  const pad = new SignaturePad(container);
</script>
```

---

## 📤 Export Example (Base64 Image for Upload)

```js
const imageData = pad.toDataURL();
// Now use fetch/AJAX to upload to your server
```

---

## 🔄 Change Log

**v1.0.2**

* Initial stable release
* PNG/SVG/JSON export
* Undo and clear support
* Canvas guideline and sync input

---

## 📫 Feedback & Contributions

Found a bug? Need a feature?
Open an issue or contribute directly on GitHub:
👉 [github.com/niel-blanca/signature-pad-js](https://github.com/niel-blanca/signature-pad-js)

---

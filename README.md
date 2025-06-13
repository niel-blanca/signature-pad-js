# 🖋️ Signature Pad JS

![image](https://github.com/user-attachments/assets/ea1d4e48-b49d-45cc-824b-847436142eb1)

A lightweight, dependency-free Signature Pad powered by the Canvas API and written in **Vanilla JavaScript**.
Offers smooth drawing, **undo**, **redo**, **clear**, **dynamic color updates**, and export (PNG, JPG, SVG, JSON) with easy integration for modern web projects.

> ⚡️ No jQuery. No frameworks. Just clean and fast native JavaScript.

---

## 📦 Installation

### 🔹 Using npm (recommended)

```bash
npm install @niel-blanca/signature-pad-js@1.1.0
```

Or add directly to your `package.json`:

```json
"@niel-blanca/signature-pad-js": "^1.1.0"
```

### 🔹 CDN (for quick use)

```html
<script src="https://cdn.jsdelivr.net/npm/@niel-blanca/signature-pad-js@1.1.0/dist/signature-pad.min.js"></script>
```

---

## ⚙️ Usage Guide

### ✅ 1. HTML Markup

```html
<div id="signature" class="signature-container"></div>
<input type="hidden" id="signature-data" name="signature" />
```

---

### ✅ 2. JavaScript Setup (ES Modules)

```js
import SignaturePad from '@niel-blanca/signature-pad-js';

const container = document.getElementById('signature');
const syncField = document.getElementById('signature-data');

const pad = new SignaturePad(container, {
  background: '#ffffff',
  color: '#000000',
  thickness: 2,
  guideline: true,
  syncField: syncField,
  syncFormat: 'PNG'
});
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

## 🧪 Methods

```js
pad.clear();                // Clears canvas
pad.undo();                 // Undo last stroke
pad.redo();                 // Redo last undone stroke
pad.isEmpty();              // Returns true if canvas is empty
pad.toJSON();               // Get signature data in JSON
pad.toSVG();                // Get signature as SVG markup
pad.toDataURL('image/jpeg'); // Export as JPG
pad.toDataURL();            // Default is PNG

pad.setColor('#ff0000');         // Update pen color dynamically
pad.setGuidelineColor('#00f');   // Change guideline color live
```

---

## 📤 Export Example

```js
const imageData = pad.toDataURL('image/jpeg');
// Upload to your server
```

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

## 🔄 Change Log

**v1.1.0**

* ✍️ Added `redo()` for stroke recovery
* 🎨 `setColor()` and `setGuidelineColor()` added for runtime color control
* 📸 `toDataURL('image/jpeg')` added for JPG export support
* ⚙️ Refactored core logic for better stability and performance

---

## 📫 Feedback & Contributions

Have ideas, bugs, or feature requests?
Open an issue or contribute on GitHub:
👉 [github.com/niel-blanca/signature-pad-js](https://github.com/niel-blanca/signature-pad-js)
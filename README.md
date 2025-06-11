# Signature Pad JS

A lightweight and dependency-free Signature Pad built with the Canvas API using Vanilla JavaScript. It allows smooth drawing, undo, export to PNG/SVG/JSON, and more.

---

### 📦 Installation

#### ✅ Using NPM/Yarn (recommended for modern projects)

```bash
npm install @niel-blanca/signature-pad-js
# or
yarn add @spybooster/signature-pad-js
```

🗂️ CDN/Manual
Download or link dist/signature-pad.min.js in your HTML:
```html
<script src="dist/signature-pad.min.js"></script>
```

⚙️ Usage
✅ HTML
```html
<div id="signature" class="signature-container"></div>
<input type="hidden" id="signature-data" name="signature" />
```

✅ JavaScript (ESM / Module)
```js
import SignaturePad from '@spybooster/signature-pad-js';

const container = document.getElementById('signature');
const syncField = document.getElementById('signature-data');

const pad = new SignaturePad(container, {
  background: '#fff',
  color: '#000',
  thickness: 2,
  guideline: true,
  syncField: syncField,
  syncFormat: 'PNG'
});
```

🎨 Styling
Add this CSS for a Bootstrap-like styled signature box:

```css
.signature-container {
  width: 100%;
  height: 200px;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  background-color: #fff;
  position: relative;
}
```

🔧 Options
Option	Type	Default	Description
| Option            | Type                       | Default     | Description                                   |
| ----------------- | -------------------------- | ----------- | --------------------------------------------- |
| `background`      | `string`                   | `'#fff'`    | Canvas background color                       |
| `color`           | `string`                   | `'#000'`    | Pen color                                     |
| `thickness`       | `number`                   | `2`         | Pen stroke width                              |
| `guideline`       | `boolean`                  | `false`     | Show a baseline guide                         |
| `guidelineColor`  | `string`                   | `'#a0a0a0'` | Guide line color                              |
| `guidelineOffset` | `number`                   | `50`        | Guide line position from bottom               |
| `guidelineIndent` | `number`                   | `10`        | Horizontal padding of guide line              |
| `disableResize`   | `boolean`                  | `false`     | Prevent canvas from resizing on window resize |
| `undoLimit`       | `number`                   | `10`        | Max undo levels                               |
| `syncField`       | `HTMLElement \| null`      | `null`      | Auto sync field to signature value            |
| `syncFormat`      | `'PNG' \| 'SVG' \| 'JSON'` | `'PNG'`     | Export format when syncing                    |
| `svgStyles`       | `boolean`                  | `false`     | Use inline styles in SVG                      |
| `onChange`        | `(instance) => {}`         | `null`      | Callback on signature change                  |


📥 API Methods
Method	Description
| Method        | Description                                      |
| ------------- | ------------------------------------------------ |
| `clear()`     | Clears the canvas                                |
| `undo()`      | Undo the last stroke                             |
| `isEmpty()`   | Returns `true` if signature is empty             |
| `toJSON()`    | Export signature as a JSON string                |
| `toSVG()`     | Export signature as an SVG string                |
| `toDataURL()` | Export signature as a PNG (or JPEG/SVG) data URL |
| `draw(data)`  | Import signature from JSON, PNG, or SVG string   |


🔄 Example: Saving and Loading
```js
const saved = pad.toJSON();
pad.clear();
pad.draw(saved);
```

🧪 Development
Build the project:
```bash
npm install
npm run build
```

Watch mode:
```bash
npm run dev
```

Output:
dist/signature-pad.js – bundled (dev)
dist/signature-pad.min.js – bundled and minified

📁 Project Structure
```pgsql
signature-pad-js/
├── dist/
│   ├── signature-pad.js
│   └── signature-pad.min.js
├── src/
│   └── SignaturePad.js
├── types/
│   └── index.d.ts
├── package.json
└── README.md
```

In Markdown (`.md`), you add links using the following syntax:

```md
[Link Text](URL)
```
---

### 🧾 License

MIT License © 2025 Niel - [Spybooster](https://github.com/Spybooster/signature-pad-js)
[View License](https://opensource.org/licenses/MIT)

---

### 💬 Support / Feedback

Found a bug or want to suggest a feature? [Open an issue](https://github.com/Spybooster/signature-pad-js/issues) on GitHub.

---

Pull requests and stars welcome!
```yaml
Let me know if you want me to add:

- Shields/badges (npm version, license, build status)

Ready to publish.
```

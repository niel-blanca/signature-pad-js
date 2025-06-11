# Signature Pad JS

A lightweight and dependency-free Signature Pad built with the Canvas API using Vanilla JavaScript. It allows smooth drawing, undo, export to PNG/SVG/JSON, and more.

---

### 📦 Installation

#### ✅ Using NPM/Yarn (recommended for modern projects)

```bash
npm install @spybooster/signature-pad-js
# or
yarn add @spybooster/signature-pad-js
🗂️ CDN/Manual
Download or link dist/signature-pad.min.js in your HTML:

html
Copy
Edit
<script src="dist/signature-pad.min.js"></script>
⚙️ Usage
✅ HTML
html
Copy
Edit
<div id="signature" class="signature-container"></div>
<input type="hidden" id="signature-data" name="signature" />
✅ JavaScript (ESM / Module)
js
Copy
Edit
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
🎨 Styling
Add this CSS for a Bootstrap-like styled signature box:

css
Copy
Edit
.signature-container {
  width: 100%;
  height: 200px;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  background-color: #fff;
  position: relative;
}
🔧 Options
Option	Type	Default	Description
background	string	'#fff'	Canvas background color
color	string	'#000'	Pen color
thickness	number	2	Pen stroke width
guideline	boolean	false	Show a baseline guide
guidelineColor	string	'#a0a0a0'	Guide line color
guidelineOffset	number	50	Guide line position from bottom
guidelineIndent	number	10	Horizontal padding of guide line
disableResize	boolean	false	Prevent canvas from resizing on window resize
undoLimit	number	10	Max undo levels
syncField	HTMLElement/null	null	Auto sync field to signature value
syncFormat	`'PNG'	'SVG'	'JSON'`
svgStyles	boolean	false	Inline styles in SVG
onChange	(instance) => {}	null	Callback on signature change

📥 API Methods
Method	Description
clear()	Clears the canvas
undo()	Undo the last stroke
isEmpty()	Returns true if signature is empty
toJSON()	Export as JSON string
toSVG()	Export as SVG string
toDataURL()	Export as PNG (or JPEG/SVG) data URL
draw(data)	Import from JSON, PNG, or SVG string

🔄 Example: Saving and Loading
js
Copy
Edit
const saved = pad.toJSON();
pad.clear();
pad.draw(saved);
🧪 Development
Build the project:
bash
Copy
Edit
npm install
npm run build
Watch mode:
bash
Copy
Edit
npm run dev
Output:
dist/signature-pad.js – bundled (dev)

dist/signature-pad.min.js – bundled and minified

📁 Project Structure
pgsql
Copy
Edit
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
🧾 License
MIT License © 2025 Niel - Spybooster

💬 Support / Feedback
GitHub Issues

Pull requests and stars welcome!

yaml
Copy
Edit

---

Let me know if you want a badge version (`npm`, `build`, `license`, etc.) or if you'll publish it under a scoped namespace like `@spybooster/signature-pad-js`.
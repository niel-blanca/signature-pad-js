/**
 * SignaturePad.js v1.0.0
 * --------------------------------------------------------
 * Custom lightweight signature pad with undo, resize, sync,
 * and SVG/PNG/JSON export support.
 *
 * @version     1.0.0
 * @author      Niel - Spybooster
 * @license     MIT (https://opensource.org/licenses/MIT)
 * --------------------------------------------------------
 * Usage:
 *
 * const sigPad = new SignaturePad(document.getElementById('sig-container'), {
 *     background: '#fff',
 *     color: '#000',
 *     thickness: 2,
 *     guideline: true,
 *     syncField: document.getElementById('signature64'),
 *     syncFormat: 'PNG',
 *     onChange: () => console.log("Signature updated.")
 * });
 *
 * sigPad.clear(); // Clear signature
 * sigPad.undo();  // Undo last stroke
 * sigPad.toDataURL(); // Export as image
 * sigPad.toJSON();    // Export as JSON
 * sigPad.toSVG();     // Export as SVG
 * --------------------------------------------------------
 */

class SignaturePad {
  constructor(container, options = {}) {
    this.container = container;
    this.opts = Object.assign({
      background: '#fff',
      color: '#000',
      thickness: 2,
      guideline: false,
      guidelineColor: '#a0a0a0',
      guidelineOffset: 50,
      guidelineIndent: 10,
      disableResize: false,
      undoLimit: 10,
      syncField: null,
      syncFormat: 'JSON',
      svgStyles: false,
      onChange: null
    }, options);

    this.lines = []; // All drawn lines

    this._initCanvas();
    this._attachEvents();

    if (!this.opts.disableResize) {
      window.addEventListener('resize', () => this._resizeCanvas());
    }

    this.clear(false);
  }

  _initCanvas() {
    this.canvas = document.createElement('canvas');
    this.container.innerHTML = '';
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this._resizeCanvas();
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  _resizeCanvas() {
    const { width, height } = this.container.getBoundingClientRect();
    const dataUrl = this.canvas.toDataURL();
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
    this._drawBackground();
    this._redrawLines();
  }

  _attachEvents() {
    const down = e => this._startStroke(e);
    this.canvas.addEventListener('pointerdown', down);
    this.canvas.addEventListener('pointermove', e => this._continueStroke(e));
    document.addEventListener('pointerup', e => this._endStroke(e));
  }

  _startStroke({ clientX, clientY }) {
    this.points = [];
    this._addPoint(clientX, clientY);
    this.isDrawing = true;
  }

  _continueStroke({ clientX, clientY }) {
    if (!this.isDrawing) return;
    this._addPoint(clientX, clientY);
    if (this.points.length > 1) {
      const [p1, p2] = this.points.slice(-2);
      this.ctx.strokeStyle = this.opts.color;
      this.ctx.lineWidth = this.opts.thickness;
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.stroke();
    }
  }

  _endStroke() {
    if (!this.isDrawing) return;
    this.isDrawing = false;

    if (this.points.length === 1) {
      const p = this.points[0];
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, this.opts.thickness / 2, 0, 2 * Math.PI);
      this.ctx.fillStyle = this.opts.color;
      this.ctx.fill();
    }

    this.lines.push(this.points.slice());
    if (this.lines.length > this.opts.undoLimit) this.lines.shift();

    this._triggerChange();
  }

  _addPoint(x, y) {
    const rect = this.canvas.getBoundingClientRect();
    this.points.push({
      x: x - rect.left,
      y: y - rect.top
    });
  }

  _drawBackground() {
    if (!this.ctx) return;
    this.ctx.fillStyle = this.opts.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.opts.guideline) {
      const y = this.canvas.height - this.opts.guidelineOffset;
      this.ctx.strokeStyle = this.opts.guidelineColor;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(this.opts.guidelineIndent, y);
      this.ctx.lineTo(this.canvas.width - this.opts.guidelineIndent, y);
      this.ctx.stroke();
    }
  }

  _redrawLines() {
    if (!this.ctx) return;
    this._drawBackground();
    this.ctx.strokeStyle = this.opts.color;
    this.ctx.lineWidth = this.opts.thickness;
    this.lines.forEach(line => {
      this.ctx.beginPath();
      line.forEach((pt, i) => {
        i === 0 ? this.ctx.moveTo(pt.x, pt.y) : this.ctx.lineTo(pt.x, pt.y);
      });
      this.ctx.stroke();
    });
  }

  _triggerChange() {
    if (this.opts.syncField) {
      let val;
      switch (this.opts.syncFormat) {
        case 'PNG': val = this.toDataURL(); break;
        case 'SVG': val = this.toSVG(); break;
        default: val = this.toJSON();
      }
      this.opts.syncField.value = val;
    }
    if (typeof this.opts.onChange === 'function') {
      this.opts.onChange(this);
    }
  }

  clear(trigger = true) {
    this.lines = [];
    this._drawBackground();
    if (trigger) this._triggerChange();
  }

  undo() {
    this.lines.pop();
    this._redrawLines();
    this._triggerChange();
  }

  isEmpty() {
    return this.lines.length === 0;
  }

  toJSON() {
    return JSON.stringify({ lines: this.lines });
  }

  toDataURL(type = 'image/png', quality) {
    return this.canvas.toDataURL(type, quality);
  }

  toSVG() {
    const { background, color, thickness, svgStyles } = this.opts;
    const szW = this.canvas.width, szH = this.canvas.height;
    const bgAttr = svgStyles
      ? `style="fill:${background};"`
      : `fill="${background}"`;
    const lineAttr = svgStyles
      ? `style="fill:none;stroke:${color};stroke-width:${thickness};"`
      : `fill="none" stroke="${color}" stroke-width="${thickness}"`;

    let sv = `<svg xmlns="http://www.w3.org/2000/svg" width="${szW}" height="${szH}">`;
    sv += `<rect ${bgAttr} x="0" y="0" width="${szW}" height="${szH}"/>`;
    sv += `<g ${lineAttr}>`;
    this.lines.forEach(line => {
      const pts = line.map(p => `${p.x},${p.y}`).join(' ');
      sv += `<polyline points="${pts}" />`;
    });
    sv += `</g></svg>`;
    return sv;
  }

  draw(data) {
    this.clear(false);
    switch (typeof data) {
      case 'string':
        if (data.startsWith('data:')) {
          const img = new Image();
          img.onload = () => this.ctx.drawImage(img, 0, 0);
          img.src = data;
        } else if (data.trim().startsWith('<svg')) {
          const dom = new DOMParser().parseFromString(data, 'image/svg+xml');
          this._parseSVG(dom);
        } else {
          this.draw(JSON.parse(data));
        }
        break;
      default:
        if (data.lines) {
          this.lines = data.lines;
          this._redrawLines();
        }
    }
    this._triggerChange();
  }

  _parseSVG(dom) {
    const pls = Array.from(dom.querySelectorAll('polyline'));
    this.lines = pls.map(pl => {
      return (pl.getAttribute('points') || '').split(' ').map(pt => {
        const [x, y] = pt.split(',').map(Number);
        return { x, y };
      });
    });
    this._redrawLines();
  }
}

export default SignaturePad;
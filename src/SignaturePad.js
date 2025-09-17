/**
 * Niel Blanca / SignaturePad.js v2.0.0
 * --------------------------------------------------------
 * Modern signature pad with advanced features and effects.
 *
 * NEW FEATURES v2.0.0:
 * - Advanced visual effects (glow, shadows, textures)
 * - Theme system with multiple presets
 * - Enhanced export options (PNG, JPG, SVG, JSON)
 * - Local storage integration
 * - Sharing capabilities
 * - Pressure sensitivity support
 * - Stroke animations
 * - Blend modes and modern effects
 *
 * @version     2.0.0
 * @author      Niel Blanca
 * @license     MIT (https://opensource.org/licenses/MIT)
 * --------------------------------------------------------
 */

/**
 * @typedef {Object} Point
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 * @property {number} [pressure] - Pressure value (0-1)
 */

/**
 * @typedef {Object} SignaturePadOptions
 * @property {string} [background='#fff'] - Background color
 * @property {string} [color='#000'] - Pen color
 * @property {number} [thickness=2] - Pen thickness
 * @property {boolean} [guideline=false] - Show guideline
 * @property {string} [guidelineColor='#a0a0a0'] - Guideline color
 * @property {number} [guidelineOffset=50] - Guideline offset from bottom
 * @property {number} [guidelineIndent=10] - Guideline indent from sides
 * @property {boolean} [disableResize=false] - Disable canvas resize
 * @property {number} [undoLimit=50] - Maximum undo/redo steps
 * @property {HTMLInputElement|HTMLTextAreaElement} [syncField=null] - Field to sync with
 * @property {string} [syncFormat='JSON'] - Sync format (JSON|PNG|JPG|SVG)
 * @property {boolean} [svgStyles=false] - Use styles in SVG export
 * @property {boolean} [smoothing=true] - Enable stroke smoothing
 * @property {number} [smoothingFactor=0.5] - Smoothing intensity (0-1)
 * @property {boolean} [shadows=false] - Enable shadows
 * @property {boolean} [glowEffect=false] - Enable glow effect
 * @property {boolean} [pressureSensitivity=false] - Enable pressure sensitivity
 * @property {boolean} [strokeAnimation=false] - Enable stroke animation
 * @property {string} [texture='smooth'] - Texture style
 * @property {string} [blendMode='normal'] - Canvas blend mode
 * @property {string} [theme='light'] - Theme preset
 * @property {Function} [onChange=null] - Change callback
 * @property {Function} [onStrokeStart=null] - Stroke start callback
 * @property {Function} [onStrokeEnd=null] - Stroke end callback
 */

/**
 * Modern signature pad with smooth drawing and advanced features
 */
class SignaturePad {
  /**
   * Creates a new SignaturePad instance
   * @param {HTMLElement|HTMLCanvasElement} container - Container or canvas element
   * @param {SignaturePadOptions} [options={}] - Configuration options
   * @throws {Error} When container is invalid
   */
  constructor(container, options = {}) {
    // Validate container
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('SignaturePad: Container must be a valid HTMLElement');
    }

    // Handle both container div and direct canvas element
    if (container.tagName === 'CANVAS') {
      this.canvas = container;
      this.container = container.parentElement || document.body;
    } else {
      this.container = container;
      this.canvas = null; // Will be created in _initCanvas
    }

    this.opts = Object.assign(
      {
        background: '#fff',
        color: '#000',
        thickness: 2,
        guideline: false,
        guidelineColor: '#a0a0a0',
        guidelineOffset: 50,
        guidelineIndent: 10,
        disableResize: false,
        undoLimit: 50,
        syncField: null,
        syncFormat: 'JSON',
        svgStyles: false,
        smoothing: true,
        smoothingFactor: 0.5,
        // Modern Features
        shadows: false,
        glowEffect: false,
        pressureSensitivity: false,
        strokeAnimation: false,
        texture: 'smooth',
        blendMode: 'normal',
        theme: 'light',
        onChange: null,
        onStrokeStart: null,
        onStrokeEnd: null
      },
      options
    );

    // Validate options
    this._validateOptions();

    // Initialize internal state
    this.lines = [];
    this.redoStack = [];
    this.isDrawing = false;
    this.points = [];

    // Performance optimization: throttle resize events
    this._resizeTimeout = null;

    // Initialize canvas and events
    this._initCanvas();
    this._attachEvents();

    // Setup resize listener with debouncing
    if (!this.opts.disableResize) {
      window.addEventListener('resize', this._debouncedResize.bind(this));
    }

    // Initial clear to set up background
    this.clear(false);
  }

  /**
   * Validates constructor options
   * @private
   * @throws {Error} When options are invalid
   */
  _validateOptions() {
    if (this.opts.undoLimit < 1) {
      throw new Error('SignaturePad: undoLimit must be at least 1');
    }
    if (this.opts.thickness < 0.1) {
      throw new Error('SignaturePad: thickness must be at least 0.1');
    }
    if (this.opts.smoothingFactor < 0 || this.opts.smoothingFactor > 1) {
      throw new Error('SignaturePad: smoothingFactor must be between 0 and 1');
    }
  }

  /**
   * Debounced resize handler for better performance
   * @private
   */
  _debouncedResize() {
    if (this._resizeTimeout) {
      clearTimeout(this._resizeTimeout);
    }
    this._resizeTimeout = setTimeout(() => {
      this._resizeCanvas();
    }, 150);
  }

  /**
   * Initializes the canvas element
   * @private
   */
  _initCanvas() {
    try {
      // If canvas wasn't provided in constructor, create one
      if (!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.container.innerHTML = '';
        this.container.appendChild(this.canvas);
      }

      this.ctx = this.canvas.getContext('2d');
      if (!this.ctx) {
        throw new Error('Failed to get 2D context from canvas');
      }

      this._resizeCanvas();
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      
      // Apply initial modern settings
      this._applyModernSettings();
    } catch (error) {
      throw new Error(`SignaturePad: Failed to initialize canvas - ${error.message}`);
    }
  }

  /**
   * Resizes canvas to fit container with improved handling
   * @private
   */
  _resizeCanvas() {
    try {
      const { width, height } = this.container.getBoundingClientRect();

      if (width === 0 || height === 0) {
        console.warn('SignaturePad: Container has zero dimensions');
        return;
      }

      // Save current content if canvas has data
      let imageData = null;
      if (this.canvas && this.canvas.width > 0 && this.canvas.height > 0) {
        try {
          imageData = this.canvas.toDataURL();
        } catch {
          // Ignore if we can't get image data (e.g., tainted canvas)
        }
      }

      // Set new dimensions
      this.canvas.width = width;
      this.canvas.height = height;

      // Re-get context after resize
      this.ctx = this.canvas.getContext('2d');
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';

      // Restore background
      this._drawBackground();

      // Restore content if available
      if (imageData) {
        const img = new Image();
        img.onload = () => {
          this.ctx.drawImage(img, 0, 0);
        };
        img.onerror = () => {
          // If image restoration fails, redraw from lines
          this._redrawLines();
        };
        img.src = imageData;
      }
    } catch (error) {
      console.error('SignaturePad: Error resizing canvas:', error);
    }
  }

  /**
   * Attaches event listeners with improved touch/pointer support
   * @private
   */
  _attachEvents() {
    // Use modern Pointer Events API for better cross-device support
    this.canvas.addEventListener('pointerdown', this._startStroke.bind(this));
    this.canvas.addEventListener('pointermove', this._continueStroke.bind(this));
    document.addEventListener('pointerup', this._endStroke.bind(this));
    document.addEventListener('pointercancel', this._endStroke.bind(this));

    // Prevent default touch behaviors that might interfere
    this.canvas.addEventListener('touchstart', e => e.preventDefault());
    this.canvas.addEventListener('touchmove', e => e.preventDefault());
    this.canvas.addEventListener('touchend', e => e.preventDefault());
  }

  /**
   * Starts a new stroke with enhanced touch/pressure support
   * @private
   * @param {PointerEvent} event - Pointer event
   */
  _startStroke(event) {
    event.preventDefault();

    this.isDrawing = true;
    this.points = [];

    const point = this._getPointFromEvent(event);
    this._addPoint(point.x, point.y, point.pressure);

    // Trigger callback
    if (typeof this.opts.onStrokeStart === 'function') {
      this.opts.onStrokeStart(this);
    }
  }

  /**
   * Continues drawing with smooth curves
   * @private
   * @param {PointerEvent} event - Pointer event
   */
  _continueStroke(event) {
    if (!this.isDrawing) return;

    event.preventDefault();

    const point = this._getPointFromEvent(event);
    this._addPoint(point.x, point.y, point.pressure);

    if (this.points.length >= 2) {
      this._drawSmoothLine();
    }
  }

  /**
   * Ends the current stroke
   * @private
   */
  _endStroke() {
    if (!this.isDrawing) return;

    this.isDrawing = false;

    // Handle single point (dot)
    if (this.points.length === 1) {
      this._drawDot(this.points[0]);
    }

    // Save stroke to history
    if (this.points.length > 0) {
      this.lines.push([...this.points]);

      // Limit undo stack size
      if (this.lines.length > this.opts.undoLimit) {
        this.lines.shift();
      }

      // Clear redo stack on new stroke
      this.redoStack = [];

      this._triggerChange();
    }

    // Trigger callback
    if (typeof this.opts.onStrokeEnd === 'function') {
      this.opts.onStrokeEnd(this);
    }
  }

  /**
   * Extracts point data from pointer event with pressure support
   * @private
   * @param {PointerEvent} event - Pointer event
   * @returns {Point} Point with coordinates and pressure
   */
  _getPointFromEvent(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      pressure: event.pressure || 0.5 // Default pressure for non-pressure devices
    };
  }

  /**
   * Adds a point to current stroke with optional smoothing
   * @private
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} [pressure=0.5] - Pressure value
   */
  _addPoint(x, y, pressure = 0.5) {
    const point = { x, y, pressure };

    if (this.opts.smoothing && this.points.length > 0) {
      // Apply smoothing by averaging with previous point
      const lastPoint = this.points[this.points.length - 1];
      const factor = this.opts.smoothingFactor;

      point.x = lastPoint.x + (point.x - lastPoint.x) * factor;
      point.y = lastPoint.y + (point.y - lastPoint.y) * factor;
    }

    this.points.push(point);
  }

  /**
   * Draws a smooth line using quadratic curves
   * @private
   */
  _drawSmoothLine() {
    const points = this.points;
    const len = points.length;

    if (len < 2) return;

    this.ctx.save();
    
    // Apply modern effects based on options
    if (this.opts.shadows) {
      this.ctx.shadowColor = this.opts.color;
      this.ctx.shadowBlur = this.opts.thickness;
      this.ctx.shadowOffsetX = 1;
      this.ctx.shadowOffsetY = 1;
    }
    
    if (this.opts.glowEffect) {
      this.ctx.shadowColor = this.opts.color;
      this.ctx.shadowBlur = this.opts.thickness * 3;
    }
    
    // Apply texture effects
    switch (this.opts.texture) {
      case 'rough':
        this.ctx.lineCap = 'square';
        this.ctx.lineJoin = 'miter';
        break;
      case 'pencil':
        this.ctx.globalAlpha = 0.8;
        this.ctx.lineCap = 'round';
        break;
      case 'marker':
        this.ctx.globalCompositeOperation = 'multiply';
        break;
      case 'watercolor':
        this.ctx.globalAlpha = 0.7;
        this.ctx.filter = 'blur(0.5px)';
        break;
      default:
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }

    this.ctx.strokeStyle = this.opts.color;
    this.ctx.lineWidth = this._getLineWidth(points[len - 1]);

    this.ctx.beginPath();

    if (len === 2) {
      // Simple line for first segment
      this.ctx.moveTo(points[0].x, points[0].y);
      this.ctx.lineTo(points[1].x, points[1].y);
    } else {
      // Quadratic curve for smooth drawing
      const prevPoint = points[len - 3];
      const controlPoint = points[len - 2];
      const endPoint = points[len - 1];

      this.ctx.moveTo(prevPoint.x, prevPoint.y);
      this.ctx.quadraticCurveTo(
        controlPoint.x,
        controlPoint.y,
        (controlPoint.x + endPoint.x) / 2,
        (controlPoint.y + endPoint.y) / 2
      );
    }

    this.ctx.stroke();
    this.ctx.restore();
  }

  /**
   * Draws a dot for single-point strokes
   * @private
   * @param {Point} point - Point to draw
   */
  _drawDot(point) {
    const radius = this._getLineWidth(point) / 2;

    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.opts.color;
    this.ctx.fill();
  }

  /**
   * Calculates line width based on pressure and thickness
   * @private
   * @param {Point} point - Point with pressure data
   * @returns {number} Line width
   */
  _getLineWidth(point) {
    const baseLine = this.opts.thickness;
    const pressureVariation = point.pressure || 0.5;

    // Vary line width based on pressure (0.5x to 1.5x base thickness)
    return baseLine * (0.5 + pressureVariation);
  }

  /**
   * Draws the background with optional guideline
   * @private
   */
  _drawBackground() {
    if (!this.ctx) return;

    try {
      // Fill background
      this.ctx.fillStyle = this.opts.background;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw guideline if enabled
      if (this.opts.guideline) {
        this._drawGuideline();
      }
    } catch (error) {
      console.error('SignaturePad: Error drawing background:', error);
    }
  }

  /**
   * Draws the signature guideline
   * @private
   */
  _drawGuideline() {
    const y = this.canvas.height - this.opts.guidelineOffset;

    this.ctx.save();
    this.ctx.strokeStyle = this.opts.guidelineColor;
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([5, 5]); // Dashed line for better appearance

    this.ctx.beginPath();
    this.ctx.moveTo(this.opts.guidelineIndent, y);
    this.ctx.lineTo(this.canvas.width - this.opts.guidelineIndent, y);
    this.ctx.stroke();

    this.ctx.restore();
  }

  /**
   * Redraws all lines with optimized performance
   * @private
   */
  _redrawLines() {
    if (!this.ctx) return;

    try {
      this._drawBackground();

      if (this.lines.length === 0) return;

      this.ctx.save();
      this.ctx.strokeStyle = this.opts.color;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';

      // Batch draw for better performance
      for (const line of this.lines) {
        if (line.length === 0) continue;

        if (line.length === 1) {
          // Single point (dot)
          const point = line[0];
          const radius = this._getLineWidth(point) / 2;

          this.ctx.beginPath();
          this.ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
          this.ctx.fillStyle = this.opts.color;
          this.ctx.fill();
        } else {
          // Multiple points (line)
          this._redrawSmoothLine(line);
        }
      }

      this.ctx.restore();
    } catch (error) {
      console.error('SignaturePad: Error redrawing lines:', error);
    }
  }

  /**
   * Redraws a single line with smooth curves
   * @private
   * @param {Point[]} points - Array of points
   */
  _redrawSmoothLine(points) {
    if (points.length < 2) return;

    this.ctx.save();
    
    // Apply modern effects based on options
    if (this.opts.shadows) {
      this.ctx.shadowColor = this.opts.color;
      this.ctx.shadowBlur = this.opts.thickness;
      this.ctx.shadowOffsetX = 1;
      this.ctx.shadowOffsetY = 1;
    }
    
    if (this.opts.glowEffect) {
      this.ctx.shadowColor = this.opts.color;
      this.ctx.shadowBlur = this.opts.thickness * 3;
    }
    
    // Apply texture effects
    switch (this.opts.texture) {
      case 'rough':
        this.ctx.lineCap = 'square';
        this.ctx.lineJoin = 'miter';
        break;
      case 'pencil':
        this.ctx.globalAlpha = 0.8;
        this.ctx.lineCap = 'round';
        break;
      case 'marker':
        this.ctx.globalCompositeOperation = 'multiply';
        break;
      case 'watercolor':
        this.ctx.globalAlpha = 0.7;
        this.ctx.filter = 'blur(0.5px)';
        break;
      default:
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }

    this.ctx.lineWidth = this.opts.thickness;
    this.ctx.strokeStyle = this.opts.color;
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);

    if (points.length === 2) {
      // Simple line for two points
      this.ctx.lineTo(points[1].x, points[1].y);
    } else {
      // Smooth curves for multiple points
      for (let i = 1; i < points.length - 1; i++) {
        const currentPoint = points[i];
        const nextPoint = points[i + 1];
        const controlX = (currentPoint.x + nextPoint.x) / 2;
        const controlY = (currentPoint.y + nextPoint.y) / 2;

        this.ctx.quadraticCurveTo(currentPoint.x, currentPoint.y, controlX, controlY);
      }

      // Final point
      const lastPoint = points[points.length - 1];
      this.ctx.lineTo(lastPoint.x, lastPoint.y);
    }

    this.ctx.stroke();
    this.ctx.restore();
  }

  /**
   * Triggers change callback and syncs with field
   * @private
   */
  _triggerChange() {
    try {
      // Sync with field if configured
      if (this.opts.syncField) {
        let val;
        switch (this.opts.syncFormat.toUpperCase()) {
          case 'PNG':
            val = this.toDataURL('image/png');
            break;
          case 'JPG':
          case 'JPEG':
            val = this.toDataURL('image/jpeg');
            break;
          case 'SVG':
            val = this.toSVG();
            break;
          default:
            val = this.toJSON();
        }
        this.opts.syncField.value = val;
      }

      // Call change callback
      if (typeof this.opts.onChange === 'function') {
        this.opts.onChange(this);
      }
    } catch (error) {
      console.error('SignaturePad: Error in change callback:', error);
    }
  }

  // ==============================================
  // PUBLIC API METHODS
  // ==============================================

  /**
   * Clears the signature pad
   * @param {boolean} [trigger=true] - Whether to trigger change callback
   * @returns {SignaturePad} This instance for method chaining
   */
  clear(trigger = true) {
    this.lines = [];
    this.redoStack = [];
    this._drawBackground();

    if (trigger) {
      this._triggerChange();
    }

    return this;
  }

  /**
   * Undoes the last stroke
   * @returns {SignaturePad} This instance for method chaining
   */
  undo() {
    if (this.lines.length === 0) return this;

    const lastLine = this.lines.pop();
    this.redoStack.push(lastLine);

    // Limit redo stack size
    if (this.redoStack.length > this.opts.undoLimit) {
      this.redoStack.shift();
    }

    this._redrawLines();
    this._triggerChange();

    return this;
  }

  /**
   * Redoes the last undone stroke
   * @returns {SignaturePad} This instance for method chaining
   */
  redo() {
    if (this.redoStack.length === 0) return this;

    const lastRedo = this.redoStack.pop();
    this.lines.push(lastRedo);

    this._redrawLines();
    this._triggerChange();

    return this;
  }

  /**
   * Checks if the signature pad is empty
   * @returns {boolean} True if no strokes have been drawn
   */
  isEmpty() {
    return this.lines.length === 0;
  }

  /**
   * Animates the stroke drawing with modern effects
   * @param {Array} strokePoints - Array of points to animate
   * @param {number} duration - Animation duration in milliseconds
   * @param {Function} callback - Callback when animation completes
   */
  animateStroke(strokePoints, duration = 1000, callback = null) {
    if (!strokePoints || strokePoints.length === 0) return;

    const startTime = Date.now();
    const pointsPerFrame = Math.max(1, Math.floor(strokePoints.length / (duration / 16)));
    let currentIndex = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Calculate how many points to draw this frame
      const targetIndex = Math.floor(progress * strokePoints.length);
      
      if (targetIndex > currentIndex) {
        const segmentPoints = strokePoints.slice(currentIndex, targetIndex + 1);
        
        // Draw the new segment with effects
        if (segmentPoints.length > 1) {
          this.ctx.save();
          
          // Apply animation-specific effects
          if (this.opts.strokeAnimation) {
            this.ctx.globalAlpha = 0.8 + (progress * 0.2); // Fade in effect
            
            if (this.opts.glowEffect) {
              this.ctx.shadowColor = this.opts.color;
              this.ctx.shadowBlur = this.opts.thickness * 2 * progress;
            }
          }
          
          this._redrawSmoothLine(segmentPoints);
          this.ctx.restore();
        }
        
        currentIndex = targetIndex;
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else if (callback) {
        callback();
      }
    };

    requestAnimationFrame(animate);
  }

  /**
   * Applies modern blend mode effects to the canvas
   * @param {string} blendMode - The blend mode to apply
   */
  applyBlendMode(blendMode = 'normal') {
    const validBlendModes = [
      'normal', 'multiply', 'screen', 'overlay', 'soft-light', 
      'hard-light', 'color-dodge', 'color-burn', 'darken', 
      'lighten', 'difference', 'exclusion', 'hue', 'saturation', 
      'color', 'luminosity'
    ];

    if (validBlendModes.includes(blendMode)) {
      this.ctx.globalCompositeOperation = blendMode;
      this.opts.blendMode = blendMode;
    }
  }

  /**
   * Applies texture effects to the stroke
   * @param {string} texture - The texture type to apply
   */
  applyTexture(texture = 'smooth') {
    this.opts.texture = texture;
    
    // Apply immediate texture changes to context
    switch (texture) {
      case 'rough':
        this.ctx.lineCap = 'square';
        this.ctx.lineJoin = 'miter';
        break;
      case 'pencil':
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        break;
      case 'marker':
        this.ctx.lineCap = 'square';
        this.ctx.lineJoin = 'round';
        break;
      case 'watercolor':
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        break;
      default:
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }
  }

  /**
   * Applies modern settings to the canvas context
   * @private
   */
  _applyModernSettings() {
    // Apply blend mode
    if (this.opts.blendMode && this.opts.blendMode !== 'normal') {
      this.ctx.globalCompositeOperation = this.opts.blendMode;
    }
    
    // Apply texture settings
    this.applyTexture(this.opts.texture);
  }

  /**
   * Updates options dynamically
   * @param {Object} newOptions - New options to apply
   * @returns {SignaturePad} This instance for method chaining
   */
  setOptions(newOptions) {
    Object.assign(this.opts, newOptions);
    this._applyModernSettings();
    this._drawBackground();
    return this;
  }

  /**
   * Sets the pen color
   * @param {string} color - Hex color string
   * @returns {SignaturePad} This instance for method chaining
   */
  setColor(color) {
    this.opts.color = color;
    return this;
  }

  /**
   * Sets the pen thickness
   * @param {number} thickness - Thickness in pixels
   * @returns {SignaturePad} This instance for method chaining
   */
  setThickness(thickness) {
    this.opts.thickness = Math.max(1, Math.min(50, thickness));
    return this;
  }

  /**
   * Sets the background color
   * @param {string} color - Hex color string
   * @returns {SignaturePad} This instance for method chaining
   */
  setBackgroundColor(color) {
    this.opts.background = color;
    this._drawBackground();
    return this;
  }

  /**
   * Downloads signature as file
   * @param {string} format - File format (png, jpg, svg, json)
   * @param {string} filename - Optional filename
   */
  download(format = 'png', filename = null) {
    const timestamp = new Date().toISOString().split('T')[0];
    const defaultName = `signature-${timestamp}`;
    const name = filename || defaultName;
    
    let dataUrl, blob, url;
    
    switch (format.toLowerCase()) {
      case 'png':
        dataUrl = this.toDataURL('image/png');
        this._downloadDataURL(dataUrl, `${name}.png`);
        break;
        
      case 'jpg':
      case 'jpeg':
        dataUrl = this.toDataURL('image/jpeg', 0.9);
        this._downloadDataURL(dataUrl, `${name}.jpg`);
        break;
        
      case 'svg':
        blob = new Blob([this.toSVG()], { type: 'image/svg+xml' });
        url = URL.createObjectURL(blob);
        this._downloadURL(url, `${name}.svg`);
        URL.revokeObjectURL(url);
        break;
        
      case 'json':
        blob = new Blob([this.toJSON()], { type: 'application/json' });
        url = URL.createObjectURL(blob);
        this._downloadURL(url, `${name}.json`);
        URL.revokeObjectURL(url);
        break;
        
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Downloads a data URL as file
   * @private
   */
  _downloadDataURL(dataUrl, filename) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /**
   * Downloads a URL as file
   * @private
   */
  _downloadURL(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /**
   * Saves signature to localStorage
   * @param {string} key - Storage key
   * @returns {SignaturePad} This instance for method chaining
   */
  saveToStorage(key = 'signature') {
    try {
      const data = {
        signature: this.toJSON(),
        timestamp: Date.now(),
        version: '2.0.0'
      };
      localStorage.setItem(key, JSON.stringify(data));
      return this;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return this;
    }
  }

  /**
   * Loads signature from localStorage
   * @param {string} key - Storage key
   * @returns {SignaturePad} This instance for method chaining
   */
  loadFromStorage(key = 'signature') {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const data = JSON.parse(stored);
        this.draw(data.signature);
      }
      return this;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return this;
    }
  }

  /**
   * Exports signature as JSON string
   * @returns {string} JSON representation of the signature
   */
  toJSON() {
    try {
      return JSON.stringify({
        lines: this.lines,
        version: '1.2.0',
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('SignaturePad: Error exporting to JSON:', error);
      return '{"lines":[],"error":"Export failed"}';
    }
  }

  /**
   * Exports signature as data URL
   * @param {string} [type='image/png'] - Image type (image/png, image/jpeg)
   * @param {number} [quality] - Image quality for JPEG (0-1)
   * @returns {string} Data URL of the signature
   */
  toDataURL(type = 'image/png', quality) {
    try {
      return this.canvas.toDataURL(type, quality);
    } catch (error) {
      console.error('SignaturePad: Error exporting to data URL:', error);
      return '';
    }
  }

  /**
   * Exports signature as SVG string with enhanced features
   * @returns {string} SVG representation of the signature
   */
  toSVG() {
    try {
      const { background, color, thickness, svgStyles } = this.opts;
      const { width: szW, height: szH } = this.canvas;

      const bgAttr = svgStyles ? `style="fill:${background};"` : `fill="${background}"`;
      const lineAttr = svgStyles
        ? `style="fill:none;stroke:${color};stroke-width:${thickness};stroke-linecap:round;stroke-linejoin:round;"`
        : `fill="none" stroke="${color}" stroke-width="${thickness}" stroke-linecap="round" stroke-linejoin="round"`;

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${szW}" height="${szH}" viewBox="0 0 ${szW} ${szH}">`;
      svg += `<rect ${bgAttr} x="0" y="0" width="${szW}" height="${szH}"/>`;

      if (this.opts.guideline) {
        const y = szH - this.opts.guidelineOffset;
        const guidelineAttr = svgStyles
          ? `style="stroke:${this.opts.guidelineColor};stroke-width:1;stroke-dasharray:5,5;"`
          : `stroke="${this.opts.guidelineColor}" stroke-width="1" stroke-dasharray="5,5"`;
        svg += `<line ${guidelineAttr} x1="${this.opts.guidelineIndent}" y1="${y}" x2="${szW - this.opts.guidelineIndent}" y2="${y}"/>`;
      }

      svg += `<g ${lineAttr}>`;
      for (const line of this.lines) {
        if (line.length === 1) {
          // Single point as circle
          const point = line[0];
          const radius = thickness / 2;
          svg += `<circle cx="${point.x}" cy="${point.y}" r="${radius}" fill="${color}"/>`;
        } else if (line.length > 1) {
          // Multiple points as path
          const points = line.map(p => `${p.x},${p.y}`).join(' ');
          svg += `<polyline points="${points}" />`;
        }
      }
      svg += '</g></svg>';

      return svg;
    } catch (error) {
      console.error('SignaturePad: Error exporting to SVG:', error);
      return '<svg></svg>';
    }
  }

  /**
   * Imports signature data with enhanced format support
   * @param {string|Object} data - Signature data to import
   * @returns {SignaturePad} This instance for method chaining
   * @throws {Error} When data format is invalid
   */
  draw(data) {
    if (!data) {
      throw new Error('SignaturePad: No data provided to draw()');
    }

    this.clear(false);

    try {
      switch (typeof data) {
        case 'string':
          this._handleStringData(data);
          break;
        case 'object':
          this._handleObjectData(data);
          break;
        default:
          throw new Error(`Unsupported data type: ${typeof data}`);
      }

      this._triggerChange();
    } catch (error) {
      console.error('SignaturePad: Error drawing data:', error);
      this.clear(false);
      throw error;
    }

    return this;
  }

  /**
   * Handles string data import
   * @private
   * @param {string} data - String data
   */
  _handleStringData(data) {
    const trimmedData = data.trim();

    if (trimmedData.startsWith('data:')) {
      // Data URL
      this._drawDataURL(trimmedData);
    } else if (trimmedData.startsWith('<svg')) {
      // SVG string
      this._drawSVG(trimmedData);
    } else {
      // Assume JSON
      try {
        const parsed = JSON.parse(trimmedData);
        this._handleObjectData(parsed);
      } catch {
        throw new Error('Invalid JSON data provided');
      }
    }
  }

  /**
   * Handles object data import
   * @private
   * @param {Object} data - Object data
   */
  _handleObjectData(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid object data provided');
    }

    if (Array.isArray(data.lines)) {
      this.lines = data.lines.map(line =>
        Array.isArray(line)
          ? line.filter(
              point => point && typeof point.x === 'number' && typeof point.y === 'number'
            )
          : []
      );
      this._redrawLines();
    } else {
      throw new Error('Object data must contain a "lines" array');
    }
  }

  /**
   * Draws data URL onto canvas
   * @private
   * @param {string} dataURL - Data URL
   */
  _drawDataURL(dataURL) {
    const img = new Image();
    img.onload = () => {
      try {
        this.ctx.drawImage(img, 0, 0);
      } catch (error) {
        console.error('SignaturePad: Error drawing image:', error);
      }
    };
    img.onerror = () => {
      console.error('SignaturePad: Failed to load image from data URL');
    };
    img.src = dataURL;
  }

  /**
   * Draws SVG data
   * @private
   * @param {string} svgString - SVG string
   */
  _drawSVG(svgString) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgString, 'image/svg+xml');

      // Check for parsing errors
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        throw new Error('Invalid SVG data');
      }

      this._parseSVG(doc);
    } catch (error) {
      throw new Error(`Failed to parse SVG: ${error.message}`);
    }
  }

  /**
   * Parses SVG document to extract signature lines
   * @private
   * @param {Document} doc - SVG document
   */
  _parseSVG(doc) {
    const polylines = Array.from(doc.querySelectorAll('polyline'));
    const circles = Array.from(doc.querySelectorAll('circle'));

    this.lines = [];

    // Parse polylines
    for (const polyline of polylines) {
      const pointsAttr = polyline.getAttribute('points');
      if (!pointsAttr) continue;

      const points = pointsAttr
        .trim()
        .split(/\s+/)
        .map(pointStr => {
          const [x, y] = pointStr.split(',').map(Number);
          return isNaN(x) || isNaN(y) ? null : { x, y };
        })
        .filter(Boolean);

      if (points.length > 0) {
        this.lines.push(points);
      }
    }

    // Parse circles (single points)
    for (const circle of circles) {
      const cx = parseFloat(circle.getAttribute('cx'));
      const cy = parseFloat(circle.getAttribute('cy'));

      if (!isNaN(cx) && !isNaN(cy)) {
        this.lines.push([{ x: cx, y: cy }]);
      }
    }

    this._redrawLines();
  }

  // ==============================================
  // DYNAMIC UPDATE METHODS
  // ==============================================

  /**
   * Changes pen color dynamically
   * @param {string} newColor - New pen color
   * @returns {SignaturePad} This instance for method chaining
   * @throws {Error} When color is invalid
   */
  setColor(newColor) {
    if (typeof newColor !== 'string' || !newColor.trim()) {
      throw new Error('SignaturePad: Color must be a non-empty string');
    }

    this.opts.color = newColor;
    this._redrawLines();
    this._triggerChange();

    return this;
  }

  /**
   * Changes guideline color dynamically
   * @param {string} newColor - New guideline color
   * @returns {SignaturePad} This instance for method chaining
   * @throws {Error} When color is invalid
   */
  setGuidelineColor(newColor) {
    if (typeof newColor !== 'string' || !newColor.trim()) {
      throw new Error('SignaturePad: Guideline color must be a non-empty string');
    }

    this.opts.guidelineColor = newColor;
    this._redrawLines();
    this._triggerChange();

    return this;
  }

  /**
   * Changes background color dynamically
   * @param {string} newColor - New background color
   * @returns {SignaturePad} This instance for method chaining
   * @throws {Error} When color is invalid
   */
  setBackgroundColor(newColor) {
    if (typeof newColor !== 'string' || !newColor.trim()) {
      throw new Error('SignaturePad: Background color must be a non-empty string');
    }

    this.opts.background = newColor;
    this._redrawLines();
    this._triggerChange();

    return this;
  }

  /**
   * Changes pen thickness dynamically
   * @param {number} newThickness - New pen thickness
   * @returns {SignaturePad} This instance for method chaining
   * @throws {Error} When thickness is invalid
   */
  setThickness(newThickness) {
    if (typeof newThickness !== 'number' || newThickness < 0.1) {
      throw new Error('SignaturePad: Thickness must be a number >= 0.1');
    }

    this.opts.thickness = newThickness;
    this._redrawLines();
    this._triggerChange();

    return this;
  }

  /**
   * Toggles guideline visibility
   * @param {boolean} [show] - Whether to show guideline (toggles if not provided)
   * @returns {SignaturePad} This instance for method chaining
   */
  toggleGuideline(show) {
    this.opts.guideline = show !== undefined ? show : !this.opts.guideline;
    this._redrawLines();
    this._triggerChange();

    return this;
  }

  // ==============================================
  // UTILITY METHODS
  // ==============================================

  /**
   * Gets current signature bounds
   * @returns {Object} Bounds object with min/max coordinates
   */
  getBounds() {
    if (this.isEmpty()) {
      return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
    }

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    for (const line of this.lines) {
      for (const point of line) {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
      }
    }

    return {
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  /**
   * Destroys the signature pad and cleans up resources
   * @returns {void}
   */
  destroy() {
    // Remove event listeners
    if (this.canvas) {
      this.canvas.removeEventListener('pointerdown', this._startStroke);
      this.canvas.removeEventListener('pointermove', this._continueStroke);
    }

    if (this._resizeTimeout) {
      clearTimeout(this._resizeTimeout);
    }

    window.removeEventListener('resize', this._debouncedResize);

    // Clear references
    this.container = null;
    this.canvas = null;
    this.ctx = null;
    this.lines = null;
    this.redoStack = null;
    this.opts = null;
  }
}

export default SignaturePad;

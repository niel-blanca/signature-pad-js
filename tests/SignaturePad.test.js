const { default: SignaturePad } = require('../dist/signature-pad.cjs.js');

describe('SignaturePad', () => {
  let container;
  let signaturePad;

  beforeEach(() => {
    // Create a DOM container for each test
    container = document.createElement('div');
    container.style.width = '400px';
    container.style.height = '200px';
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Clean up after each test
    if (signaturePad) {
      signaturePad = null;
    }
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  });

  describe('Constructor', () => {
    test('should create a signature pad with default options', () => {
      signaturePad = new SignaturePad(container);

      expect(signaturePad.container).toBe(container);
      expect(signaturePad.canvas).toBeInstanceOf(HTMLCanvasElement);
      expect(signaturePad.lines).toEqual([]);
      expect(signaturePad.redoStack).toEqual([]);
    });

    test('should accept custom options', () => {
      const options = {
        background: '#f0f0f0',
        color: '#ff0000',
        thickness: 5,
        guideline: true,
        undoLimit: 20
      };

      signaturePad = new SignaturePad(container, options);

      expect(signaturePad.opts.background).toBe('#f0f0f0');
      expect(signaturePad.opts.color).toBe('#ff0000');
      expect(signaturePad.opts.thickness).toBe(5);
      expect(signaturePad.opts.guideline).toBe(true);
      expect(signaturePad.opts.undoLimit).toBe(20);
    });
  });

  describe('Drawing Methods', () => {
    beforeEach(() => {
      signaturePad = new SignaturePad(container);
    });

    test('should clear the signature pad', () => {
      signaturePad.lines = [{ x: 10, y: 10 }];
      signaturePad.redoStack = [{ x: 20, y: 20 }];

      signaturePad.clear();

      expect(signaturePad.lines).toEqual([]);
      expect(signaturePad.redoStack).toEqual([]);
    });

    test('should report if signature pad is empty', () => {
      expect(signaturePad.isEmpty()).toBe(true);

      signaturePad.lines = [{ x: 10, y: 10 }];
      expect(signaturePad.isEmpty()).toBe(false);
    });

    test('should perform undo operation', () => {
      const testLine = [
        { x: 10, y: 10 },
        { x: 20, y: 20 }
      ];
      signaturePad.lines = [testLine];

      signaturePad.undo();

      expect(signaturePad.lines).toEqual([]);
      expect(signaturePad.redoStack).toEqual([testLine]);
    });

    test('should perform redo operation', () => {
      const testLine = [
        { x: 10, y: 10 },
        { x: 20, y: 20 }
      ];
      signaturePad.redoStack = [testLine];

      signaturePad.redo();

      expect(signaturePad.lines).toEqual([testLine]);
      expect(signaturePad.redoStack).toEqual([]);
    });

    test('should not undo when no lines exist', () => {
      expect(signaturePad.lines).toEqual([]);

      signaturePad.undo();

      expect(signaturePad.lines).toEqual([]);
      expect(signaturePad.redoStack).toEqual([]);
    });

    test('should not redo when redo stack is empty', () => {
      expect(signaturePad.redoStack).toEqual([]);

      signaturePad.redo();

      expect(signaturePad.lines).toEqual([]);
      expect(signaturePad.redoStack).toEqual([]);
    });
  });

  describe('Export Methods', () => {
    beforeEach(() => {
      signaturePad = new SignaturePad(container);
    });

    test('should export to JSON', () => {
      const testLines = [
        [
          { x: 10, y: 10 },
          { x: 20, y: 20 }
        ]
      ];
      signaturePad.lines = testLines;

      const json = signaturePad.toJSON();
      const parsed = JSON.parse(json);

      expect(parsed.lines).toEqual(testLines);
    });

    test('should export to data URL', () => {
      const dataURL = signaturePad.toDataURL();
      expect(dataURL).toMatch(/^data:image\/png;base64,/);
    });

    test('should export to data URL with custom format', () => {
      const dataURL = signaturePad.toDataURL('image/jpeg', 0.8);
      expect(dataURL).toMatch(/^data:image\/png;base64,/); // Mocked to return PNG
    });

    test('should export to SVG', () => {
      const testLines = [
        [
          { x: 10, y: 10 },
          { x: 20, y: 20 }
        ]
      ];
      signaturePad.lines = testLines;

      const svg = signaturePad.toSVG();

      expect(svg).toMatch(/^<svg/);
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(svg).toContain('</svg>');
    });
  });

  describe('Dynamic Color Updates', () => {
    beforeEach(() => {
      signaturePad = new SignaturePad(container);
    });

    test('should change pen color dynamically', () => {
      const newColor = '#ff0000';

      signaturePad.setColor(newColor);

      expect(signaturePad.opts.color).toBe(newColor);
    });

    test('should change guideline color dynamically', () => {
      const newColor = '#00ff00';

      signaturePad.setGuidelineColor(newColor);

      expect(signaturePad.opts.guidelineColor).toBe(newColor);
    });
  });

  describe('Data Import', () => {
    beforeEach(() => {
      signaturePad = new SignaturePad(container);
    });

    test('should import JSON data', () => {
      const testData = {
        lines: [
          [
            { x: 10, y: 10 },
            { x: 20, y: 20 }
          ]
        ]
      };
      const jsonString = JSON.stringify(testData);

      signaturePad.draw(jsonString);

      expect(signaturePad.lines).toEqual(testData.lines);
    });

    test('should import object data', () => {
      const testData = {
        lines: [
          [
            { x: 10, y: 10 },
            { x: 20, y: 20 }
          ]
        ]
      };

      signaturePad.draw(testData);

      expect(signaturePad.lines).toEqual(testData.lines);
    });

    test('should handle data URL import', () => {
      const dataURL =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

      // Should not throw error
      expect(() => {
        signaturePad.draw(dataURL);
      }).not.toThrow();
    });
  });

  describe('Sync Field Integration', () => {
    beforeEach(() => {
      signaturePad = new SignaturePad(container);
    });

    test('should sync with input field in JSON format', () => {
      const syncField = document.createElement('input');
      signaturePad.opts.syncField = syncField;
      signaturePad.opts.syncFormat = 'JSON';

      const testData = { lines: [[{ x: 10, y: 10 }]] };
      signaturePad.lines = testData.lines;
      signaturePad._triggerChange();

      const parsedValue = JSON.parse(syncField.value);
      expect(parsedValue.lines).toEqual(testData.lines);
      expect(parsedValue.version).toBe('1.2.0');
      expect(typeof parsedValue.timestamp).toBe('number');
    });

    test('should sync with input field in PNG format', () => {
      const syncField = document.createElement('input');
      signaturePad.opts.syncField = syncField;
      signaturePad.opts.syncFormat = 'PNG';

      signaturePad._triggerChange();

      expect(syncField.value).toMatch(/^data:image\/png;base64,/);
    });
  });

  describe('Event Callbacks', () => {
    beforeEach(() => {
      signaturePad = new SignaturePad(container);
    });

    test('should call onChange callback when triggered', () => {
      const onChange = jest.fn();
      signaturePad.opts.onChange = onChange;

      signaturePad._triggerChange();

      expect(onChange).toHaveBeenCalledWith(signaturePad);
    });
  });

  describe('Error Handling', () => {
    test('should throw error with invalid container', () => {
      expect(() => {
        new SignaturePad(null);
      }).toThrow('SignaturePad: Container must be a valid HTMLElement');
    });

    test('should throw error with invalid undoLimit', () => {
      expect(() => {
        new SignaturePad(container, { undoLimit: 0 });
      }).toThrow('SignaturePad: undoLimit must be at least 1');
    });

    test('should throw error with invalid thickness', () => {
      expect(() => {
        new SignaturePad(container, { thickness: 0.05 });
      }).toThrow('SignaturePad: thickness must be at least 0.1');
    });

    test('should throw error with invalid smoothingFactor', () => {
      expect(() => {
        new SignaturePad(container, { smoothingFactor: 1.5 });
      }).toThrow('SignaturePad: smoothingFactor must be between 0 and 1');
    });
  });

  describe('Method Chaining', () => {
    beforeEach(() => {
      signaturePad = new SignaturePad(container);
    });

    test('should support method chaining', () => {
      const result = signaturePad
        .setColor('#ff0000')
        .setThickness(3)
        .setBackgroundColor('#f0f0f0')
        .clear();

      expect(result).toBe(signaturePad);
      expect(signaturePad.opts.color).toBe('#ff0000');
      expect(signaturePad.opts.thickness).toBe(3);
      expect(signaturePad.opts.background).toBe('#f0f0f0');
    });
  });

  describe('Canvas Utilities', () => {
    beforeEach(() => {
      signaturePad = new SignaturePad(container);
    });

    test('should get bounds correctly', () => {
      // Add some mock drawing data
      signaturePad.lines = [
        [
          { x: 10, y: 20 },
          { x: 30, y: 40 }
        ],
        [
          { x: 50, y: 60 },
          { x: 70, y: 80 }
        ]
      ];

      const bounds = signaturePad.getBounds();

      expect(bounds.minX).toBe(10);
      expect(bounds.minY).toBe(20);
      expect(bounds.maxX).toBe(70);
      expect(bounds.maxY).toBe(80);
      expect(bounds.width).toBe(60);
      expect(bounds.height).toBe(60);
    });

    test('should handle empty bounds', () => {
      const bounds = signaturePad.getBounds();

      expect(bounds.minX).toBe(0);
      expect(bounds.minY).toBe(0);
      expect(bounds.maxX).toBe(0);
      expect(bounds.maxY).toBe(0);
      expect(bounds.width).toBe(0);
      expect(bounds.height).toBe(0);
    });
  });
});

declare module '@niel-blanca/signature-pad-js' {
  interface SignaturePadOptions {
    background?: string;
    color?: string;
    thickness?: number;
    guideline?: boolean;
    guidelineColor?: string;
    guidelineOffset?: number;
    guidelineIndent?: number;
    disableResize?: boolean;
    undoLimit?: number;
    syncField?: HTMLInputElement | HTMLTextAreaElement | null;
    syncFormat?: 'JSON' | 'PNG' | 'JPG' | 'JPEG' | 'SVG';
    svgStyles?: boolean;
    smoothing?: boolean;
    smoothingFactor?: number;
    onChange?: (instance: SignaturePad) => void;
    onStrokeStart?: (instance: SignaturePad) => void;
    onStrokeEnd?: (instance: SignaturePad) => void;
  }

  interface Point {
    x: number;
    y: number;
    pressure?: number;
  }

  interface Bounds {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
  }

  interface SignatureData {
    lines: Point[][];
    version?: string;
    timestamp?: number;
  }

  class SignaturePad {
    constructor(container: HTMLElement, options?: SignaturePadOptions);

    // Drawing & Data Management
    clear(trigger?: boolean): SignaturePad;
    undo(): SignaturePad;
    redo(): SignaturePad;
    isEmpty(): boolean;
    draw(data: string | SignatureData): SignaturePad;

    // Data Export
    toJSON(): string;
    toDataURL(type?: 'image/png' | 'image/jpeg' | string, quality?: number): string;
    toSVG(): string;

    // Dynamic Updates (with method chaining)
    setColor(color: string): SignaturePad;
    setGuidelineColor(color: string): SignaturePad;
    setBackgroundColor(color: string): SignaturePad;
    setThickness(thickness: number): SignaturePad;
    toggleGuideline(show?: boolean): SignaturePad;

    // Utility Methods
    getBounds(): Bounds;
    destroy(): void;

    // Properties (readonly)
    readonly container: HTMLElement;
    readonly canvas: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;
    readonly opts: SignaturePadOptions;
    readonly lines: Point[][];
    readonly redoStack: Point[][];
  }

  export = SignaturePad;
}
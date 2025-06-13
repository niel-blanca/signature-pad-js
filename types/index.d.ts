declare module 'signature-pad' {
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
    syncFormat?: 'JSON' | 'PNG' | 'SVG';
    svgStyles?: boolean;
    onChange?: (instance: SignaturePad) => void;
  }

  interface Point {
    x: number;
    y: number;
  }

  class SignaturePad {
    constructor(container: HTMLElement, options?: SignaturePadOptions);

    // Drawing & Data
    clear(trigger?: boolean): void;
    undo(): void;
    redo(): void;
    isEmpty(): boolean;
    draw(data: string | { lines: Point[][] }): void;

    // Data Export
    toJSON(): string;
    toDataURL(type?: 'image/png' | 'image/jpeg' | string, quality?: number): string;
    toSVG(): string;

    // Dynamic Option Updates
    setColor(color: string): void;
    setGuidelineColor(color: string): void;
  }

  export = SignaturePad;
}
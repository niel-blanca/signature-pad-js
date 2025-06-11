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

    clear(trigger?: boolean): void;
    undo(): void;
    isEmpty(): boolean;

    toJSON(): string;
    toDataURL(type?: string, quality?: number): string;
    toSVG(): string;

    draw(data: string | { lines: Point[][] }): void;
  }

  export = SignaturePad;
}
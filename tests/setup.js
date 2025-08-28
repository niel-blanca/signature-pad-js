// Jest setup file
require('jest-environment-jsdom');

// Mock canvas context for testing
global.HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => []),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  fill: jest.fn(),
  arc: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  translate: jest.fn(),
  clip: jest.fn(),
  quadraticCurveTo: jest.fn(),
  setLineDash: jest.fn(),
  createLinearGradient: jest.fn(() => ({
    addColorStop: jest.fn()
  })),
  createRadialGradient: jest.fn(() => ({
    addColorStop: jest.fn()
  })),
  measureText: jest.fn(() => ({ width: 0 }))
}));

// Mock toDataURL
global.HTMLCanvasElement.prototype.toDataURL = jest.fn(() => 'data:image/png;base64,test');

// Mock getBoundingClientRect
global.HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 400,
  height: 200,
  left: 0,
  top: 0,
  right: 400,
  bottom: 200
}));

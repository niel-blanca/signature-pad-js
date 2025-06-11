(() => {
})();
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

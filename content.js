// Allow text selection and remove event listeners that block copy, paste, and right-click.
document.body.style.userSelect = 'auto';

// List of events to unblock
const events = [
  'copy',
  'cut',
  'paste',
  'contextmenu',
  'selectstart',
  'mousedown',
  'mouseup'
];

// Remove event listeners and inline handlers for the listed events
events.forEach(event => {
  document.body.addEventListener(event, e => e.stopPropagation(), true);
  document.body.addEventListener(event, e => e.stopImmediatePropagation(), true);
});

// Remove inline event handlers recursively
function removeInlineHandlers(elem) {
  elem.oncopy = null;
  elem.onpaste = null;
  elem.oncut = null;
  elem.oncontextmenu = null;
  elem.onselectstart = null;
  elem.onmousedown = null;
  elem.onmouseup = null;
  Array.from(elem.children).forEach(removeInlineHandlers);
}
removeInlineHandlers(document.body);

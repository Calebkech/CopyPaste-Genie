// == CopyPaste Genie Advanced & Persistent Unblocker ==

// List of events to unblock
const events = [
  'copy',
  'cut',
  'paste',
  'contextmenu',
  'selectstart',
  'mousedown',
  'mouseup',
  'keydown'
];

// Helper: Unblock on an element
function unblockElement(el) {
  // Remove inline event handlers
  events.forEach(event => {
    el[`on${event}`] = null;
  });

  // Remove CSS user-select restriction
  el.style.userSelect = 'auto';
  el.style.webkitUserSelect = 'auto';
  el.style.MozUserSelect = 'auto';
  el.style.msUserSelect = 'auto';

  // Remove pointer-events:none if present
  if (el.style.pointerEvents && el.style.pointerEvents.toLowerCase() === 'none') {
    el.style.pointerEvents = 'auto';
  }
}

// Helper: Remove event listeners by cloning element
function stripEventListeners(el) {
  // Only clone if the element is not <html> or <body>
  if (el.parentNode && el !== document.body && el !== document.documentElement) {
    const newEl = el.cloneNode(true);
    el.parentNode.replaceChild(newEl, el);
    return newEl;
  }
  return el;
}

// Recursively unblock all elements in the DOM
function recursivelyUnblock(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null);
  let node = root;
  while (node) {
    unblockElement(node);
    node = walker.nextNode();
  }
}

// Attach event listeners to re-allow actions
function attachGlobalAllowEvents() {
  events.forEach(event => {
    document.addEventListener(event, e => {
      e.stopPropagation();
      // Optionally, remove preventDefault
      if (typeof e.cancelable !== 'undefined' && e.cancelable) {
        e.preventDefault();
      }
    }, true);
  });
}

// Initial unblock
function persistentUnblock() {
  recursivelyUnblock(document.body);
  attachGlobalAllowEvents();
}

// Watch for new nodes being added to the DOM
const observer = new MutationObserver(mutations => {
  for (const m of mutations) {
    for (const node of m.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        recursivelyUnblock(node);
      }
    }
  }
});

// Start observing
observer.observe(document.body, { childList: true, subtree: true });

// Run persistent unblocker on page load
document.addEventListener('DOMContentLoaded', persistentUnblock);
window.addEventListener('load', persistentUnblock);

// Also run immediately in case DOMContentLoaded has already fired
persistentUnblock();

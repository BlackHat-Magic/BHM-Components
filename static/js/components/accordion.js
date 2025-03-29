document.addEventListener("alpine:init", () => {
  // Add x-collapse directive if not included in Alpine
  if (!window.Alpine.directive('collapse')) {
    window.Alpine.directive('collapse', (el, { modifiers, expression }, { evaluate }) => {
      const duration = modifiers.includes('slow') ? 500 : (modifiers.includes('fast') ? 150 : 300);
      
      if (el._x_isShown === undefined) el._x_isShown = true;
      
      if (el._x_isShown) {
        el.style.overflow = 'hidden';
        el.style.maxHeight = `${el.scrollHeight}px`;
        el.style.transition = `max-height ${duration}ms ease-out`;
        
        setTimeout(() => {
          el.style.maxHeight = '0px';
          setTimeout(() => {
            el._x_isShown = false;
          }, duration);
        }, 5);
      } else {
        el._x_isShown = true;
        el.style.maxHeight = '0px';
        
        setTimeout(() => {
          el.style.maxHeight = `${el.scrollHeight}px`;
          setTimeout(() => {
            el.style.overflow = '';
            el.style.maxHeight = '';
          }, duration);
        }, 5);
      }
    });
  }
});

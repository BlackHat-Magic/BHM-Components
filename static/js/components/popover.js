document.addEventListener("alpine:init", () => {
    Alpine.data(
      "popoverComponent",
      ({ arrow = true, offset = 8, initialPosition = "auto" }) => ({
        open: false,
        position: initialPosition, // 'top', 'bottom', or 'auto' initially
        arrow: arrow,
        offset: offset,
        triggerEl: null,
        panelEl: null,
  
        init() {
          this.triggerEl = this.$refs.trigger.firstElementChild || this.$refs.trigger; // Get the actual trigger element
          this.panelEl = this.$refs.panel;
  
          // If auto, determine initial best guess (can be refined when opened)
          if (this.position === "auto") {
            this.position = this.calculateBestPosition();
          }
  
          // Watch for open state changes to recalculate position
          this.$watch("open", (isOpen) => {
            if (isOpen) {
              this.position = this.calculateBestPosition();
              // Optional: Focus first focusable element inside popover
              this.$nextTick(() => {
                const firstFocusable = this.panelEl.querySelector(
                  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
                );
                firstFocusable?.focus();
              });
            }
          });
  
          // Optional: Recalculate on resize if popover is open
          window.addEventListener("resize", () => {
            if (this.open) {
              this.position = this.calculateBestPosition();
            }
          });
        },
  
        toggle() {
          this.open = !this.open;
        },
  
        close() {
          this.open = false;
        },
  
        calculateBestPosition() {
          if (initialPosition !== "auto") {
            return initialPosition; // Respect initial preference if not 'auto'
          }
          if (!this.triggerEl || !this.panelEl) {
            return "bottom"; // Default if elements aren't ready
          }
  
          const triggerRect = this.triggerEl.getBoundingClientRect();
          const panelHeight = this.panelEl.offsetHeight; // Get current height
          const viewportHeight = window.innerHeight;
  
          const spaceBelow = viewportHeight - triggerRect.bottom - this.offset;
          const spaceAbove = triggerRect.top - this.offset;
  
          // Prefer bottom, but switch to top if not enough space below
          // and there's more space above
          if (spaceBelow < panelHeight && spaceAbove > spaceBelow) {
            return "top";
          }
          return "bottom";
        },
      }),
    );
  });
  
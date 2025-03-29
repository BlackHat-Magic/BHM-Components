document.addEventListener("alpine:init", () => {
    Alpine.data("hoverCardComponent", ({ enterDelay = 600, leaveDelay = 300 }) => ({
      open: false,
      enterTimeout: null,
      leaveTimeout: null,
      enterDelayMs: enterDelay,
      leaveDelayMs: leaveDelay,
  
      enter() {
        // Clear any pending leave action
        clearTimeout(this.leaveTimeout);
        this.leaveTimeout = null;
  
        // If already open or enter timer already running, do nothing
        if (this.open || this.enterTimeout) {
          return;
        }
  
        // Start timer to open
        this.enterTimeout = setTimeout(() => {
          this.open = true;
          this.enterTimeout = null; // Clear timer ID once done
        }, this.enterDelayMs);
      },
  
      leave() {
        // Clear any pending enter action
        clearTimeout(this.enterTimeout);
        this.enterTimeout = null;
  
        // If already closed or leave timer already running, do nothing
        if (!this.open || this.leaveTimeout) {
          return;
        }
  
        // Start timer to close
        this.leaveTimeout = setTimeout(() => {
          this.open = false;
          this.leaveTimeout = null; // Clear timer ID once done
        }, this.leaveDelayMs);
      },
    }));
  });
  
document.addEventListener("alpine:init", () => {
    Alpine.data(
      "tabsComponent",
      ({ initialIndex = 0, orientation = "horizontal", style = "marker" }) => ({
        selectedIndex: initialIndex,
        orientation: orientation,
        style: style,
        markerStyle: {
          width: "0px",
          height: "0px",
          left: "0px",
          top: "0px",
          opacity: 0, // Start hidden until positioned
        },
        tablistEl: null,
        markerEl: null,
        tabs: [], // Array of button elements
  
        init(idBase) {
          this.tablistEl = this.$refs.tablist;
          this.markerEl = this.$refs.marker; // Might be null if style !== 'marker'
          this.tabs = Array.from(this.tablistEl.querySelectorAll('[role="tab"]'));
  
          // Ensure initial selection is valid
          if (this.selectedIndex < 0 || this.selectedIndex >= this.tabs.length) {
            this.selectedIndex = 0;
          }
  
          // Set initial marker position after elements are rendered
          this.$nextTick(() => {
            if (this.style === "marker" && this.tabs.length > 0) {
              this.repositionMarker(this.tabs[this.selectedIndex]);
              // Make marker visible after initial positioning
              setTimeout(() => { this.markerStyle.opacity = 1; }, 50); 
            }
          });
  
          // Optional: Reposition marker on resize
          // Using ResizeObserver is better but adds complexity.
          // Window resize is simpler but less precise.
          let resizeTimeout;
          window.addEventListener("resize", () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
              if (this.style === "marker" && this.tabs.length > 0) {
                this.repositionMarker(this.tabs[this.selectedIndex]);
              }
            }, 150); 
          });
        },
  
        selectTab(index, buttonEl) {
          if (index === this.selectedIndex) return; // No change
          this.selectedIndex = index;
          if (this.style === "marker") {
            this.repositionMarker(buttonEl);
          }
        },
  
        repositionMarker(buttonEl) {
          if (!buttonEl || !this.markerEl) return;
  
          this.markerStyle.width = `${buttonEl.offsetWidth}px`;
          this.markerStyle.height = `${buttonEl.offsetHeight}px`;
          this.markerStyle.left = `${buttonEl.offsetLeft}px`;
          this.markerStyle.top = `${buttonEl.offsetTop}px`;
        },
  
        isActiveTab(index) {
          return this.selectedIndex === index;
        },
  
        isActivePanel(index) {
          return this.selectedIndex === index;
        },
      }),
    );
  });
  
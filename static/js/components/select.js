document.addEventListener("alpine:init", () => {
    Alpine.data(
      "selectComponent",
      ({ options, initialValue, placeholder, name }) => ({
        open: false,
        value: initialValue || "", // The actual selected value (for hidden input)
        displayValue: placeholder, // Text shown on the button
        activeValue: null, // Value of the highlighted option (keyboard/mouse)
        originalOptions: options, // Keep original list for filtering/reset
        options: options, // The potentially filtered list shown
        position: "bottom",
        search: "",
        searchTimeout: null,
        refs: {}, // To store $refs
  
        init() {
          this.refs = this.$refs; // Store refs for easier access
          const selected = this.getOptionByValue(this.value);
          if (selected) {
            this.displayValue = selected.title;
          } else {
            this.value = ""; // Ensure value is empty if initialValue is invalid
            this.displayValue = placeholder;
          }
  
          this.$watch("open", (isOpen) => {
            if (isOpen) {
              this.calculatePosition();
              this.ensureActiveVisible();
              // Reset search on open
              this.search = "";
              this.options = this.originalOptions;
            } else {
              // Reset active item visually when closing
              this.clearActiveOption();
            }
          });
  
          this.$watch("value", (newValue) => {
            const selected = this.getOptionByValue(newValue);
            this.displayValue = selected ? selected.title : placeholder;
          });
  
          window.addEventListener("resize", () => {
            if (this.open) this.calculatePosition();
          });
        },
  
        toggle() {
          this.open = !this.open;
        },
  
        close() {
          this.open = false;
        },
  
        focusTrigger() {
          this.refs.trigger.focus();
        },
  
        getOptionByValue(val) {
          // Use originalOptions to find display text even if list is filtered
          return this.originalOptions.find((opt) => opt.value === val);
        },
  
        getActiveOption() {
          return this.options.find((opt) => opt.value === this.activeValue);
        },
  
        isActive(val) {
          return this.activeValue === val;
        },
  
        isSelected(val) {
          return this.value === val;
        },
  
        selectOption(option) {
          if (option.disabled) return;
          this.value = option.value;
          // displayValue is updated by the $watch('value', ...)
          this.close();
        },
  
        selectActive() {
          const active = this.getActiveOption();
          if (active) {
            this.selectOption(active);
          }
        },
  
        setActiveOption(option) {
          if (option.disabled) return;
          this.activeValue = option.value;
        },
  
        setActiveByIndex(index) {
          const targetOption = this.options[index];
          if (targetOption && !targetOption.disabled) {
            this.activeValue = targetOption.value;
            this.ensureActiveVisible();
          }
        },
  
        clearActiveOption() {
          this.activeValue = null;
        },
  
        moveActive(direction) {
          if (!this.open) return this.open = true; // Open if closed
  
          const currentActiveIndex = this.options.findIndex(
            (opt) => opt.value === this.activeValue,
          );
          let nextIndex = currentActiveIndex + direction;
  
          // Loop around
          if (nextIndex < 0) nextIndex = this.options.length - 1;
          if (nextIndex >= this.options.length) nextIndex = 0;
  
          // Skip disabled options
          let attempts = 0;
          while (this.options[nextIndex]?.disabled && attempts < this.options.length) {
            nextIndex += direction;
            if (nextIndex < 0) nextIndex = this.options.length - 1;
            if (nextIndex >= this.options.length) nextIndex = 0;
            attempts++;
          }
  
          this.setActiveByIndex(nextIndex);
        },
  
        ensureActiveVisible() {
          this.$nextTick(() => {
            const activeElement = this.refs.menu.querySelector(
              `#${this.$id('option')}-${this.activeValue}`, // Use Alpine's $id helper if needed, or construct ID
            );
            if (activeElement) {
              this.refs.menu.scrollTop =
                activeElement.offsetTop -
                this.refs.menu.offsetTop -
                this.refs.menu.offsetHeight / 2 +
                activeElement.offsetHeight / 2;
            }
          });
        },
  
        handleSearch(event) {
          // Allow navigation keys without triggering search
          if ([13, 27, 38, 40, 35, 36].includes(event.keyCode)) return;
  
          // Basic alphanumeric search
          if (event.key && event.key.length === 1 && event.key.match(/\S/)) {
            this.search += event.key.toLowerCase();
  
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => (this.search = ""), 1000);
  
            // Filter options (simple startswith)
            this.options = this.originalOptions.filter((opt) =>
              opt.title.toLowerCase().startsWith(this.search),
            );
  
            // Set active to the first match if available
            const firstMatch = this.options.find((opt) => !opt.disabled);
            this.activeValue = firstMatch ? firstMatch.value : null;
            this.ensureActiveVisible();
          }
        },
  
        calculatePosition() {
          const triggerRect = this.refs.trigger.getBoundingClientRect();
          const menuHeight = this.refs.menu.offsetHeight;
          const viewportHeight = window.innerHeight;
          const spaceBelow = viewportHeight - triggerRect.bottom;
  
          if (spaceBelow < menuHeight && triggerRect.top > menuHeight) {
            this.position = "top";
          } else {
            this.position = "bottom";
          }
        },
      }),
    );
  });
  
function showBanner(message, type = "info", duration = 5000) {
    // ... (banner JS code from previous answer) ...
}

// --- Datepicker ---
document.addEventListener("alpine:init", () => {
    Alpine.data("datepickerComponent", ({ initialValue, displayFormat, inputName }) => ({
        open: false,
        displayValue: "", // Value shown in the visible input (formatted)
        standardValue: "", // Value for hidden input (YYYY-MM-DD)
        currentMonth: new Date().getMonth(),
        currentYear: new Date().getFullYear(),
        selectedDate: null, // Store the selected Date object
        monthNames: [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December",
        ],
        dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        daysInMonth: [],
        blankDays: [],

        initPicker() {
            let dateToInit = new Date(); // Default to today
            if (initialValue) {
            // Try parsing YYYY-MM-DD first, then other common formats
            const parts = initialValue.split("-");
            if (parts.length === 3 && !isNaN(Date.parse(initialValue))) {
                dateToInit = new Date(
                parseInt(parts[0]),
                parseInt(parts[1]) - 1,
                parseInt(parts[2]),
                );
            } else {
                // Fallback parsing (less reliable)
                const parsed = Date.parse(initialValue);
                if (!isNaN(parsed)) {
                dateToInit = new Date(parsed);
                }
            }
            }

            // If initialValue was provided and valid, set it as selected
            if (initialValue && !isNaN(dateToInit.getTime())) {
            this.selectedDate = dateToInit;
            this.currentMonth = this.selectedDate.getMonth();
            this.currentYear = this.selectedDate.getFullYear();
            this.updateValues(this.selectedDate);
            } else {
            // Otherwise, just set the view to today/initial month/year
            this.currentMonth = dateToInit.getMonth();
            this.currentYear = dateToInit.getFullYear();
            }

            this.calculateDays();

            // Watch for external changes to the standardValue (e.g., via JS)
            this.$watch("standardValue", (newValue) => {
            if (!newValue) {
                this.selectedDate = null;
                this.displayValue = "";
                // Optionally reset view to today if value is cleared
                // this.currentMonth = new Date().getMonth();
                // this.currentYear = new Date().getFullYear();
                // this.calculateDays();
                return;
            }
            const parts = newValue.split("-");
            if (parts.length === 3) {
                const newDate = new Date(
                parseInt(parts[0]),
                parseInt(parts[1]) - 1,
                parseInt(parts[2]),
                );
                if (!isNaN(newDate.getTime())) {
                this.selectedDate = newDate;
                this.displayValue = this.formatDate(newDate, displayFormat);
                // Optionally update calendar view if needed
                // this.currentMonth = newDate.getMonth();
                // this.currentYear = newDate.getFullYear();
                // this.calculateDays();
                }
            }
            });
        },

        calculateDays() {
            const days = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
            const startDayOfWeek = new Date(this.currentYear, this.currentMonth, 1).getDay();

            this.blankDays = Array.from({ length: startDayOfWeek }, (_, i) => i + 1);
            this.daysInMonth = Array.from({ length: days }, (_, i) => i + 1);
        },

        previousMonth() {
            if (this.currentMonth === 0) {
            this.currentMonth = 11;
            this.currentYear--;
            } else {
            this.currentMonth--;
            }
            this.calculateDays();
        },

        nextMonth() {
            if (this.currentMonth === 11) {
            this.currentMonth = 0;
            this.currentYear++;
            } else {
            this.currentMonth++;
            }
            this.calculateDays();
        },

        selectDay(day) {
            this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
            this.updateValues(this.selectedDate);
            this.open = false;
        },

        updateValues(date) {
            this.displayValue = this.formatDate(date, displayFormat);
            this.standardValue = this.formatDate(date, "YYYY-MM-DD"); // Always store YYYY-MM-DD
        },

        isToday(day) {
            const today = new Date();
            const d = new Date(this.currentYear, this.currentMonth, day);
            return today.toDateString() === d.toDateString();
        },

        isSelected(day) {
            if (!this.selectedDate) return false;
            const d = new Date(this.currentYear, this.currentMonth, day);
            return this.selectedDate.toDateString() === d.toDateString();
        },

        getFormattedDayLabel(day) {
            const d = new Date(this.currentYear, this.currentMonth, day);
            return this.formatDate(d, "M d, Y"); // Format for ARIA label
        },

        formatDate(date, format) {
            if (!date || isNaN(date.getTime())) return ""; // Handle invalid date

            const day = date.getDate();
            const month = date.getMonth();
            const year = date.getFullYear();

            const M = this.monthNames[month].substring(0, 3);
            const MM = String(month + 1).padStart(2, "0");
            const Month = this.monthNames[month];
            const d = String(day);
            const dd = String(day).padStart(2, "0");
            const YYYY = String(year);

            switch (format) {
            case "MM/DD/YYYY": return `${MM}/${dd}/${YYYY}`;
            case "DD.MM.YYYY": return `${dd}.${MM}.${YYYY}`;
            case "M d, Y": return `${M} ${d}, ${YYYY}`;
            case "YYYY-MM-DD": // Fallthrough
            default: return `${YYYY}-${MM}-${dd}`;
            }
        },
      })
    );
});

// --- Hovercard ---
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
        }
    }));
});

// --- Popover ---
document.addEventListener("alpine:init", () => {
    Alpine.data("popoverComponent", ({ arrow = true, offset = 8, initialPosition = "auto" }) => ({
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
    }));
});

// --- Tabs ---
document.addEventListener("alpine:init", () => {
    Alpine.data("selectComponent", ({ options, initialValue, placeholder, name }) => ({
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
    }));
});

// --- Tabs ---
document.addEventListener("alpine:init", () => {
    Alpine.data("tabsComponent", ({ initialIndex = 0, orientation = "horizontal", style = "marker" }) => ({
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
    }));
});

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

console.log("Flask Components JS Initialized");
  
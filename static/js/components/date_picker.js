document.addEventListener("alpine:init", () => {
    Alpine.data(
      "datepickerComponent",
      ({ initialValue, displayFormat, inputName }) => ({
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
      }),
    );
  });
  
<script setup lang="ts">
import { ref, computed } from 'vue';

const props = withDefaults(
  defineProps<{
    label: string;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    required?: boolean;
    readOnly?: boolean;
    minDate?: string;
    maxDate?: string;
  }>(),
  {
    placeholder: 'Choose a date',
    disabled: false,
    error: '',
    required: false,
    readOnly: false,
  }
);

const emit = defineEmits<{
  'on-change': [date: string];
  'on-clear': [];
}>();

const selectedDate = ref<string | null>(null);
const showPicker = ref<boolean>(false);
const showYearSelector = ref<boolean>(false);
const showMonthSelector = ref<boolean>(false);
const currentMonth = ref<number>(new Date().getMonth());
const currentYear = ref<number>(new Date().getFullYear());
const years = computed(() => Array.from({ length: 20 }, (_, i) => currentYear.value - 10 + i));
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const daysInMonth = computed(() => {
  const days = [];
  const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay();
  const totalDays = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
  for (let i = 0; i < firstDay; i++) days.push({ day: '', disabled: true });
  for (let i = 1; i <= totalDays; i++) {
    const date = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    days.push({ day: i, date, disabled: isDateDisabled(date) });
  }
  return days;
});

const isDateDisabled = (date: string) => {
  if (props.minDate && date < props.minDate) return true;
  if (props.maxDate && date > props.maxDate) return true;
  return false;
};

const handleDateSelect = (date: string) => {
  if (!isDateDisabled(date)) {
    selectedDate.value = date;
    emit('on-change', date);
    showPicker.value = false;
  }
};

const togglePicker = () => {
  if (!props.disabled && !props.readOnly) {
    showPicker.value = !showPicker.value;
  }
};

const selectYear = (year: number) => {
  currentYear.value = year;
  showYearSelector.value = false;
};

const selectMonth = (monthIndex: number) => {
  currentMonth.value = monthIndex;
  showMonthSelector.value = false;
};
</script>

<template>
  <div class="calendar-container">
    <label v-if="props.label" class="calendar-label">
      {{ props.label }} <span v-if="props.required" class="required">*</span>
    </label>
    <div class="calendar-input" @click="togglePicker">
      <input :value="selectedDate || props.placeholder" readonly :disabled="props.disabled || props.readOnly" />
    </div>
    <div v-if="showPicker" class="calendar-picker">
      <div class="month-year-selector">
        <span @click="showMonthSelector = true">{{ months[currentMonth] }}</span>
        <span @click="showYearSelector = true">{{ currentYear }}</span>
      </div>
      <div v-if="showMonthSelector" class="month-selector">
        <button v-for="(month, index) in months" :key="month" @click="selectMonth(index)">{{ month }}</button>
      </div>
      <div v-if="showYearSelector" class="year-selector">
        <button v-for="year in years" :key="year" @click="selectYear(year)">{{ year }}</button>
      </div>
      <div v-if="!showMonthSelector && !showYearSelector" class="days-grid">
        <button v-for="(day, index) in daysInMonth" :key="index" :class="{ disabled: day.disabled, selected: day.date === selectedDate }" @click="handleDateSelect(day.date ?? '')" :disabled="day.disabled">
          {{ day.day }}
        </button>
      </div>
    </div>
    <div v-if="props.error" class="error-message">{{ props.error }}</div>
  </div>
</template>

<style scoped>
.calendar-container {
  position: relative;
  width: 100%;
  max-width: 300px;
}
.calendar-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}
.required {
  color: red;
}
.calendar-input {
  border: 1px solid #ccc;
  padding: 0.5rem;
  cursor: pointer;
  background-color: white;
  display: flex;
}
.calendar-input input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
}
.calendar-picker {
  position: absolute;
  width: 350px;
  border: 1px solid #ccc;
  background-color: white;
  z-index: 1000;
  margin-top: 0.25rem;
  padding: 1rem;
}
.month-year-selector {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  font-weight: bold;
}
.month-selector,
.year-selector {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.days-grid button {
  padding: 0.5rem;
  border: none;
  cursor: pointer;
  background-color: white;
}
.days-grid button.disabled {
  color: #ccc;
  cursor: not-allowed;
}
.days-grid button.selected {
  background-color: #007bff;
  color: white;
}
.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>

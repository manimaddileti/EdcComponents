<script setup lang="ts">
import { ref, computed, watch } from 'vue';

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
const currentMonth = ref<number>(new Date().getMonth() + 1); 
const currentYear = ref<number>(new Date().getFullYear());
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const daysInMonth = computed(() => {
  const days = [];
  const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1).getDay();
  const totalDays = new Date(currentYear.value, currentMonth.value, 0).getDate();
  for (let i = 0; i < firstDay; i++) {
    days.push({ day: '', disabled: true });
  }
  for (let i = 1; i <= totalDays; i++) {
    const date = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    days.push({
      day: i,
      date,
      disabled: isDateDisabled(date),  
    });
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

const handleCalender = () => {
  selectedDate.value = null;
  emit('on-clear');
};

const togglePicker = () => {
  if (!props.disabled && !props.readOnly) {
    showPicker.value = !showPicker.value;
  }
};

const goToPrevMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 1;
    currentYear.value -= 1;
  } else {
    currentMonth.value -= 1;
  }
};

const goToNextMonth = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1;
    currentYear.value += 1;
  } else {
    currentMonth.value += 1;
  }
};
</script>

<template>
  <div class="calendar-container">
    <label v-if="props.label" class="calendar-label">
      {{ props.label }}
      <span v-if="props.required" class="required">*</span>
    </label>

    <div class="calendar-input" @click="togglePicker">
      <input
        :value="selectedDate || props.placeholder"
        :placeholder="props.placeholder"
        :disabled="props.disabled || props.readOnly"
        readonly
      />
      <button v-if="selectedDate && !props.disabled" @click.stop="handleCalender" class="clear-button">
        ×
      </button>
    </div>
    <div v-if="showPicker" class="calendar-picker">
      <div class="month-navigation">
        <button @click="goToPrevMonth" :disabled="props.disabled">◀</button>
        <span>{{ months[currentMonth - 1] }} {{ currentYear }}</span>
        <button @click="goToNextMonth" :disabled="props.disabled">▶</button>
      </div>

      <div class="week-days">
        <span v-for="day in weekDays" :key="day">{{ day }}</span>
      </div>

      <div class="days-grid">
        <button
          v-for="(day, index) in daysInMonth"
          :key="index"
          :class="{ disabled: day.disabled, selected: day.date === selectedDate }"
          @click="handleDateSelect(day.date ?? '')"
          :disabled="day.disabled"
        >
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
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  background-color: white;
}

.calendar-input input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  cursor: pointer;
}

.clear-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  margin-left: 0.5rem;
}

.calendar-picker {
  position: absolute;
  width: 500px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  z-index: 1000;
  margin-top: 0.25rem;
  padding: 1rem;
}

.month-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.week-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.week-days span {
  text-align: center;
  font-weight: bold;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.days-grid button {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: white;
}

.days-grid button:disabled {
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
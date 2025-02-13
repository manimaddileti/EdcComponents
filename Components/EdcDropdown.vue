<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    label: string; 
    options: { label: string; value: string }[]; 
    defaultValue?: string;
    disabled?: boolean; 
    error?: string; 
    required?: boolean; 
    loading?: boolean; 
    readOnly?: boolean; 
    enableClear?: boolean; 
  }>(),
  {
    defaultValue: 'Choose an option',
    disabled: false,
    error: '',
    required: false,
    loading: false,
    readOnly: false,
    enableClear: false,
  }
);

const emit = defineEmits<{
  'on-select': [selectedValue: string]; 
  'on-clear': []; 
}>();

const selectedValue = ref<string | null>(null); 
const showOptions = ref<boolean>(false); 
const search = ref<string>(''); 
const filteredOptions = ref([...props.options]);

watch(
  () => props.options,
  (newOptions) => {
    filteredOptions.value = newOptions.filter((option) =>
      option.label.toLowerCase().includes(search.value.toLowerCase())
    );
  },
  { immediate: true } 
);

watch(search, (newSearch) => {
  filteredOptions.value = props.options.filter((option) =>
    option.label.toLowerCase().includes(newSearch.toLowerCase())
  );
});

function toggleOptions() {
  if (!props.disabled && !props.readOnly) {
    showOptions.value = !showOptions.value;
  }
}

function handleSelect(value: string) {
  selectedValue.value = value;
  showOptions.value = false;
  emit('on-select', value);
}

function handleClear() {
  selectedValue.value = null;
  emit('on-clear');
}
</script>

<template>
  <div class="dropdown-container">
    <label v-if="props.label" class="dropdown-label">
      {{ props.label }}
      <span v-if="props.required" class="required">*</span>
    </label>

    <div class="dropdown-input" @click="toggleOptions">
      <input
        :value="selectedValue ? selectedValue : props.defaultValue"
        :placeholder="props.defaultValue"
        :disabled="props.disabled || props.readOnly"
        readonly
      />
      <button
        v-if="selectedValue && props.enableClear && !props.disabled"
        @click.stop="handleClear"
        class="clear-button"
      >
        ×
      </button>
      <div v-if="props.loading" class="loading-spinner">Loading...</div>
    
      <div class="dropdown-arrow" :class="{ 'rotate-180': showOptions }">▼</div>
    </div>

    <div v-if="showOptions" class="dropdown-options">
    
      <input
        v-if="!props.readOnly"
        v-model="search"
        placeholder="Search..."
        class="search-input"
      />
      <div
        v-for="option in filteredOptions"
        :key="option.value"
        class="dropdown-option"
        @click="handleSelect(option.value)"
      >
        {{ option.label }}
      </div>

      <div v-if="filteredOptions.length === 0" class="no-results">
        No results found
      </div>
    </div>

    <div v-if="props.error" class="error-message">{{ props.error }}</div>
  </div>
</template>

<style scoped>
.dropdown-container {
  position: relative;
  width: 100%;
  max-width: 300px;

}

.dropdown-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.required {
  color: red;
}

.dropdown-input {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  background-color: white;
  margin-bottom: 3rem;
}

.dropdown-input input {
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

.loading-spinner {
  margin-left: 0.5rem;
  color: #888;
}

.dropdown-arrow {
  margin-left: 0.5rem;
  transition: transform 0.2s;
}

.rotate-180 {
  transform: rotate(180deg);
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  z-index: 1000;
  margin-top: 0.25rem;
}

.search-input {
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
}

.dropdown-option {
  padding: 0.5rem;
  cursor: pointer;
}

.dropdown-option:hover {
  background-color: #f0f0f0;
}

.no-results {
  padding: 0.5rem;
  color: #888;
}

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
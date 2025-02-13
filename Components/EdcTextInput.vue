<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps({
  label: { type: String, default: '' }, 
  placeholder: { type: String, default: '' }, 
  required: { type: Boolean, default: false }, 
  disabled: { type: Boolean, default: false }, 
  readOnly: { type: Boolean, default: false }, 
  error: { type: String, default: '' }, 
  type: { type: String, default: 'text' }, 
  minLength: { type: Number, default: 0 }, 
  maxLength: { type: Number, default: 1000 }, 
  showTooltip: { type: Boolean, default: false }, 
  tooltipText: { type: String, default: '' }, 
});

const emit = defineEmits(['on-input', 'on-focus']);
const modelValue = defineModel<string | number | null>({ default: null });
const inputRef = ref<HTMLInputElement | null>(null);
const showPassword = ref(false);
const isInputFocused = ref(false);
const isTextEllipsed = computed(() => {
  if (inputRef.value) {
    return inputRef.value.offsetWidth < inputRef.value.scrollWidth;
  }
  return false;
});
const tooltip = computed(() => props.tooltipText || modelValue.value);

const getInputId = computed(() => props.label.toLowerCase().replace(/\s+/g, '-'));
const inputClasses = computed(() => ({
  'input-value form-input text-ellipsis': true,
  'pointer-events-none readonly-form-input': props.readOnly,
}));
const inputContainerClasses = computed(() => ({
  'relative flex flex-col rounded-[var(--border-radius-4)]': true,
}));

const getInputType = computed(() => {
  return props.type === 'password' && showPassword.value ? 'text' : props.type;
});

function handleInputChange() {
  emit('on-input', modelValue.value);
}

function handleOnFocus(event: FocusEvent) {
  isInputFocused.value = true;
  emit('on-focus', event);
}

watch(
  () => modelValue.value,
  (newValue, oldValue) => {
    if (newValue && typeof newValue === 'string' && newValue.length > props.maxLength) {
      modelValue.value = oldValue; 
    }
  }
);

function preventInputScroll(event: WheelEvent) {
  if (isInputFocused.value) event.preventDefault();
}
</script>

<template>
  <div class="container">
    
    <label :for="getInputId" class="input-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <div
      v-tooltip="{
        content: (isTextEllipsed || showTooltip) && tooltip ? String(tooltip) : '',
        placement: 'top',
      }"
      :class="inputContainerClasses"
    >
      <input
        :id="getInputId"
        ref="inputRef"
        v-model="modelValue"
        :type="getInputType"
        :class="inputClasses"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readOnly"
        @input="handleInputChange"
        @focus="handleOnFocus"
        @blur="isInputFocused = false"
        @wheel="preventInputScroll"
      />

      <button
        v-if="props.type === 'password'"
        class="toggle-password"
        @click="showPassword = !showPassword"
      >
        {{ showPassword ? 'Hide' : 'Show' }}
      </button>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
    margin-top: 0.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.input-label {
  font-weight: bold;
}

.input-value {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.toggle-password {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
}

.error-message {
  color: red;
  margin-top: 0.3rem;
}

.required {
  color: red;
}
</style>
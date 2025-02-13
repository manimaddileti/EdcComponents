<script setup lang="ts">
import { ref, computed, watch } from 'vue';

// Define the props for the component
const props = defineProps({
  cols: { type: Number, default: 50 }, 
  rows: { type: Number, default: 4 }, 
  label: { type: String, default: '' }, 
  placeholder: { type: String, default: '' }, 
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  readOnly: { type: Boolean, default: false },  
  error: { type: String, default: '' }, 
  showCharacterCount: { type: Boolean, default: false }, 
  max: { type: Number, default: 1000 }, 
  showHelpText: { type: Boolean, default: false },
   helpText: { type: String, default: '' }, 
     tabindex: { type: Number, default: undefined },
});

const emit = defineEmits(['on-input', 'on-focus', 'on-model-change']);
const modelValue = defineModel<string | null>({ default: null });
const inputRef = ref<HTMLTextAreaElement | null>(null);
const characterCount = computed(() => modelValue.value?.length || 0);

function handleInputChange() {
  if (!modelValue.value) modelValue.value = null;
  emit('on-input');
  emit('on-model-change');
}

function handleOnFocus(event: FocusEvent) {
  emit('on-focus', event);
}

watch(
  () => modelValue.value,
  (newValue) => {
    if (newValue && newValue.length > props.max) {
      modelValue.value = newValue.slice(0, props.max);
    }
  }
);
</script>

<template>
  <div class="container">
    
    <label v-if="props.label" class="input-label">
      {{ props.label }}
      <span v-if="props.required" class="required">*</span>
    </label>

    <div class="input-container">
      <textarea
        :id="props.label.toLowerCase().replace(/\s+/g, '-')"
        ref="inputRef"
        v-model="modelValue"
        :rows="props.rows"
        :cols="props.cols"
        :class="['input-value', { 'readonly-form-input': props.readOnly }]"
        :disabled="props.disabled"
        :placeholder="props.placeholder"
        :readonly="props.readOnly"
        :tabindex="props.tabindex"
        @input="handleInputChange"
        @focus="handleOnFocus"
      />
    </div>

    <div class="error-and-count-container">
      <span v-if="props.error" class="error-message">{{ props.error }}</span>
      <span v-if="props.showCharacterCount && !props.readOnly" class="character-count">
        {{ characterCount }} / {{ props.max }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  font-weight: bold;
}

.input-container {

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.input-value {
  width: 50%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none; 
}

.readonly-form-input {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error-and-count-container {
  display: flex;
  justify-content:center;
  align-items: center;
  margin-top: 0.5rem;
}

.error-message {
  color: red;
}

.character-count {
  color: #666;
  font-size: 0.9rem;
}

.required {
  color: red;
}
</style>
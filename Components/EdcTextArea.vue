<script setup lang="ts">
import { ref, computed, watch } from 'vue';

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
  max: { type: Number, default: 1000 }
});

const emit = defineEmits(['on-input', 'on-focus']);
const modelValue = defineModel<string | null>({ default: null });
const characterCount = computed(() => modelValue.value?.length || 0);

function handleInputChange() {
  emit('on-input');
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

    <textarea
      v-model="modelValue"
      :rows="props.rows"
      :cols="props.cols"
      class="input-value"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :readonly="props.readOnly"
      @input="handleInputChange"
    />

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
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.input-label {
  font-weight:inherit;
}

.input-value {
  width: 75%;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none; 
}

.error-and-count-container {
  display: flex;
  justify-content: space-between;
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
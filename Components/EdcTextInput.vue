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
  maxLength: { type: Number, default: 1000 }, 
});

const emit = defineEmits(['on-input', 'on-focus']);
const modelValue = defineModel<string | number | null>({ default: null });
const inputRef = ref<HTMLInputElement | null>(null);
const showPassword = ref(false);

const getInputId = computed(() => props.label.toLowerCase().replace(/\s+/g, '-'));
const getInputType = computed(() => props.type === 'password' && showPassword.value ? 'text' : props.type);

function handleInputChange() {
  emit('on-input', modelValue.value);
}

function handleOnFocus(event: FocusEvent) {
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
</script>

<template>
  <div class="container">
    <label :for="getInputId" class="input-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <div class="input-container">
      <input
        :id="getInputId"
        ref="inputRef"
        v-model="modelValue"
        :type="getInputType"
        class="input-value"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readOnly"
        @input="handleInputChange"
        @focus="handleOnFocus"
      />

      <button v-if="props.type === 'password'" class="toggle-password" @click="showPassword = !showPassword">
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

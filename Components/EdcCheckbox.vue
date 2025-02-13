<script setup lang="ts">
import { defineProps, defineEmits, ref, computed, onMounted } from 'vue';

const props = defineProps({
  label: String,
  checked: Boolean,
  disabled: Boolean,
  required: Boolean,
  error: String,
  name: String,
  readOnly: Boolean,
  value: String,
  tabindex: Number,
});

const emit = defineEmits<{
  "on-change": [checked: boolean];
}>();
const modelValue = ref(props.checked);
function onChange() {
  emit('on-change', modelValue.value);
}
onMounted(() => {
  modelValue.value = props.checked;
});
</script>

<template>
  <div :class="['checkbox-container', props.disabled && 'disabled']">
    <label v-if="props.label" :for="props.name">
      {{ props.label }} <span v-if="props.required" class="required">*</span>
    </label>

    <input
      v-if="!props.readOnly"
      type="checkbox"
      :id="props.name"
      v-model="modelValue"
      :disabled="props.disabled"
      :tabindex="props.tabindex"
      @change="onChange"
    />

    <span v-else-if="modelValue" class="check-icon">✔</span>

    <span v-if="props.error" class="error-text">{{ props.error }}</span>
  </div>
</template>

<style scoped>
.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.required {
  color: red;
}

.check-icon {
  color: green;
}

.error-text {
  color: red;
  font-size: 0.875rem;
}
</style>

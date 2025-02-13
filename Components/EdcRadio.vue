<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  label: { type: String, default: '' }, 
  elementId: { type: String, default: '' },
  containerClass: { type: String, default: '' }, 
  inputClass: { type: String, default: '' }, 
  labelClass: { type: String, default: '' }, 
  checked: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  allowDeselect: { type: Boolean, default: false }, 
  disabled: { type: Boolean, default: false }, 
  tabindex: { type: Number, default: undefined },
   name: { type: String, required: true }, 
     value: { type: [String, Number], required: true }, 
});

const emit = defineEmits<{
  'on-change': [selectedValue: string | number];
}>();

const modelValue = defineModel<string | number | null>({ default: null });

const preSelected = ref<boolean>(props.checked);

const getInputId = computed(() => props.elementId || `${props.name}_${props.label}`);

const containerClasses = computed(() => ({
  container: true, 
  [props.containerClass]: props.containerClass,     
}));

const inputClasses = computed(() => ({
  'input-value radio-input': true, 
  [props.inputClass]: props.inputClass, 
  'input-font !w-fit': !props.inputClass.includes('font'), 
  'w-[1.2rem] h-[1.2rem]': props.labelClass.includes('admin-input-font'), 
}));

function onChange(event: Event) {
  const selectedValue = (event.target as HTMLInputElement).value;
  emit('on-change', selectedValue);
}

function handleDeselect(event: Event) {
  const selectedValue = (event.target as HTMLInputElement).value;
  if (props.allowDeselect && modelValue.value === selectedValue) {
    modelValue.value = null;
  }
}

onMounted(() => {
  if (modelValue.value === props.value) preSelected.value = true;
});
</script>

<template>
  <div :class="containerClasses">
 
    <div class="relative">
      <input
        :id="getInputId"
        v-model="modelValue"
        :value="props.value"
        type="radio"
        :class="inputClasses"
        :name="props.name"
        :checked="preSelected"
        :disabled="props.disabled"
        :tabindex="props.tabindex"
        @change="onChange($event)"
        @click="handleDeselect($event)"
      />
    </div>

    <label :for="getInputId" :class="props.labelClass">
      {{ props.label }}
      <span v-if="props.required" class="text-red-500">*</span>
    </label>
  </div>
</template>

<style scoped>
.container {
    margin-top: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.text-label {
  width: 100%;
}
</style>

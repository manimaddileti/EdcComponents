<script setup lang="ts">
import { ref, watch } from "vue";

const modelValue = ref<string | null>(null);

const props = withDefaults(
  defineProps<{
    elementId: string;
    placeholder?: string;
    disabled?: boolean;
    label?: string;
    debounceDelay?: number;
  }>(),
  {
    placeholder: "Search...",
    disabled: false,
    label: "",
    debounceDelay: 500,
  }
);

const emit = defineEmits<{
  "on-input": [];
  "on-search": [searchQuery: string | null];
}>();

let timeout: ReturnType<typeof setTimeout> | null = null;
const handleInputChange = () => {
  emit("on-input");

  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    emit("on-search", modelValue.value);
  }, props.debounceDelay);
};

const handleClearSearch = () => {
  modelValue.value = null;
  handleInputChange();
};

watch(modelValue, (newValue) => {
  if (!newValue) modelValue.value = null;
});
</script>

<template>
  <div class="flex flex-col gap-3 w-full max-w-[1600px] items-center">
    <label v-if="label" :for="elementId" class="text-gray-700 font-semibold">
      {{ label }}
    </label>

    <div class="relative flex items-center border rounded-md p-2 bg-white">
      <span class="text-gray-500">🔍</span>

      <input
        :id="elementId"
        v-model="modelValue"
        type="text"
        :placeholder="placeholder"
        :disabled="disabled"
        class="ml-2 flex-grow outline-none"
        @input="handleInputChange"
      />

      <button v-if="modelValue" @click="handleClearSearch" class="text-gray-500 ml-2">
        ✖
      </button>
    </div>
  </div>
</template>

<style scoped>
input:disabled {
  background-color: #f3f3f3;
  cursor: not-allowed;
}
</style>

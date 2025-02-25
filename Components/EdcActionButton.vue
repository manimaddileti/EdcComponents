<script setup lang="ts">
import { ref, computed } from 'vue';
const props = defineProps({
  containerClass: { type: String, default: 'md:py-[0.4rem] md:px-[3rem] lg:py-[0.8rem] lg:px-[6rem]' }, 
  labelClass: { type: String, default: '' }, 
  label: { type: String, required: true }, 
  type: { type: String, default: 'submit' },
  disabled: { type: Boolean, default: false }, 
  showLoader: { type: Boolean, default: false }, 
  tabindex: { type: Number, default: undefined },
  isDisabledStateStyle: { type: Boolean, default: true }, 
  onClick: { type: Function, required: true },
  onKeyUp: { type: Function as PropType<(e: KeyboardEvent) => void>, default: () => {} },
});

const loading = ref(false);
const containerClasses = computed(() => ({
  container: true, 
  [`${props.type}-container`]: true,
  'container-striped-bg': loading.value, 
  [props.containerClass]: true, 
  'md:rounded-[--border-radius-6] lg:rounded-[--border-radius-10]': !props.containerClass.includes('rounded'), 
  disabled: props.isDisabledStateStyle, 
}));

const labelClasses = computed(() => ({
  [props.labelClass]: true, 
  'font-bold button-text': true, 
  'text-[var(--color-white)]': props.type === 'submit' || props.type === 'delete', 
  'text-[var(--color-gray-cancel-text)]': props.type === 'cancel', 
}));

async function handleClick() {
  if (props.disabled) return; 
  loading.value = true;

  try {
    const result = props.onClick();
    if (result instanceof Promise) {
      await result;
    } else {
      await new Promise(resolve => setTimeout(resolve,5000));
    }
  } catch (error) {
    console.error("Error in button click:", error);
  }

  loading.value = false; 
}
</script>

<template>
  <div class="flex justify-center items-center h-full">
    <button
      :class="containerClasses"
      type="button"
      :disabled="props.disabled || loading"
      :tabindex="props.tabindex"
      @click="handleClick"
      @keyup.enter="props.onKeyUp"
    >
      <span :class="labelClasses">{{ label }}</span>
    </button>
  </div>
</template>

<style scoped>
.container {
  width: fit-content;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease; 
  border-radius: 2rem;
  margin-bottom: 2rem;
}


.button-text {
  font-size: var(--text-11); 
}

.submit-container {
  margin-top: 2rem; 
  color: var(--color-white); 
  background-color: skyblue; 
}
.submit-container:hover {
  background-color: blue; 
}
.submit-container:disabled {
  opacity: 0.7; 
}


.container-striped-bg {
  
  background-color: var(--color-primary);
        background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23003465' fill-opacity='0.42' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E");
        animation: barberpole 3s linear infinite;
}

@keyframes barberpole {
  100% {
    background-position: 100% 100%;
  }
}

@media screen and (min-width: 1024px) {
  .button-text {
    font-size: var(--text-12); 
  }
}
</style>

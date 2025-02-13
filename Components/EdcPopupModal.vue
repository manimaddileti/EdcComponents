<script setup lang="ts">
import { computed } from 'vue';
import Ss from "./../assests/Screenshot 2025-02-13 101247.png"
const props = withDefaults(
  defineProps<{
    modalId: string; 
    cancelLabel?: string; 
    submitLabel?: string; 
    containerClass?: string; 
    primaryButtonType?: 'cancel' | 'submit' | 'delete'; 
    hideCancel?: boolean; 
    onSubmit: () => Promise<void> | void;
    onCancel?: () => void;
  }>(),
  {
    cancelLabel: 'Cancel',
    submitLabel: 'Submit',
    containerClass: '',
    primaryButtonType: 'submit',
    hideCancel: false,
    onCancel: () => {},
  }
);

const containerClasses = computed(() => ({
  modal: true,
  [props.containerClass]: props.containerClass,
}));

async function handleSubmit() {
  await props.onSubmit();
}

function handleCancel() {
  props.onCancel();
}
</script>

<template>
  
  <transition name="fade">
    <div class="modal-overlay"></div>
  </transition>

  <transition name="pop">
    <div :class="containerClasses" role="dialog">
      <div class="relative">
        <div class="sticky top-0 z-[1000] flex justify-end p-4 bg-black">
          <button @click="handleCancel" class="p-2">
            <img :src="Ss" alt="Close" class="Image" />
          </button>
        </div>

        <div class="p-4 overflow-x-hidden">
          <slot />
        </div>

        <div class="sticky bottom-0 z-10 flex justify-end p-4 bg-white">
          <div class="flex gap-4">
            <button
              v-if="!hideCancel"
              @click="handleCancel"
              class="px-4 py-2 rounded-lg bg-gray-200 text-sm"
            >
              {{ cancelLabel }}
            </button>
            <button
              @click="handleSubmit"
              :class="[
                'px-4 py-2 rounded-lg text-sm',
                primaryButtonType === 'delete' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white',
              ]"
            >
              {{ submitLabel }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width:50%;
  max-width: 92vw;
  max-height: 88vh;
  overflow-y: auto;
  background: white;
  border-radius: 8px;
  
  z-index: 999;
}
.Image
{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 998;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
  transition:
    transform 0.4s cubic-bezier(0.5, 0, 0.5, 1),
    opacity 0.4s;
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.3) translateY(-20%);
}
</style>
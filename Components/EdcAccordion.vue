<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted } from 'vue';
const props = defineProps({
  loading: {
    type: Boolean,
    required: true,
  },
  isActive: {
    type: Boolean, 
    required: true,
  },
});

const emit = defineEmits<{
  "on-heading-click": [];  
}>();

const isHovered = ref(false);
const isClicked = ref(false); 

const handleHover = (state: boolean) => {
  if (!isClicked.value) { 
    isHovered.value = state;
  }
};

const handleButtonClick = () => {
  isClicked.value = false; 
};
</script>

<template>
  <div class="flex flex-col gap-[1rem] w-full items-center">
      <div 
        class="accordion-item h-[3rem] mb-[1rem] w-[30%] mt-[1rem]"
        @mouseenter="handleHover(true)" 
        @mouseleave="handleHover(false)"
      >
        <div class="accordion-header" @click="emit('on-heading-click')">
          <slot name="header"/>
        </div>
        <edc-transition-height>
          <div v-show="isHovered || isClicked" class="accordion-body">
            <slot name="timeline" />
          </div>
        </edc-transition-height>
      </div>
  
  </div>
</template>

<style scoped>
.accordion-item {   
  border: 0.1rem solid blue;
}
.accordion-header {
  padding: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.accordion-body {
  padding: 1rem;
  background: black;
  color: white;
}
</style>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  dataCount: {
    type: Number, 
    required: true,
  },
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
    <template v-if="loading">
      <div v-for="index in dataCount" :key="index" class="accordion-item w-[50%]">
        <div class="pointer-events-none accordion-header !py-[2rem]" @click="emit('on-heading-click')">
          <edc-skeleton-loader
            container-class="w-[90%] h-[0.5rem] my-[0.5rem]"
            loader-type="rectangle"
          />
          <edc-skeleton-loader
            container-class="w-[3%] h-[1rem] my-[0.5rem]"
            loader-type="rectangle"
          />
        </div>
      </div>
    </template>
    
    <template v-else>
      <div 
        v-for="(rowCount, index) in dataCount" 
        :key="index" 
        class="accordion-item h-[3rem] mb-[1rem] w-[30%] mt-[1rem]"
        @mouseenter="handleHover(true)" 
        @mouseleave="handleHover(false)"
      >
        <div class="accordion-header" @click="emit('on-heading-click')">
          <slot name="header"/>
          <edc-icon
            icon="chevron-right-sharp"
            :class="`transition-all !w-[1.5rem] !h-[1.5rem] ${isHovered || isClicked ? 'rotate-90' : ''}`"
            fill="var(--color-black)"
          />
        </div>

        <edc-transition-height>
          <div v-show="isHovered || isClicked" class="accordion-body">
            <slot name="timeline" />
          </div>
        </edc-transition-height>
      </div>
    </template>
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

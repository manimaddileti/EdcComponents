<script setup lang="ts">
import { computed } from 'vue';
const props = withDefaults(
  defineProps<{
    breadCrumbDetails: string[]; 
    type?: 'clinical-trials' | 'discrepancy-modal'; 
  }>(),
  {
    type: 'clinical-trials', 
  }
);

const labelClasses = computed(() => ({
  'font-bold': true,
  'text-[1.2rem] lg:text-[1.3rem] accent-text': props.type === 'clinical-trials',
  'text-[1.3rem] lg:text-[1.4rem]': props.type === 'discrepancy-modal',
}));
</script>

<template>
  <section
    v-if="breadCrumbDetails.length > 0"
    class="flex flex-row items-center self-start gap-[1rem] mb-[2rem]"
    >
    <template v-for="(breadCrumbDetailRow, index) in breadCrumbDetails" :key="index">
      <span
        :class="[
          labelClasses,
          index === breadCrumbDetails.length - 1 ? 'opacity-60' : '', 
        ]"
      >
        {{ breadCrumbDetailRow }}
      </span>   
      <edc-icon
        v-if="index < breadCrumbDetails.length - 1" 
        icon="chevron-right-sharp"
        class="w-[1.2rem] h-[1.2rem] opacity-60"
        fill="var(--color-accent)"/>
    </template>
  </section>
</template>
<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";

const props = defineProps({
  tabs: { type: Array as () => string[], required: true },
  activeIndex: { type: Number, default: 0 }, 
});

const emit = defineEmits<{
  "on-tab-change": [tabIndex: number];
}>();

const tabListRef = ref<HTMLElement | null>(null);
const showLeftArrow = ref(false);
const showRightArrow = ref(false);

const checkScrollButtons = () => {
  if (!tabListRef.value) return;
  const { scrollLeft, scrollWidth, clientWidth } = tabListRef.value;
  showLeftArrow.value = scrollLeft > 0;
  showRightArrow.value = scrollLeft < scrollWidth - clientWidth;
};

const scroll = (direction: "left" | "right") => {
  if (!tabListRef.value) return;
  const scrollAmount = 200; 
  tabListRef.value.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });

  setTimeout(checkScrollButtons, 300);
};

const activeTabIndex = ref<number>(props.activeIndex);

const changeTab = (tabIndex: number) => {
  activeTabIndex.value = tabIndex;
  emit("on-tab-change", tabIndex);
};

onMounted(async () => {
  await nextTick();
  checkScrollButtons();
});

watch(() => props.tabs, async () => {
  await nextTick();
  checkScrollButtons();
});
</script>

<template>
  <div class="flex flex-col p-4 tab-container">
    
    <section class="relative flex flex-row justify-between border-b border-gray-300">
      
      <button
        v-if="showLeftArrow"
        class="absolute left-0 z-10 bg-white px-2 h-full flex items-center shadow-md"
        @click="scroll('left')"
      >
        <span class="text-2xl">‹</span>
      </button>

      <ul
        ref="tabListRef"
        class="flex flex-row items-end gap-4 overflow-x-auto scroll-smooth no-scrollbar"
        @scroll="checkScrollButtons"
      >
        <li
          v-for="(tab, index) in tabs"
          :key="index"
          :class="[
            'transition-all border-b-4 px-4 pb-2 whitespace-nowrap cursor-pointer',
            activeTabIndex === index ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-700'
          ]"
          @click="changeTab(index)"
        >
          <span class="md:text-lg lg:text-xl font-semibold">
            {{ tab }}
          </span>
        </li>
      </ul>

      <button
        v-if="showRightArrow"
        class="absolute right-0 z-10 bg-white px-2 h-full flex items-center shadow-md"
        @click="scroll('right')"
      >
        <span class="text-2xl">›</span>
      </button>
    </section>

    <section class="py-4">
      <slot :name="`tab-${activeTabIndex}`" />
    </section>
  </div>
</template>

<style scoped>
.tab-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>

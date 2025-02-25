<script setup lang="ts">
import { ref, computed } from 'vue';

const props = withDefaults(
  defineProps<{
    columns: { header: string; field: string; sort?: boolean }[]; 
    tableData: Record<string, any>[]; 
    loading?: boolean; 
    paginationType?: 'classic' | 'lazy' | 'none'; 
    emptyMessage?: string; 
    enableRowClick?: boolean; 
  }>(),
  
  {
    loading: false,
    paginationType: 'none',
    emptyMessage: 'No records found',
    enableRowClick: false,
  }
);
const emit = defineEmits<{
  'on-row-click': [row: Record<string, any>]; 
  'on-sort-change': [column: string, order: 'asc' | 'desc']; 
}>();

const sortDetails = ref<Record<string, 'asc' | 'desc'>>({});

const handleRowClick = (row: Record<string, any>) => {
  if (props.enableRowClick) {
    emit('on-row-click', row);
  }
};
const handleSorting = (column: string) => {
  const currentOrder = sortDetails.value[column];
  const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
  sortDetails.value[column] = newOrder;
  emit('on-sort-change', column, newOrder);
};
</script>

<template>
  <div class="data-table">
    <table class="w-full">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.header"
            class="font-bold text-left p-2"
            @click="column.sort ? handleSorting(column.field) : null"
          >
            {{ column.header }}
            <span v-if="column.sort" class="sort-icon">
              {{ sortDetails[column.field] === 'asc' ? '▲' : '▼' }}
            </span>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="loading">
          <td :colspan="columns.length" class="text-center p-4">Loading...</td>
        </tr>
        <tr v-else-if="tableData.length === 0">
          <td :colspan="columns.length" class="text-center p-4">{{ emptyMessage }}</td>
        </tr>

        <tr
          v-for="(row, index) in tableData"
          :key="index"
          class="hover:bg-gray-100 cursor-pointer"
          @click="handleRowClick(row)"
        >
          <td v-for="column in columns" :key="column.field" class="p-2">
            {{ row[column.field] }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="paginationType === 'classic'" class="pagination">
    </div>
  </div>
</template>

<style scoped>

.data-table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f4f4f4;
  cursor: pointer;
}

.sort-icon {
  margin-left: 5px;
}

.pagination {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
<script setup lang="ts">
import { ref } from 'vue';
import EdcTextInput from './Components/EdcTextInput.vue';
import EdcTextArea from './Components/EdcTextArea.vue';
import EdcCalendar from './Components/EdcCalendar.vue';
import EdcRadio from './Components/EdcRadio.vue';
import EdcActionButton from './Components/EdcActionButton.vue';
import EdcTabView from './Components/EdcTabView.vue';
import EdcSearchBar from './Components/EdcSearchBar.vue';
import EdcPopupModal from './Components/EdcPopupModal.vue';
import EdcDropdown from './Components/EdcDropdown.vue';
import EdcBreadcrumb from './Components/EdcBreadcrumb.vue';
import EdcDataTable from './Components/EdcDataTable.vue';
import EdcCheckbox from './Components/EdcCheckbox.vue';
import EdcAccordion from './Components/EdcAccordion.vue';
const selectedValue = ref<string | number | null>(null);
const handleRadioChange = (value: string | number) => {
  selectedValue.value = value;
  console.log('Selected Radio:', value);
};
function handleDateChange(date: string) {
  console.log('Selected Date:', date);
}
function handleClear() {
  console.log('Calendar cleared');
}

const handleButtonClick = () => {
  console.log('Button clicked!');
};
const dropdownOptions = ref([
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
]);
function handleSelect(selectedValue: string) {
  console.log('Selected:', selectedValue);
}
const isModalOpen = ref(false);
function handleSubmit() {
  console.log('Save action');
  return Promise.resolve();
}
function handleCancel() {
  console.log('Cancel action');
  isModalOpen.value = false;
}
const breadCrumbDetails = ['Home', '>', 'Clinical Trials', '>', 'Study Details'];
const columns = [
  { header: 'ID', field: 'id' },
  { header: 'Name', field: 'name', sort: true },
  { header: 'Age', field: 'age' },
];
const tableData = ref([
  { id: 1, name: 'Mani', age: 25 },
  { id: 2, name: 'Manjunath', age: 30 },
  { id: 3, name: 'Vasu', age: 22 },
]);

function handleRowClick(row: Record<string, any>) {
  console.log('Row clicked:', row);
}

function handleSortChange(column: string, order: 'asc' | 'desc') {
  console.log('Sort changed:', column, order);
}

const isChecked = ref(false);
const isDisabled = ref(false);
const errorMessage = ref('');
function handleChange(checked: boolean) {
  console.log('Checkbox state:', checked);
  isChecked.value = checked;
}
</script>

<template>
  <div class="form-container">
    <p>Username</p>
    <EdcTextInput />
    <p>Password</p>
    <EdcTextInput />
    <p>Reenter Password</p>
    <EdcTextInput />
    <p class="mt-4">Permanent Address</p>
    <EdcTextArea />

    <h1>DOB</h1>
    <EdcCalendar
      label="Select a Date"
      placeholder="Choose a date"
      :required="true"
      @on-change="handleDateChange"
      @on-clear="handleClear"
      :minDate="'2024-01-01'"
      :maxDate="'2024-12-31'"
    />
    <div class="radio-group">
      <EdcRadio
        name="gender"
        label="Male"
        :value="'male'"
        :checked="selectedValue === 'male'"
        @on-change="handleRadioChange"
      />
      <EdcRadio
        name="gender"
        label="Female"
        :value="'female'"
        :checked="selectedValue === 'female'"
        @on-change="handleRadioChange"
      />
    </div>

    <EdcActionButton label="Submit" :onClick="handleButtonClick" />
  </div>

  <div class="additional-components">
    <EdcTabView :tabs="['Tab 1', 'Tab 2', 'Tab 3']" :activeIndex="0" @on-tab-change="" />
    <EdcSearchBar elementId="search-input" />

    <button @click="isModalOpen = true" class="Btn px-4 py-2 bg-blue-500 text-white rounded-lg mt-4">
      Open Modal
    </button>

    <EdcPopupModal
      v-if="isModalOpen"
      modalId="exampleModal"
      :onSubmit="handleSubmit"
      :onCancel="handleCancel"
      cancelLabel="Close"
      submitLabel="Save"
      primaryButtonType="submit"
    />

    <div class="dropdown-container">
      <h1>Dropdown Example</h1>
      <EdcDropdown
        label="Choose an option"
        :options="dropdownOptions"
        @on-select="handleSelect"
        @on-clear="handleClear"
        :required="true"
        :enableClear="true"
      />
    </div>

    <div class="breadcrumb-container">
      <h1>Breadcrumb Example</h1>
      <EdcBreadcrumb :breadCrumbDetails="breadCrumbDetails" type="clinical-trials" />
    </div>

    <div class="data-table-container">
      <h1>DataTable Example</h1>
      <EdcDataTable
        :columns="columns"
        :tableData="tableData"
        :enableRowClick="true"
        @on-row-click="handleRowClick"
        @on-sort-change="handleSortChange"/>
    </div>
    <div class="checkbox-container">
      <EdcCheckbox
        label="I accept the terms"
        v-model="isChecked"
        :required="true"
        :error="errorMessage"
        :disabled="isDisabled"
        @on-change="handleChange"
      />
    </div>
    <EdcAccordion :loading="false" :isActive="true" />
  </div>
</template>

<style scoped>
.form-container {
  background:grey;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 500px;
  margin: auto;
  font-weight:1000;
}
.radio-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}
.additional-components {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}
.dropdown-container,
.breadcrumb-container,
.data-table-container,
.checkbox-container {
  text-align: center;
  margin-top: 2rem;
}
.Btn {
  cursor: pointer;
  transition: background-color 0.3s;
}
.Btn:hover {
  background-color: #2563eb;
}
</style>

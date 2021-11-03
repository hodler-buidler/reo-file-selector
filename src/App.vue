<template>
  <div class="app">
    <div class="content">
      <div>
        <a-button type="primary" :loading="isFilesStructureLoading">Select Files</a-button>
      </div>
      <div class="selected-display content__selected-display">
        <SelectedFilesDisplay />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import SelectedFilesDisplay from '@/components/SelectedFilesDisplay/SelectedFilesDisplay.vue';
  import { useAppStore } from '@/store';
  import { loadFilesStructure } from '@/store/modules/filesStructure';
  import useAppMessagesDisplay from '@/composables/useAppMessagesDisplay';

  export default defineComponent({
    name: 'App',
    components: { SelectedFilesDisplay },
    setup() {
      const { isFilesStructureLoading } = useAppStore((state) => state.filesStructure);

      loadFilesStructure();
      useAppMessagesDisplay();

      return { isFilesStructureLoading };
    },
  });
</script>

<style scoped lang="scss">
  .app {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;

    &__selected-display {
      margin-top: 32px;
    }
  }

  .selected-display {
    min-width: 375px;
    max-width: 375px;
    min-height: 300px;
    max-height: 300px;
  }
</style>

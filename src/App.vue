<template>
  <div class="app">
    <div class="content">
      <div>
        <a-button
          type="primary"
          :loading="isFilesStructureLoading"
          @click="openFilesStructureModal"
        >
          Select Files
        </a-button>
      </div>
      <div class="selected-display content__selected-display">
        <SelectedFilesDisplay />
      </div>
    </div>

    <FilesStructureModal
      v-model:selectedFilesIds="selectedFilesIds"
      :visible="isFilesStructureModalOpened"
      :files-structure="filesStructure"
      root-name="Files Structure"
      :loading="isFilesStructureLoading"
      :should-hide-file="shouldHideFile"
      @closed="closeFilesStructureModal"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { File } from '@/types/filesStructure';
  import { ALLOWED_MIME_TYPES } from '@/config/filesStructure';
  import SelectedFilesDisplay from '@/components/SelectedFilesDisplay/SelectedFilesDisplay.vue';
  import FilesStructureModal from '@/components/FilesStructureModal/FilesStructureModal.vue';
  import { useAppStore } from '@/store';
  import { loadFilesStructure } from '@/store/modules/filesStructure';
  import { openFilesStructureModal, closeFilesStructureModal } from '@/store/modules/app';
  import useAppMessagesDisplay from '@/composables/useAppMessagesDisplay';
  import '@/assets/styles/global.scss';

  export default defineComponent({
    name: 'App',
    components: { SelectedFilesDisplay, FilesStructureModal },
    setup() {
      const { isFilesStructureLoading, filesStructure } = useAppStore(
        (state) => state.filesStructure,
      );
      const { isFilesStructureModalOpened } = useAppStore((state) => state.app);
      const selectedFilesIds = ref<string[]>([]);

      loadFilesStructure();
      useAppMessagesDisplay();

      function shouldHideFile(file: File): boolean {
        return !ALLOWED_MIME_TYPES.includes(file.mimeType);
      }

      return {
        isFilesStructureLoading,
        isFilesStructureModalOpened,
        filesStructure,
        openFilesStructureModal,
        closeFilesStructureModal,
        shouldHideFile,
        selectedFilesIds,
      };
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

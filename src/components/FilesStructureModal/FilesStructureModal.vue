<template>
  <UiModal
    v-model:visible="isVisible"
    v-bind="$attrs"
    width="480px"
    body-height="262px"
    vertical-offset="0"
    horizontal-offset="8px"
    header-padding="8px"
    footer-padding="8px 16px 16px 16px"
    hide-divider-header
    hide-divider-footer
    @opened="$emit('opened')"
    @closed="onClosed"
    @close-icon-click="clearItemsSelection"
  >
    <template #header>
      <div class="header">
        <UiButton v-if="!isRoot" @click="goBack">
          <ArrowLeftOutlined />
        </UiButton>
        <div class="header__title">
          {{ modalTitle }}
        </div>
      </div>
    </template>

    <div>
      <UiFilesStructure
        v-model:currentFolderId="currentFolderId"
        :files-structure="filesStructure"
        :selected-items-ids="internalSelectedFilesIds"
        :can-interact-with-item="canInteractWithItem"
        :should-hide-file="shouldHideFile"
        @click-file="onFileClick"
      />
    </div>

    <template #footer>
      <a-button type="primary" :disabled="isSelectButtonDisabled" @click="saveSelectedItems">
        {{ selectedButtonContent }}
      </a-button>
    </template>
  </UiModal>
</template>

<script lang="ts">
  import {
    defineComponent,
    watch,
    ref,
    watchEffect,
    PropType,
    computed,
    onMounted,
    onUnmounted,
  } from 'vue';
  import { localize } from '@/i18n';
  import { ArrowLeftOutlined } from '@ant-design/icons-vue';
  import { FilesStructure, Folder, File, FilesStructureItem } from '@/types/filesStructure';
  import { findFolderById, isFolder, isFile } from '@/utils/filesStructure';
  import filters from '@/utils/filters';
  import isEqual from 'lodash/isEqual';

  type CanSelectFileFunction = (file: File) => boolean;
  type ShouldHideFileFunction = (file: File) => boolean;

  export default defineComponent({
    name: 'FilesStructureModal',
    components: { ArrowLeftOutlined },
    props: {
      visible: { type: Boolean, required: true },
      filesStructure: { type: Object as PropType<FilesStructure>, required: true },
      rootName: { type: String, default: filters.capitalizeFirst(localize('root')) },
      selectedFilesIds: { type: Array as PropType<string[]>, default: () => [] },
      allowFilesSelection: { type: Boolean, default: true },
      canSelectFile: { type: Function as PropType<CanSelectFileFunction>, default: () => true },
      shouldHideFile: { type: Function as PropType<ShouldHideFileFunction>, default: () => false },
    },
    emits: ['closed', 'opened', 'update:visible', 'update:selectedFilesIds'],
    setup(props, { emit }) {
      /* Vitals */
      const currentFolderId = ref('');
      const currentFolder = computed((): FilesStructure | Folder => {
        if (currentFolderId.value) {
          const folderContents = findFolderById(props.filesStructure, currentFolderId.value);
          if (folderContents) return folderContents;
        }

        return props.filesStructure;
      });

      const isRoot = computed(() => {
        return !currentFolderId.value;
      });

      const modalTitle = computed(() => {
        if (isFolder(currentFolder.value)) {
          if (currentFolder.value.name.length > 20) {
            return filters.shortenStr(currentFolder.value.name, 5, 3);
          }
          return currentFolder.value.name;
        }

        return props.rootName;
      });

      function goBack(): void {
        if (isFolder(currentFolder.value)) {
          currentFolderId.value = currentFolder.value.parentFolderId || '';
        }
      }

      /* Files selection */
      const internalSelectedFilesIds = ref([...props.selectedFilesIds]);
      watch(
        () => props.selectedFilesIds,
        () => {
          if (
            internalSelectedFilesIds.value.length !== props.selectedFilesIds.length ||
            !isEqual(internalSelectedFilesIds.value, props.selectedFilesIds)
          ) {
            internalSelectedFilesIds.value = [...props.selectedFilesIds];
          }
        },
        { deep: true },
      );

      function saveSelectedItems(): void {
        emit('update:selectedFilesIds', [...internalSelectedFilesIds.value]);
        closeModal();
      }

      function clearItemsSelection(): void {
        internalSelectedFilesIds.value = [];
        emit('update:selectedFilesIds', []);
      }

      function isFileSelectable(file: File): boolean {
        return props.allowFilesSelection && props.canSelectFile(file);
      }

      function canInteractWithItem(item: FilesStructureItem): boolean {
        if (!isFile(item)) return false;
        return isFileSelectable(item);
      }

      function onFileClick(file: File): void {
        if (isFileSelectable(file)) {
          if (isFileSelected(file)) unselectFile(file);
          else selectFile(file);
        }
      }

      function isFileSelected(file: File): boolean {
        return internalSelectedFilesIds.value.includes(file.id);
      }

      function selectFile(file: File): void {
        internalSelectedFilesIds.value.push(file.id);
      }

      function unselectFile(file: File): void {
        const fileIdIdx = internalSelectedFilesIds.value.indexOf(file.id);
        if (fileIdIdx > -1) {
          internalSelectedFilesIds.value.splice(fileIdIdx, 1);
        }
      }

      /* Select button */
      const isSelectButtonDisabled = computed(() => !internalSelectedFilesIds.value.length);
      const selectedButtonContent = computed(() => {
        const amountFiles = internalSelectedFilesIds.value.length || '';
        return filters.capitalize(localize('select-files', { amount: amountFiles }));
      });

      /* Visibility */
      const isVisible = ref(props.visible);

      watch(
        () => props.visible,
        () => {
          if (isVisible.value !== props.visible) {
            isVisible.value = props.visible;
          }
        },
      );
      watchEffect(() => emit('update:visible', isVisible.value));

      function closeModal(): void {
        isVisible.value = false;
      }

      function onClosed(): void {
        internalSelectedFilesIds.value = [...props.selectedFilesIds];
        emit('closed');
      }

      /* Accessebility */
      onMounted(() => {
        document.addEventListener('keydown', goBackOnLeftArrowPress);
      });

      onUnmounted(() => {
        document.removeEventListener('keydown', goBackOnLeftArrowPress);
      });

      function goBackOnLeftArrowPress(keyDownEvent: KeyboardEvent): void {
        if (keyDownEvent.key === 'ArrowLeft' && !isRoot.value) {
          goBack();
        }
      }

      return {
        isVisible,
        closeModal,
        currentFolderId,
        modalTitle,
        isRoot,
        goBack,
        canInteractWithItem,
        onFileClick,
        internalSelectedFilesIds,
        isSelectButtonDisabled,
        selectedButtonContent,
        clearItemsSelection,
        saveSelectedItems,
        onClosed,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .header {
    display: flex;
    align-items: center;

    &__title {
      margin-left: 8px;
    }
  }
</style>

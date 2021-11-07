<template>
  <div
    ref="root"
    class="files-structure"
    :class="[modeClassName, themeClassName, size]"
    :style="styleVariables"
  >
    <template v-if="isEmpty">
      <slot name="emptyFolderContent">
        <div class="empty-folder-content">
          {{ $t('empty-folder-message') }}
        </div>
      </slot>
    </template>
    <template v-else>
      <UiItem
        v-for="item in filesStructureItems"
        :key="item.id"
        :item="item"
        :size="size"
        :mode="mode"
        :theme="theme"
        :disabled="isItemDisabled(item)"
        :inactive="isItemInactive(item)"
        :followable="isItemFollowable(item)"
        :selected="isItemSelected(item)"
        class="files-structure__item js-item"
        @click="() => onItemClick(item)"
        @focus="onFocus"
        @blur="onBlur"
      >
      </UiItem>
    </template>
  </div>
</template>

<script lang="ts">
  import {
    defineComponent,
    PropType,
    ref,
    computed,
    watch,
    watchEffect,
    onMounted,
    nextTick,
    onUnmounted,
  } from 'vue';
  import type { StylingVariablesMap } from '@/types/common';
  import { FilesStructure, Folder, File, FilesStructureItem } from '@/types/filesStructure';
  import { findFolderById, isFile } from '@/utils/filesStructure';
  import { getFocusableSibling } from '@/utils/DOM';
  import {
    SortItemsFunction,
    ShouldHideFolderFunction,
    ShouldHideFileFunction,
    CanInteractWithItemFunction,
    Mode,
    Theme,
    Size,
  } from './types';
  import UiItem from './components/UiItem/UiItem.vue';

  export default defineComponent({
    name: 'UiFilesStructure',
    components: { UiItem },
    props: {
      filesStructure: { type: Object as PropType<FilesStructure>, required: true },
      currentFolderId: { type: String, default: '' },
      selectedItemsIds: { type: Array as PropType<string[]>, default: () => [] },

      mode: { type: String as PropType<Mode>, default: Mode.Default },
      theme: { type: String as PropType<Theme>, default: Theme.Default },
      size: { type: String as PropType<Size>, default: Size.Medium },

      allowOpenEmptyFolder: { type: Boolean, default: false },

      sortItems: {
        type: Function as PropType<SortItemsFunction>,
        default: (items: FilesStructureItem[]) => items,
      },
      shouldHideFolder: {
        type: Function as PropType<ShouldHideFolderFunction>,
        default: () => false,
      },
      shouldHideFile: { type: Function as PropType<ShouldHideFileFunction>, default: () => false },
      canInteractWithItem: {
        type: Function as PropType<CanInteractWithItemFunction>,
        default: () => false,
      },

      itemsMargin: { type: String, default: '0px' },
    },
    emits: ['update:currentFolderId', 'click-folder', 'click-file'],
    setup(props, { emit }) {
      const root = ref(null);

      /* Current folder ID related */
      const currentActiveFolderId = ref(props.currentFolderId);
      watch(
        () => props.currentFolderId,
        () => {
          if (currentActiveFolderId.value !== props.currentFolderId) {
            currentActiveFolderId.value = props.currentFolderId;
          }
        },
      );
      watchEffect(() => {
        emit('update:currentFolderId', currentActiveFolderId.value);
      });

      /* Folder contents */
      const currentFolderContents = computed((): FilesStructure | Folder => {
        if (currentActiveFolderId.value) {
          const folderContents = findFolderById(props.filesStructure, currentActiveFolderId.value);
          if (folderContents) return folderContents;
        }

        return props.filesStructure;
      });

      const filesStructureItems = computed((): FilesStructureItem[] => {
        return props.sortItems([
          ...currentFolderContents.value.folders.filter(
            (folder) => !props.shouldHideFolder(folder),
          ),
          ...currentFolderContents.value.files.filter((file) => !props.shouldHideFile(file)),
        ]);
      });

      /* Emptiness */
      const isEmpty = computed(() => {
        return isFolderEmpty(currentFolderContents.value);
      });

      const isFolderEmpty = (folder: FilesStructure | Folder) => {
        const visibleFiles = folder.files.filter((file) => !props.shouldHideFile(file));
        return !folder.folders.length && !visibleFiles.length;
      };

      /* Disabled state of item */
      function isItemDisabled(item: FilesStructureItem): boolean {
        if (isFile(item)) return isFileDisabled(item);
        return isFolderDisabled(item);
      }
      const isFileDisabled: (file: File) => boolean = () => false;
      const isFolderDisabled = (folder: Folder) => {
        if (props.canInteractWithItem(folder)) return false;
        return !isFolderFollowable(folder);
      };

      /* Inactivity */
      function isItemInactive(item: FilesStructureItem): boolean {
        if (isFile(item)) return isFileInactive(item);
        return isFolderInactive(item);
      }
      const isFileInactive = (file: File) => {
        return !props.canInteractWithItem(file);
      };
      const isFolderInactive: (folder: Folder) => boolean = () => false;

      /* Followability */
      function isItemFollowable(item: FilesStructureItem): boolean {
        if (isFile(item)) return isFileFollowable(item);
        return isFolderFollowable(item);
      }
      const isFileFollowable: (file: File) => boolean = () => false;
      const isFolderFollowable = (folder: Folder) => {
        return props.allowOpenEmptyFolder || !isFolderEmpty(folder);
      };

      /* Selection */
      function isItemSelected(item: FilesStructureItem): boolean {
        return props.selectedItemsIds.includes(item.id);
      }

      /* Click handling */
      function onItemClick(item: FilesStructureItem): void {
        if (isFile(item)) onFileClick(item);
        else onFolderClick(item);
      }

      const onFileClick = (file: File) => {
        emit('click-file', file);
      };

      const onFolderClick = (folder: Folder) => {
        if (isFolderFollowable(folder)) {
          currentActiveFolderId.value = folder.id;
        }
        emit('click-folder', folder);
      };

      /* Styling */
      const modeClassName = computed(() => `mode-${props.mode}`);
      const themeClassName = computed(() => `theme-${props.theme}`);

      const styleVariables = computed((): StylingVariablesMap => {
        return {
          '--items-margin': props.itemsMargin,
        };
      });

      /* Accessability */
      const currentFocusedItem = ref<HTMLDivElement | null>(null);

      onMounted(() => {
        focusOnFirstItem();
      });

      onMounted(() => {
        document.addEventListener('keydown', onKeyDown);
      });

      onUnmounted(() => {
        document.removeEventListener('keydown', onKeyDown);
      });

      watch(
        () => currentActiveFolderId.value,
        () => {
          nextTick(() => focusOnFirstItem());
        },
      );

      function focusOnFirstItem(): void {
        const container = root.value as unknown as HTMLDivElement;
        const items: HTMLDivElement[] = Array.from(
          container.querySelectorAll('.js-item[tabindex="0"]'),
        );
        if (items[0]) items[0].focus();
      }

      function focusOnCurrentFocusedItemSibling(direction: 'previous' | 'next'): void {
        if (!currentFocusedItem.value) focusOnFirstItem();
        else {
          const sibling = getFocusableSibling(currentFocusedItem.value, direction);
          if (sibling) sibling.focus();
          else focusOnFirstItem();
        }
      }

      function onFocus(event: FocusEvent): void {
        const element = event.target as any;
        if (element && element.classList.contains('js-item')) {
          currentFocusedItem.value = element;
        }
      }

      function onBlur(event: FocusEvent): void {
        const element = event.target as any;
        // Resetting, to always begin selection from start
        if (element && element === currentFocusedItem.value) {
          currentFocusedItem.value = null;
        }
      }

      function onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'ArrowUp') {
          focusOnCurrentFocusedItemSibling('previous');
        }

        if (event.key === 'ArrowDown') {
          focusOnCurrentFocusedItemSibling('next');
        }
      }

      return {
        root,
        onFocus,
        onBlur,
        modeClassName,
        themeClassName,
        filesStructureItems,
        isEmpty,
        styleVariables,
        isItemDisabled,
        isItemInactive,
        isItemFollowable,
        isItemSelected,
        onItemClick,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .files-structure {
    &__item {
      margin-bottom: var(--items-margin);

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .empty-folder-content {
    text-align: center;
    font-weight: bold;
    user-select: none;
  }
</style>

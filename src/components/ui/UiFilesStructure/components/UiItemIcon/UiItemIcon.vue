<template>
  <div class="icon" :class="[modeClassName, themeClassName, size]">
    <template v-if="isFile(item)">
      <template v-if="DISPLAYABLE_IMAGES_MIME_TYPES.includes(item.mimeType)">
        <FileImageOutlined />
        <div
          class="file-image"
          :style="{ background: `url(${item.url})`, backgroundSize: 'cover' }"
        />
      </template>
      <template v-else>
        <FileOutlined />
      </template>
    </template>

    <template v-if="isFolder(item)">
      <FolderOutlined />
    </template>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType, computed } from 'vue';
  import { FileOutlined, FileImageOutlined, FolderOutlined } from '@ant-design/icons-vue';
  import { FilesStructureItem } from '@/types/filesStructure';
  import { isFile, isFolder } from '@/utils/filesStructure';
  import { DISPLAYABLE_IMAGES_MIME_TYPES } from '@/config/filesStructure';
  import { Mode, Theme, Size } from '../../types';

  export default defineComponent({
    name: 'UiItemIcon',
    components: { FileOutlined, FileImageOutlined, FolderOutlined },
    props: {
      item: { type: Object as PropType<FilesStructureItem>, required: true },
      mode: { type: String as PropType<Mode>, default: Mode.Default },
      theme: { type: String as PropType<Theme>, default: Theme.Default },
      size: { type: String as PropType<Size>, default: Size.Medium },
    },
    setup(props) {
      const modeClassName = computed(() => `mode-${props.mode}`);
      const themeClassName = computed(() => `theme-${props.theme}`);

      return {
        DISPLAYABLE_IMAGES_MIME_TYPES,
        modeClassName,
        themeClassName,
        isFile,
        isFolder,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .icon {
    --border-radius: 8px;
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    &.small {
      --border-radius: 4px;
      height: 28px;
      width: 28px;
      font-size: 16px;
    }

    &.medium {
      height: 44px;
      width: 44px;
      font-size: 24px;
    }

    &.large {
      height: 52px;
      width: 52px;
      font-size: 32px;
    }

    &.mode-default {
      --bg-color: transparent;
      --icon-color: transparent;
      background: var(--bg-color);
      color: var(--icon-color);

      &.theme-default {
        --bg-color: var(--gray-color-1);
        --icon-color: var(--gray-color-3);
      }
    }
  }

  .file-image {
    border-radius: var(--border-radius);
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>

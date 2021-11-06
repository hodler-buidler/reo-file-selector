<template>
  <div class="wrapper">
    <div class="title wrapper__title">Files selected</div>
    <div class="files-container">
      <div v-for="file in files" :key="file.id" class="file-item files-container__item">
        {{ filters.shortenFileName(file.name) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType, computed } from 'vue';
  import { FilesStructure, File } from '@/types/filesStructure';
  import { findFileById } from '@/utils/filesStructure';
  import filters from '@/utils/filters';

  export default defineComponent({
    name: 'SelectedFilesDisplay',
    props: {
      filesStructure: { type: Object as PropType<FilesStructure>, required: true },
      selectedFilesIds: { type: Array as PropType<string[]>, required: true },
    },
    setup(props) {
      const files = computed((): File[] => {
        return props.selectedFilesIds
          .map((fileId) => findFileById(props.filesStructure, fileId))
          .filter((file) => !!file) as File[];
      });

      return { files, filters };
    },
  });
</script>

<style scoped lang="scss">
  .wrapper {
    &__title {
      margin-bottom: 8px;
    }
  }

  .title {
    font-weight: 600;
    line-height: 19px;
  }

  .files-container {
    &__item {
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .file-item {
    line-height: 19px;
  }
</style>

<template>
  <div>
    <a-button type="primary" @click="toggleLoading">Hello, World!</a-button>
    <div>Is loading: {{ isFilesStructureLoading }}</div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useAppStore } from '@/store';
  import { setFilesStructureLoading } from '@/store/modules/filesStructure';

  export default defineComponent({
    name: 'App',
    setup() {
      const { isFilesStructureLoading } = useAppStore((store) => store.filesStructure);

      const toggleLoading = () => {
        setFilesStructureLoading(!isFilesStructureLoading.value);
      };

      return { isFilesStructureLoading, toggleLoading };
    },
  });
</script>

<style scoped lang="scss"></style>

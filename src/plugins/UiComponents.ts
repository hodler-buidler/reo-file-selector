import UiButton from '@/components/ui/UiButton/UiButton.vue';
import UiFilesStructure from '@/components/ui/UiFilesStructure/UiFilesStructure.vue';
import UiModal from '@/components/ui/UiModal/UiModal.vue';
import { Plugin } from 'vue';

const UiComponents: Plugin = {
  install: (app) => {
    app.component('UiModal', UiModal);
    app.component('UiButton', UiButton);
    app.component('UiFilesStructure', UiFilesStructure);
  },
};

export default UiComponents;

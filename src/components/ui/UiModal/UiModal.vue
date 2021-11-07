<template>
  <a-modal
    v-model:visible="isVisible"
    :centered="centered"
    :mask="mask"
    :destroy-on-close="destroyOnClose"
    :body-style="{
      padding: `${verticalOffset} ${horizontalOffset}`,
      height: bodyHeight,
    }"
    class="ui-modal"
    :style="styleVariables"
  >
    <template #closeIcon>
      <UiButton @click="$emit('close-icon-click')">
        <CloseOutlined />
      </UiButton>
    </template>

    <template #title>
      <slot name="header" :closeModal="closeModal">
        <div />
      </slot>
    </template>

    <div class="ui-modal-content">
      <a-spin :spinning="loading" size="large" :tip="loadingText">
        <perfect-scrollbar class="scroll-container">
          <slot :closeModal="closeModal" />
        </perfect-scrollbar>
      </a-spin>
    </div>

    <template #footer>
      <slot name="footer" :closeModal="closeModal" />
    </template>
  </a-modal>
</template>

<script lang="ts">
  import { ref, watch, watchEffect, computed, defineComponent } from 'vue';
  import { CloseOutlined } from '@ant-design/icons-vue';
  import { StylingVariablesMap } from '@/types/common';
  import { localize } from '@/i18n';
  import filters from '@/utils/filters';

  export default defineComponent({
    name: 'UiModal',
    components: { CloseOutlined },
    props: {
      visible: { type: Boolean, required: true },

      centered: { type: Boolean, default: true },
      loading: { type: Boolean, default: false },
      loadingText: { type: String, default: `${filters.capitalize(localize('loading'))}...` },
      mask: { type: Boolean, default: false },
      destroyOnClose: { type: Boolean, default: false },

      hideDividerHeader: { type: Boolean, default: false },
      hideDividerFooter: { type: Boolean, default: false },

      width: { type: String, default: '520px' },
      bodyHeight: { type: String, default: '200px' },
      borderRadius: { type: String, default: '16px' },
      verticalOffset: { type: String, default: '8px' },
      horizontalOffset: { type: String, default: '16px' },
      headerPadding: { type: String, default: '8px 16px' },
      footerPadding: { type: String, default: '16px' },
    },
    emits: ['closed', 'opened', 'close-icon-click', 'update:visible'],
    setup(props, { emit, slots }) {
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
      watchEffect(() => {
        emit('update:visible', isVisible.value);
        if (isVisible.value) emit('opened');
        else emit('closed');
      });

      function closeModal(): void {
        isVisible.value = false;
      }

      /* Styling */
      const styleVariables = computed((): StylingVariablesMap => {
        return {
          '--border-radius': props.borderRadius,
          '--width': props.width,
          '--header-padding': props.headerPadding,
          '--footer-padding': props.footerPadding,
          '--footer-display-mode': slots.footer ? 'block' : 'none',
          '--divider-header': props.hideDividerHeader ? 'transparent' : '#f0f0f0',
          '--divider-footer': props.hideDividerFooter ? 'transparent' : '#f0f0f0',
        };
      });

      return { isVisible, closeModal, styleVariables };
    },
  });
</script>

<style lang="scss" scoped>
  ::v-global(.ui-modal.ant-modal) {
    width: var(--width) !important;
  }

  ::v-global(.ui-modal .ant-modal-content) {
    border-radius: var(--border-radius);
    display: grid;
    grid-template-rows: minmax(54px, auto) 1fr auto;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08), 0px 8px 24px rgba(0, 0, 0, 0.12);
  }

  ::v-global(.ui-modal .ant-modal-header) {
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
    padding: var(--header-padding);
    border-color: var(--divider-header);
  }

  ::v-global(.ui-modal .ant-modal-footer) {
    padding: var(--footer-padding);
    display: var(--footer-display-mode);
    border-color: var(--divider-header);
  }

  ::v-global(.ui-modal .ant-modal-title) {
    font-size: 20px;
    line-height: 44px;
    user-select: none;
  }

  ::v-global(.ui-modal .ant-modal-close) {
    top: 4px;
  }

  .ui-modal-content {
    height: 100%;
  }

  ::v-global(.ui-modal .ant-spin-nested-loading) {
    height: 100%;
  }

  ::v-global(.ui-modal .ant-spin-container) {
    max-height: 100%;
    height: 100%;
  }

  .scroll-container {
    height: 100%;
  }
</style>

<template>
  <div
    ref="root"
    :tabindex="isInteractive ? 0 : -1"
    class="item"
    :class="[
      {
        active: active,
        disabled: disabled,
        inactive: inactive,
      },
      modeClassName,
      themeClassName,
      size,
    ]"
    @click="onClick"
    @keyup.enter="onClick"
    @keyup.space="onClick"
    @keyup="onRightArrowClick"
  >
    <div class="visual-presentation">
      <div class="visual-presentation__icon">
        <UiItemIcon :item="item" size="small" :mode="mode" :theme="theme" />
      </div>

      <div class="item-name">
        {{ filters.shortenFileName(item.name) }}
      </div>
    </div>
    <div class="controls">
      <div v-if="selected" class="controls__item">
        <div class="selected-icon">
          <CheckOutlined />
        </div>
      </div>

      <div v-if="followable && isInteractive" class="follow-icon controls__item">
        <RightOutlined />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType, computed, ref } from 'vue';
  import { RightOutlined, CheckOutlined } from '@ant-design/icons-vue';
  import { FilesStructureItem } from '@/types/filesStructure';
  import filters from '@/utils/filters';
  import { Mode, Theme, Size } from '../../types';
  import UiItemIcon from '../UiItemIcon/UiItemIcon.vue';

  export default defineComponent({
    name: 'UiItem',
    components: { UiItemIcon, RightOutlined, CheckOutlined },
    props: {
      item: { type: Object as PropType<FilesStructureItem>, required: true },

      mode: { type: String as PropType<Mode>, default: Mode.Default },
      theme: { type: String as PropType<Theme>, default: Theme.Default },
      size: { type: String as PropType<Size>, default: Size.Medium },

      active: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
      inactive: { type: Boolean, default: false },
      followable: { type: Boolean, default: false },
      selected: { type: Boolean, default: false },
    },
    emits: ['click'],
    setup(props, { emit }) {
      const root = ref(null);

      const modeClassName = computed(() => `mode-${props.mode}`);
      const themeClassName = computed(() => `theme-${props.theme}`);

      const isInteractive = computed(() => !(props.disabled || props.inactive));

      function onClick(): void {
        if (isInteractive.value) emit('click');
      }

      function onRightArrowClick(keyDownEvent: KeyboardEvent): void {
        if (keyDownEvent.key === 'ArrowRight' && props.followable) {
          onClick();
        }
      }

      return {
        root,
        filters,
        modeClassName,
        themeClassName,
        isInteractive,
        onClick,
        onRightArrowClick,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .item {
    --padding: 8px;
    --border-radius: 8px;
    --name-font-size: 16px;
    --name-line-height: 18px;
    --select-icon-bg-color: var(--blue-color-1);
    padding: var(--padding);
    border-radius: var(--border-radius);
    box-sizing: border-box;
    transition: 0.2s all;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    outline: none;

    &.small {
      --padding: 4px;
      --border-radius: 4px;
      --name-font-size: 14px;
      --name-line-height: 14px;
    }

    &.large {
      --padding: 10px;
      --name-font-size: 18px;
      --name-line-height: 20px;
    }

    &.disabled {
      cursor: not-allowed;
    }

    &.disabled,
    &.inactive {
      .selected-icon {
        --select-icon-bg-color: var(--gray-color-3);
      }
    }

    &:not(.disabled):not(.inactive) {
      cursor: pointer;
    }

    &.mode-default {
      --hover-bg-color: transparent;
      --active-bg-color: transparent;
      --disabled-bg-color: transparent;
      --icon-offset-from-name: 12px;

      &.small {
        --icon-offset-from-name: 10px;
      }

      &.large {
        --icon-offset-from-name: 14px;
      }

      &:not(.disabled):not(.inactive) {
        &:hover,
        &:focus {
          background: var(--hover-bg-color);
        }

        &:active,
        &.active {
          background: var(--active-bg-color);
        }
      }

      .visual-presentation {
        display: flex;
        align-items: center;

        &__icon {
          margin-right: var(--icon-offset-from-name);
        }
      }

      &.disabled {
        opacity: 0.6;
        background: var(--disabled-bg-color);
      }

      &.theme-default {
        --hover-bg-color: var(--gray-color-1);
        --active-bg-color: var(--gray-color-2);
        --disabled-bg-color: var(--gray-color-1);

        .follow-icon {
          color: var(--dark-color-2);
        }
      }
    }
  }

  .item-name {
    font-size: var(--name-font-size);
    line-height: var(--name-line-height);
  }

  .controls {
    display: flex;
    align-items: center;

    &__item {
      margin-right: 14px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .selected-icon {
    background: var(--select-icon-bg-color);
    color: #ffffff;
    border-radius: 50%;
    font-size: 10px;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .follow-icon {
    font-size: 20px;
    line-height: 20px;
  }
</style>

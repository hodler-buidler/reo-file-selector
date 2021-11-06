<template>
  <div
    ref="root"
    class="btn"
    :class="[modeClassName, themeClassName, size, { disabled: disabled }]"
    :style="styleVariables"
    :tabindex="disabled ? -1 : 0"
    @click="onClick"
    @keyup.enter="onClick"
  >
    <slot />
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, PropType } from 'vue';
  import { Mode, Theme, Size } from './types';
  import type { StylingVariablesMap } from '@/types/common';

  type Customization = {
    [key: string]: string | undefined;
    'min-width'?: string;
    'font-size'?: string;
    height?: string;
    'border-radius'?: string;
    'border-thickness'?: string;
    'border-type'?: string;
    'border-color'?: string;
    'horizontal-offset'?: string;
    'text-color'?: string;
    'disabled-text-color'?: string;
    'disabled-border-color'?: string;
    'disabled-background-color'?: string;
    'hover-bg-color'?: string;
    'active-text-color'?: string;
  };

  export default defineComponent({
    name: 'UiButton',
    props: {
      mode: { type: String as PropType<Mode>, default: Mode.Default },
      theme: { type: String as PropType<Theme>, default: Theme.Default },
      size: { type: String as PropType<Size>, default: Size.Medium },
      customization: { type: Object as PropType<Customization>, default: () => ({}) },
      disabled: { type: Boolean, default: false },
    },
    emits: ['click'],
    setup(props, { emit }) {
      const root = ref(null);

      const styleVariables = computed((): StylingVariablesMap => {
        const themeSettings: Record<any, any> = {};

        Object.keys(props.customization).forEach((key) => {
          themeSettings[`--btn-${key}`] = props.customization[key];
        });

        return {
          ...themeSettings,
        };
      });

      const modeClassName = computed(() => {
        return `mode-${props.mode}-btn`;
      });

      const themeClassName = computed(() => {
        return `theme-${props.theme}`;
      });

      function onClick(): void {
        const button = root.value as unknown as HTMLButtonElement;
        button.blur();
        if (!props.disabled) emit('click');
      }

      return {
        root,
        styleVariables,
        modeClassName,
        themeClassName,
        onClick,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .btn {
    box-sizing: border-box;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    min-width: var(--btn-min-width, auto);

    &:not(.disabled) {
      cursor: pointer;
    }

    &.disabled {
      cursor: not-allowed;
    }

    &.small {
      font-size: var(--btn-font-size, 12px);
      height: var(--btn-height, 28px);
      min-width: var(--btn-height, 28px);
      line-height: var(--btn-height, 28px);
    }

    &.medium {
      height: var(--btn-height, 44px);
      min-width: var(--btn-height, 44px);
      line-height: var(--btn-height, 44px);
    }

    &.large {
      font-size: var(--btn-font-size, 120%);
      height: var(--btn-height, 52px);
      min-width: var(--btn-height, 52px);
      line-height: var(--btn-height, 52px);
    }
  }

  .mode-default-btn {
    border-radius: var(--btn-border-radius, 8px);
    border: var(--btn-border-thickness, 1px) var(--btn-border-type, solid);
    transition: 0.3s all;

    &.small {
      padding: 0 var(--btn-horizontal-offset, 4px);
    }

    &.medium {
      padding: 0 var(--btn-horizontal-offset, 8px);
    }

    &.large {
      padding: 0 var(--btn-horizontal-offset, 12px);
    }

    &.disabled {
      color: var(--btn-disabled-text-color, rgba(#595959, 0.4));
      border-color: var(--btn-disabled-border-color, transparent);
      background: var(--btn-disabled-background-color, rgba(0, 0, 0, 0.05));
    }

    &:not(.disabled).theme-default {
      color: var(--btn-text-color, var(--dark-color-2));
      border-color: var(--btn-border-color, transparent);

      &:hover,
      &:focus {
        background: var(--btn-hover-bg-color, var(--gray-color-1));
      }

      &:active {
        color: var(--btn-active-text-color, #000000);
      }
    }
  }
</style>

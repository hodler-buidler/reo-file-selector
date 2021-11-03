import { useAppStore } from '@/store';
import { popMessagesStack } from '@/store/modules/app';
import { AppMessage } from '@/types/app';
import { notification } from 'ant-design-vue';
import { nextTick, watch } from 'vue';

function useAppMessagesDisplay(): void {
  const { messages } = useAppStore((store) => store.app);

  watch(
    () => messages,
    (updatedMessages, old) => {
      if (
        !updatedMessages.value.length ||
        (old && updatedMessages.value.length <= old.value.length)
      )
        return;
      printMessage(updatedMessages.value[0]);
      nextTick(() => {
        popMessagesStack();
      });
    },
    { deep: true, immediate: true },
  );

  function printMessage(message: AppMessage): void {
    notification[message.type]({
      message: message.title,
      description: message.description,
      placement: message.placement,
    });
  }
}

export default useAppMessagesDisplay;

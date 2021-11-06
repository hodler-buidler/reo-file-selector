import { Button, Modal, Spin } from 'ant-design-vue';
import { Plugin } from 'vue';

const AntComponents: Plugin = {
  install: (app) => {
    app.use(Button);
    app.use(Modal);
    app.use(Spin);
  },
};

export default AntComponents;

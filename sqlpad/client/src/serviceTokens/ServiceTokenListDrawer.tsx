import React from 'react';
import Drawer from '../common/Drawer';
import ServiceTokenList from './ServiceTokenList';

function ServiceTokenListDrawer({ visible, onClose }: any) {
  return (
    <Drawer
      title="Service Tokens"
      visible={visible}
      width={600}
      onClose={onClose}
      placement="right"
    >
      <ServiceTokenList />
    </Drawer>
  );
}

export default ServiceTokenListDrawer;

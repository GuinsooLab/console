import React from 'react';
import Drawer from '../common/Drawer';
import ConnectionList from './ConnectionList';

function ConnectionListDrawer({ visible, onClose }: any) {
  return (
    <Drawer
      title="Connections"
      visible={visible}
      width={600}
      onClose={onClose}
      placement="right"
    >
      <ConnectionList />
    </Drawer>
  );
}

export default ConnectionListDrawer;

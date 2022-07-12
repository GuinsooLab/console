import React from 'react';
import AppHeaderAdminSection from './AppHeaderAdminSection';
import AppMenu from './AppMenu';
import HistoryButton from './HistoryButton';
// import Logo from './Logo';
import QueryListButton from './QueryListButton';
import ToolbarNewQueryButton from './ToolbarNewQueryButton';
import AppHeaderSpacer from './AppHeaderSpacer';
import AppHeaderUser from './AppHeaderUser';

function Appheader() {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#ffffff',
        padding: 6,
        borderBottom: '1px solid #d9d9d999',
        borderTop: '1px solid #d9d9d999',
      }}
    >
      <div style={{ display: 'flex' }}>
        <ToolbarNewQueryButton />
        <QueryListButton />
        <HistoryButton />
        <AppHeaderAdminSection />
        <AppHeaderSpacer grow />
        <AppHeaderUser />
        <AppMenu />
      </div>
    </div>
  );
}

export default React.memo(Appheader);

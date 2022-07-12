import { MenuItem } from '@reach/menu-button';
import DotsVerticalIcon from 'mdi-react/DotsVerticalIcon';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import IconMenu from '../common/IconMenu';
import { resetState } from '../stores/editor-actions';
import UserProfileModal from '../users/UserProfileModal';
import { api } from '../utilities/api';
import useAppContext from '../utilities/use-app-context';

function AppMenu() {
  const { currentUser } = useAppContext();
  const [showProfile, setShowProfile] = useState(false);
  const history = useHistory();

  let hideUserItems = false;
  if (!currentUser || currentUser.id === 'noauth') {
    hideUserItems = true;
  }

  return (
    <div>
      <IconMenu variant="ghost" icon={<DotsVerticalIcon aria-label="menu" />}>
        <MenuItem hidden={hideUserItems} onSelect={() => setShowProfile(true)}>
          Profile
        </MenuItem>
        <MenuItem
          hidden={hideUserItems}
          onSelect={async () => {
            await api.signout();
            history.push(`/signin`);
            resetState();
          }}
        >
          Sign out
        </MenuItem>
      </IconMenu>

      <UserProfileModal
        visible={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </div>
  );
}

export default React.memo(AppMenu);

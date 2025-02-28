const initialState = {
  userData: null,
  lockScreen: false,
  rahatPasscode: '',
  backupToDriveStatus: false,
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USERDATA':
      return {...state, userData: action.userData};

    case 'SET_RAHAT_PASSCODE':
      return {
        ...state,
        lockScreen: true,
        rahatPasscode: action.passcode,
      };
    case 'UNLOCK_APP':
      return {
        ...state,
        lockScreen: false,
      };
    case 'LOCK_APP':
      return {
        ...state,
        lockScreen: true,
      };
    case 'BACKUP_TO_DRIVE_STATUS':
      return {
        ...state,
        backupToDriveStatus: action.payload,
      };

    default:
      return state;
  }
};

export default auth;

const INITIAL_STATE = {
  users: [],
  chat: [],
  userToDm: ''
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USERS':
      return { ...state, users: action.users };
    case 'SET_CHAT':
      return { ...state, chat: action.chat };
    case 'SET_USER_TO_DM':
      return { ...state, userToDm: action.userToDm };
    default:
      return INITIAL_STATE;
  }
};

export { INITIAL_STATE, reducer };

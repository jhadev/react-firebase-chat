const INITIAL_STATE = {
  showChat: true,
  chat: [],
  room: 'chat',
  roomList: [],
  users: []
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_CHAT':
      return { ...state, showChat: !state.showChat };
    case 'SET_MESSAGES':
      return { ...state, chat: action.chat };
    case 'SET_ROOM':
      return { ...state, room: action.room };
    case 'SET_ROOM_LIST':
      return { ...state, roomList: action.roomList };
    case 'SET_USERS':
      return { ...state, users: action.users };
    default:
      return INITIAL_STATE;
  }
};

export { INITIAL_STATE, reducer };

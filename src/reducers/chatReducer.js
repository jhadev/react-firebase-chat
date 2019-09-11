const INITIAL_STATE = {
  showChat: true,
  chat: [],
  room: 'chat',
  roomList: [],
  allUsers: []
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
      return { ...state, allUsers: action.allUsers };
    default:
      return INITIAL_STATE;
  }
};

export { INITIAL_STATE, reducer };

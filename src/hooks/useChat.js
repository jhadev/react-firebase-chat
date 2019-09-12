import { useEffect, useContext, useReducer } from 'react';
import { AuthUserContext } from '../components/Session';
import alert from '../sounds/sent.mp3';
const alertSound = new Audio(alert);

// takes in imported reducer function, initial state, firebase prop, type to handle effect switch.
const useChat = (reducer, INITIAL_STATE, firebase, type) => {
  const authUser = useContext(AuthUserContext);

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  // these are shared effects of both chat pages
  useEffect(() => {
    const handleUsers = snapshot => {
      const usersObj = snapshot.val();
      const users = Object.keys(usersObj).map(key => ({
        ...usersObj[key],
        uid: key
      }));

      dispatch({ type: 'SET_USERS', users });
    };
    // get all users
    firebase.users().on('value', handleUsers);
    return () => {
      firebase.users().off('value', handleUsers);
    };
  }, [authUser.email, dispatch, firebase]);

  useEffect(() => {
    if (type === 'dms') {
      const handleNewMessages = snapshot => {
        if (snapshot.val()) {
          const messages = Object.values(snapshot.val());

          const filterByPersonToDm = messages.filter(
            message =>
              (message.user === authUser.email &&
                message.receiver === state.userToDm) ||
              (message.user === state.userToDm &&
                message.receiver === authUser.email)
          );
          dispatch({ type: 'SET_CHAT', chat: filterByPersonToDm });
        }
      };
      firebase.dms().on('value', handleNewMessages);
      return () => {
        firebase.dms().off('value', handleNewMessages);
      };
    } else {
      const handleNewMessages = snapshot => {
        if (snapshot.val()) {
          const messages = Object.values(snapshot.val());
          // remove first msg bc it is a placeholder to create a new room
          messages.shift();
          dispatch({ type: 'SET_MESSAGES', chat: messages });
        }
      };
      firebase.chat(state.room).on('value', handleNewMessages);
      return () => {
        firebase.chat(state.room).off('value', handleNewMessages);
      };
    }
  }, [authUser.email, dispatch, firebase, type, state.userToDm, state.room]);

  useEffect(() => {
    if (state.chat.length > 0) {
      if (state.chat[state.chat.length - 1].user !== authUser.email) {
        alertSound.play();
      }
    }
  }, [authUser.email, state.chat]);

  return [state, dispatch, authUser];
};

export { useChat };

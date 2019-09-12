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
          alertSound.play();
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
          alertSound.play();
        }
      };
      firebase.chat(state.room).on('value', handleNewMessages);
      return () => {
        firebase.chat(state.room).off('value', handleNewMessages);
      };
    }
  }, [authUser.email, dispatch, firebase, type, state.userToDm, state.room]);

  return [state, dispatch, authUser];
};

export { useChat };

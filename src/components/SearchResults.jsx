import React, { useEffect, useContext, useRef } from 'react';
import AuthUserContext from '../components/Session/context';
import Message from '../components/Message';
import Row from '../components/common/Row';
import Column from '../components/common/Column';
import { useForm } from '../hooks/useForm';

const SearchResults = props => {
  const authUser = useContext(AuthUserContext);
  const inputRef = useRef(null);
  const { formState, setFormState, onChange } = useForm(
    {
      search: '',
      results: []
    },
    'search-results'
  );

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    setFormState({ search: '', results: [] });
  }, [props.room, setFormState]);

  useEffect(() => {
    if (formState.search !== '') {
      const results = props.chat.filter(({ message }) => {
        return message.includes(formState.search);
      });
      setFormState({ results });
    } else {
      setFormState({ results: [] });
    }
  }, [formState.search, props.chat, setFormState]);

  
  

  return (
    <div className="mb-2">
      <Row>
        <Column size={'md-3 12'}>
          <div className="sticky-top">
            <div id="spacer" />
            <div className="form-group mt-2">
              <label htmlFor="search-input">Search for messages in: {props.room}</label>
              <input 
                className="form-control mb-2" 
                ref={inputRef} 
                placeholder="Search" 
                type="search" 
                value={formState.search} 
                name="search" 
                onChange={onChange} 
                id="search-input"
              />
            </div>
            <button
              className={`btn btn-${props.showChat} btn-block`}
              onClick={() => props.dispatch({ type: 'TOGGLE_CHAT' })}>
              Back to <span>{props.room}</span>
            </button>
          </div>
        </Column>
        <Column size={'md-9 12'}>
          <div id="spacer" />
          {formState.results.length > 0 &&
            formState.results.map(({ user, timestamp, message, id }) => {
              return (
                <div
                  key={id}
                  className={`animated zoomIn d-flex flex-column my-2 align-items-${
                    authUser.email === user ? 'end' : 'start'
                  }`}>
                  <Message
                    color={authUser.email === user ? 'user' : 'receiver'}
                    message={message}
                    user={user}
                    timestamp={timestamp}
                  />
                </div>
              );
            })}
        </Column>
      </Row>
    </div>
  );
};

export default SearchResults;

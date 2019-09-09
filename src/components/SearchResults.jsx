import React, { useEffect, useContext, useRef } from 'react';
import AuthUserContext from '../components/Session/context';
import Message from '../components/Message';
import Row from '../components/common/Row';
import Column from '../components/common/Column';
import { useForm } from '../hooks/useForm';

const INITIAL_STATE = {
  search: '',
  results: [],
  filteredResults: [],
  userToFilter: '',
  filter: false
};

const SearchResults = props => {
  const authUser = useContext(AuthUserContext);
  const inputRef = useRef(null);

  const { formState, setFormState, onChange } = useForm(
    INITIAL_STATE,
    'search-results'
  );

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    setFormState(INITIAL_STATE);
  }, [props.room, setFormState]);

  useEffect(() => {
    if (formState.search !== '') {
      const results = props.chat.filter(({ message }) => {
        return message.includes(formState.search);
      });
      setFormState({
        results,
        filter: false,
        userToFilter: '',
        filteredResults: []
      });
    } else {
      setFormState({ results: [], filter: false, userToFilter: '' });
    }
  }, [formState.search, props.chat, setFormState]);

  useEffect(() => {
    if (formState.filter) {
      const filteredResults = formState.results.filter(
        result => result.user === formState.userToFilter
      );
      setFormState({ filteredResults });
    }
  }, [
    formState.filter,
    formState.results,
    formState.userToFilter,
    setFormState
  ]);

  const usersInSearch = () => {
    const usersOnly = formState.results.map(({ user }) => user);
    return ['All', ...new Set(usersOnly)];
  };

  const filterByUser = user => {
    inputRef.current.focus();
    if (user === 'All') {
      setFormState({ filter: false, userToFilter: '' });
    } else {
      setFormState({ filter: true, userToFilter: user });
    }
  };

  const displayUsers = usersInSearch();

  return (
    <div className="mb-2">
      <Row>
        <Column size={'md-3 12'}>
          <div className="sticky-top">
            <div id="spacer" />
            <div className="form-group mt-2">
              <label htmlFor="search-input">
                Search for messages in: {props.room}
              </label>
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
              className={`btn btn-${!props.showChat} btn-block`}
              onClick={() => props.dispatch({ type: 'TOGGLE_CHAT' })}>
              Back to <span>{props.room}</span>
            </button>
          </div>
        </Column>
        <Column size={'md-9 12'}>
          <div id="spacer" />
          {formState.results.length > 0 && !formState.filter ? (
            <div>
              <h4 className="mb-2">
                Displaying {formState.results.length} results for{' '}
                <span className="font-italic">{`'${formState.search}'`}</span>
              </h4>
              {displayUsers.length > 2 &&
                displayUsers.map((user, index) => {
                  return (
                    <button
                      key={index}
                      className={`btn btn-${
                        authUser.email === user ? 'true' : 'false'
                      } mx-1 mb-2`}
                      disabled={formState.userToFilter === user}
                      onClick={() => filterByUser(user)}>
                      {user}
                    </button>
                  );
                })}
              {formState.results.map(
                ({ user, timestamp, message, id }, index) => {
                  return (
                    <div
                      key={id || index}
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
                }
              )}
            </div>
          ) : formState.filteredResults.length > 0 && formState.filter ? (
            <div>
              <h4 className="mb-2">
                Displaying {formState.filteredResults.length} results for{' '}
                <span className="font-italic">{`'${formState.search}' `} </span>
              </h4>
              <div className="font-weight-bold my-2">
                {' '}
                {` by: ${formState.userToFilter}`}
              </div>
              {displayUsers.map((user, index) => {
                return (
                  <button
                    key={index}
                    className={`btn btn-${
                      authUser.email === user ? 'true' : 'false'
                    } mx-1 mb-2`}
                    disabled={formState.userToFilter === user}
                    onClick={() => filterByUser(user)}>
                    {user}
                  </button>
                );
              })}
              {formState.filteredResults.map(
                ({ user, timestamp, message, id }, index) => {
                  return (
                    <div
                      key={id || index}
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
                }
              )}
            </div>
          ) : (
            <h4>
              {formState.search === ''
                ? 'Waiting for search...'
                : 'No results found'}
            </h4>
          )}
        </Column>
      </Row>
    </div>
  );
};

export default SearchResults;

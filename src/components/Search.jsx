import React, { useEffect, useContext, useRef } from 'react';
import { AuthUserContext } from './Session';
import Row from './common/Row';
import Column from './common/Column';
import Results from './Results';
import { useForm } from '../hooks/useForm';
import searchGif from '../images/search.gif';
import frank from '../images/frank.gif';
import pikachu from '../images/pikachu.gif';
import nope from '../images/nope.gif';

const INITIAL_STATE = {
  search: '',
  results: [],
  filteredResults: [],
  userToFilter: '',
  filter: false
};

const Search = props => {
  const authUser = useContext(AuthUserContext);
  const inputRef = useRef(null);

  const { formState, setFormState, onChange } = useForm(
    INITIAL_STATE,
    'search-results'
  );

  const noResults = [frank, nope, pikachu];

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
      setFormState({
        results: [],
        filteredResults: [],
        filter: false,
        userToFilter: ''
      });
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

  // useEffect(() => {
  //   document.getElementById('bottom').scrollIntoView(false);
  // }, [formState.results, formState.filteredResults]);

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
            <div className="spacer" />
            <div className="form-group mt-2">
              <label htmlFor="search-input">
                Search in: <b>{props.room}</b>
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
              Back to <span className="font-italic">{props.room}</span>
            </button>
          </div>
        </Column>
        <Column size={'md-9 12'}>
          {formState.results.length > 0 ||
          formState.filteredResults.length > 0 ? (
            <Results
              results={
                !formState.filter
                  ? formState.results
                  : formState.filteredResults
              }
              displayUsers={displayUsers}
              search={formState.search}
              userToFilter={formState.userToFilter}
              filterByUser={filterByUser}
              authUser={authUser}
              getUserDetails={props.getUserDetails}
              users={props.users}
            />
          ) : (
            <div className="text-center">
              <div className="spacer" />
              <h4 className="mt-2">
                {formState.search === ''
                  ? 'Waiting for search...'
                  : 'No results found'}
              </h4>
              {formState.search === '' ? (
                <img src={searchGif} alt="search" className="img-fluid" />
              ) : (
                <Row helper={'justify-content-center'}>
                  <Column size={'md-6 12'}>
                    <img
                      className="shadow img-fluid border border-dark"
                      src={
                        noResults[Math.floor(Math.random() * noResults.length)]
                      }
                      alt="search"
                    />
                  </Column>
                </Row>
              )}
            </div>
          )}
        </Column>
      </Row>
      <div id="bottom" />
    </div>
  );
};

export default Search;

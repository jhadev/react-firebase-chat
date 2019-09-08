import React, { useEffect, useContext } from 'react';
import AuthUserContext from '../components/Session/context';
import Message from '../components/Message';
import Row from '../components/common/Row';
import Column from '../components/common/Column';
import { useForm } from '../hooks/useForm';

const SearchResults = props => {
  const authUser = useContext(AuthUserContext);
  console.log(props);
  const { formState, setFormState, mapInputs } = useForm(
    {
      search: '',
      results: []
    },
    'search-results'
  );

  useEffect(() => {
    setFormState({ search: '', results: [] });
  }, [props.room, setFormState]);

  useEffect(() => {
    if (formState.search !== '') {
      const results = props.chat.filter(chatMessage =>
        chatMessage.message.includes(formState.search)
      );
      setFormState({ results });
    } else {
      setFormState({ results: [] });
    }
  }, [formState.search, props.chat, setFormState]);

  const formOptions = [{ label: `Search for messages in: ${props.room}` }];
  const displayInputs = mapInputs(formState, ['search'])(formOptions);

  return (
    <div>
      <div className="form-group">{displayInputs}</div>
      <Row>
        {formState.results.length > 0 &&
          formState.results.map(({ user, timestamp, message, id }) => {
            return (
              <Column key={id} size={'12'}>
                <div className="w-100">
                  <Message
                    color={authUser.email === user ? 'user' : 'receiver'}
                    message={message}
                    user={user}
                    timestamp={timestamp}
                  />
                </div>
              </Column>
            );
          })}
      </Row>
    </div>
  );
};

export default SearchResults;

import React from 'react';
import Message from './Message';

const Results = props => {
  return (
    <div>
      <div className="sticky-top filter-bg">
        <div className="spacer" />
        <div className="searchDisplay shadow-sm rounded">
          <h4 className="my-2 mx-1">
            Displaying {props.results.length} results for{' '}
            <span className="font-italic">{`'${props.search}'`}</span>
          </h4>
          {props.userToFilter && (
            <div className="font-weight-bold my-2">
              {' '}
              {` by: ${props.userToFilter}`}
            </div>
          )}
          {props.displayUsers.length > 2 &&
            props.displayUsers.map((user, index) => {
              return (
                <button
                  key={index}
                  className={`btn btn-outline-${
                    props.authUser.email === user ? 'true' : 'false'
                  } btn-sm mx-1 mb-2`}
                  disabled={props.userToFilter === user}
                  onClick={() => props.filterByUser(user)}>
                  {user}
                </button>
              );
            })}
        </div>
      </div>
      {props.results.map(({ user, timestamp, message, id }, index) => {
        return (
          <div
            key={id || index}
            className={`animated ${
              props.authUser.email === user ? 'slideInRight' : 'slideInLeft'
            } faster d-flex flex-column my-2 align-items-${
              props.authUser.email === user ? 'end' : 'start'
            }`}>
            <Message
              color={props.authUser.email === user ? 'user' : 'receiver'}
              message={message}
              user={user}
              timestamp={timestamp}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Results;

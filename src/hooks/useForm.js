import React, { useReducer } from 'react';

// reducer to emulate this.setState
const reducer = (currentState, newState) => {
  return { ...currentState, ...newState };
};

// call useForm with initialState object in any functional component
const useForm = initialState => {
  // initialize useReducer and extract state object and setState function from it.
  const [formState, setFormState] = useReducer(reducer, initialState);

  // handle setting state with the value of the input based on input name tags
  const onChange = event => {
    const { name, value } = event.target;
    setFormState({ [name]: value });
  };

  // takes in the formState object as an arg in the functional component
  // create an array of arrays with key, value pairs.
  // return a closure that uses the state object to map inputs as JSX
  const mapInputs = state => {
    const stateArr = Object.entries(state);
    return args => {
      if (args) {
        args = [...args];
      } else {
        args = [];
        args.length = stateArr.length;
        args = [...args].map(() => ({}));
      }
      return stateArr.map(([key, value], index) => {
        // index as key is an anti-pattern but it is perfect in this case
        return (
          <React.Fragment key={index}>
            {args[index].label && (
              <label htmlFor={args[index].id || `${key}-${index}`}>
                {args[index].label || `Enter your ${key}`}
              </label>
            )}
            <input
              className={args[index].className || `form-control mb-3`}
              id={args[index].id || `${key}-${index}`}
              type={args[index].type || key}
              placeholder={
                args[index].placeholder ||
                `${key.charAt(0).toUpperCase() + key.slice(1)}`
              }
              name={key}
              value={value}
              onChange={onChange}
            />
          </React.Fragment>
        );
      });
    };
  };

  return { formState, setFormState, onChange, mapInputs };
};

export { useForm };

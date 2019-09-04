import React, { useReducer } from 'react';

const reducer = (currentState, newState) => {
  return { ...currentState, ...newState };
};
// input type check
const types = [
  'date',
  'datetime-local',
  'email',
  'number',
  'password',
  'range',
  'search',
  'tel',
  'time',
  'url',
  'week',
  'month'
];
// used but unnecessary leaving for future use...
const genId = () => {
  let cache = {};
  return (formName, key, index) => {
    if (!cache[`${formName}-${key}-${index}`]) {
      cache[`${formName}-${key}-${index}`] = `${formName}-${key}`;
    }
    return cache;
  };
};
const createCache = genId();

const useForm = (initialState, formName = 'default') => {
  const [formState, setFormState] = useReducer(reducer, initialState);

  const onChange = event => {
    const { name, value } = event.target;
    setFormState({ [name]: value });
  };

  const mapInputs = (state, filter) => {
    let stateToMap = Object.entries(state);

    if (filter) {
      const filteredState = filter.reduce(
        (obj, key) => ({ ...obj, [key]: state[key] }),
        {}
      );
      stateToMap = Object.entries(filteredState);
    }

    return (options = []) => {
      if (options.length) {
        // placeholder to do something else.
        options = [...options];
        const [{ className }] = options;
        if (className) {
          options = options.map(dependency => {
            if (!dependency.className) {
              return { ...dependency, className: className };
            }
            return dependency;
          });
        }
      } else {
        options.length = stateToMap.length;
        options = [...options].map(() => ({}));
      }

      return stateToMap.map(([key, value], index) => {
        const genned = createCache(formName, key, index);
        const { label, id, className, placeholder, type, textarea } = options[
          index
        ];

        return (
          <React.Fragment key={index}>
            {label && (
              <label htmlFor={id || `${genned[`${formName}-${key}-${index}`]}`}>
                {label}
              </label>
            )}
            {textarea ? (
              <textarea
                className={className || `form-control mb-3`}
                id={id || `${genned[`${formName}-${key}-${index}`]}`}
                rows={textarea.rows || 3}
                placeholder={
                  placeholder || `${key.charAt(0).toUpperCase() + key.slice(1)}`
                }
                maxLength={textarea.maxLength || null}
                name={key}
                value={value}
                onChange={onChange}
              />
            ) : (
              <input
                className={className || `form-control mb-3`}
                id={id || `${genned[`${formName}-${key}-${index}`]}`}
                type={type ? type : types.includes(key) ? key : 'text'}
                placeholder={
                  placeholder || `${key.charAt(0).toUpperCase() + key.slice(1)}`
                }
                name={key}
                value={value}
                onChange={onChange}
              />
            )}
          </React.Fragment>
        );
      });
    };
  };

  return { formState, setFormState, onChange, mapInputs };
};

export { useForm };

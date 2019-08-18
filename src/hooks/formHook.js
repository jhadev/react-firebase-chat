import { useReducer } from 'react';

const reducer = (currentState, newState) => {
  return { ...currentState, ...newState };
};

const useForm = initialState => {
  const [formState, setFormState] = useReducer(reducer, initialState);

  const onChange = event => {
    const { name, value } = event.target;
    setFormState({ success: false, [name]: value });
  };

  return { formState, setFormState, onChange };
};

export { useForm };

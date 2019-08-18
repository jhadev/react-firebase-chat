import { useState } from 'react';

const useForm = initialState => {
  const [formState, setFormState] = useState(initialState);

  const onChange = event => {
    const { name, value } = event.target;
    setFormState({ ...formState, success: false, [name]: value });
  };

  return { formState, setFormState, onChange };
};

export { useForm };

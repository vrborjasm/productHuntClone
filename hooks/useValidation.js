import React, { useState, useEffect } from 'react';



const useValidation = (initialState, validationRules, fn) => {
    
    const [values, setValues] = useState(initialState);
    const [error, setError] = useState({});
    const [submitForm, setSubmitForm] = useState(false);

    useEffect(() => {
        if(submitForm) {
            const noError = Object.keys(error).length === 0;

            if(noError) {
                fn();
            }

            setSubmitForm(false);
        }
    },[error]);

    const handleChange = e => {
        setValues({
            ...values,
            [e.target.name] : e.target.value
        })
    }

    const handleBlur = () => {
        const errorValidation =  validationRules(values);
        setError(errorValidation);
    }

    const handleSubmit = e => {
        e.preventDefault();
        const errorValidation =  validationRules(values);
        setError(errorValidation);
        setSubmitForm(true);
    }

    return {
        values,
        error,
        handleChange,
        handleSubmit,
        handleBlur
    };
}
 
export default useValidation;
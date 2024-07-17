import { useState, useEffect } from "react";

export const usePasswordValidation = ({ passwordToCheck = ""}) => {
    const [validLength, setValidLength] = useState(null);
    const [hasNumber, setHasNumber] = useState(null);
    const [upperCase, setUpperCase] = useState(null);
    const [lowerCase, setLowerCase] = useState(null);

    useEffect(() => {
        setValidLength(passwordToCheck.length>=6?true:false)
        setUpperCase(passwordToCheck.toLowerCase() !== passwordToCheck);
        setLowerCase(passwordToCheck.toUpperCase() !== passwordToCheck);
        setHasNumber(/\d/.test(passwordToCheck));

    }, [passwordToCheck]);

    return [validLength, hasNumber, upperCase, lowerCase];
}
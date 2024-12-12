import { useEffect, useState } from 'react';

export default function useLocalStorage(key, initValue) {
    const [localValue, setLocalValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initValue;
        } catch (error) {
            console.log(error);
            return initValue;
        }
    });

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(localValue));
    }, [key, localValue]);

    // return [localValue, setValue];
    return [localValue, setLocalValue];
}
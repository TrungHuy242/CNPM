import React, { useContext } from 'react';
import { SearchContext } from '../../store/SearchContext';

function Register() {
    const [data, dispatch] = useContext(SearchContext);
    const { step } = data;

    if (step !== 3) return null;

    return (
        <div>
            <h1>Phiếu đặt phòng</h1>
            <button onClick={ev => {
                dispatch({
                    type: 'changeSearch',
                    payload: {
                        step: (step <= 1 ? 1 : step - 1)
                    }
                })
            }} className='btn'>&lt; Trở lại</button>
        </div>
    )
}

export default Register;
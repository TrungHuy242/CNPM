import React, { useState } from 'react';
import SelectList from '../SelectList'; // Điều chỉnh đường dẫn dựa trên cấu trúc thư mục của bạn

function ParentComponent() {
    const [resetValue, setResetValue] = useState(0); // Giá trị mặc định
    const [selectedValue, setSelectedValue] = useState(0);

    const handleReset = () => {
        setResetValue(0); // Reset về giá trị mặc định
    };

    return (
        <div>
            <SelectList
                name="example"
                start={0}
                end={10}
                text="Item"
                css="form-item"
                num={selectedValue}
                onChange={setSelectedValue}
                resetValue={resetValue} // Truyền giá trị reset
            />
            <button onClick={handleReset}>Reset</button>
        </div>
    );
}

export default ParentComponent;
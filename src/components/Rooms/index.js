import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { SearchContext } from '../../store/SearchContext';
import Room from '../Room/index';
import './style.scss';

function Rooms() {
    const [data, dispatch] = useContext(SearchContext);  // Thêm dispatch để cập nhật trạng thái
    const [rooms, setRooms] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);  // Trang hiện tại
    const roomsPerPage = 4;  // Số phòng mỗi trang

    useEffect(() => {
        if (data.step !== 1) return;

        const fetchRooms = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/rooms', {
                    params: {
                        adults: data.adults || 0,
                        children: data.children || 0
                    }
                });

                const totalPeople = parseInt(data.adults) + parseInt(data.children);
                const availableRooms = response.data.filter(room => room.capacity >= totalPeople);

                setRooms(availableRooms);  // Lưu phòng vào state
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();
    }, [data]);

    // Tính toán các phòng cần hiển thị
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);

    const handleSelectRoom = (room) => {
        // Lưu thông tin phòng đã chọn vào SearchContext
        dispatch({
            type: 'setRoom',
            payload: {
                id: room.id,  // room_id
                name: room.name,
                price: room.price,
            },
        });
    };

    if (data.step !== 1) return null;

    return (
        <section>
            {currentRooms.map((room) => (
                <Room
                    key={room.id}
                    info={room}
                    selected={data.room?.id === room.id}
                    onSelect={handleSelectRoom}  // Truyền callback xuống Room
                />
            ))}

            {/* Pagination controls */}
            <div className="pagination">
                <button 
                    className="pagination-button pagination-prev"
                    onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))} 
                    disabled={currentPage === 1}>
                    Previous
                </button>
                <span className="pagination-number">
                    <span> {currentPage}</span>
                </span>
                <button 
                    className="pagination-button pagination-next"
                    onClick={() => setCurrentPage(prevPage => prevPage + 1)} 
                    disabled={rooms.length <= currentPage * roomsPerPage}>
                    Next
                </button>
            </div>

        </section>
    );
}

export default Rooms;

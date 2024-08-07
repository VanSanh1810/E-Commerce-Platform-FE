import { createContext, useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const SocketIOContext = createContext();

function SocketIOProvider({ children }) {
    // const dispatch = useDispatch();
    const { userId } = useSelector((state) => {
        return state;
    });
    // const [_socket, setMySocket] = useState(null);
    const socket = io(process.env.NEXT_PUBLIC_SERVER_DOMAIN);
    useEffect(() => {
        console.log(userId);
        socket.once('connect', () => {
            if (userId) {
                socket.emit('assign-user-data', userId, 'user');
                console.log('assign-user-data', userId, 'user');
            }
        });
        return () => {
            // socket.disconnect();
            socket.emit('logout', userId);
            socket.close();
        };
    }, [userId, socket]);
    return <SocketIOContext.Provider value={{ socket: socket }}>{children}</SocketIOContext.Provider>;
}

export { SocketIOContext, SocketIOProvider };

// const mapStateToProps = (state) => ({
//     userId: state.userId,
// });

// // const mapDispatchToProps = {
// //     userLogin,
// //     userLogout,
// // };

// export default connect(mapStateToProps, null)(SocketIOContext);

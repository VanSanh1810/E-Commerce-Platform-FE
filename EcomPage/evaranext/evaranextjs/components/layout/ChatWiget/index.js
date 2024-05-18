// import external styling
import { useContext, useEffect, useState } from 'react';
import { styles } from './styles';
import ModalWindow from '../ModalWindow';
// import icon
import { BsFillChatFill } from 'react-icons/bs';
import { SocketIOContext } from '../../../contexts/SocketIOContext';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedConversation } from '../../../redux/action/conversation';
import axiosInstance from '../../../config/axiosInstance';

const ChatWidget = () => {
    const dispatch = useDispatch();
    //
    const { socket } = useContext(SocketIOContext);
    const { conversation } = useSelector((state) => {
        return state;
    });
    const { userId } = useSelector((state) => {
        return state;
    });
    // state variable to track modal visibility
    const [visible, setVisible] = useState(false);
    //
    const [totalUnseenMessages, setTotalUnseenMessages] = useState([]);
    const [reloadAction, setReloadAction] = useState(false);

    // dont touch the code
    useEffect(() => {
        if (conversation) {
            setVisible(true);
        }
    }, [conversation]);

    useEffect(() => {
        if (!visible) {
            dispatch(setSelectedConversation(null));
        }
    }, [visible]);
    ///
    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const response = await axiosInstance.get('/api/conversation');
                setTotalUnseenMessages(response.data.totalUnseen);
                // console.log(response);
            } catch (error) {
                console.error(error);
            }
        };
        fetchConversation();
    }, [reloadAction, visible, userId]);

    useEffect(() => {
        socket.on('receive-message', (messageObj, targetUserId, role, conversationId) => {
            console.log(1);
            setReloadAction(!reloadAction);
        });
        return () => socket.off('receive-message');
    }, [socket, reloadAction, visible]);
    //
    const calculateUnseen = (_totalUnseenMessages) => {
        if (!_totalUnseenMessages) {
            return 0;
        }
        const total = [..._totalUnseenMessages].reduce((acc, con) => {
            return con.total + acc;
        }, 0);
        return total;
    };
    //
    const totalUnseenUI = (num) => {
        if (num < 100) {
            return num;
        }
        return '+99';
    };

    return (
        <div>
            {/* Call Modal Window */}
            <ModalWindow visible={visible} setReloadAction={setReloadAction} reloadAction={reloadAction} />
            {/* Chat Button Component */}
            <div
                onClick={() => setVisible(!visible)}
                style={{
                    ...styles.chatWidget,
                    ...{ zIndex: '100' },
                }}
            >
                {/* Inner Container */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {/* Button Icon */}
                    <BsFillChatFill size={20} color="white" />
                    {/* Button Text */}
                    <span style={{ ...styles.chatWidgetText, userSelect: 'none' }}>Chat Now!!</span>
                    {calculateUnseen(totalUnseenMessages) > 0 ? (
                        <span
                            style={{
                                padding: calculateUnseen(totalUnseenMessages) < 100 ? '1px 7px' : '1px 5px',
                                backgroundColor: '#f02626',
                                borderRadius: '6px',
                                position: 'absolute',
                                top: '-8px',
                                right: calculateUnseen(totalUnseenMessages) < 100 ? '-8px' : '-20px',
                                color: '#f5f5f5',
                            }}
                        >
                            {totalUnseenUI(calculateUnseen(totalUnseenMessages))}
                        </span>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default ChatWidget;

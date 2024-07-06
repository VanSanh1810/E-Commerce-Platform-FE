import { Row, Col, Dropdown, Badge } from 'react-bootstrap';
// importing external style
import { styles } from '../ChatWiget/styles';
import axiosInstance from '../../../config/axiosInstance';
import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedConversation } from '../../../redux/action/conversation';
import { SocketIOContext } from '../../../contexts/SocketIOContext';
import { debounce } from 'lodash';
//for displaying the model view/Window
const ModalWindow = ({ visible, setReloadAction, reloadAction }) => {
    const dispatch = useDispatch();
    const { conversation } = useSelector((state) => {
        return state;
    });
    const { userId } = useSelector((state) => {
        return state;
    });

    const messageContainerRef = useRef();

    const { socket } = useContext(SocketIOContext);
    //state
    const [selectedConversationMessage, setSelectedConversationMessage] = useState([]);
    const [selectedConversationData, setSelectedConversationData] = useState();
    //
    const [listConversation, setListConversation] = useState([]);
    const [totalUnseenMessages, setTotalUnseenMessages] = useState([]);
    //
    const [messToSend, setMessToSend] = useState('');

    //fetch the selected conversation messages
    useEffect(() => {
        const fetchSelectedConversationMessage = async () => {
            try {
                const response = await axiosInstance.get(`/api/conversation/message/${conversation}`);
                setSelectedConversationMessage([...response.data.messages]);
            } catch (e) {
                console.error(e);
            }
        };
        if (conversation) {
            fetchSelectedConversationMessage();
            setReloadAction((st) => !st);
        }
    }, [conversation]);

    //fetch all conversations
    useEffect(() => {
        const fetchMyConversation = async () => {
            try {
                const response = await axiosInstance.get('/api/conversation');
                setListConversation(response.data.conversations);
                setTotalUnseenMessages(response.data.totalUnseen);
            } catch (e) {
                console.error(e);
            }
        };
        if (visible) {
            fetchMyConversation();
        } else {
            setSelectedConversationMessage([]);
            setSelectedConversationData([]);
            setListConversation([]);
            setTotalUnseenMessages([]);
        }
    }, [visible]);

    useEffect(() => {
        socket.on('receive-message', async (messageObj, targetUserId, role, conversationId) => {
            // setReloadAction((st) => !st);
            if (conversationId === conversation) {
                console.log('1: ', messageObj);
                setSelectedConversationMessage((st) => {
                    const temp = [...st];
                    temp.push({ content: messageObj.content, sender: messageObj.sender });
                    return [...temp];
                });
            } else {
                console.log('2: ', messageObj);
                setTotalUnseenMessages((st) => {
                    const temp = [...st];
                    for (let i = 0; i < temp.length; i++) {
                        if (temp[i]._id === conversationId) {
                            temp[i].total = temp[i].total + 1;
                            break;
                        }
                    }
                    return [...temp];
                });
                // setReload(!reload);
            }
        });
        return () => socket.off('receive-message');
    }, [socket, conversation, reloadAction]);

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [selectedConversationMessage, messageContainerRef, conversation, selectedConversationData]);

    const sendMess = async () => {
        if (messToSend.trim() && conversation) {
            const listUser = [...listConversation.find((con) => con._id === conversation).user];
            const target = listUser.find((u) => u._id !== userId);
            //
            socket.emit('send-message', { content: messToSend, sender: userId }, target._id, target.type, conversation);
            //
            const temp = [...selectedConversationMessage];
            temp.push({ sender: userId, content: messToSend });
            setSelectedConversationMessage([...temp]);
            setMessToSend('');
        }
    };

    return (
        <div
            style={{
                ...styles.modalWindow,
                ...{ display: visible ? 'unset' : 'none', zIndex: '101' },
            }}
        >
            <Row style={{ height: '100%' }}>
                <Col xl={4} md={4}>
                    <div style={{ overflowY: 'scroll', height: '65vh', borderRight: '2px solid #9c9c9c' }}>
                        <ul>
                            {listConversation.map((_conversation, i) => {
                                return (
                                    <ConversationItem
                                        key={i}
                                        id={_conversation._id}
                                        setSelectedConversationData={setSelectedConversationData}
                                        totalUnseenMessages={totalUnseenMessages}
                                    />
                                );
                            })}
                        </ul>
                    </div>
                </Col>
                <Col xl={8} md={8}>
                    {selectedConversationData?.title ? (
                        <Row>
                            <div style={{ height: '100%' }} className="chat-message-container">
                                <div className="chat-title">
                                    <img src={selectedConversationData?.img} alt="" />
                                    <span style={{ fontWeight: '700' }}>{selectedConversationData?.title}</span>
                                </div>
                                <div className="chat-content" ref={messageContainerRef}>
                                    <ul style={{ display: 'flex', flexDirection: 'column' }}>
                                        {selectedConversationMessage.map((message, i) => {
                                            return (
                                                <li className={`message-item ${message.sender === userId ? 'me' : ''}`}>
                                                    <div className="message-content">
                                                        <span>{message.content} </span>
                                                    </div>
                                                </li>
                                            );
                                        })}

                                        {/* <li className="message-item">
                                            <div className="message-content">
                                                <span>Otsdfsdfdsdfsdfsdfsdfsdfsddfhee asddda asdasd asdasdasdr</span>
                                            </div>
                                        </li>
                                        <li className="message-item me">
                                            <div className="message-content">
                                                <span>ME asdd asda asdasd as das a sdas ddadd asda sd asd as </span>
                                            </div>
                                        </li>
                                        <li className="message-item">
                                            <div className="message-content">
                                                <span>Otsdfsdfdsdfsdfsdfsdfsdfsddfhee asddda asdasd asdasdasdr</span>
                                            </div>
                                        </li> */}
                                    </ul>
                                </div>
                                <div className="chat-action pe-4 mt-3">
                                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                        <input
                                            key={messToSend}
                                            style={{ flexGrow: 1, marginRight: '10px' }}
                                            type="text"
                                            placeholder={'type a message'}
                                            defaultValue={messToSend}
                                            onChange={debounce((e) => setMessToSend(e.target.value), 1000)}
                                        />
                                        <button className="btn btn-primary" onClick={sendMess}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                class="bi bi-send-fill"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Row>
                    ) : (
                        <div
                            style={{
                                display: 'flex',
                                width: '100%',
                                height: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <span style={{ opacity: 0.5 }}>Select a conversation</span>
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
};
export default ModalWindow;

const ConversationItem = ({ id, setSelectedConversationData, totalUnseenMessages }) => {
    const dispatch = useDispatch();
    const { conversation } = useSelector((state) => {
        return state;
    });

    const [data, setData] = useState();
    const [countUnseen, setCountUnseen] = useState(0);

    useEffect(() => {
        const fetchConversationTitleData = async () => {
            //console.log(1);
            try {
                const response = await axiosInstance.get(`/api/conversation/${id}`);
                setData(response.data);
                if (conversation === id) {
                    setSelectedConversationData(response.data);
                    setCountUnseen(0);
                } else {
                    const total = totalUnseenMessages.find((con) => con._id === id).total;
                    setCountUnseen(total);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchConversationTitleData();
    }, [id, conversation, setSelectedConversationData, totalUnseenMessages]);

    const selectedConversation = async (_id) => {
        try {
            const response = await axiosInstance.post(`/api/conversation/markAtRead/${_id}`);
            dispatch(setSelectedConversation(_id));
        } catch (e) {
            console.error(e);
        }
    };
    return (
        <li
            className={`conversation-item ${id === conversation ? 'active' : ''}`}
            onClick={() => {
                selectedConversation(id);
            }}
        >
            <img src={data?.img} alt="" />
            <span style={{ marginLeft: '10px', flexGrow: '1000000' }}>{data?.title}</span>
            {countUnseen > 0 ? (
                <Badge bg="primary" className="me-1">
                    {countUnseen}
                </Badge>
            ) : null}
        </li>
    );
};

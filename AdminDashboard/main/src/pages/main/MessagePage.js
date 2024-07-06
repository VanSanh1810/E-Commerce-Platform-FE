import React, { useContext, useEffect, useRef, useState } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Row, Col, Dropdown } from 'react-bootstrap';
import { ButtonComponent } from '../../components/elements';
import IconFieldComponent from '../../components/fields/IconFieldComponent';
import PageLayout from '../../layouts/PageLayout';
import data from '../../assets/data/messagePage.json';
import axiosInstance from '../../configs/axiosInstance';
import { SocketIOContext } from '../../context/SocketIOContext';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setReload } from '../../store/reducers/notificationReducer';
import { debounce } from 'lodash';

export default function MessagePage() {
    const { t } = useContext(TranslatorContext);
    const dispatch = useDispatch();
    const { socket } = useContext(SocketIOContext);
    const { userId } = useSelector((state) => state.persistedReducer.authReducer);
    const { reloadListener } = useSelector((state) => state.persistedReducer.notificationReducer);

    const [listConvesation, setListConversation] = useState([]);
    const [totalUnseenMessages, setTotalUnseenMessages] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState();
    const [selectedConversationData, setSelectedConversationData] = useState();
    const [selectedConversationMessage, setSelectedConversationMessage] = useState([]);
    //
    const [messToSend, setMessToSend] = useState('');
    const messageContainerRef = useRef();

    //fetch all coversations
    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const response = await axiosInstance.get('/api/conversation');
                setListConversation(response.data.conversations);
                setTotalUnseenMessages(response.data.totalUnseen);
                console.log(response);
            } catch (error) {
                console.error(error);
            }
        };
        fetchConversation();
    }, []);

    //fetchConversationMessages
    useEffect(() => {
        const fetchConversationMessage = async () => {
            try {
                const response = await axiosInstance.get(`/api/conversation/message/${selectedConversation}`);
                setSelectedConversationMessage([...response.data.messages]);
                console.log(response);
            } catch (error) {
                console.error(error);
            }
        };
        dispatch(setReload());
        if (selectedConversation) {
            fetchConversationMessage();
        }
    }, [selectedConversation, dispatch]);

    useEffect(() => {
        socket.on('receive-message', async (messageObj, targetUserId, role, conversationId) => {
            if (conversationId === selectedConversation) {
                setSelectedConversationMessage((st) => {
                    const temp = [...st];
                    temp.push({ content: messageObj.content, sender: messageObj.sender });
                    return [...temp];
                });
            } else {
                // dispatch(setReload());
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
            }
        });
        return () => {
            socket.off('receive-message');
        };
    }, [socket, selectedConversation, dispatch, reloadListener]);

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [selectedConversationMessage, messageContainerRef, selectedConversation]);

    const sendMess = (e) => {
        e.preventDefault();
        if (messToSend.trim() && selectedConversation) {
            const listUser = [...listConvesation.find((conversation) => conversation._id === selectedConversation).user];
            const target = listUser.find((u) => u._id !== userId);
            console.log(target);
            socket.emit('send-message', { content: messToSend, sender: userId }, target._id, target.type, selectedConversation);
            //
            const temp = [...selectedConversationMessage];
            temp.push({ sender: userId, content: messToSend });
            setSelectedConversationMessage([...temp]);
            //
            setMessToSend('');
        }
    };

    return (
        <PageLayout>
            <Row>
                <Col md={5} xl={4}>
                    <div className="mc-card p-0">
                        <div className="mc-message-user">
                            <div className="mc-message-user-filter">
                                {/* <IconFieldComponent
                                    type="search"
                                    icon="search"
                                    classes="w-100 h-sm"
                                    placeholder={t('search_username')}
                                />
                                <Dropdown bsPrefix="mc-dropdown">
                                    <Dropdown.Toggle bsPrefix="mc-dropdown-toggle">
                                        <i className="material-icons">dialpad</i>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu align="end" className="mc-dropdown-paper">
                                        <button type="button" className="mc-dropdown-menu">
                                            <i className="material-icons">account_circle</i>
                                            <span>{t('active_users')}</span>
                                        </button>
                                        <button type="button" className="mc-dropdown-menu">
                                            <i className="material-icons">question_answer</i>
                                            <span>{t('all_conversations')}</span>
                                        </button>
                                        <button type="button" className="mc-dropdown-menu">
                                            <i className="material-icons">mark_chat_unread</i>
                                            <span>{t('unread_messages')}</span>
                                        </button>
                                        <button type="button" className="mc-dropdown-menu">
                                            <i className="material-icons">mark_chat_read</i>
                                            <span>{t('read_messages')}</span>
                                        </button>
                                    </Dropdown.Menu>
                                </Dropdown> */}
                            </div>
                            <ul className="mc-message-user-list thin-scrolling">
                                {listConvesation.map((item, index) => {
                                    return (
                                        <ChatItem
                                            index={index}
                                            id={item._id}
                                            setSelectedConversation={setSelectedConversation}
                                            selectedConversation={selectedConversation}
                                            totalUnseenMessages={totalUnseenMessages}
                                            setSelectedConversationData={setSelectedConversationData}
                                        />
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </Col>
                <Col md={7} xl={8}>
                    <div className="mc-card">
                        <div className="mc-message-chat">
                            <div className="mc-message-chat-header">
                                {selectedConversation ? (
                                    <>
                                        <div className="mc-round-avatar xs abc">
                                            <img src={selectedConversationData?.img} alt="avatar" />
                                        </div>
                                        <div className="mc-duel-text xs">
                                            <h3 className="mc-duel-text-title">{selectedConversationData?.title}</h3>
                                            {/* <p className="mc-duel-text-descrip">{t('active_now')}</p> */}
                                        </div>
                                    </>
                                ) : null}
                            </div>
                            <ul className="mc-message-chat-list thin-scrolling pe-2" ref={messageContainerRef}>
                                {selectedConversationMessage.map((chat, index) => (
                                    <li key={index} className={`mc-message-chat-item ${chat.sender === userId ? 'me' : ''}`}>
                                        <div className="mc-message-chat-group">
                                            <div key={index} className="mc-message-chat-text">
                                                <p>{chat.content}</p>
                                            </div>
                                            {/* <p className="mc-message-chat-datetime">{chat.time}</p> */}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <form className="mc-message-chat-footer" onSubmit={sendMess}>
                                <input
                                    key={messToSend}
                                    type="text"
                                    placeholder={t('type_a_message')}
                                    defaultValue={messToSend}
                                    onChange={debounce((e) => setMessToSend(e.target.value), 1000)}
                                />
                                <ButtonComponent type="submit" className="material-icons">
                                    send
                                </ButtonComponent>
                            </form>
                        </div>
                    </div>
                </Col>
            </Row>
        </PageLayout>
    );
}

const ChatItem = ({ id, totalUnseenMessages, setSelectedConversationData, selectedConversation, setSelectedConversation }) => {
    const [data, setData] = useState();
    const [countUnseen, setCountUnseen] = useState(0);

    useEffect(() => {
        const fetchConversationTitleData = async () => {
            //console.log(1);
            try {
                const response = await axiosInstance.get(`/api/conversation/${id}`);
                setData(response.data);
                if (selectedConversation === id) {
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
    }, [id, selectedConversation, setSelectedConversationData, totalUnseenMessages]);

    const selectConversation = async (_id) => {
        try {
            const response = await axiosInstance.post(`/api/conversation/markAtRead/${_id}`);
            setSelectedConversation(_id);
        } catch (e) {
            console.error(e);
        }
    };
    return (
        <li
            className={`mc-message-user-item ${id === selectedConversation ? 'active' : ''}`}
            onClick={() => selectConversation(id)}
        >
            <div className={`mc-round-avatar xs ${1 === 1 ? 'item.status' : ''}`}>
                <img src={data?.img} alt="avatar" />
            </div>
            <div className={`mc-duel-text xs ${1 === 1 ? 'item.mark' : ''}`}>
                <h3 className="mc-duel-text-title">{data?.title}</h3>
            </div>
            {countUnseen > 0 && <sup>{countUnseen}</sup>}
        </li>
    );
};

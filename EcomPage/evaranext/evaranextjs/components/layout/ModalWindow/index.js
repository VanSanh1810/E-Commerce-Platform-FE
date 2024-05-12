import { Row, Col, Dropdown, Badge } from 'react-bootstrap';
// importing external style
import { styles } from '../ChatWiget/styles';
//for displaying the model view/Window
const ModalWindow = (props) => {
    // returning display
    return (
        <div
            style={{
                ...styles.modalWindow,
                ...{ display: props.visible ? 'unset' : 'none', zIndex: '101' },
            }}
        >
            <Row style={{ height: '100%' }}>
                <Col xl={4} md={4}>
                    <div style={{ overflowY: 'scroll', maxHeight: '65vh', borderRight: '2px solid #9c9c9c' }}>
                        <ul>
                            <li className="conversation-item">
                                <img
                                    src="https://w7.pngwing.com/pngs/301/114/png-transparent-message-board-online-chat-computer-icons-conversation-livechat-chat-room-chat-miscellaneous-angle-text-thumbnail.png"
                                    alt=""
                                />
                                <p>name</p>
                                <Badge bg="primary" className="me-1">
                                    {1}
                                </Badge>
                            </li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                            <li>as</li>
                        </ul>
                    </div>
                </Col>
                <Col xl={8} md={8}>
                    <Row>
                        <div style={{ height: '100%' }} className="chat-message-container">
                            <div className="chat-title">
                                <img
                                    src="https://w7.pngwing.com/pngs/301/114/png-transparent-message-board-online-chat-computer-icons-conversation-livechat-chat-room-chat-miscellaneous-angle-text-thumbnail.png"
                                    alt=""
                                />
                                <p>name</p>
                            </div>
                            <div className="chat-content">
                                <ul style={{ display: 'flex', flexDirection: 'column' }}>
                                    <li className="message-item me">
                                        <div className="message-content">
                                            <span>ME asdd asda asdasd  as das a sdas ddadd asda sd asd as </span>
                                        </div>
                                    </li>
                                    <li className="message-item">
                                        <div className="message-content">
                                            <span>Otsdfsdfdsdfsdfsdfsdfsdfsddfhee asddda asdasd asdasdasdr</span>
                                        </div>
                                    </li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                    <li>as</li>
                                </ul>
                            </div>
                            <div className="chat-action pe-4 mt-3">
                                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <input style={{ flexGrow: 1, marginRight: "10px" }} type="text" placeholder={'type_a_message'} />
                                    <button className="btn btn-primary">
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
                </Col>
            </Row>
        </div>
    );
};
export default ModalWindow;

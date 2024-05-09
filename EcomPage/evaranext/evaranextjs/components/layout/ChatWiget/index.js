// import external styling
import { useState } from 'react';
import { styles } from './styles';
import ModalWindow from '../ModalWindow';
// import icon
import { BsFillChatFill } from 'react-icons/bs';
import { SocketIOProvider } from '../../../contexts/SocketIOContext';

const ChatWidget = () => {
    // state variable to track if widget button was hovered on
    const [hovered, setHovered] = useState(false);
    // state variable to track modal visibility
    const [visible, setVisible] = useState(false);

    return (
        
            <div>
                {/* Chat Button Component */}
                <div
                    onClick={() => setVisible(!visible)}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    style={{
                        ...styles.chatWidget,
                        ...{ border: hovered ? '1px solid black' : '' },
                    }}
                >
                    {/* Call Modal Window */}
                    <ModalWindow visible={visible} />
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
                    </div>
                </div>
            </div>
    );
};

export default ChatWidget;

// importing external style
import { styles } from '../ChatWiget/styles';
//for displaying the model view/Window
const ModalWindow = (props) => {
    // returning display
    return (
        <div
            style={{
                ...styles.modalWindow,
                ...{ display: props.visible ? 'unset' : 'none' },
            }}
        >
            Hello there!
        </div>
    );
};
export default ModalWindow;

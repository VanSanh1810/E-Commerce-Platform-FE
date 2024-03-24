import React, { forwardRef } from 'react';
import { ButtonComponent } from '../elements';

// Functional component
const IconFieldComponent = forwardRef(
    ({ classes, icon, option, activeOption, type, placeholder, passwordVisible, ...rest }, ref) => {
        const [visible, setVisible] = React.useState(false);
        // Sử dụng ref như một tham số trong component
        return (
            <div className={`mc-icon-field ${classes || 'w-md h-sm'}`}>
                <i className="material-icons">{icon || 'account_circle'}</i>
                {type ? (
                    <>
                        <input
                            type={visible ? 'text' : type || 'text'}
                            placeholder={type ? placeholder || 'Type here...' : ''}
                            ref={ref}
                            {...rest}
                        />
                        {passwordVisible && (
                            <ButtonComponent type="button" className="material-icons" onClick={() => setVisible(!visible)}>
                                {visible ? 'visibility_off' : 'visibility'}
                            </ButtonComponent>
                        )}
                    </>
                ) : (
                    <select style={{ backgroundImage: 'url(/images/dropdown.svg)' }} {...rest}>
                        <option>{activeOption || 'Select Option'}</option>
                        {option.map((item, index) => (
                            <option key={index} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                )}
            </div>
        );
    },
);

export default IconFieldComponent;

// export default function IconFieldComponent({ classes, icon, option, activeOption, type, placeholder, passwordVisible, ...rest }) {
//     const [visible, setVisible] = React.useState(false);

//     return (
//         <div className={`mc-icon-field ${classes || 'w-md h-sm'}`}>
//             <i className="material-icons">{icon || 'account_circle'}</i>
//             {type ? (
//                 <>
//                     <input
//                         type={visible ? 'text' : type || 'text'}
//                         placeholder={type ? placeholder || 'Type here...' : ''}
//                         {...rest}
//                     />
//                     {passwordVisible && (
//                         <ButtonComponent type="button" className="material-icons" onClick={() => setVisible(!visible)}>
//                             {visible ? 'visibility_off' : 'visibility'}
//                         </ButtonComponent>
//                     )}
//                 </>
//             ) : (
//                 <select style={{ backgroundImage: 'url(/images/dropdown.svg)' }} {...rest}>
//                     <option>{activeOption || 'Select Option'}</option>
//                     {option.map((item, index) => (
//                         <option key={index} value={item}>
//                             {item}
//                         </option>
//                     ))}
//                 </select>
//             )}
//         </div>
//     );
// }

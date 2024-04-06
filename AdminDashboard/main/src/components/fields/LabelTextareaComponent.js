import React from 'react';

export default function LabelTextareaComponent({ label, labelDir, fieldSize, placeholder, err, ...rest }) {
    return (
        <div className={`mc-label-field-group ${label ? labelDir || 'label-col' : ''}`}>
            {label && <label className="mc-label-field-title">{label}</label>}
            <textarea
                style={err ? { border: '1px solid #f54242' } : null}
                className={`mc-label-field-textarea ${fieldSize || 'w-md h-text-md'}`}
                placeholder={placeholder || 'Type here...'}
                {...rest}
            ></textarea>
        </div>
    );
}

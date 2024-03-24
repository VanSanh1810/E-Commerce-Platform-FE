import React, { useContext } from 'react';
import { TranslatorContext } from '../../context/Translator';

export default function LabelFieldComponent({
    label,
    labelDir,
    fieldSize,
    option,
    type,
    placeholder,
    defaultSelection,
    err,
    ...rest
}) {
    const { t } = useContext(TranslatorContext);
    return (
        <div className={`mc-label-field-group ${label ? labelDir || 'label-col' : ''}`}>
            {label && (
                <label className="mc-label-field-title">
                    {t(label)} {err && <label style={{ color: '#f54242' }}>{t(err)}</label>}
                </label>
            )}

            {type ? (
                <input
                    type={type || 'text'}
                    placeholder={placeholder || t('type_here')}
                    className={`mc-label-field-input ${fieldSize || 'w-md h-sm'}`}
                    style={err ? { border: '1px solid #f54242' } : null}
                    {...rest}
                />
            ) : (
                <>
                    <select
                        style={
                            err
                                ? { backgroundImage: 'url(/images/dropdown.svg)', border: '1px solid #f54242' }
                                : { backgroundImage: 'url(/images/dropdown.svg)' }
                        }
                        className={`mc-label-field-select ${fieldSize || 'w-md h-sm'}`}
                        {...rest}
                    >
                        {option.map((item, index) => (
                            <option key={index} value={item}>
                                {t(item)}
                            </option>
                        ))}
                    </select>
                </>
            )}
        </div>
    );
}

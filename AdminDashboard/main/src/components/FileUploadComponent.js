import React, { useContext } from "react";
import { TranslatorContext } from "../context/Translator";

export default function FileUploadComponent({ icon, text }) {
    const { t } = useContext(TranslatorContext)

    return (
        <>
            {text ?
                <div className={`mc-file-upload ${ text ? "button" : "icon" }`}>
                    <input type="file" id="avatar" />
                    <label htmlFor="avatar">
                        <i className="material-icons">{ icon || t('cloud_upload') }</i>
                        <span>{ text || t('upload') }</span>
                    </label>
                </div>
            :
                <div className={`mc-file-upload ${ text ? "button" : "icon" }`}>
                    <input type="file" id="avatar" />
                    <label htmlFor="avatar" className="material-icons">{ icon || t('cloud_upload') }</label>
                </div>
            }
        </>
    )
}
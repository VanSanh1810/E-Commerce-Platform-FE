import React, { useContext } from "react"; 
import { TranslatorContext } from "../context/Translator";

export default function PaginationComponent() {
    const { t, n, currentLanguage } = useContext(TranslatorContext);
    return (
        <div className="mc-paginate">
            <p className="mc-paginate-title">
                {t('showing')} 
                <b> {n(12)} </b> 
                {t('of')}
                <b> {n(60)} </b>
                {t('results')}
            </p>
            <ul className="mc-paginate-list">
                <li className="mc-paginate-item">
                    { currentLanguage?.dir === "ltr" ? 
                        <i className="material-icons">chevron_left</i> 
                        : <i className="material-icons">chevron_right</i>
                    }
                </li>
                <li className="mc-paginate-item active">{n(1)}</li>
                <li className="mc-paginate-item">{n(2)}</li>
                <li className="mc-paginate-item">{n(3)}</li>
                <li className="mc-paginate-item">...</li>
                <li className="mc-paginate-item">{n(45)}</li>
                <li className="mc-paginate-item">
                    { currentLanguage?.dir === "ltr" ? 
                        <i className="material-icons">chevron_right</i> 
                        : <i className="material-icons">chevron_left</i>
                    }
                </li>
            </ul>
        </div>
    )
}
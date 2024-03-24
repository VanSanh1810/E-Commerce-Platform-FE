import React, { useState, useEffect, useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import Modal from 'react-bootstrap/Modal';
import { AnchorComponent, ButtonComponent } from "../elements";

export default function DealsTableComponent({ thead, tbody }) {
    const [alertModal, setAlertModal] = useState(false);
    const { t } = useContext(TranslatorContext);
    const [data, setData] = useState([]);

    useEffect(()=> { setData(tbody) }, [tbody]);

    const handleCheckbox = (event) => {
        const { name, checked } = event.target;

        if(name === "allCheck") {
            const checkData = data?.map((item)=> {
                return { ...item, isChecked: checked };
            });
            setData(checkData);
        }
        else {
            const checkData = data?.map((item) => 
                item.name === name ? {...item, isChecked: checked} : item
            );
            setData(checkData);
        }
    }

    return (
        <div className="mc-table-responsive">
            <table className="mc-table">
                <thead className="mc-table-head primary">
                    <tr>
                        <th>
                            <div className="mc-table-check">
                                <input 
                                    type="checkbox" 
                                    name="allCheck"
                                    checked={ data?.filter((item)=> item.isChecked !== true).length < 1 } 
                                    onChange={ handleCheckbox } 
                                />
                                <p>s.l</p>
                            </div>
                        </th>
                        {thead.map((item, index) => (
                            <th key={ index }>{ item }</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="mc-table-body even">
                    {data?.map((item, index) => (
                        <tr key={ index }> 
                            <td>
                                <div className="mc-table-check">
                                    <input 
                                        type="checkbox" 
                                        name={item.name} 
                                        checked={ item?.isChecked || false }
                                        onChange={ handleCheckbox } 
                                    />
                                    <p>{ index + 1 }</p>
                                </div>
                            </td>
                            <td>
                                <div className="mc-table-profile">
                                    <img src={ item.src } alt={ item.alt } />
                                    <p>{ item.name }</p>
                                </div>
                            </td>
                            <td>{ item.email }</td>
                            <td>{ item.amount }</td>
                            <td><p className={`mc-table-badge ${ item.status.variant }`}>{ item.status.text }</p></td>
                            <td>{ item.date }</td>
                            <td>
                                <div className="mc-table-action">
                                    <AnchorComponent title="View" href="/user-profile" className="material-icons view">{ item.action.view }</AnchorComponent>
                                    <AnchorComponent title="Download" href="#" className="material-icons download" download>{ item.action.download }</AnchorComponent>
                                    <ButtonComponent title="Delete" className="material-icons delete" onClick={()=> setAlertModal(true)}>{ item.action.delete }</ButtonComponent>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal show={ alertModal } onHide={()=> setAlertModal(false)}>
                <div className="mc-alert-modal">
                    <i className="material-icons">new_releases</i>
                    <h3>are your sure!</h3>
                    <p>Want to delete this deals?</p>
                    <Modal.Footer>
                        <ButtonComponent type="button" className="btn btn-secondary" onClick={()=> setAlertModal(false)}>{t('close')}</ButtonComponent>
                        <ButtonComponent type="button" className="btn btn-danger" onClick={()=> setAlertModal(false)}>{t('delete')}</ButtonComponent>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    )
}
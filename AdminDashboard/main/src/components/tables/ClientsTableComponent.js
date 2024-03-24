import React from "react";
import { AnchorComponent } from "../elements";

export default function ClientsTableComponent({ thead, tbody }) {
    return (
        <div className="mc-table-responsive">
            <table className="mc-table">
                <thead className="mc-table-head">
                    <tr>
                        {thead.map((item, index) => (
                            <th key={ index }>{ item }</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="mc-table-body">
                    {tbody.map((item, index) => (
                        <tr key={ index }> 
                            <td>
                                <div className="mc-table-profile">
                                    <img src={ item.src } alt={ item.alt } />
                                    <p>{ item.name }</p>
                                </div>
                            </td>
                            <td>{ item.order }</td>
                            <td>{ item.amount }</td>
                            <td>
                                <div className="mc-table-action">
                                    <AnchorComponent to="/message" title="Chat" className="material-icons chat">{ item.action.chat }</AnchorComponent>
                                    <AnchorComponent to="/user-profile" title="View" className="material-icons view">{ item.action.view }</AnchorComponent>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
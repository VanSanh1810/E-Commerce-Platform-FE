import React from "react";

export default function TrafficsTableComponent({ thead, tbody }) {
    return (
        <div className="mc-table-responsive">
            <table className="mc-table">
                <thead className="mc-table-head primary">
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
                                <div className="mc-table-icon">
                                    <i className="material-icons">{ item.source.icon }</i>
                                    <p>{ item.source.text }</p>
                                </div>
                            </td>
                            <td>{ item.users }</td>
                            <td>{ item.sessions }</td>
                            <td>{ item.bounce }</td>
                            <td>{ item.duration }</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
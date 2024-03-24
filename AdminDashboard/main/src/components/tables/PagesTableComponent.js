import React from "react";
import { AnchorComponent } from "../elements";

export default function PagesTableComponent({ thead, tbody }) {
    return (
        <div className="mc-table-responsive thin-scrolling" style={{ height: "382px" }}>
            <table className="mc-table">
                <thead className="mc-table-head sticky gray">
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
                                    <i className="material-icons" style={{ fontSize: "18px" }}>open_in_new</i>
                                    <AnchorComponent to={ item.path }>{ item.path }</AnchorComponent>
                                </div>
                            </td>
                            <td>{ item.visitor }</td>
                            <td>{ item.bounce }</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
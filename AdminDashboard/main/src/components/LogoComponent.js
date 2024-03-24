import React from "react";
import { Link } from "react-router-dom";

export default function LogoComponent({ src, alt, name, href, className }) {
    return (
        <>
            {name ?
                <Link to={ href } className={`mc-logo-group ${ className }`}>
                    <img src={ src } alt={ alt } />
                    <span>{ name }</span>
                </Link>
            :
                <Link to={ href } className={`mc-logo ${ className }`}>
                    <img src={ src } alt={ alt } />
                </Link>
            }
        </>
    )
}
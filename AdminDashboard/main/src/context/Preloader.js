import { createContext, useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";

export const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        setLoading(true);
        setTimeout(()=> { setLoading(false) }, 1000);
    }, []);

    return (
        <LoaderContext.Provider value={{ loading }}>
            { loading ? 
                <div className="mc-spinner">
                    <img className="pattern" src="images/pattern.webp" alt="pattern" />
                    <img className="favicon" src="images/4.png" alt="logo" />
                    <div className="mc-spinner-group">
                        <h3>Loading</h3>
                        <PulseLoader 
                            color="#0857f5"
                            loading={loading} 
                            size={8} 
                        /> 
                    </div>
                </div>
                : 
                children 
            }
        </LoaderContext.Provider>
    )
}
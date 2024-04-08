import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Private = ({ children, roleAllow }) => {
    const XNOR = (a, b) => {
        return (a && b) || (!a && !b);
    };
    const { adminToken } = useSelector((state) => state.persistedReducer.authReducer);
    const { isVendor } = useSelector((state) => state.persistedReducer.authReducer);
    if (roleAllow) {
        if (XNOR(roleAllow === 'vendor', isVendor)) {
            //  have  permission
            return adminToken ? children : <Navigate to="/login" />;
        } else {
            // don't have permission
            return adminToken ? <Navigate to="/" /> : <Navigate to="/login" />;
        }
    } else {
        //all roles can access
        return adminToken ? children : <Navigate to="/login" />;
    }
};
export default Private;

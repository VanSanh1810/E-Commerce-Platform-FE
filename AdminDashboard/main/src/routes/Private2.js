import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Private2 = ({ children }) => {
    const { adminToken } = useSelector((state) => state.persistedReducer.authReducer);
    return adminToken ? <Navigate to="/" /> : children;
};
export default Private2;

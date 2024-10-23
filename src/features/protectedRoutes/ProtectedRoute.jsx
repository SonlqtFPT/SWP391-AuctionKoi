import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const accessToken = localStorage.getItem('accessToken');
    const storedData = localStorage.getItem('accountData');
    const accountData = storedData ? JSON.parse(storedData) : null; // Check if accountData exists

    // If accountData is null or role isn't in allowedRoles, redirect to home page
    if (!accessToken || !accountData || !allowedRoles.includes(accountData.role)) {
        console.log("Redirecting to home page");
        return <Navigate to="/" replace />;
    }

    // Render the child components if the user has the right role and accessToken
    return children;
};

// Define PropTypes for the component
ProtectedRoute.propTypes = {
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired, // Allowed roles should be an array of strings
    children: PropTypes.node.isRequired, // Children is required and can be any renderable content
};

export default ProtectedRoute;

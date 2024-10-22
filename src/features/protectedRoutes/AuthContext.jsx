import PropTypes from 'prop-types';
import { createContext, useState, useEffect, useContext } from 'react';
import api from '../../config/axios';

// Create the context
const AuthContext = createContext(null);

// Create a provider component
export function AuthProvider({ children }) {
    const [userName, setUserName] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const [role, setRole] = useState('');
    const [accountId, setAccountId] = useState('');
    const [breederName, setBreederName] = useState('');
    const [location, setLocation] = useState('');
    const [accountData, setAccountData] = useState(
        JSON.parse(localStorage.getItem('accountData')) || {}
    );

    useEffect(() => {
        // Get the account data from localStorage
        const storedData = localStorage.getItem('accountData');
        if (storedData) {
            const accountData = JSON.parse(storedData);
            setUserName(`${accountData.firstName} ${accountData.lastName}`);
            setRole(accountData.role);
            setAccountId(accountData.accountId);
            setBreederName(accountData.breederName);
        }
        const accessTokenFromStorage = localStorage.getItem('accessToken');
        const refreshTokenFromStorage = localStorage.getItem('refreshToken');
        setAccessToken(accessTokenFromStorage);
        setRefreshToken(refreshTokenFromStorage);
        // If the user is a breeder, fetch additional breeder info
        if (accountData.role === "BREEDER" && accessTokenFromStorage) {
            const fetchBreederInfo = async () => {
                try {
                    const response = await api.get("/breeder/get-breeder-information", {
                        headers: {
                            Authorization: `Bearer ${accessTokenFromStorage}`,
                        },
                    });
                    const { data } = response.data;
                    setBreederName(data.breederName);
                    setLocation(data.location);
                    // Update localStorage with new breeder information
                    const updatedAccountData = {
                        ...accountData,
                        breederName: data.breederName,
                        location: data.location,
                    };
                    localStorage.setItem("accountData", JSON.stringify(updatedAccountData));
                    setAccountData(updatedAccountData);
                } catch (error) {
                    console.error("Error fetching breeder information:", error);
                }
            };
            fetchBreederInfo();
        }
    }, [accessToken, accountData.role]);

    return (
        <AuthContext.Provider
            value={{
                userName,
                accessToken,
                refreshToken,
                role,
                accountId,
                breederName,
                location,
                setAccountId,
                setUserName,
                setAccessToken,
                setRefreshToken,
                setRole,
                setBreederName,
                setLocation
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// PropTypes to validate that children is passed
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// Custom hook to use the auth context
export function useAuth() {
    return useContext(AuthContext);
}

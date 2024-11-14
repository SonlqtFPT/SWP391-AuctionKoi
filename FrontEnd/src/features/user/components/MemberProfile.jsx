import React from 'react'
import { useAuth } from '../../protectedRoutes/AuthContext'
import { NavLink, Outlet } from 'react-router-dom';

function MemberProfile() {
    const { userName } = useAuth();

    return (
        <div className="bg-black w-full relative">
            {/* Profile Header Section */}
            <section className="relative h-32 bg-hero-pattern bg-cover flex justify-center items-center mt-20">
                {/* Overlay */}
                <div className="absolute bg-black bg-opacity-70 inset-0"></div>
                {/* Profile Info */}
                <div className="font-bold text-2xl relative z-10 text-center text-white flex flex-col items-center my-6">
                    {/* User Info */}
                    <h2 className="text-lg">Welcome, {userName}</h2>
                </div>
            </section>

            {/* Navigation Section */}
            <section className="bg-gray-900 text-white py-3">
                <div className="container mx-auto flex justify-center space-x-4">
                    <NavLink
                        to="/member/profile/details"
                        className={({ isActive }) =>
                            isActive
                                ? "flex items-center space-x-2 bg-yellow-500 text-black rounded-full px-4 py-2"
                                : "flex items-center space-x-2 px-4 py-2 hover:bg-yellow-500 hover:text-black rounded-full"
                        }
                    >
                        PROFILE DETAILS
                    </NavLink>

                </div>
            </section>

            {/* Dynamic Content */}
            <section className="p-6">
                <div className="container mx-auto">
                    <Outlet /> {/* Dynamic content will load here */}
                </div>
            </section>
        </div>
    );
}

export default MemberProfile

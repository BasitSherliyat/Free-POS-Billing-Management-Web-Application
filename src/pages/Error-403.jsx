import React from 'react';
import { Link } from 'react-router-dom';

const Error403 = () => {
    return (
        <div className="h-full lg:h-svh">
            <div className="grid h-full bg-primary/80 bg-no-repeat bg-cover lg:grid-cols-12"
                style={{ backgroundImage: "url(assets/images/signup-bg.png)" }}>
                <div className="bg-white lg:rounded-r-3xl lg:col-span-6">
                    <div className=" flex justify-center items-center h-full">
                        <div className="p-4 xl:w-3/5 text-center">
                            <h1 className="text-primary font-bold mb-4 text-8xl">403</h1>
                            <h2 className="text-black font-bold mb-4 text-2xl md:text-3xl">Forbidden</h2>
                            <p className="text-black/60 mb-8 font-medium">You do not have permission to access the document or
                                program that you requested.</p>
                            <Link to="/"
                                className="text-white bg-primary border border-primary font-bold text-lg rounded-lg px-6 py-2 transition ease-in-out duration-1000 hover:bg-white hover:text-primary">
                                Back To Home
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-6 p-4">
                    <div className="flex justify-center items-center h-full">
                        <div className="p-4 text-center">
                            <img src="/images/401-error.png" alt="403 Error" className="mx-auto mb-4 w-4/5" />
                            <h2 className="text-white font-bold mb-4 text-xl md:text-4xl">Access Denied</h2>
                            <p className="text-white text-lg mb-4">Please contact the administrator.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Error403;

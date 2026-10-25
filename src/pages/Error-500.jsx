import React from 'react';
import { Link } from 'react-router-dom';

const Error500 = () => {
    return (
        <div className="h-svh dark:bg-black">
            <div className="container mx-auto h-full">
                <div className="grid h-full lg:grid-cols-12">
                    <div className="lg:col-span-5 flex justify-center items-center">
                        <div className="p-4">
                            <div className="relative">
                                <h1
                                    className="text-primary/20 font-extrabold leading-none text-[80px] md:text-[140px] xl:text-[180px]">
                                    500
                                </h1>
                                <h3
                                    className="text-danger font-bold text-3xl absolute bottom-2 md:bottom-8 md:text-5xl xl:text-6xl">
                                    Ooops!.
                                </h3>
                            </div>
                            <h4 className="font-bold text-warning text-2xl md:text-4xl">Internal Server Error!</h4>
                            <p className="text-lg text-black/60 mb-4">Server Error 500. We're not exactly sure what happened,
                                but our
                                servers say something is wrong.</p>
                            <Link to="/"
                                className="text-white bg-primary border border-primary font-bold text-lg rounded-lg px-6 py-2 inline-block transition ease-in-out duration-1000 hover:bg-white hover:text-primary">
                                <i className="ri-home-4-line pr-2"></i> Back to home
                            </Link>
                        </div>
                    </div>
                    <div className="lg:col-span-7 flex justify-center items-center p-4">
                        <img src="/images/500-error.png" alt="500 Error" className="w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Error500;

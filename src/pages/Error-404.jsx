import React from 'react';
import { Link } from 'react-router-dom';

const Error404 = () => {
    return (
        <div className="h-svh dark:bg-black">
            <div className="container mx-auto h-full">
                <div className="grid h-full lg:grid-cols-12">
                    <div className="lg:col-span-5 flex justify-center items-center">
                        <div className="p-4">
                            <div className="relative">
                                <h1
                                    className="text-primary/20 font-extrabold leading-none text-[80px] md:text-[140px] xl:text-[180px]">
                                    404
                                </h1>
                                <h3
                                    className="text-danger font-bold text-3xl absolute bottom-2 md:bottom-8 md:text-5xl xl:text-6xl">
                                    Ooops!.
                                </h3>
                            </div>
                            <h4 className="font-bold text-warning text-2xl md:text-4xl">Something went wrong</h4>
                            <p className="text-lg text-black/60 mb-4">Don't worry, our team is here to help.</p>
                            <Link to="/"
                                className="text-white bg-primary border border-primary font-bold text-lg rounded-lg px-6 py-2 inline-block transition ease-in-out duration-1000 hover:bg-white hover:text-primary">
                                <i className="ri-home-4-line pr-2"></i> Back to home
                            </Link>
                        </div>
                    </div>
                    <div className="lg:col-span-7 flex justify-center items-center p-4">
                        <img src="/images/404-error.png" alt="404 Error" className="w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Error404;

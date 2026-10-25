import React from 'react';
import { Link } from 'react-router-dom';

const Error401 = () => {
  return (
    <div className="h-svh dark:bg-black">
      <div className="container mx-auto h-full">
        <div className="grid h-full lg:grid-cols-12">
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="p-4">
              <div className="relative">
                <h1 className="text-primary/20 font-extrabold leading-none text-[80px] md:text-[140px] xl:text-[180px]">
                  401
                </h1>
                <h3 className="text-danger font-bold text-3xl absolute bottom-2 md:bottom-8 md:text-5xl xl:text-6xl">
                  Error
                </h3>
              </div>
              <h4 className="font-bold text-warning mb-4 text-2xl md:text-4xl">Unauthorized Required.</h4>
              <Link to="/"
                className="text-white bg-primary border border-primary font-bold text-lg rounded-lg px-6 py-2 inline-block transition ease-in-out duration-1000 hover:bg-white hover:text-primary">
                <i className="ri-home-4-line pr-2"></i> Back to home
              </Link>
            </div>
          </div>
          <div className="lg:col-span-7 flex justify-center items-center p-4">
            <img src="/images/401-error.png" alt="401 Error" className="w-4/5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error401;

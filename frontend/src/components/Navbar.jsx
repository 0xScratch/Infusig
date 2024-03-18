'use client'

import React from 'react';
import { useEthers } from '@usedapp/core';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
    const { activateBrowserWallet, deactivate, account } = useEthers()
    
    // Handle connect wallet button
    const handleWalletConnection = () => {
        if (!account) {
            activateBrowserWallet()
        } else {
            deactivate()
        }
    }

    return (
        <nav className="bg-[#06071b] p-2 w-full sticky top-1 z-50 mb-10">
            <div className="container mx-auto flex flex-wrap items-center">
                <div className="flex w-full md:w-1/2 justify-center md:justify-start">
                    <Image src="/logo.png" alt="logo" className='logo' width={200} height={50} priority/>
                </div>
                <div className="flex w-full pt-2 content-center justify-between md:w-1/2 md:justify-end mb-2">
                    <ul className="list-reset flex justify-between flex-1 md:flex-none items-center">
                        <li className="mr-8">
                            <Link className="inline-block py-2 px-4 text-white no-underline hover:underline hover:text-white transition duration-200 ease-in-out" href="#"><strong>Invest Now</strong></Link>
                        </li>
                        <li className="mr-8">
                            <Link className="inline-block py-2 px-4 text-white no-underline hover:underline hover:text-white transition duration-200 ease-in-out" href="/my-portfolios"><strong>My Portfolios</strong></Link>
                        </li>
                        <li className="mr-8">
                            <a className="inline-block py-2 px-4 text-white no-underline hover:underline hover:text-gray-200 transition duration-200 ease-in-out" href="/create-an-portfolio"><strong>Build a Portfolio</strong></a>
                        </li>
                        <li className="mr-14">
                            <a className="inline-block py-2 px-4 text-white no-underline hover:underline hover:text-gray-200 transition duration-200 ease-in-out" href="#"><strong>About Us</strong></a>
                        </li>
                        <li className="mr-5">
                           <button className="inline-block text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded transition duration-200 ease-in-out" onClick={handleWalletConnection}>
                            {account
                                ? `Disconnect ${account.substring(0, 5)}...`
                                : 'Connect Wallet'}
                           </button> 
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
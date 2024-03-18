'use client'

import { useCall, useEthers } from "@usedapp/core";
import Platform from '@/context/Platform.json'
import { Contract, utils } from "ethers";
import Card from "./portfolio-components/Card";

const { platformAddress } = require('@/context/address.json')

export default function MyPortfolios() {
    const contract = new Contract(platformAddress, Platform.abi)

    const { account } = useEthers()

    const someValue = useCall({contract, method: 'getPortfolioIds', args: [account]})
    if (someValue) console.log(someValue.value)
    
    return (
        <main className="flex flex-col items-start justify-center min-h-screen text-white px-10">
            <h1 className="text-3xl font-bold mb-5">Your Portfolios!</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-y-11 gap-x-64">
                <Card />
                <Card />
                <Card />
                {/* Add more Card components here */}
            </div> 
        </main>
    );
}
'use client'

import { useCall, useEthers } from "@usedapp/core";
import Platform from '@/context/Platform.json'
import { Contract, utils } from "ethers";
import Card from "./portfolio-components/Card"
import { useMemo } from "react";

const { platformAddress } = require('@/context/address.json')

const PortfolioCard = ({ id, contract }) => {
    const isDeleted = useCall({contract, method: 'isPortfolioDeleted', args: [id]});

    if (isDeleted && isDeleted.value[0]) {
        return null;
    }

    if (!isDeleted) return null

    return <Card id={id} contract={contract} investor={false}/>
}

export default function MyPortfolios() {
    
    const { account } = useEthers()
    
    const contract = useMemo(() => new Contract(platformAddress, Platform.abi), []);
    const callArgs = useMemo(() => ({contract, method: 'getPortfolioIds', args: [account]}), [contract, account]);
    const someValue = useCall(callArgs)
    
    return (
        <main className="flex flex-col items-start justify-center text-white px-10 ml-20 mt-10">
            <h1 className="text-3xl font-bold mb-5">Your Portfolios!</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-y-11 gap-x-80">
                {someValue && someValue.value && someValue.value[0].map((bigNumber) => (
                    <PortfolioCard key={parseInt(bigNumber._hex, 16)} id={parseInt(bigNumber._hex, 16)} contract={contract}/>
                ))} 
                {/* {
                    [0, 1].map((id) => 
                    <Card 
                        key={id} 
                        id={id}
                        contract={contract} 
                        investor={false}
                    />)
                } */}
                {/* Add more Card components here */}
            </div> 
        </main>
    );
}
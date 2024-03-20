'use client'

import { useCall, useEthers } from "@usedapp/core";
import Platform from '@/context/Platform.json'
import { Contract, utils } from "ethers";
import Card from "../my-portfolios/portfolio-components/Card";
import { useMemo } from "react";

const { platformAddress } = require('@/context/address.json')

const PortfolioCard = ({ id, contract }) => {
    const isDeleted = useCall({contract, method: 'isPortfolioDeleted', args: [id]});

    if (isDeleted && isDeleted.value[0]) {
        return null;
    }

    return <Card id={id} contract={contract} investor={true}/>
}

export default function BrowsePortfolios() {
    
    // const { account } = useEthers()
    
    const contract = useMemo(() => new Contract(platformAddress, Platform.abi), []);
    // console.log(contract)
    const callArgs = useMemo(() => ({contract, method: 'getallIds', args: []}), [contract]);
    // console.log(callArgs)
    const someValue = useCall(callArgs)
    console.log(someValue)
    
    return (
        <main className="flex flex-col items-start justify-center text-white px-10 ml-20 mt-10">
            <h1 className="text-3xl font-bold mb-5">Available Portfolios to Invest!</h1>
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
                        investor={true}
                    />)
                } */}
                {/* Add more Card components here */}
            </div> 
        </main>
    );
}
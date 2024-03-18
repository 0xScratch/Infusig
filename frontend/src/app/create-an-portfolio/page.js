'use client'

import { useEthers, MoonbaseAlpha, useContractFunction } from "@usedapp/core";
import Platform from '@/context/Platform.json'
import { Contract, ethers } from "ethers";
import { useState } from "react";

const { platformAddress } = require('@/context/address.json')

export default function Portfolio() {
    // instantiating the contract
    const platformContract = new Contract(platformAddress, Platform.abi)

    // getting the account and chainId
    const { chainId, switchNetwork } = useEthers()

    // setting up some values which is used within the form
    const [name, setName] = useState('')
    const [minAmount, setMinAmount] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)
    const [maxReturn, setMaxReturn] = useState(0)
    const [managementFee, setManagementFee] = useState(0)

    // setting up the contract function
    const { state, send} = useContractFunction(platformContract, 'createPortfolio')

    // handling the form submission
    const handleSubmit = async (e) => {
        // preventing the default form submission
        e.preventDefault()

        // checking if the chainId is not equal to the MoonbaseAlpha chainId
        try {
            if (chainId !== MoonbaseAlpha.chainId) {
                await switchNetwork(MoonbaseAlpha.chainId)
            }

            // converting the values to the correct unit
            const minAmountInWei = ethers.utils.parseEther(minAmount.toString());
            const totalAmountInWei = ethers.utils.parseEther(totalAmount.toString());
            const maxReturnInCorrectUnit = ethers.utils.parseUnits(maxReturn.toString(), 16);
            const managementFeeInCorrectUnit = ethers.utils.parseUnits(managementFee.toString(), 16);

            // sending the transaction
            await send(name, minAmountInWei, totalAmountInWei, maxReturnInCorrectUnit, managementFeeInCorrectUnit)
        } catch (error) {
            console.log(error)
        }
    }

    const isLaunching = state?.status === 'Mining'

    return (
        <main>
            <div className="flex items-center justify-center h-screen pt-20">
                <form className="w-1/3 bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-5 text-gray-900">Create Your Portfolio!</h2>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company-name">
                        Name of the Company
                    </label>
                    <input className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none" type="text" placeholder="E.g: GrayScale" onChange={(e) => setName(e.target.value)}/>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="minimum-amount">
                        Minimum Amount to enter the portfolio (in ETH)
                    </label> 
                    <input className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none" type="number" placeholder="E.g: 0.001" min={0} step={0.0001} onChange={(e) => setMinAmount(e.target.value)} />
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="total-amount">
                        Enter the Target Raise Amount (in ETH)
                    </label>
                    <input className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none" type="number" placeholder="E.g: 0.1" min={0} step={0.001} onChange={(e) => setTotalAmount(e.target.value)} />
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maximum-return">
                        Enter the predicted Maximum Returns (in %)
                    </label>
                    <input className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none" type="number" placeholder="E.g: 25" min={1} step={0.01} onChange={(e) => setMaxReturn(e.target.value)} />
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="management-fee">
                        Enter the Management Fee (in %)
                    </label>
                    <input className="w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none" type="number" placeholder="E.g: 2" min={0} step={0.01} onChange={(e) => setManagementFee(e.target.value)} />
                    <button className="w-full bg-indigo-700 hover:bg-blue-800 text-white font-bold py-2 px-4 mb-6 rounded" onClick={handleSubmit}>
                        {isLaunching ? 'Launching Up...' : 'Launch 🚀'}
                    </button>
                </form>
            </div>
        </main>
    );
}
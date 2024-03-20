'use client'

import {useState, useMemo} from 'react';
import { ChainId, useEthers, useContractFunction} from '@usedapp/core';
import { ethers, Contract } from 'ethers';
import Platform from '@/context/Platform.json';

const { platformAddress } = require('@/context/address.json')

const Owner = () => {

    const contract = useMemo(() => new Contract(platformAddress, Platform.abi), []);

    const [state, setState] = useState(0);
    const [fee, setFee] = useState(0);
    const [returns, setReturns] = useState(0);
    const [portfolioId1, setPortfolioId1] = useState(0);
    const [portfolioId2, setPortfolioId2] = useState(0);
    const [portfolioId3, setPortfolioId3] = useState(0);

    // console.log(state, fee, returns, portfolioId1, portfolioId2, portfolioId3)

    const { switchNetwork } = useEthers();

    // changing the contract state
    const { state: changeState, send: changeStateSend } = useContractFunction(contract, 'changeState');

    const { state: changeFeeState, send: changeFeeSend } = useContractFunction(contract, 'changePlatformFee');

    const { state: setReturnsState, send: setReturnsSend } = useContractFunction(contract, 'setReturns');

    const { state: terminateState, send: terminateSend } = useContractFunction(contract, 'terminatePortfolio');


    // function to handle the change of state
    const handleChangeState = async (e) => {
        e.preventDefault()

        // checking if the chainId is not equal to the Optimism chainId
        try {
            if (ChainId !== 11155420) {
                await switchNetwork(11155420)
            }

            // sending the transaction
            await changeStateSend(portfolioId1, state)
        } catch (error) {
            console.log(error)
        }
    }

    // to check if the change state transaction is mining
    const isChangingState = changeState?.status === 'Mining'


    // function to handle the change of platform fee
    const handleChangeFee = async (e) => {
        e.preventDefault()

        // checking if the chainId is not equal to the Optimism chainId
        try {
            if (ChainId !== 11155420) {
                await switchNetwork(11155420) }
            const weiValue = ethers.utils.parseUnits(fee.toString(), 16);
            // sending the transaction
            await changeFeeSend(weiValue)
        } catch (error) {
            console.log(error)
        }
    }

    // to check if the change fee transaction is mining
    const isChangingFee = changeFeeState?.status === 'Mining'


    // function to handle the setting of returns
    const handleSetReturns = async (e) => {
        e.preventDefault()

        // checking if the chainId is not equal to the Optimism chainId
        try {
            if (ChainId !== 11155420) {
                await switchNetwork(11155420)
            }

            const weiValue = ethers.utils.parseUnits(returns.toString(), 16);
            // sending the transaction
            await setReturnsSend(portfolioId2, weiValue)
        } catch (error) {
            console.log(error)
        }
    }

    // to check if the set returns transaction is mining
    const isSettingReturns = setReturnsState?.status === 'Mining'
    

    // function to handle the termination of portfolio
    const handleTerminate = async (e) => {
        e.preventDefault()

        // checking if the chainId is not equal to the optimism chainId
        try {
            if (ChainId !== 11155420) {
                await switchNetwork(11155420)
            }

            // sending the transaction
            await terminateSend(portfolioId3)
        } catch (error) {
            console.log(error)
        }
    }

    // to check if the terminate transaction is mining
    const isTerminating = terminateState?.status === 'Mining'



    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 -mt-16">
            <h1 className="text-3xl text-white font-bold mb-6">Control Room</h1>
            <div className="grid grid-cols-2 gap-8">
                <div className="bg-white rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Change State of the Portfolios</h2>
                    <div className="flex flex-col space-y-2 mb-4">
                        <input type="number" className="border-2 border-gray-300 rounded px-2 py-1" placeholder="Portfolio Id" min={0} step={1} onChange={(e) => setPortfolioId1(e.target.value)}/>
                        <input type="number" className="border-2 border-gray-300 rounded px-2 py-1" placeholder="State" min={0} step={1} onChange={(e) => setState(e.target.value)}/>
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleChangeState}>
                        {isChangingState ? 'Changing State...' : 'Change State'} 
                    </button>
                </div>
                <div className="bg-white rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Set Returns (Manual for now)</h2>
                    <div className="flex flex-col space-y-2 mb-4">
                        <input type="number" className="border-2 border-gray-300 rounded px-2 py-1" placeholder="Portfolio Id" onChange={(e) => setPortfolioId2(e.target.value)}/>
                        <input type="number" className="border-2 border-gray-300 rounded px-2 py-1" placeholder="Returns in %" onChange={(e) => setReturns(e.target.value)}/>
                    </div>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleSetReturns}>
                        {isSettingReturns ? 'Setting Returns...' : 'Set Returns'}
                    </button>
                </div>
                <div className="bg-white rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Terminate Any Portfolio (temporary)</h2>
                    <div className="flex flex-col space-y-2 mb-4">
                        <input type="number" className="border-2 border-gray-300 rounded px-2 py-1" placeholder="Portfolio Id" onChange={(e) => setPortfolioId3(e.target.value)}/>
                    </div>
                    <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded" onClick={handleTerminate}>
                        {isTerminating ? 'Terminating...' : 'Terminate'}
                    </button>
                </div>
                <div className="bg-white rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Change Platform Fee</h2>
                    <div className="flex flex-col space-y-2 mb-4">
                        <input type="number" className="border-2 border-gray-300 rounded px-2 py-1" placeholder="Fee Amount" onChange={(e) => setFee(e.target.value)}/>
                    </div>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleChangeFee}>
                        {isChangingFee ? 'Changing Fee...' : 'Change Fee'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Owner;
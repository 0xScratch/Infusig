import { useEffect, useMemo, useState } from "react";
import { ChainId, useCall, useContractFunction, useEthers } from "@usedapp/core";
import { ethers, utils } from "ethers";

const Card = ({ id, contract, investor }) => {

    // calling data from blockchain
    const [name, setName] = useState('');
    const [maxReturn, setMaxReturn] = useState(0);
    const [totalFunds, setTotalFunds] = useState(0);
    const [minAmount, setMinAmount] = useState(0);
    const [feePercent, setFeePercent] = useState(0);
    const [amountCollected, setAmountCollected] = useState(0);

    // data for changing contract state
    const [newMaxReturn, setNewMaxReturn] = useState(0);
    const [newTotalFunds, setNewTotalFunds] = useState(0);
    const [payAmount, setPayAmount] = useState(0);
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [investAmount, setInvestAmount] = useState(0);

    const { switchNetwork } = useEthers();

    // changing the contract state
    const { state: maxReturnState, send: maxReturnSend } = useContractFunction(contract, 'changeMaxReturn');

    const { state: totalFundsState, send: totalFundsSend } = useContractFunction(contract, 'changeTotalFunds');

    const { state: payAmountState, send: payAmountSend } = useContractFunction(contract, 'payAmount');

    const { state: withdrawAmountState, send: withdrawAmountSend } = useContractFunction(contract, 'withdraw');

    const { state: investState, send: investSend } = useContractFunction(contract, 'invest');

    const { state: endPortfolioState, send: endPortfolioSend } = useContractFunction(contract, 'endPortfolio');


    // function to handle the investment
    const handleInvestAmount = async (e) => {
        e.preventDefault()

        // checking if the chainId is not equal to the Optimism chainId
        try {
            if (ChainId !== 11155420) {
                await switchNetwork(11155420)
            }

            const weiValue = ethers.utils.parseEther(investAmount.toString());
            // sending the transaction
            await investSend(id, { value: weiValue })
        } catch (error) {
            console.log(error)
        }
    }

    // to check if the invest transaction is mining
    const isInvesting = investState?.status === 'Mining'


    // function to handle the change of withdraw amount
    const handleWithdrawAmount = async (e) => {
        e.preventDefault()

        // checking if the chainId is not equal to the Optimism chainId
        try {
            if (ChainId !== 11155420) {
                await switchNetwork(11155420)
            }

            const weiValue = ethers.utils.parseEther(withdrawAmount.toString());
            // sending the transaction
            await withdrawAmountSend(id, weiValue)
        } catch (error) {
            console.log(error)
        }
    }

    // to check if the withdraw transaction is mining
    const isWithdrawing = withdrawAmountState?.status === 'Mining'


    // function to handle the change of max return
    const handleMaxReturn = async (e) => {
        e.preventDefault()

        // checking if the chainId is not equal to the Optimism chainId
        try {
            if (ChainId !== 11155420) {
                await switchNetwork(11155420)
            }

            const maxReturnInCorrectUnit = ethers.utils.parseUnits(newMaxReturn.toString(), 16);
            const product = (totalFunds * newMaxReturn) / 100;
            const finalValue = ethers.utils.parseEther(product.toString());

            // sending the transaction
            await maxReturnSend(id, maxReturnInCorrectUnit, { value: finalValue })
        } catch (error) {
            console.log(error)
        }
    }

    // to check if the max return transaction is mining
    const isMaxReturn = maxReturnState?.status === 'Mining'


    // function to handle the change of total funds
    const handleTotalFunds = async (e) => {
        e.preventDefault()

        // checking if the chainId is not equal to the Optimism chainId
        try {
            if (ChainId !== 11155420) {
                await switchNetwork(11155420)
            }

            const weiValue = ethers.utils.parseEther(newTotalFunds.toString());
            // sending the transaction
            await totalFundsSend(id, weiValue)
        } catch (error) {
            console.log(error)
        }
    }

    // to check if the total funds transaction is mining
    const isTotalFunds = totalFundsState?.status === 'Mining'


    // function to handle the payment
    const handlePayAmount = async (e) => {
        e.preventDefault()

        // checking if the chainId is not equal to the Optimism chainId
        try {
            if (ChainId !== 11155420) {
                await switchNetwork(11155420)
            }

            const finalValue = (amountCollected * maxReturn) / 100
            const weiValue = ethers.utils.parseEther(finalValue.toString());

            // sending the transaction
            await payAmountSend(id, { value: weiValue })
        } catch (error) {
            console.log(error)
        }
    }

    // to check if the pay amount transaction is mining
    const isPaying = payAmountState?.status === 'Mining'


    // function to handle the end of a portfolio
    const handleEndPortfolio = async (e) => {
        e.preventDefault()

        // checking if the chainId is not equal to the Optimism chainId
        try {
            if (ChainId !== 11155420) {
                await switchNetwork(11155420)
            }

            // sending the transaction
            await endPortfolioSend(id)
        } catch (error) {
            console.log(error)
        }
    }

    // to check if the end portfolio transaction is mining
    const isEndingPortfolio = endPortfolioState?.status === 'Mining'


    // helper function to convert wei to eth
    const helperFunc = (wei) => {
        const eth = utils.formatEther(wei);
        return eth;
    }

    // calling the contract to get the portfolio details
    const portfolioDetails = useMemo(() => ({ contract, method: 'getPortfolioMajorDetails', args: [id] }), [contract, id]);
    const details = useCall(portfolioDetails);


    // setting the values from the contract
    useEffect(() => {
        const setValues = () => {
            if (details && details.value) {

                setName(details.value[0].toString());
                setMaxReturn(helperFunc(details.value[4]._hex) * 100);
                setTotalFunds(helperFunc(details.value[3]._hex));
                setMinAmount(helperFunc(details.value[2]._hex));
                setFeePercent(helperFunc(details.value[6]._hex) * 100);
                setAmountCollected(helperFunc(details.value[5]._hex))
            }
        }

        setValues();
    }, [details])

    return (
        <div className="bg-white card text-black rounded-lg p-6 w-1/3">
            <div className="flex justify-between">
                <h2 className="text-2xl font-bold mb-3">{name}</h2>
                <span>#{id}</span>
            </div>
            <p className="mb-2">Jump in for only <strong>{minAmount} ETH!</strong></p>
            <ul className="list-disc list-inside">
                <li className="mb-1">Current Investment: <strong>{amountCollected} ETH</strong> already committed by investors</li>
                <li className="mb-1">Target Goal: <strong>{totalFunds} ETH</strong> to reach full capacity</li>
                <li className="mb-1">Potential Gains: Up to <strong>{maxReturn}%</strong> of your investment!</li>
                <li className="mb-1">Low Fee: Just <strong>{feePercent}%</strong> management fee</li>
            </ul>
            {!investor && <div className="flex flex-col space-y-4 mt-6">
                <div className="flex gap-4 justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/2" onClick={handleMaxReturn}>
                        {isMaxReturn ? 'Checking In...' : 'Change Max. Return'}
                    </button>
                    <input type="number" className="border-2 border-gray-300 rounded text-black px-2 w-1/2" placeholder="Enter Increased %" min={1} step={0.01} onChange={(e) => setNewMaxReturn(e.target.value)} />
                </div>
                <div className=" gap-4 flex justify-between">
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-1/2" onClick={handleTotalFunds}>
                        {isTotalFunds ? 'Changing...' : 'Change Total Funds'}
                    </button>
                    <input type="number" className="border-2 border-gray-300 rounded text-black px-2 w-1/2" placeholder="Enter New Amount" min={0} step={0.001} onChange={(e) => setNewTotalFunds(e.target.value)} />
                </div>
                <div className="flex gap-4 justify-between">
                    <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded w-full" onClick={handlePayAmount}>
                        {isPaying ? 'Paying...' : 'Pay Amount'}
                    </button>
                </div>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full" onClick={handleEndPortfolio}>
                    {isEndingPortfolio ? 'Wrapping Up...' : 'End Portfolio'}
                </button>
            </div>}
            {investor && <div className="flex flex-col space-y-4 mt-6">
                <div className="flex justify-between gap-4">
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-1/2" onClick={handleInvestAmount}>
                        {isInvesting ? 'Investing...' : 'Invest 🪙'}
                    </button>
                    <input type="number" className="border-2 border-gray-300 rounded text-black px-2 w-1/2" placeholder="Amount to invest" min={0} step={0.0001} onChange={(e) => setInvestAmount(e.target.value)} />
                </div>
                <div className="flex justify-between gap-4">
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-1/2" onClick={handleWithdrawAmount}>
                        {isWithdrawing ? 'On the Way...' : 'Withdraw 💳'}
                    </button>
                    <input type="number" className="border-2 border-gray-300 rounded text-black px-2 w-1/2" placeholder="Watch your funds" min={0} step={0.0001} onChange={(e) => setWithdrawAmount(e.target.value)} />
                </div>
            </div>}
        </div>
    )
}

export default Card;
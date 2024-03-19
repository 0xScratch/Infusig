import { useEffect, useMemo, useState } from "react";
import { useCall } from "@usedapp/core";
import { utils } from "ethers";

const Card = ({ id, contract}) => {

    const [name, setName] = useState('');
    const [maxReturn, setMaxReturn] = useState(0);
    const [totalFunds, setTotalFunds] = useState(0);
    const [minAmount, setMinAmount] = useState(0);
    const [feePercent, setFeePercent] = useState(0);
    const [amountCollected, setAmountCollected] = useState(0);

    const helperFunc = (wei) => {
        const eth = utils.formatEther(wei);
        return eth;
    }
    // console.log(helperFunc(trial_object))

    // const portfolioDetails = useMemo(() => ({contract, method: 'getPortfolioMajorDetails', args: [id]}), [contract, id]);
    // const details = useCall(portfolioDetails);
    // console.log(helperFunc(details.value[4]._hex) * 100)
    // console.log(helperFunc(details.value[4]._hex) * 100)
    // console.log(helperFunc(details.value[3]._hex))

    // useEffect(() => {
    //     const setValues = () => {
    //         if (details && details.value) {

    //             setName(details.value[0].toString());
    //             setMaxReturn(helperFunc(details.value[4]._hex) * 100);
    //             setTotalFunds(helperFunc(details.value[3]._hex));
    //             setMinAmount(helperFunc(details.value[2]._hex));
    //             setFeePercent(helperFunc(details.value[6]._hex) * 100);
    //             setAmountCollected(helperFunc(details.value[5]._hex))
    //         }
    //     }

    //     setValues();
    // }, [details])

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
            <div className="flex flex-col space-y-4 mt-6">
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-auto">Change Max. Return</button>
    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-auto">Change Total Funds</button>
    <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded w-auto">Pay Amount</button>
    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-auto">End Portfolio</button>
</div> 
        </div>
    )
}

export default Card;
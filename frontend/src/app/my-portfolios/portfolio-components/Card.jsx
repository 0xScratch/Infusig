const Card = () => {
    return (
        <div className="bg-white card text-black rounded-lg p-6 w-1/3">
            <div className="flex justify-between">
                <h2 className="text-2xl font-bold mb-3">GrayScale</h2>
                <span>#0</span>
            </div>
            <p className="mb-2">Jump in for only <strong>0.1 ETH!</strong></p>
            <ul className="list-disc list-inside">
                <li className="mb-1">Current Investment: <strong>0.5 ETH</strong> already committed by investors</li>
                <li className="mb-1">Target Goal: <strong>1 ETH</strong> to reach full capacity</li>
                <li className="mb-1">Investment Window: Launched on <strong>Jan 1, 2022 (Open until Dec 31, 2022)</strong></li>
                <li className="mb-1">Potential Gains: Up to <strong>23%</strong> of your investment!</li>
                <li className="mb-1">Low Fee: Just <strong>1%</strong> management fee</li>
            </ul>
            <div className="flex flex-col space-y-4 mt-6">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Change Max. Return</button>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Change Total Funds</button>
                <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">Pay Amount</button>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">End Portfolio</button>
            </div>
        </div>
    )
}

export default Card;
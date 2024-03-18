// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Platform {
    // platform fee - let's suppose it to be 1% right
    uint public platformFee = 1 ether / 100;

    // withdraw fee - let's suppose it to be 0.6%
    uint public withdrawFee = 6 ether / 1000;

    // portfolio struct
    struct portfolio {
        address manager; // owner address
        bool isOpen; // tells whether someone can invest in the portfolio or not
        bool isPaid; // tells whether the manager has paid his amount or not
        bool deadlineApproached; // tells whether the deadline has approached or not
        uint id; // id of the portfolio
        string name;
        uint minAmount; // minimum amount one should invest to enter in this portfolio
        uint totalFunds; // Upto which value the manager would collect funds
        uint maxReturn; // maximum return percentage that portfolio can provide (this value is changeable)
        uint amountCollected; // includes the amount collected from investors
        uint feePercent; // management fee percentage
        PortfolioStatus status; // status of the portfolio
        address[] investors; // investors in the portfolio
    }

    // enum for the status of the portfolio
    enum PortfolioStatus {
        OpenforInvestors,
        FeeTimeForManager,
        PortfolioInAction
    }

    // portfolio array
    portfolio[] public portfolios;

    // returns mapping
    mapping(uint => uint) public portfolioReturns;

    // investors mapping
    mapping(uint => mapping(address => uint)) public portfolioInvestors;

    // owner
    address public owner;

    ////////// Modifiers //////////

    // only owner modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    // when portfolio is opened for investors
    modifier isOpen(uint _id) {
        require(
            portfolios[_id].status == PortfolioStatus.OpenforInvestors,
            "Portfolio not in open state"
        );
        _;
    }

    // when portfolio is closed for investors and open for manager to pay the amount
    modifier isFeeTime(uint _id) {
        require(
            portfolios[_id].manager == msg.sender,
            "Only the manager can call this function"
        );
        require(!portfolios[_id].isPaid, "Manager has paid the amount");
        require(
            portfolios[_id].status == PortfolioStatus.FeeTimeForManager,
            "Portfolio is not open for manager to pay the amount"
        );
        _;
    }

    // when portfolio is in action
    modifier inAction(uint _id) {
        require(
            portfolios[_id].status == PortfolioStatus.PortfolioInAction,
            "Portfolio ain't in trading mode!"
        );
        _;
    }

    // constructor
    constructor() {
        owner = msg.sender;
    }

    ////////// Functions for Portfolio Managers //////////

    // create portfolio
    function createPortfolio(
        string memory _name,
        uint _minAmount,
        uint _totalFunds,
        uint _maxReturn,
        uint _feePercent
    ) public {
        require(_totalFunds > 0, "Total funds should be greater than 0");

        portfolios.push(
            portfolio({
                manager: msg.sender,
                isOpen: true,
                isPaid: false,
                deadlineApproached: false,
                id: portfolios.length,
                name: _name,
                minAmount: _minAmount,
                totalFunds: _totalFunds,
                maxReturn: _maxReturn,
                amountCollected: 0,
                feePercent: _feePercent,
                status: PortfolioStatus.OpenforInvestors,
                investors: new address[](0)
            })
        );
    }

    // function to change the range of total funds collected for a particular portfolio
    function changeTotalFunds(uint _id, uint _totalFunds) public isOpen(_id) {
        require(
            portfolios[_id].manager == msg.sender,
            "Only the manager can change the total funds"
        );
        require(
            _totalFunds > portfolios[_id].totalFunds,
            "New total funds should be greater than the previous one"
        );
        portfolios[_id].totalFunds = _totalFunds;
    }

    // function by which manager can pay the amount decided to the smart contract which clarifies the fact that the manager is ready to invest the funds poured in his portfolio
    function payAmount(uint _id) public payable isFeeTime(_id) {
        uint amountToPay = (portfolios[_id].amountCollected * portfolios[_id].maxReturn) / 1e18;
        require(
            msg.value >= amountToPay,
            "Amount should be equal to the total funds"
        );
        portfolios[_id].isPaid = true;
        portfolios[_id].status = PortfolioStatus.PortfolioInAction;
    }

    // function for manager to call, when he thinks that maximum return percentage could be increased (cuz it do makes sense to increase the return percentage when the market is in the bull phase)
    // Here this function is done payable cuz when he predicts that the return could be increased to a certain extent, he should pay an equal amount to the smart contract...this is done to avoid any fraud or scam!
    function changeMaxReturn(
        uint _id,
        uint _increasedPercentage
    ) public payable {
        require(portfolios[_id].isPaid == true, "First pay your initial amount");
        require(
            portfolios[_id].manager == msg.sender,
            "Only the manager can call this function"
        );
        uint increasedAmount = (portfolios[_id].totalFunds *
            _increasedPercentage) / 1e18;
        require(
            msg.value >= increasedAmount,
            "Amount should be equal to the increased amount"
        );
        portfolios[_id].maxReturn =
            _increasedPercentage +
            portfolios[_id].maxReturn;
    }

    // This function will be called by manager to end the portfolio cuz either the deadline is near or the portfolio manager thinks that we can't get enough returns than this or whatever the reason
    // Here charges will be applied to investors by both platform and portfolio manager
    // Then investors will get their crypto including the profits they earned and deducting the fees charged!
    // At end the portfolio manager will be returned his amount
    function endPortfolio(uint _id) public inAction(_id){
        require(
            portfolios[_id].manager == msg.sender ||
                portfolios[_id].deadlineApproached,
            "Only the manager can call this function or if the deadline has approached"
        );

        // These are some variables which be used again and again..thus we declared them here
        uint feePercent = portfolios[_id].feePercent;
        uint length = portfolios[_id].investors.length;
        uint amountCollected = portfolios[_id].amountCollected;
        address managerAddress = portfolios[_id].manager;

        // current returns
        uint currentReturn = portfolioReturns[_id];

        // This is the total fee collected by the portfolio manager, and it's the management fee (later we can add performance one)
        uint feeCollected = (amountCollected * feePercent) / 1 ether;
        payable(managerAddress).transfer(feeCollected);

        // This is the total fee collected by the platform collectively from all investors
        uint totalPlatformFee = (amountCollected * platformFee) / 1 ether;
        payable(owner).transfer(totalPlatformFee);

        // Here's the code which is used to transfer the returns to the investors
        for (uint i; i < length; ) {
            // First getting the address of the investor
            address investor = portfolios[_id].investors[i];

            // Then getting the amount invested by the investor
            uint amount = portfolioInvestors[_id][investor];

            // Checking whether the amount is not 0
            if (amount > 0) {
                // Here we are calculating the amount which is to be returned to the investor, it's like Suppose
                // the investor invested 100ETH, the feePercent is 5%, the platformFee is 1% and the currentReturns for this portfolio is 10%, then the amount
                // which is to be returned to the investor is 100 - (100 * 5%) - (100 * 1%) + (100 * 10%) = 104ETH
                uint tranferrableAmount = (amount * 1e18 -
                    (amount * feePercent) -
                    (amount * platformFee) +
                    (amount * currentReturn)) / 1e18;
                payable(investor).transfer(tranferrableAmount);
            }

            unchecked {
                ++i;
            }
        }

        // Give back the remaining amount back to the portfolio manager, which kind of invested in start by him..
        // Now there be two cases of it, sometimes he be hitting up his max. return and sometimes he not
        // Usually, it goes like this - Suppose the total funds collected are 100ETH, and he is expecting 60% returns
        // but returns comes out to be 50% by the end of his deadline then, in start he deposited 60 ETH, then these 10
        // ETH will be returned back by cutting off the platform fee (but right now we are considering any platform fee 
        //from companies
        uint maxReturn = portfolios[_id].maxReturn;

        if (maxReturn > currentReturn) {
            uint transferAmount = amountCollected * (maxReturn - currentReturn) / 1e18;
            payable(managerAddress).transfer(transferAmount);
        }

        // At last delete the portfolio data from the blockchain
        delete portfolios[_id];
    }

    // This function will be called by the owner in case he finds some fraudelent activites done by the portfolio..here money will be returned to the investors including the amount stored by the manager of that portfolio, and that portfolio managers will be send to blacklist
    function terminatePortfolio(uint _id) public onlyOwner {
        require(
            portfolios[_id].status == PortfolioStatus.PortfolioInAction,
            "Portfolio is not in action"
        );

        // This is the total fee collected by the platform collectively from all investors
        uint totalPlatformFee = portfolios[_id].amountCollected * platformFee / 1e18;
        payable(owner).transfer(totalPlatformFee);

        // This is the maxReturn been allocated by the portfolio manager, and he do paid amount which can fulfill the maxReturn
        uint maxReturn = portfolios[_id].maxReturn;

        // Here's the code which is used to transfer the returns to the investors, and here the return % will be maxPercent cuz the portfolio is terminated by the owner
        uint length = portfolios[_id].investors.length;

        for (uint i; i < length; ) {
            // First getting the address of the investor
            address investor = portfolios[_id].investors[i];

            // Then getting the amount invested by the investor
            uint amount = portfolioInvestors[_id][investor];

            // Checking whether the amount is not 0
            if (amount > 0) {
                
                uint transferrableAmount = (amount * 1e18 -
                    (amount * platformFee) +
                    (amount * maxReturn)) / 1e18;
                payable(investor).transfer(transferrableAmount);
            }

            unchecked {
                ++i;
            }
        }

        // Here we can blacklist the portfolio manager

        // At last delete the portfolio data from the blockchain
        delete portfolios[_id];
    }

    ////////// Helper Functions //////////

    // This is a manual testing function to set the returns of a particular portfolio
    function setReturns(uint id, uint _amount) public onlyOwner{
        portfolioReturns[id] = _amount;
    }

    // This function will tell the current returns of a particular portfolio
    function getReturns(uint id) public view returns (uint) {
        return portfolioReturns[id];
    }

    // function to manually change the portfolio status
    function changeState(uint _id, PortfolioStatus _state) public onlyOwner {
        portfolios[_id].status = _state;
    }

    // function to change the platform fee
    function changePlatformFee(uint _fee) public onlyOwner {
        platformFee = _fee;
    }

    function markDeadlineApproached(uint _id) public onlyOwner {
        portfolios[_id].deadlineApproached = true;
        if (portfolioReturns[_id] > portfolios[_id].maxReturn) {
            portfolioReturns[_id] = portfolios[_id].maxReturn;
        }
    }

    // This is a manual function to close the portfolio as the first deadline hits
    function closePortfolio(uint _id) public onlyOwner {
        portfolios[_id].isOpen = false;
        portfolios[_id].status = PortfolioStatus.FeeTimeForManager;
    }

    ////////// Functions for Investors //////////

    // function to invest in a particular portfolio
    function invest(uint _portfolioId) public payable isOpen(_portfolioId) {
        require(
            msg.value >= portfolios[_portfolioId].minAmount,
            "Amount should be greater than the minimum amount"
        );
        require(
            msg.value + portfolios[_portfolioId].amountCollected <=
                portfolios[_portfolioId].totalFunds,
            "Amount should be less than the total funds"
        );
        portfolios[_portfolioId].amountCollected += msg.value;
        portfolioInvestors[_portfolioId][msg.sender] += msg.value;
        portfolios[_portfolioId].investors.push(msg.sender);
    }

    function withdraw(uint _portfolioId, uint amount) public {
        require(amount > 0, "Amount should be greater than 0");
        require(
            amount <= portfolioInvestors[_portfolioId][msg.sender],
            "You don't have enough amount to withdraw"
        );
        require(
            portfolios[_portfolioId].status !=
                PortfolioStatus.FeeTimeForManager,
            "You can't withdraw now"
        );
        if (
            portfolios[_portfolioId].status == PortfolioStatus.OpenforInvestors
        ) {
            // Here we calculated the platform fee and then transfer the amount to the owner
            uint charge = (amount * withdrawFee) / 1e18;
            payable(owner).transfer(charge);

            // Here we updated the actual amount which to be returned to the owner
            uint newAmount = amount - charge;
            portfolioInvestors[_portfolioId][msg.sender] -= amount;
            portfolios[_portfolioId].amountCollected -= amount;
            payable(msg.sender).transfer(newAmount);
        } else {
            // Here we are charging the investor with both platform fee and portfolio fee, Make sure that these fees are charged
            // now excluding his profit or loss returns i.e we aren't really bothering about his returns, just the amount he actually
            // paid to the portfolio...This could be change in future!
            uint platformCharge = (amount * platformFee) / 1e18;
            uint portfolioFee = (amount * portfolios[_portfolioId].feePercent) / 1e18;
            payable(owner).transfer(platformCharge);
            payable(portfolios[_portfolioId].manager).transfer(portfolioFee);

            // Here we updated the actual amount which to be returned to the investor - Here final amount = fees gained by the platform + profit/loss returns made by the portfolio
            uint newAmount = (amount - platformCharge - portfolioFee) +
                (amount * portfolioReturns[_portfolioId]) / 1e18;

            // Here we updated the amount collected by the portfolio and the investor
            portfolioInvestors[_portfolioId][msg.sender] -= amount;
            portfolios[_portfolioId].amountCollected -= amount;
            payable(msg.sender).transfer(newAmount);
        }
    }

    ////////// Getters //////////

    // get the portfolio name
    function getPortfolioName(uint _id) public view returns (string memory) {
        return portfolios[_id].name;
    }
    
    // get the portfolio manager_address
    function getPortfolioManager(uint _id) public view returns (address) {
        return portfolios[_id].manager;
    }

    // get the portfolio minimum amount
    function getPortfolioMinAmount(uint _id) public view returns (uint) {
        return portfolios[_id].minAmount;
    }

    // get the portfolio total funds
    function getPortfolioTotalFunds(uint _id) public view returns (uint) {
        return portfolios[_id].totalFunds;
    }

    // get the portfolio max return
    function getPortfolioMaxReturn(uint _id) public view returns (uint) {
        return portfolios[_id].maxReturn;
    }

    // get the portfolio amount collected
    function getPortfolioAmountCollected(uint _id) public view returns (uint) {
        return portfolios[_id].amountCollected;
    }

    // get the portfolio fee percent
    function getPortfolioFeePercent(uint _id) public view returns (uint) {
        return portfolios[_id].feePercent;
    }

    // get the portfolio status
    function getPortfolioStatus(uint _id) public view returns (PortfolioStatus) {
        return portfolios[_id].status;
    }

    // check if the portfolio is open
    function isPortfolioOpen(uint _id) public view returns (bool) {
        return portfolios[_id].isOpen;
    }

    // check if the portfolio is paid
    function isPortfolioPaid(uint _id) public view returns (bool) {
        return portfolios[_id].isPaid;
    }

    // check if the portfolio deadline has approached
    function hasDeadlineApproached(uint _id) public view returns (bool) {
        return portfolios[_id].deadlineApproached;
    }
}

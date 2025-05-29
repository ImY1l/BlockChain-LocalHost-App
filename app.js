const contractAddress = "0xddaAd340b0f1Ef65169Ae5E41A8b10776a75482d"; // Your deployed contract address

const abi = [
    {
        "inputs": [
            { "internalType": "uint256", "name": "_goal", "type": "uint256" },
            { "internalType": "uint256", "name": "_durationDays", "type": "uint256" }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "checkBalance",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "contribute",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "deadline",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getDetails",
        "outputs": [
            { "internalType": "uint256", "name": "_goal", "type": "uint256" },
            { "internalType": "uint256", "name": "_deadline", "type": "uint256" },
            { "internalType": "uint256", "name": "_raised", "type": "uint256" },
            { "internalType": "uint256", "name": "_contributors", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "raised",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "refund",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "name": "contributions",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
];

let provider, signer, contract;
let userAddress;

const connectBtn = document.getElementById('connectBtn');
const walletAddressDiv = document.getElementById('walletAddress');
const goalSpan = document.getElementById('goal');
const raisedSpan = document.getElementById('raised');
const balanceSpan = document.getElementById('balance');
const deadlineSpan = document.getElementById('deadline');
const contributorsSpan = document.getElementById('contributors');
const timeLeftSpan = document.getElementById('timeLeft');
const contributeBtn = document.getElementById('contributeBtn');
const contributionAmountInput = document.getElementById('contributionAmount');
const withdrawBtn = document.getElementById('withdrawBtn');
const ownerSection = document.getElementById('ownerSection');
const refundBtn = document.getElementById('refundBtn');

connectBtn.onclick = async () => {
    if (window.ethereum) {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            userAddress = await signer.getAddress();
            walletAddressDiv.textContent = `Connected wallet: ${userAddress}`;
            contract = new ethers.Contract(contractAddress, abi, signer);
            await updateUI();
            checkOwner();
        } catch (error) {
            alert("Failed to connect wallet: " + error.message);
        }
    } else {
        alert("Please install MetaMask!");
    }
};

async function updateUI() {
    try {
        const [goal, deadline, raised, contributors] = await contract.getDetails();
        const balance = await contract.checkBalance();

        goalSpan.textContent = ethers.utils.formatEther(goal);
        raisedSpan.textContent = ethers.utils.formatEther(raised);
        balanceSpan.textContent = ethers.utils.formatEther(balance);
        contributorsSpan.textContent = contributors;

        const deadlineDate = new Date(deadline.toNumber() * 1000);
        deadlineSpan.textContent = deadlineDate.toLocaleString();

        const now = Date.now();
        const timeLeftMs = deadlineDate.getTime() - now;
        if (timeLeftMs > 0) {
            const days = Math.floor(timeLeftMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeftMs / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((timeLeftMs / (1000 * 60)) % 60);
            timeLeftSpan.textContent = `${days}d ${hours}h ${minutes}m`;
        } else {
            timeLeftSpan.textContent = "Deadline passed";
        }
    } catch (error) {
        console.error("Error updating UI:", error);
    }
}

contributeBtn.onclick = async () => {
    if (!contract) {
        alert("Connect wallet first");
        return;
    }
    const amount = contributionAmountInput.value;
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
        alert("Enter a valid contribution amount");
        return;
    }
    try {
        const tx = await contract.contribute({ value: ethers.utils.parseEther(amount) });
        await tx.wait();
        alert("Contribution successful!");
        contributionAmountInput.value = "";
        await updateUI();
    } catch (error) {
        alert("Contribution failed: " + (error.data?.message || error.message));
    }
};

withdrawBtn.onclick = async () => {
    if (!contract) {
        alert("Connect wallet first");
        return;
    }
    try {
        const tx = await contract.withdraw();
        await tx.wait();
        alert("Withdrawal successful!");
        await updateUI();
    } catch (error) {
        alert("Withdrawal failed: " + (error.data?.message || error.message));
    }
};

refundBtn.onclick = async () => {
    if (!contract) {
        alert("Connect wallet first");
        return;
    }
    try {
        const tx = await contract.refund();
        await tx.wait();
        alert("Refund successful!");
        await updateUI();
    } catch (error) {
        alert("Refund failed: " + (error.data?.message || error.message));
    }
};

async function checkOwner() {
    if (!contract || !userAddress) return;
    try {
        const contractOwner = await contract.owner();
        if (contractOwner.toLowerCase() === userAddress.toLowerCase()) {
            ownerSection.style.display = "block";
        } else {
            ownerSection.style.display = "none";
        }
    } catch (error) {
        console.error("Error checking owner:", error);
    }
}

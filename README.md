# 💸 Decentralized Crowdfunding DApp
A simple Ethereum-based decentralized crowdfunding application.

## 🔧 Features
- Accepts ETH contributions
- Tracks total raised amount and contributor count
- Refund option if the funding goal is not met
- Owner-only withdrawal if the goal is reached
- Displays real-time funding status, goal progress, and deadlines
- Full MetaMask integration for wallet connection and transaction signing

## 🌐 Frontend
- JavaScript, HTML, and CSS
- Uses [Ethers.js](https://docs.ethers.org/) to interact with MetaMask and the smart contract
- Dynamic display of:
  - Goal, Raised, Deadline
  - Time left
  - User contribution
  - Progress bar
- Fully responsive UI

## 🚀 Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/ImY1l/Decentralized-App.git
   cd Decentralized-App
   ```
2. Change "YOUR_CONTRACT_ADDRESS" in [`app.js`](./app.js) to your real address:
   ```javascript
   const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS"
   ```
3. Start a local server in the project folder:
   ```bash
   python -m http.server 8080 # or any number 
   ```
4. Open http://localhost:8080/Yous.html in your browser
5. Use the app!!

# 💸 Decentralized Crowdfunding DApp

A simple Ethereum-based decentralized crowdfunding application.

## 🔧 Features

- Accepts ETH contributions
- Tracks total raised amount and contributor count
- Refund option if the funding goal is not met
- Owner-only withdrawal if the goal is reached
- Displays real-time funding status, goal progress, and deadlines
- Full MetaMask integration for wallet connection and transaction signing

## 🧠 Smart Contract

File: [Crowdfunding.sol](./Crowdfunding.sol)

- `contribute()` – Accepts ETH, updates state
- `withdraw()` – Owner withdraws funds after success
- `refund()` – Contributors get refunds if the goal fails
- `getDetails()` – Returns full campaign state
- `getContribution(address)` – View a user's contribution
- Emits events for contributions, refunds, and withdrawals

## 🌐 Frontend

- JavaScript, HTML, and CSS
- Uses [Ethers.js](https://docs.ethers.org/) to interact with MetaMask and the smart contract
- Dynamic display of:
  - Goal, Raised, Deadline
  - Time left
  - User contribution
  - Progress bar
- Fully responsive UI

## ▶️ How to Run Locally

1. Put your contract address in [`app.js`](./app.js)
2. Start a local server in the project folder:
   ```bash
   python -m http.server 8080 # or any number 
   ```
3. 

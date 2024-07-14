# Personalized Voting System using Web3 & Blockchain

The Personalized Voting System is a decentralized application (dApp) built on Web3 technologies and blockchain, designed to facilitate secure and transparent voting processes. Utilizing the Soroban framework, this project integrates smart contracts to manage various aspects of the voting lifecycle.

![App Screenshot 1](link-to-screenshot-1)
![App Screenshot 2](link-to-screenshot-2)
![App Screenshot 3](link-to-screenshot-3)

## Project Overview

This project leverages blockchain's immutable ledger and smart contracts to ensure the integrity and transparency of voting procedures. The Soroban smart contracts employed in this application include:

### `record_votes()`

Handles the process of recording votes cast by users securely on the blockchain, ensuring each vote is verifiable and tamper-proof.

### `view_poll()`

Enables participants to view the details and current status of active polls, providing transparency into ongoing voting activities.

### `view_voter()`

Allows administrators to access individual voter records, ensuring accountability and preventing duplicate or unauthorized voting.

### `withdraw_votes()`

Enables voters to retract their previously cast votes if they choose to change their decision before the voting deadline.

### `change_vote()`

Permits voters to modify their votes up until the voting deadline, ensuring flexibility in decision-making during the voting period.

### `set_deadline()`

Facilitates administrators in setting deadlines for voting, ensuring timely closure of polls and preventing further voting after the set time.

### `announce_results()`

Automatically computes and publicly announces the results of completed polls based on the votes recorded in the smart contract, ensuring transparency and trust in the outcome.

### `reset_poll()`

Allows administrators to reset polls if needed, clearing all existing votes and resetting the voting process, ensuring flexibility in managing voting campaigns.

## Getting Started

### Step 1

Clone this repository to your local machine:

```shell
git clone <repo-url>
cd name-of-folder
```

### Step 2

Deploy the Soroban smart contract (`n2d-soroban-votecontract-v1.rs`) on the blockchain network of your choice. Refer to the provided deployment instructions for guidance.

### Step 3

Configure and run the NextJS front-end application:

```shell
cd name-of-folder
npm install
```

### Step 4

Update the contract address in the configuration file (`soroban.js` or equivalent) with the deployed contract address.

```javascript
let contractAddress = 'YOUR_CONTRACT_ADDRESS_HERE';
```

Save the file.

### Step 5

Install the Freighter browser wallet extension and create your wallet account. Fund your account with test tokens if necessary.

### Step 6

Run the application locally:

```shell
npm run dev
```

The application should now be accessible at [localhost:3000](https://localhost:3000).

## Demo

Insert link to your live demo here.

## Additional Notes

For detailed guidance on deploying the smart contract and using the application, refer to the tutorial videos provided:

- [Deployment Tutorial](https://www.youtube.com/watch?v=your-deployment-tutorial-video)
- [Application Usage Tutorial](https://www.youtube.com/watch?v=your-app-usage-tutorial-video)

---

This README provides an overview of the project, its functionalities, and guidance on setting up and deploying the application. Adjust the details and placeholders according to your project specifications and preferences.

---

Feel free to use this README as a template for your project documentation on GitHub. Let me know if there's anything else you need help with!

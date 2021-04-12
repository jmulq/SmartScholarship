import React from 'react';
import { Button } from "./";

export const WalletButton = ({ provider, loadWeb3Modal, logoutOfWeb3Modal }) => {
    return (
        <Button
            onClick={() => {
                if (!provider) {
                    loadWeb3Modal();
                } else {
                    logoutOfWeb3Modal();
                }
            }}
        >
            {!provider ? "Connect Wallet" : "Disconnect Wallet"}
        </Button>
    );
}
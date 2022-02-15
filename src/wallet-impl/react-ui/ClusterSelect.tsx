import { FormControl, InputLabel, Menu, MenuItem, Select, Tooltip } from "@mui/material";
import { clusterApiUrl } from "@safecoin/web3.js";
import React from "react";
import { useContext, useState } from "react";
import { ConnectContext } from "../wallet-adapter-react/ConnectContext";


interface DomEvent {
    target?: Element;
}

export default function ClusterSelect() {
    const { endpoint, setEndpoint } = useContext(ConnectContext);

    const networks = [
        'mainnet-beta',
        'devnet',
        'testnet',
        'http://localhost:8899',
    ];

    const networkLabels = [
        'Mainnet Beta',
        'Devnet',
        'Testnet'
    ];

    const changeEndpoint = (e: DomEvent) => {
        if (e && e.target && e.target.value) {
            console.log(e.target.value);
            setEndpoint(e?.target?.value);
        }
    }

    return (
        <FormControl id="cluster-select-root" variant="standard" sx={{ width: { xs: 150 }, marginX: "1em" }}>
            <Select
                autoWidth={true}
                labelId="demo-simple-select-label"
                id="cluster-select"
                value={endpoint}
                label="Age"
                onChange={changeEndpoint}
                sx={{fontSize:"smaller"}}
            >
                {networks.map((nw, idx) => (<MenuItem sx={{ fontSize: "smaller" }} key={idx} value={nw}>{networkLabels[idx]}</MenuItem>))}

            </Select>
        </FormControl>)
}



import { FormControl, InputLabel, Menu, MenuItem, Select, SelectChangeEvent, Tooltip } from "@mui/material";
import React, { ChangeEvent } from "react";
import { useContext } from "react";
import { ConnectContext } from "../wallet-adapter-react/ConnectContext";


interface DomEvent {
    target?: HTMLElement;
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

    const changeEndpoint = (e: SelectChangeEvent<string>) => {
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



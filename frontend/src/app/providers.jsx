'use client'

import { DAppProvider, DEFAULT_SUPPORTED_CHAINS } from "@usedapp/core"
// import { getDefaultProvider } from "ethers"
import { OptimismSepolia } from "../context/chain"

// const { https } = require('/secrets.json')

const config = {
    readOnlyChainId: OptimismSepolia.chainId,
    readOnlyUrls: {
        [OptimismSepolia.chainId]: process.env.NEXT_PUBLIC_HTTPS
    },
    networks: [...DEFAULT_SUPPORTED_CHAINS, OptimismSepolia],
}

export function Providers({ children }) {
    return (
        <DAppProvider config={config} >
            {children}
        </DAppProvider>
    )
}
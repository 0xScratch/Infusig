'use client'

import { DAppProvider, MoonbaseAlpha } from "@usedapp/core"
import { getDefaultProvider } from "ethers"

const config = {
    readOnlyChainId: MoonbaseAlpha.chainId,
    readOnlyUrls: {
        [MoonbaseAlpha.chainId]: getDefaultProvider(
            'https://moonbase-alpha.blastapi.io/d674f3b3-cfe9-4e7b-8d4f-601e1e1d17d2'
        )
    }
}

export function Providers({ children }) {
    return (
        <DAppProvider config={config} >
            {children}
        </DAppProvider>
    )
}
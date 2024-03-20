'use client'

import { DAppProvider, MoonbaseAlpha } from "@usedapp/core"
import { getDefaultProvider } from "ethers"

const config = {
    readOnlyChainId: MoonbaseAlpha.chainId,
    readOnlyUrls: {
        [MoonbaseAlpha.chainId]: getDefaultProvider(
            process.env.NEXT_PUBLIC_HTTPS
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
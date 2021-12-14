import Web3 from 'web3'
import { useEffect, useState } from "react"

async function getUserNonce(addr) {
    const user_response = await fetch("/api/user?addr="+addr)
    const user_data = await user_response.json()
    return user_data.nonce || undefined
}

export default function Auth() {
    // States
    const [web3, setWeb3] = useState(undefined)
    const [authenticatedAddress, setAuthenticatedAddress] = useState("")

    useEffect(() => {
        if (window?.ethereum) {
            const web3 = new Web3(window.ethereum)
            setWeb3(web3)
        }
    }, [])

    const onWeb3Login = async () => {
        // Request account access
        const address = (await web3.eth.requestAccounts())[0]
        // Fetch user nonce
        const nonce = await getUserNonce(address)
        // Create message to sign
        const message = "Hello "+nonce
        // Request user to sign the signature
        const signature = await web3.eth.personal.sign(message, address)
        // Verify signature and address
        const result = await fetch(`/api/verify?sig=${signature}&addr=${address}`)
        const data = await result.json()

        if (data.success) {
            setAuthenticatedAddress(address)
        }
    }

    return (
        <div style={{'margin':"50px"}}>
        {!authenticatedAddress && web3 && <button onClick={onWeb3Login} >Connect to wallet</button>}
        {authenticatedAddress && <div>You are logged in with {authenticatedAddress}</div>}
        </div>
    )
}
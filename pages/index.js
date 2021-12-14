import Web3 from 'web3'
import { useEffect, useState } from "react"

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
        // Create message to sign
        const message = "Hello Prezi!"
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

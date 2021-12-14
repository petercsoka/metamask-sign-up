import { nonce } from "../../db/user"

// Return nonce for a given address
export default function handler(req, res) {
    return res
          .status(200)
          .send({ nonce });
}
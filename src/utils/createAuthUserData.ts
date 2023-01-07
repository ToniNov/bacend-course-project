import { Secret } from "../enum/secret";

const jwt = require('jsonwebtoken')

export const createAuthUserData = async (user: (any & { password: string }) | undefined | null) => {
    const userInstance = JSON.parse(JSON.stringify(user))

    const token = jwt.sign({
        _id: userInstance._id,
    }, Secret.Secret, { expiresIn: '2d' })

    const { password, ...otherUserData } = userInstance

    return Promise.resolve({ token, ...otherUserData })
}

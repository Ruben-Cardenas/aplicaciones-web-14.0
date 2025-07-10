import  Jwt  from 'jsonwebtoken'
const ACCESS_SECRET = "secret1234utd";


export const generateAccessToken = (userId: string, role: any) => {
    return Jwt.sign (
        { userId },
        ACCESS_SECRET,
        { 
            expiresIn: "15m" 
        }
    )
}
import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google"
import { GithubProfile } from "next-auth/providers/github"
import { OAuthUserConfig } from "next-auth/providers"
// import jwt from 'jsonwebtoken'

export const authOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        } as OAuthUserConfig<GithubProfile>),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        } as OAuthUserConfig<GoogleProfile>),
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email", name: "email", placeholder: "jsmith@example.com" },
                password: { label: "Password", type: "password", name: "password" }
            },
            // @ts-ignore // This is because credentials is going to come back different a lot
            async authorize(credentials, request) {
                console.log("Credentials Authorize")
                // console.log(credentials)
                // Hit Endpoint here
                if (!credentials || !credentials.email || !credentials.password) return null

                try {
                    let formData = new URLSearchParams();
                    formData.append("username", credentials.email)
                    formData.append("password", credentials.password)

                    const response = await fetch("http://localhost:8001/auth", {
                        method: "POST",
                        body: formData,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    })

                    if (!response.ok) {
                        console.log("Failed to login: " + response.status)
                        console.log(response)
                        return null
                    }

                    const data = await response.json()
                    const token = data.access_token
                    if (!token) {
                        console.log("Failed to login: no token")
                        return null
                    }

                    let user;

                    const userResponse = await fetch("http://localhost:8001/me", {
                        method: "GET",
                        headers: {
                            'content-type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        }
                    }).then(res => res.json()).then(data => {
                        user = data.user
                    })
                    // console.log("ASwSwadasdasdSSDAHSDHASHDASHHH")
                    // console.log(user)

                    if (!user) {
                        console.log("Failed to login: no user")
                        return null
                    }
                    return { user, token }

                } catch (error) {
                    console.log(error)

                }
            }
        }),
        // ...add more providers here
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            // Triggers after sign in
            // Technically during, but after the user submits their credentials
            // This lets us check if the user is allowed to sign in, as well as move extra data to or from the backend
            // For Oauth users this means grabbing backend data or making a new backend account 💭 
            console.log("Sign In Callback")
            console.log(user)
            console.log(account)
            console.log(profile)

            return true
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            console.log("JWT Callback")
            console.log(token)
            console.log(user)
            console.log(account)
            console.log(profile)
            console.log(isNewUser)

            // Use endpoint to check
            if (isNewUser) {
                // Create new user in database
                // This is only for OAuth users
                // New from Oauth endpoint 💭
            }

            let output: any = null;

            if (account && account.type === "oauth") {
                output = {
                    ...token,
                    ...account
                };
            } else if (user) {
                output = user;
            }

            return output
        },
        async session({ session, token }) {
            console.log("Session Callback")
            console.log(session)
            console.log(token)
            const { user, ...access_token } = token;
            //@ts-ignore
            session.user = user
            //@ts-ignore //Executive decision to ignore type shenanigans until accounst are 100% figured out (might not happen and that's ok) 🐢
            session.token = access_token.token
            console.log("----------")
            console.log(session)
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        maxAge: 60 * 60,
    },
    pages: { //These are for cutom pages
        signIn: '/access',
        // signOut: '/auth/signout',
        error: '/access', // Error code passed in query string as ?error=
        // verifyRequest: '/auth/verify-request', // (used for check email message)
        // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    }
} as NextAuthOptions

export default NextAuth(authOptions)
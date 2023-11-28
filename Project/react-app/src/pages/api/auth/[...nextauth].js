import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
// import jwt from 'jsonwebtoken'

export const authOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email", name: "email", placeholder: "jsmith@example.com" },
                password: { label: "Password", type: "password", name: "password" }
            },
            async authorize(credentials) {
                // console.log("Credentials Authorize")
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
            // console.log("Sign In Callback")
            // console.log(user)
            // console.log(account)
            // console.log(profile)

            return true
        },
        async jwt({ token, user, account, profile, isNewUser, trigger, session }) {
            // console.log("JWT Callback")
            // console.log(token)
            // console.log(user)
            // console.log(account)
            // console.log(profile)
            // console.log(isNewUser)
            // console.log(trigger)
            // console.log(session)

            if (user) {
                token = user;
            }


            if (trigger === "update" && session?.following_list) {
                console.log("Updating Session")
                token.user.following = session.following_list
            }

            return token
        },
        async session({ session, token }) {
            // console.log("Session Callback")
            const { user, ...access_token } = token;
            session.user = user
            session.token = access_token.token
            // console.log(session)
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        maxAge: 60 * 60,
    },
    pages: { //These are for custom pages
        signIn: '/access',
        // signOut: '/auth/signout',
        // error: '/auth/error', // Error code passed in query string as ?error=
        // verifyRequest: '/auth/verify-request', // (used for check email message)
        // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    }
}

export default NextAuth(authOptions)
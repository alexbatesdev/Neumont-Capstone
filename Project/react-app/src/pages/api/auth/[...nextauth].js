import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

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
                // Hit Endpoint here
                if (!credentials) return null

                // if (userLoggedIn) {
                //     return token
                // }

                return null;
                // return token
            }
        }),
        // ...add more providers here
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            // Triggers after sign in
            // Technically during, but after the user submits their credentials
            // This lets us check if the user is allowed to sign in, as well as move extra data to or from the backend
            // For Oauth users this means grabbing backend data or making a new backend account
            console.log(user)
            console.log(account)
            console.log(profile)

            return true
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            // stuff go here
            console.log(token)
            console.log(user)
            console.log(account)
            console.log(profile)
            console.log(isNewUser)

            return token
        },
        async session(session, token) {
            session.accessToken = token.accessToken;
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    // pages: {
    //     signIn: '/auth/signin',
    //     signOut: '/auth/signout',
    //     error: '/auth/error', // Error code passed in query string as ?error=
    //     verifyRequest: '/auth/verify-request', // (used for check email message)
    //     newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    // }
}

console.log(process.env.GITHUB_ID)
console.log(process.env.GITHUB_SECRET)

export default NextAuth(authOptions)
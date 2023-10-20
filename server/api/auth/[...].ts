import { NuxtAuthHandler } from '#auth';
import CredentialsProvider from 'next-auth/providers/credentials'


export default NuxtAuthHandler({
  pages: {
    signIn: '/login',
  },
  providers: [
    // @ts-ignore Import is exported on .default during SSR, so we need to call it this way. May be fixed via Vite at some point
    CredentialsProvider.default({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
    
      authorize: async (credentials: any) => {


        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // NOTE: THE BELOW LOGIC IS NOT SAFE OR PROPER FOR AUTHENTICATION!

        
        let user: {id: Number, name: String, username: String, accessToken: String} | null = null
        
        try {
          user = await $fetch("http://localhost:8080/api/auth/authenticate", {
            method: "POST",
            body: { 
              username: credentials?.username.trim(),
              password: credentials?.password.trim(),
            },
          })        
        } catch (err) {
          user = null
        }

        if (user) {
          return user
        } else {
          return null
        }
      }
    })
  ],

  callbacks:{
    async jwt({token, user}){
      return {...token, ...user}
    },
    async session({session, token, user}){
      session.user = token
      return session
    }
  }
});

import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { query } from "faunadb";

import { fauna } from "../../../services/fauna";

export default NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            authorization: { params: { scope: "read:user" } },
        }),
    ],
    callbacks: {
        async session({ session }) {
            try {
                const email = session.user.email;
                const userActiveSubscription = await fauna.query(
                    query.Get(
                        query.Intersection([
                            query.Match(
                                query.Index("subscription_by_user_ref"),
                                query.Select(
                                    "ref",
                                    query.Get(
                                        query.Match(
                                            query.Index("user_by_email"),
                                            query.Casefold(email)
                                        )
                                    )
                                )
                            ),
                            query.Match(
                                query.Index("subscription_by_status"),
                                "active"
                            ),
                        ])
                    )
                );

                return {
                    ...session,
                    activeSubscription: userActiveSubscription,
                };
            } catch (error) {
                return {
                    ...session,
                    activeSubscription: null,
                };
            }
        },
        // @ts-ignore
        async signIn(user, account, profile) {
            const email = user.user.email;
            try {
                const match = query.Match(
                    query.Index("user_by_email"),
                    query.Casefold(email)
                );
                await fauna.query(
                    query.If(
                        query.Not(query.Exists(match)),
                        query.Create(query.Collection("users"), {
                            data: { email },
                        }),
                        query.Get(match)
                    )
                );

                return true;
            } catch {
                return false;
            }
        },
    },
});

import { query } from "faunadb";

import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

async function fetchUserCollectionRef(customerId: string) {
    const userCollectionRef = await fauna.query(
        query.Select(
            "ref",
            query.Get(
                query.Match(
                    query.Index("user_by_stripe_customer_id"),
                    customerId
                )
            )
        )
    );

    return userCollectionRef;
}

async function fetchSubscriptionData(
    subscriptionId: string,
    userCollectionRef: object
) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const subscriptionData = {
        id: subscription.id,
        userId: userCollectionRef,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id,
    };

    return subscriptionData;
}

export async function updateSubscription(
    subscriptionId: string,
    customerId: string
) {
    const userCollectionRef = await fetchUserCollectionRef(customerId);
    const subscriptionData = await fetchSubscriptionData(
        subscriptionId,
        userCollectionRef
    );
    await fauna.query(
        query.Replace(
            query.Select(
                "ref",
                query.Get(
                    query.Match(
                        query.Index("subscription_by_id"),
                        subscriptionId
                    )
                )
            ),
            { data: subscriptionData }
        )
    );
}

export async function saveSubscription(
    subscriptionId: string,
    customerId: string
) {
    const userCollectionRef = await fetchUserCollectionRef(customerId);
    const subscriptionData = await fetchSubscriptionData(
        subscriptionId,
        userCollectionRef
    );
    await fauna.query(
        query.Create(query.Collection("subscriptions"), {
            data: subscriptionData,
        })
    );
}

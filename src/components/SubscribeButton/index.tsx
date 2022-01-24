import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "../../services/api";
import { stripe } from "../../services/stripe";
import { getStripeJs } from "../../services/stripe-js";

import styles from "./styles.module.scss";

export function SubscribeButton() {
    const { data: session } = useSession();
    const router = useRouter();

    const handleSubscribe = async () => {
        if (!session) {
            signIn("github");
            return;
        }

        if (session.activeSubscription) {
            router.push("/posts");
            return;
        }

        try {
            const response = await api.post("/subscribe");
            const { sessionId } = response.data;
            const stripe = await getStripeJs();
            await stripe.redirectToCheckout({ sessionId });
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <button
            type="button"
            onClick={() => handleSubscribe()}
            className={styles.subscribeButton}
        >
            Subscribe now
        </button>
    );
}

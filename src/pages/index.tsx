import Head from "next/head";
import { GetStaticProps } from "next";

import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";

import styles from "../styles/home.module.scss";

interface HomeProps {
    product: {
        priceId: string;
        amount: number;
    };
}

// Client side
// Server side
// Static Site Generation

export default function Home({ product }: HomeProps) {
    return (
        <>
            <Head>
                <title>Home | ig.news</title>
            </Head>
            <main className={styles.contentContainer}>
                <section className={styles.hero}>
                    <span>Hey, welcome!</span>
                    <h1>
                        News about the <span>React</span> world.
                    </h1>
                    <p>
                        Get access to all the publications <br />{" "}
                        <span>for {product.amount}/month</span>
                    </p>
                    <SubscribeButton />
                </section>
                <img src="/images/avatar.svg" alt="Girl coding" />
            </main>
        </>
    );
}

// Next.js will pre-render this page on each request using the data returned by getServerSideProps
// export const getServerSideProps: GetServerSideProps = async () => {
//     const price = await stripe.prices.retrieve(
//         "price_1KC4BLEsxU4kmnwAGaXVngno",
//         {
//             expand: ["product"],
//         }
//     );
//     const product = {
//         priceId: price.id,
//         amount: new Intl.NumberFormat("en-US", {
//             style: "currency",
//             currency: "USD",
//         }).format(price.unit_amount / 100),
//     };

//     return {
//         props: {
//             product,
//         },
//     };
// };

// Next.js will pre-render this page at build time using the props returned by getStaticProps.
export const getStaticProps: GetStaticProps = async () => {
    const price = await stripe.prices.retrieve(
        "price_1KC4BLEsxU4kmnwAGaXVngno",
        {
            expand: ["product"],
        }
    );
    const product = {
        priceId: price.id,
        amount: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price.unit_amount / 100),
    };

    return {
        props: {
            product,
        },
        revalidate: 60 * 60 * 24, // 24 hours
    };
};

import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { RichText } from "prismic-dom";
import { useEffect } from "react";

import { getPrismicClient } from "../../../services/prismic";

import styles from "../post.module.scss";

interface PostPreviewProps {
    postPreview: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    };
}

export default function PostPreview({ postPreview }: PostPreviewProps) {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session?.activeSubscription) {
            router.push(`/posts/${postPreview.slug}`);
        }
    }, [session]);

    return (
        <>
            <Head>
                <title>{postPreview.title} | Ignews</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{postPreview.title}</h1>
                    <time>{postPreview.updatedAt}</time>
                    <div
                        className={`${styles.postContent} ${styles.previewContent}`}
                        dangerouslySetInnerHTML={{
                            __html: postPreview.content,
                        }}
                    />

                    <div className={styles.continueReading}>
                        Wanna continue reading?
                        <Link href="/">
                            <a>Subscribe now</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        // paths: [{ params: { slug: "clean-architecture" } }], // if we want this specific post to be generated during the build
        fallback: "blocking",
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params;
    const prismic = getPrismicClient();
    const response = await prismic.getByUID("post", String(slug), {});
    if (!response) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    const postPreview = {
        slug: slug,
        // @ts-ignore
        title: RichText.asText(response.data.title),
        // @ts-ignore
        content: RichText.asHtml(response.data.content.splice(0, 3)),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString(
            "en-US",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        ),
    };

    return {
        props: {
            postPreview,
        },
        revalidate: 60 * 30, // 30 minutes
    };
};

import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import { getSession } from "next-auth/react";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicClient } from "../../services/prismic";

const post = {
    slug: "my-new-post",
    title: "My new Post",
    content: "<p>Post content</p>",
    updatedAt: "January 24, 2022",
};

jest.mock("next-auth/react");
jest.mock("../../services/prismic");

describe("Post page", () => {
    it("should render correctly", () => {
        render(<Post post={post} />);

        expect(screen.getByText("My new Post")).toBeInTheDocument();
        expect(screen.getByText("Post content")).toBeInTheDocument();
    });

    it("should redirect user if no subscription is found", async () => {
        const getSessionMocked = mocked(getSession);
        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: null,
        } as any);
        const response = await getServerSideProps({
            params: {
                slug: "my-new-post",
            },
        } as any);

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: "/",
                }),
            })
        );
    });

    it("should load initial data correctly", async () => {
        const getSessionMocked = mocked(getSession);
        const getPrismicClientMocked = mocked(getPrismicClient);
        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: "fake-active-subscription",
        } as any);
        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [{ type: "heading", text: "My new Post" }],
                    content: [{ type: "paragraph", text: "Post content" }],
                },
                last_publication_date: "01-24-2022",
            }),
        } as any);
        const response = await getServerSideProps({
            params: { slug: "my-new-post" },
        } as any);

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: "my-new-post",
                        title: "My new Post",
                        content: "<p>Post content</p>",
                        updatedAt: "January 24, 2022",
                    },
                },
            })
        );
    });
});

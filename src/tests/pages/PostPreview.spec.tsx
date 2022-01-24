import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import Post, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicClient } from "../../services/prismic";

const post = {
    slug: "my-new-post",
    title: "My new Post",
    content: "<p>Post content</p>",
    updatedAt: "January 24, 2022",
};

jest.mock("next-auth/react");
jest.mock("next/router");
jest.mock("../../services/prismic");

describe("Post Preview page", () => {
    it("should render correctly", () => {
        const useSessionMocked = mocked(useSession);
        useSessionMocked.mockReturnValueOnce([null, false]);

        render(<Post postPreview={post} />);

        expect(screen.getByText("My new Post")).toBeInTheDocument();
        expect(screen.getByText("Post content")).toBeInTheDocument();
        expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
    });

    it("should redirect to full post page when user is subscribed", async () => {
        const useSessionMocked = mocked(useSession);
        const useRouterMocked = mocked(useRouter);
        const pushMock = jest.fn();

        useSessionMocked.mockReturnValueOnce({
            data: {
                user: {
                    name: "John Doe",
                    email: "john.doe@example.com",
                },
                activeSubscription: "fake-active-subscription",
                expires: "fake-expiration",
            },
            status: "authenticated",
        });
        useRouterMocked.mockReturnValueOnce({
            push: pushMock,
        } as any);

        render(<Post postPreview={post} />);

        expect(pushMock).toHaveBeenCalledWith("/posts/my-new-post");
    });

    it("should load initial data correctly", async () => {
        const getPrismicClientMocked = mocked(getPrismicClient);

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [{ type: "heading", text: "My new Post" }],
                    content: [{ type: "paragraph", text: "Post content" }],
                },
                last_publication_date: "01-24-2022",
            }),
        } as any);

        const response = await getStaticProps({
            params: { slug: "my-new-post" },
        } as any);

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    postPreview: {
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

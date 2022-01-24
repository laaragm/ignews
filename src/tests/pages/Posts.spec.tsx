import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";

import Posts, { getStaticProps } from "../../pages/posts";
import { getPrismicClient } from "../../services/prismic";

const posts = [
    {
        slug: "fake-slug-1",
        title: "fake-title-1",
        excerpt: "fake-excerpt-1",
        updatedAt: "fake-date-updated-1",
    },
    {
        slug: "fake-slug-2",
        title: "fake-title-2",
        excerpt: "fake-excerpt-2",
        updatedAt: "fake-date-updated-2",
    },
    {
        slug: "fake-slug-3",
        title: "fake-title-3",
        excerpt: "fake-excerpt-3",
        updatedAt: "fake-date-updated-3",
    },
];

jest.mock("../../services/prismic");

describe("Posts page", () => {
    it("should render correctly", () => {
        render(<Posts posts={posts} />);

        expect(screen.getByText("fake-title-1")).toBeInTheDocument();
        expect(screen.getByText("fake-title-2")).toBeInTheDocument();
        expect(screen.getByText("fake-title-3")).toBeInTheDocument();
    });

    it("should load initial data correctly", async () => {
        const getPrismicClientMocked = mocked(getPrismicClient);

        getPrismicClientMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [
                    {
                        uid: "my-new-fake-post",
                        data: {
                            title: [{ type: "heading", text: "fake title" }],
                            content: [
                                { type: "paragraph", text: "fake content" },
                            ],
                        },
                        last_publication_date: "01-24-2022",
                    },
                ],
            }),
        } as any);

        const response = await getStaticProps({});

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    posts: [
                        {
                            slug: "my-new-fake-post",
                            title: "fake title",
                            excerpt: "fake content",
                            updatedAt: "January 24, 2022",
                        },
                    ],
                },
            })
        );
    });
});

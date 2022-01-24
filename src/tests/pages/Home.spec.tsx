import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";

import { stripe } from "../../services/stripe";
import Home, { getStaticProps } from "../../pages";

jest.mock("next/router");

jest.mock("next-auth/react", () => {
    return {
        useSession: () => [null, false],
    };
});

jest.mock("../../services/stripe");

describe("Home page", () => {
    it("should render correctly", () => {
        render(<Home product={{ priceId: "fake-price-id", amount: "$10" }} />);

        expect(screen.getByText(/\$10/i)).toBeInTheDocument();
    });

    it("should load initial data correctly", async () => {
        const retrieveStripePriceMocked = mocked(stripe.prices.retrieve);

        retrieveStripePriceMocked.mockResolvedValueOnce({
            id: "fake-price-id",
            unit_amount: 1000,
        } as any);

        const response = await getStaticProps({});

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    product: {
                        priceId: "fake-price-id",
                        amount: "$10.00",
                    },
                },
            })
        );
    });
});

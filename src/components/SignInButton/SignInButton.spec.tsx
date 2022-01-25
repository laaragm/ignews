import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import { useSession } from "next-auth/react";

import { SignInButton } from ".";

jest.mock("next-auth/react");

describe("SignInButton component", () => {
    it("should render correctly when the user is not logged in", () => {
        const useSessionMocked = mocked(useSession);
        useSessionMocked.mockReturnValueOnce([null, false]);
        render(<SignInButton />);

        expect(screen.getByText("Sign in with Github")).toBeInTheDocument();
    });

    it("should render correctly when the user is logged in", () => {
        const useSessionMocked = mocked(useSession);
        useSessionMocked.mockReturnValueOnce({
            data: {
                user: {
                    name: "John Doe",
                    email: "john.doe@example.com",
                },
                expires: "fake-expiration",
            },
            status: "authenticated",
        });
        render(<SignInButton />);

        expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
});

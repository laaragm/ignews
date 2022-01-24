import { render, screen, fireEvent } from "@testing-library/react";
import { signIn, useSession } from "next-auth/react";
import { mocked } from "jest-mock";
import { useRouter } from "next/router";
import { SubscribeButton } from ".";

jest.mock("next-auth/react");
jest.mock("next/router");

describe("SubscribeButton component", () => {
    it("should render correctly when the user is not logged in", () => {
        const useSessionMocked = mocked(useSession);
        useSessionMocked.mockReturnValueOnce([null, false]);
        render(<SubscribeButton />);

        expect(screen.getByText("Subscribe now")).toBeInTheDocument();
    });

    it("should redirect user to sign in when not authenticated", () => {
        const signInMocked = mocked(signIn);
        const useSessionMocked = mocked(useSession);
        useSessionMocked.mockReturnValueOnce([null, false]);
        render(<SubscribeButton />);
        const subscribeButton = screen.getByText("Subscribe now");
        fireEvent.click(subscribeButton);

        expect(signInMocked).toHaveBeenCalled();
    });

    it("should redirect user to posts when user already has a subscription", () => {
        const useRouterMocked = mocked(useRouter);
        const useSessionMocked = mocked(useSession);
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
        render(<SubscribeButton />);
        const subscribeButton = screen.getByText("Subscribe now");
        fireEvent.click(subscribeButton);

        expect(pushMock).toHaveBeenCalled();
    });
});

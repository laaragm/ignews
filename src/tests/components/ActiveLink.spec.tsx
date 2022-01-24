import { render } from "@testing-library/react";
import { ActiveLink } from "../../components/ActiveLink";

jest.mock("next/router", () => {
    return {
        useRouter() {
            return {
                asPath: "/",
            };
        },
    };
});

describe("ActiveLink component", () => {
    it("should render correctly", () => {
        const { debug, getByText } = render(
            <ActiveLink href="/" activeClassName="active">
                <a>Home</a>
            </ActiveLink>
        );

        debug();
        expect(getByText("Home")).toBeInTheDocument();
    });

    it("should add the active class if the current link is active", () => {
        const { debug, getByText } = render(
            <ActiveLink href="/" activeClassName="active">
                <a>Home</a>
            </ActiveLink>
        );

        debug();
        expect(getByText("Home")).toHaveClass("active");
    });
});

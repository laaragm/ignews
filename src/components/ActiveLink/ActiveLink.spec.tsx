import { render } from "@testing-library/react";
import { ActiveLink } from ".";

jest.mock("next/router", () => {
    return {
        useRouter() {
            return {
                asPath: "/",
            };
        },
    };
});

test("Active link component renders correctly", () => {
    const { debug, getByText } = render(
        <ActiveLink href="/" activeClassName="active">
            <a>Home</a>
        </ActiveLink>
    );

    debug();
    expect(getByText("Home")).toBeInTheDocument();
});

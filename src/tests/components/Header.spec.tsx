import { render, screen } from "@testing-library/react";

import { Header } from "../../components/Header";

jest.mock("next/router", () => {
    return {
        useRouter() {
            return {
                asPath: "/",
            };
        },
    };
});

jest.mock("next-auth/react", () => {
    return {
        useSession() {
            return [null, false];
        },
    };
});

describe("Header component", () => {
    it("should render correctly", () => {
        render(<Header />);

        screen.logTestingPlaygroundURL();

        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.getByText("Posts")).toBeInTheDocument();
    });
});

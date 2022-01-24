import {
    fireEvent,
    render,
    screen,
    waitFor,
    waitForElementToBeRemoved,
} from "@testing-library/react";

import { Async } from "../../components/Async";

describe("Async component", () => {
    it("should render correctly", async () => {
        render(<Async />);

        expect(screen.getByText("Hello world")).toBeInTheDocument();
        expect(await screen.findByText("Click here")).toBeInTheDocument(); // findByText waits for something to be rendered
        // waitFor is similar to findByText
        await waitFor(() => {
            return expect(screen.getByText("Description")).toBeInTheDocument();
        });
    });

    it("should not contain description text after button is clicked", async () => {
        render(<Async />);

        const button = screen.getByText("Click here");
        fireEvent.click(button);

        await waitForElementToBeRemoved(
            expect(
                screen.queryByText(<div>Description</div>)
            ).not.toBeInTheDocument()
        ).catch((error) => console.log(error));
    });
});

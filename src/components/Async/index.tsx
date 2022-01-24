import { useEffect, useState } from "react";

export function Async() {
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsButtonVisible(false);
        }, 1000);
    }, []);

    const handleToggleDescriptionVisibility = () => {
        setTimeout(() => {
            setIsButtonVisible((prevState) => !prevState);
        }, 1000);
    };

    return (
        <div>
            <div>Hello world</div>
            {isButtonVisible && (
                <button onClick={handleToggleDescriptionVisibility}>
                    Click here
                </button>
            )}
            {isDescriptionVisible && <div>Description</div>}
        </div>
    );
}

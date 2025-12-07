import React from "react";
import classNames from "classnames";
import { MdArrowOutward } from "react-icons/md";

const PrimaryButton = ({
    text,
    showIcon,
    isLoading = false,
    className,
    disabled,
    ...props
}) => {
    const isDisabled = disabled || isLoading;

    return (
        <button
            {...props}
            disabled={isDisabled}
            aria-busy={isLoading || props["aria-busy"]}
            className={classNames(
                className,
                "bg-mic-cta transition-all duration-300 ease-in-out hover:bg-mic-heading-gray box-border cursor-pointer typo-button-semibold h-[52px] whitespace-nowrap py-[12px] px-[24px] rounded-[4px]",
                isDisabled && "cursor-not-allowed opacity-70 hover:bg-mic-cta"
            )}
        >
            <div className="flex uppercase flex-row justify-center items-center gap-[9px]">
                {isLoading && (
                    <span
                        className="inline-block h-4 w-4 border-2 border-current border-b-transparent rounded-full animate-spin"
                        aria-hidden="true"
                    />
                )}
                <p>{text}</p>
                {!isLoading && showIcon && <MdArrowOutward />}
            </div>
        </button>
    );
};

export default PrimaryButton;

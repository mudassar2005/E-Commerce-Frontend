import React from "react";
import classNames from "classnames";
import Link from "next/link";


const ServiceCard = ({ ...props }) => {


    return (
        <div
            style={{
                backgroundImage: `url(${props.image})`
            }}
            className={classNames(props.className,
                `bg-cover bg-center`,
                "w-full lg:h-[532px] h-[485px]"
            )}>
            <div
                className={"w-full group  h-full flex flex-col justify-end items-center gap-[24px]  bg-gradient-to-b from-[#FFFFFF00] to-[#530203D6] "}>
                <p
                    className={classNames(
                        "large-heading-light text-white transition-all duration-500 ease-in-out",
                        "lg:group-hover:mb-[158px] group-hover:mb-[118px]"
                    )}
                >
                    {props.number}
                </p>

                <div className={"flex flex-col justify-end items-center gap-[24px]"}>
                    <Link
                        className={"rounded-full typo-base-regular h-[38px] px-[32px] py-[8px] flex justify-center items-center box-border text-center border-[1px] text-white border-white"}
                        href={props.buttonLink}>
                        {props.buttonText}
                    </Link>
                    <p className={"typo-medium-semibold text-white"}>
                        {props.title}
                    </p>
                    <p
                        className={classNames(
                            "typo-base-regular text-center pb-2 max-w-[90%] text-white overflow-hidden transition-all duration-500 ease-in-out",
                            "opacity-0 max-h-0 translate-y-4 group-hover:opacity-100 group-hover:max-h-[200px] group-hover:translate-y-0"
                        )}
                    >
                        {props.description}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ServiceCard
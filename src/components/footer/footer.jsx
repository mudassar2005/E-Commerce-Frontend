import React from "react";
import classNames from "classnames";
import Image from "next/image";
import { contactInfo, FooterLinks } from "@/components/footer/footer-links";
import Link from "next/link";


const Footer = ({ ...props }) => {


    return (
        <div
            className={classNames(props.className, "py-[45px] flex  flex-col  bg-black-light px-[24px] lg:py-[50px] lg:px-[150px]")}>

            <div
                className={"flex flex-col gap-[12px] lg:border-t-[1px] lg:pt-4 border-t-[#1E2C3D] lg:mx-auto lg:w-[1140px]   lg:flex-row"}>
                <Image src={"/images/logo.png"} alt={"logo"} width={86} height={86}
                    className={"h-[86px] mx-auto -mt-[85px] lg:mt-0 lg:mx-0 w-[86px] lg:h-[145px] lg:mr-[50px] lg:w-[145px]"} />


                <div className={"grid grid-cols-2 lg:grid-cols-3 w-full gap-x-[24px] gap-[12px]"}>
                    {
                        FooterLinks.map((footerLinkGroup, index) => (
                            <div className={"flex flex-col gap-[17px] lg:gap-[19px]"} key={index}>
                                <p className={"font-[600] text-white text-[18px]"}>
                                    {footerLinkGroup.label}
                                </p>
                                <div className={"flex flex-col gap-[17px] lg:gap-[19px]"}>
                                    {
                                        footerLinkGroup.routes.map((route, routeIndex) => (
                                            <Link key={routeIndex}
                                                href={route.href}
                                                className={"typo-button-regular hover:underline text-mic-stroke-gray"}
                                            >
                                                {route.label}
                                            </Link>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }

                    <div
                        className={"flex flex-col col-span-2 mt-[12px] lg:mt-0 lg:col-span-1  items-center lg:items-start gap-[24px] lg:gap-[12px] lg:justify-between "}>
                        {
                            contactInfo.map((info, index) => (
                                <div key={index}
                                    className={"flex flex-col items-center lg:items-start max-w-[311.4px] lg:max-w-[346px] gap-[22px] lg:flex-row"}>
                                    {info.icon}
                                    <div className={"flex flex-col items-center lg:items-start gap-[6px]"}>
                                        <p className={"typo-button-regular text-white uppercase"}>
                                            {info.title}
                                        </p>
                                        <p className={"typo-base-semibold text-center lg:text-start text-white"}>
                                            {info.value}
                                        </p>

                                    </div>
                                </div>
                            ))
                        }
                    </div>

                </div>


            </div>

            <div
                className={"    border-t-[1px] mt-[12px] lg:mt-[50px]  border-t-[#1E2C3D] h-[69px] lg:h-[63px] lg:w-[1140px] lg:mx-auto   flex flex-col"}>

                <p className={"uppercase mt-auto text-center typo-copyrights text-white"}>
                    Copyright 2025 © All Right Reserved | School of army air defence
                </p>
            </div>

        </div>
    )
}

export default Footer
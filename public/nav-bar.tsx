"use client"


import React, {useState, useRef, useEffect} from "react";
import classNames from "classnames";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {MdArrowOutward} from "react-icons/md";
import {ChevronDownIcon} from "lucide-react";

import Image from "next/image";
import Icon from "@/components/icon/icon";


export interface NavbarProps {
    className?: string;
}

const routes = [
    {
        name: "HOME",
        link: "/"
    },
    {
        name: "COMMANDANT",
        routes: [
            {
                name: "Incumbent Commandant",
                link: "/incumbent-commandant"
            },
            {
                name: "Ex Commandant",
                link: "/ex-commandant"
            }
        ]

    },
    {
        name: "SCHOOL LIFE",
        routes: [
            {
                name: "Extra Curricular Activities",
                link: "/extra-curricular-activities"
            },
            {
                name: "Curricular Activities",
                link: "/curricular-activities"
            }, {
                name: "Places to Go",
                link: "/places-to-go"
            }
        ]
    }, {
        name: "LIBRARY",
        link: "/ghazi-library"
    }, {
        name: "GALLERY",
        link: "/moments-of-honour/photos"
    }
]


const Navbar: React.FC<NavbarProps> = ({...props}) => {
    const pathname = usePathname();
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileOpenDropdown, setMobileOpenDropdown] = useState<number | null>(null);
    const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
    const router = useRouter();
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openDropdown !== null) {
                const dropdownElement = dropdownRefs.current[openDropdown];
                if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
                    setOpenDropdown(null);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openDropdown]);

    const toggleDropdown = (index: number) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    const toggleMobileDropdown = (index: number) => {
        setMobileOpenDropdown(mobileOpenDropdown === index ? null : index);
    };

    const isSubRouteActive = (route: typeof routes[0]): boolean => {
        if (!route.routes) return false;
        return route.routes.some(subRoute => pathname === subRoute.link);
    };

    const isRouteActive = (link: string): boolean => {
        return pathname === link;
    };

    return (
        <div
            className={classNames(props.className, "p-[16px]   box-border gap-[26px] lg:gap-[50px] lg:p-[30px] flex flex-col lg:flex-row bg-primary-red-500")}>
            <div
                className={" w-full hidden lg:flex flex-col  lg:flex-row justify-end items-start lg:items-center gap-[32px]"}>
                <Image src={"/images/logo.png"} alt={"logo"} width={145} height={145}
                       className={"h-[145px]  z-20 w-[145px] absolute top-[20px] left-[50px]   "}/>
                <div className={"hidden lg:flex"}>
                    <nav className="flex items-center gap-[32px]">
                        {routes.map((route, index) => (
                            <div key={index} className="relative" ref={(el) => {
                                dropdownRefs.current[index] = el;
                            }}>
                                {route.routes ? (
                                    <>
                                        <button
                                            onClick={() => toggleDropdown(index)}
                                            className={classNames(
                                                "flex items-center gap-1 px-4 py-2 rounded-md transition-colors",
                                                isSubRouteActive(route)
                                                    ? "text-[#FFCC01]"
                                                    : openDropdown === index
                                                        ? "text-[#FFCC01]"
                                                        : "text-white hover:text-[#FFCC01]"
                                            )}
                                        >
                                            <span>{route.name}</span>
                                            <ChevronDownIcon
                                                className={classNames(
                                                    "h-4 w-4 transition-all duration-200",
                                                    openDropdown === index && "rotate-180"
                                                )}
                                            />
                                        </button>
                                        {openDropdown === index && (
                                            <div
                                                className="absolute top-full left-0 mt-2 bg-white rounded-[10px]  min-w-[200px] shadow-lg border border-gray-200 z-50">
                                                {route.routes.map((subRoute, subIndex) => (
                                                    <Link
                                                        key={subIndex}
                                                        href={subRoute.link}
                                                        className={classNames(
                                                            "block whitespace-nowrap border-b-[1px] border-[#ECE8E0E0] last:border-none rounded-md px-4 py-2 text-sm transition-colors",
                                                            isRouteActive(subRoute.link)
                                                                ? "text-[#FFCC01]"
                                                                : "text-black hover:text-[#FFCC01] focus:text-[#FFCC01]"
                                                        )}
                                                        onClick={() => setOpenDropdown(null)}
                                                    >
                                                        {subRoute.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={route.link || "#"}
                                        className={classNames(
                                            "px-4 py-2 rounded-md transition-colors",
                                            isRouteActive(route.link || "#")
                                                ? "text-[#FFCC01]"
                                                : "text-white hover:text-[#FFCC01] focus:text-[#FFCC01]"
                                        )}
                                    >
                                        {route.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>

            </div>

            <div className={"flex lg:hidden flex-row justify-between items-center w-full"}>
                <Image src={"/images/logo.png"} alt={"logo"} width={86} height={86}
                       className={"h-[86px] w-[86px]   "}/>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className={"bg-primary-red-500 justify-center items-center flex rounded-md box-border h-[52px] w-[52px] cursor-pointer"}>
                    <Icon name={"bars.svg"}/>
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden w-full flex flex-col gap-4 pt-4">
                    <nav className="flex flex-col gap-4">
                        {routes.map((route, index) => (
                            <div key={index} className="flex flex-col">
                                {route.routes ? (
                                    <>
                                        <button
                                            onClick={() => toggleMobileDropdown(index)}
                                            className={classNames(
                                                "flex items-center justify-between w-full px-4 py-2 rounded-md transition-colors text-left",
                                                isSubRouteActive(route)
                                                    ? "text-[#FFCC01]"
                                                    : mobileOpenDropdown === index
                                                        ? "text-[#FFCC01]"
                                                        : "text-white hover:text-[#FFCC01]"
                                            )}
                                        >
                                            <span>{route.name}</span>
                                            <ChevronDownIcon
                                                className={classNames(
                                                    "h-4 w-4 transition-all duration-200",
                                                    (mobileOpenDropdown === index || isSubRouteActive(route)) && "rotate-180"
                                                )}
                                            />
                                        </button>
                                        {(mobileOpenDropdown === index || isSubRouteActive(route)) && (
                                            <div className="flex flex-col pl-4 mt-2 gap-2">
                                                {route.routes.map((subRoute, subIndex) => (
                                                    <Link
                                                        key={subIndex}
                                                        href={subRoute.link}
                                                        className={classNames(
                                                            "block px-4 py-2 rounded-md text-sm transition-colors",
                                                            isRouteActive(subRoute.link)
                                                                ? "text-[#FFCC01]"
                                                                : "text-white hover:text-[#FFCC01]"
                                                        )}
                                                        onClick={() => {
                                                            setMobileOpenDropdown(null);
                                                            setMobileMenuOpen(false);
                                                        }}
                                                    >
                                                        {subRoute.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={route.link || "#"}
                                        className={classNames(
                                            "px-4 py-2 rounded-md transition-colors",
                                            isRouteActive(route.link || "#")
                                                ? "text-[#FFCC01]"
                                                : "text-white hover:text-[#FFCC01]"
                                        )}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {route.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            )}

            <button
                onClick={() => router.push("/contact-us")}
                className={"bg-mic-cta hover:bg-mic-heading-gray box-border cursor-pointer typo-button-semibold h-[52px] hover:bg-gr whitespace-nowrap py-[12px] px-[24px] rounded-[4px]"}>
                <div className={"flex uppercase flex-row justify-center items-start gap-[9px] "}>
                    <p>
                        Contact Us
                    </p>
                    <MdArrowOutward/>
                </div>


            </button>
        </div>

    )
}

export default Navbar
import { CiLocationOn } from "react-icons/ci";
import { BsEnvelope } from "react-icons/bs";
import { PiPhoneLight } from "react-icons/pi";


export const FooterLinks = [
    {
        label: "School Life",
        routes: [
            { label: "About Scholl", href: "#" },
            { label: "Curricular Activities", href: "#" },
            { label: "Co Curricular Activities", href: "#" },
        ]
    }, {
        label: "Publications",
        routes: [
            { label: "Citadel", href: "#" },
            { label: "The Review", href: "#" },
            { label: "Century of excellence", href: "#" },
            { label: "Journey Through Ages", href: "#" },
            { label: "Tender Notice", href: "#" },

        ]
    },
]

export const contactInfo = [
    {
        icon: <CiLocationOn className={"text-white text-2xl"} />,
        title: "SCHOOL LOCATION",
        value: "West ridge Army Cantonment, Rawalpindi, Punjab, Pakistan",
    },
    {
        icon: <BsEnvelope className={"text-mic-stroke-gray"} />,
        title: "CONTACT VIA EMAIL",
        value: "info@saad.gov.pk",
    },
    {
        icon: <PiPhoneLight className={"text-white"} />,
        title: "HAVE ANY QUESTION",
        value: "Call: (+92) 123 456 78",
    },
];

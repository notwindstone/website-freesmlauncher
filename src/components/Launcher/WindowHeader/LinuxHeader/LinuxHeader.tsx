import {useContext} from "react";
import {WindowContext} from "@/utils/Contexts/Contexts";
import freesmLogo from "../../../../../public/favicon.webp";
import {APP_NAME} from "@/configs/constants";
import {Icon} from "@iconify/react";
import ConfiguredImage from "@/components/ConfiguredImage/ConfiguredImage";

export default function LinuxHeader() {
    const {
        name,
        maximized,
        onlyCloseButton,
        onClose,
        onMinimize,
        onMaximize,
    } = useContext(WindowContext);

    const LogoWrapperSizeClassName = onlyCloseButton ? "w-[24px] sm:w-8" : "w-[72px] sm:w-24";

    return (
        <div
            className="flex flex-nowrap rounded-t-md justify-between items-center gap-2 w-full h-6 sm:h-8 bg-crust"
        >
            <div className={`select-none pl-1 sm:pl-2 flex flex-nowrap justify-start gap-2 items-center ${LogoWrapperSizeClassName}`}>
                <ConfiguredImage
                    className="transition w-4 h-4 sm:h-5 sm:w-5"
                    src={freesmLogo}
                    alt={`${APP_NAME} logo`}
                />
            </div>
            <div className="select-none text-xs text-nowrap sm:text-sm text-white">
                {name}
            </div>
            <div className="flex h-full gap-0 items-stretch">
                {
                    !onlyCloseButton && (
                        <>
                            <div
                                onClick={onMinimize}
                                className="group flex justify-center items-center transition w-6 sm:w-8"
                            >
                                <div
                                    className="flex justify-center items-center transition rounded-full text-[#999] group-hover:text-crust group-hover:bg-white w-4 h-4 sm:w-5 sm:h-5"
                                >
                                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" icon="mdi:chevron-down"/>
                                </div>
                            </div>
                            <div
                                onClick={onMaximize}
                                className="group flex justify-center items-center transition w-6 sm:w-8"
                            >
                                <div
                                    className={`flex justify-center items-center transition rounded-full text-[#999] group-hover:text-crust group-hover:bg-white w-4 h-4 sm:w-5 sm:h-5 ${maximized ? 'bg-white text-[#11111b]' : ''}`}
                                >
                                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" icon="mdi:chevron-up"/>
                                </div>
                            </div>
                        </>
                    )
                }
                <div
                    onClick={onClose}
                    className="group flex justify-center items-center transition w-6 sm:w-8"
                >
                    <div
                        className="flex justify-center items-center transition rounded-full text-[#999] group-hover:text-crust group-hover:bg-white w-4 h-4 sm:w-5 sm:h-5"
                    >
                        <Icon className="w-3 h-3 sm:w-4 sm:h-4" icon="mdi:close" />
                    </div>
                </div>
            </div>
        </div>
    );
}

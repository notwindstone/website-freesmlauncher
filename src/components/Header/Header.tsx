"use client";

import freesmLogo from '../../../public/freesm-launcher-logo.webp';
import Link from "next/link";
import {Icon} from "@iconify/react";
import {HEADER_ITEMS, HEADER_LINKS} from "@/configs/constants";
import {HeaderItemType} from "@/types/Layout/HeaderItem.type";
import {HeaderExternalLinkType} from "@/types/Layout/HeaderExternalLink.type";
import SwitchLanguage from "@/components/SwitchLanguage/SwitchLanguage";
import {useContext} from "react";
import {DictionariesContext} from "@/utils/Providers/DictionariesProvider";
import ConfiguredImage from "@/components/ConfiguredImage/ConfiguredImage";

export default function Header() {
    const { dictionaries } = useContext(DictionariesContext);

    return (
        <>
            <div className="w-full h-[80px] absolute top-0 bg-[#09090e] hidden sm:block" />
            <header
                className="hidden sm:block z-[2000] sticky top-0 bg-[#09090e] lg:bg-[#09090ebb] lg:backdrop-blur border-b-[1px] border-mantle select-none p-4 w-full">
                <div className="mx-auto max-w-[1280px] flex justify-between items-center h-12 w-full">
                    <Link href={"/"}>
                        <ConfiguredImage height={48} src={freesmLogo} alt="FreesmLauncher logo"/>
                    </Link>
                    <div className="flex gap-4">
                        {
                            HEADER_ITEMS(dictionaries).map((item: HeaderItemType) => {
                                return (
                                    <Link
                                        prefetch
                                        key={item.name}
                                        className="font-semibold text-white py-1 transition border-b-2 border-transparent hover:border-mauve"
                                        href={item.link}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })
                        }
                        <div className="w-[2px] bg-mauve"/>
                        {
                            HEADER_LINKS.map((link: HeaderExternalLinkType) => {
                                return (
                                    <Link
                                        key={link.link}
                                        className="w-8 h-8 transition flex justify-center items-center bg-mantle rounded-full hover:bg-surfaceZero"
                                        target="_blank"
                                        href={link.link}
                                    >
                                        <Icon
                                            className="text-white"
                                            height={link.height}
                                            icon={link.icon}
                                        />
                                    </Link>
                                );
                            })
                        }
                        <SwitchLanguage />
                    </div>
                </div>
            </header>
        </>
    );
}

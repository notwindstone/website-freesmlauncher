"use client";

import { DOWNLOADS_OPTIONS } from "@/configs/constants";
import getPlatformName from "@/utils/getPlatformName";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function Downloads() {
    const translate = useTranslations('Translations');

    const platform = navigator.platform.toLowerCase();
    const displayPlatform = getPlatformName(platform);

    const [selectedPlatform, setSelectedPlatform] = useState(displayPlatform);

    let downloadsNode;

    switch (selectedPlatform.toLowerCase()) {
        case 'linux':
            downloadsNode = (
                <>

                </>
            );
            break;
        case 'macos':
            downloadsNode = (
                <></>
            );
            break;
        case 'windows':
            downloadsNode;
            break;
    }

    return (
        <div className="flex flex-col gap-8 mt-12 max-w-[960px] px-4 mx-auto">
            <p className="text-center font-bold text-balance text-7xl text-white">
                {translate('downloads.title')}
            </p>
            <p className="text-center text-balance text-2xl text-gray-400">
                {translate('downloads.description')}
            </p>
            <div className="flex gap-2 rounded-md border-[1px] border-[#181825] w-full bg-[#11111b] p-2">
                {
                    DOWNLOADS_OPTIONS.map((option) => {
                        if (option === selectedPlatform) {
                            return (
                                <button
                                    onClick={() => setSelectedPlatform(option)}
                                    className="transition px-2 py-1 flex-1 bg-[#1D1A28] flex justify-center text-2xl items-center rounded-md" 
                                    key={option}
                                >
                                    {option}
                                </button>
                            );
                        }
                        
                        return (
                            <button 
                                onClick={() => setSelectedPlatform(option)}
                                className="transition flex justify-center items-center px-2 py-1 text-2xl flex-1" 
                                key={option}
                            >
                                {option}
                            </button>
                        );
                    })
                }
            </div>
            <div className="rounded-md border-[1px] border-[#181825] w-full bg-[#11111b] p-2">
                <div className="flex flex-col gap-4 py-8 items-center">
                    <p className="text-3xl font-semibold text-white">
                        {translate('downloads.packages-for')}{' '}
                        <span className="text-[#cba6f7]">
                            {selectedPlatform}
                        </span>
                    </p>
                    
                </div>
            </div>
        </div>
    );
}
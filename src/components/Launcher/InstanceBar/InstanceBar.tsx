import {useCatPackStore, useInstanceStore, useLauncherBarsStore, useRenamesStore} from "@/utils/Stores/Stores";
import {LauncherBarType} from "@/types/Launcher/LauncherBar.type";
import {
    DELETED,
    LAUNCHER_GROUPS,
    LAUNCHER_INSTANCE_BAR_ITEMS,
    LAUNCHER_INSTANCES,
    UNKNOWN_INSTANCE
} from "@/configs/launcher";
import {LauncherInstanceBarItemType} from "@/types/Launcher/LauncherInstanceBarItem.type";
import {LauncherInstanceType} from "@/types/Launcher/LauncherInstance.type";
import {Icon} from "@iconify/react";
import {useContext, useEffect, useState} from "react";
import InstanceButton from "@/components/Launcher/InstanceBar/InstanceButton/InstanceButton";
import getDisabledProperty from "@/utils/Helpers/getDisabledProperty";
import handleLaunch from '@/utils/Helpers/handleLaunch';
import React from "react";
import {DictionariesContext} from "@/utils/Providers/DictionariesProvider";
import ConfiguredImage from "@/components/ConfiguredImage/ConfiguredImage";

const LAUNCHER_GROUPS_OBJ: { [name: string]: boolean } = {};

LAUNCHER_GROUPS.forEach((value: string) => {
    LAUNCHER_GROUPS_OBJ[value] = false;
});

export default function InstanceBar({
    maximized,
}: {
    maximized?: boolean;
}) {
    const { dictionaries } = useContext(DictionariesContext);

    const translations = dictionaries?.Translations;
    const translationsLauncher = translations?.launcher;
    const translationsLauncherInstance = translations?.launcher?.instance;

    const [filteredInstancesList, setFilteredInstancesList] = useState<LauncherInstanceType[]>(LAUNCHER_INSTANCES);

    const [hidden, setHidden] = useState<{
        [name: string]: boolean,
    }>(LAUNCHER_GROUPS_OBJ);

    const instancesStore = useInstanceStore((state) => state);
    const { currentInstance, updateCurrentInstance } = instancesStore;

    const renamesStore = useRenamesStore((state) => state);
    const { currentRenames, updateCurrentRenames } = renamesStore;
    const renamedInstance = currentRenames[currentInstance.name].name;

    const catPackStore = useCatPackStore((state) => state);
    const { enabled: catPackEnabled } = catPackStore;

    const launcherBarsStore = useLauncherBarsStore((state) => state);
    const instanceBar = launcherBarsStore.entries.find((entry: LauncherBarType) => entry.name === 'instance-toolbar');
    const statusBar = launcherBarsStore.entries.find((entry: LauncherBarType) => entry.name === 'status-bar');
    const lastIndex = launcherBarsStore.entries.length - 1;
    const hasLockBars = launcherBarsStore.entries[lastIndex].opened;

    function toggleGroup(group: string) {
        setHidden((obj) => {
            return {
                ...obj,
                [group]: !obj[group],
            };
        });
    }

    useEffect(() => {
        if (currentInstance.deleted === DELETED.YES) {
            setFilteredInstancesList((list: LauncherInstanceType[]) => list.filter((item: LauncherInstanceType) => item.name !== currentInstance.name));

            updateCurrentInstance({
                ...UNKNOWN_INSTANCE,
                deleted: DELETED.NO,
            })
        }
    }, [currentInstance.deleted, currentInstance.name, updateCurrentInstance]);

    return (
        <div
            className={`w-full min-h-40 items-stretch flex flex-nowrap gap-0 ${maximized ? "h-full" : ""}`}
            style={{
                borderBottomLeftRadius: statusBar?.opened ? "0" : "0.375rem",
                borderBottomRightRadius: statusBar?.opened ? "0" : "0.375rem",
            }}
        >
            {
                instanceBar?.opened && (
                    <div
                        className="p-2.5 flex flex-col gap-2 w-[128px] sm:w-[168px] bg-[#0a0a10]"
                        style={{
                            borderBottomLeftRadius: statusBar?.opened ? "0" : "0.375rem",
                        }}
                    >
                        {
                            !hasLockBars && (
                                <div className="cursor-move rounded-full h-[5px] w-full bg-[#dbcafe]" />
                            )
                        }
                        <div
                            className={`transition select-none flex justify-center items-center rounded-md ${currentInstance.name === UNKNOWN_INSTANCE.name ? "" : "hover:bg-[#1b1825]"}`}
                        >
                            <ConfiguredImage
                                width={80}
                                src={currentInstance.icon}
                                alt="Grass svg icon"
                                style={{
                                    filter: currentInstance?.grayscale
                                        ? 'grayscale(100%) contrast(40%) '
                                        : ''
                                }}
                            />
                        </div>
                        <div
                            onClick={() => {
                                if (currentInstance.name !== UNKNOWN_INSTANCE.name) {
                                    updateCurrentRenames({
                                        ...currentRenames,
                                        [currentInstance.name]: {
                                            name: currentRenames[currentInstance.name].name,
                                            isBeingRenamed: true,
                                        }
                                    })
                                }
                            }}
                            className={`transition select-none flex justify-center items-center rounded-md ${currentInstance.name === UNKNOWN_INSTANCE.name ? "" : "hover:bg-[#1b1825]"}`}
                        >
                            <p className="text-center text-[10px] sm:text-[13px] text-[#CDD6F4]">
                                {renamedInstance ?? currentInstance.name}
                            </p>
                        </div>
                        {
                            LAUNCHER_INSTANCE_BAR_ITEMS.map((item: LauncherInstanceBarItemType) => {
                                const { disabled, action } = getDisabledProperty({
                                    item,
                                    currentInstance,
                                    updateCurrentInstance,
                                    handleLaunch,
                                    currentRenames,
                                    updateCurrentRenames,
                                });

                                if (disabled) {
                                    return (
                                        <button
                                            key={item.name}
                                            className="cursor-default select-none px-1 py-0.5 flex gap-1 items-start sm:items-center text-[#9298b6]"
                                        >
                                            <div className="min-w-[14px]">
                                                {item.icon}
                                            </div>
                                            <p className="text-[10px] sm:text-[13px]">
                                                {translationsLauncherInstance?.[item.name]}
                                            </p>
                                        </button>
                                    );
                                }

                                return (
                                    <button
                                        onClick={action}
                                        key={item.name}
                                        className="transition select-none px-1 py-0.5 flex gap-1 items-start sm:items-center rounded-md hover:bg-[#1b1825] text-[#CDD6F4]"
                                    >

                                        <div className="min-w-[14px]">
                                            {item.icon}
                                        </div>
                                        <p className="text-[10px] sm:text-[13px]">
                                            {translationsLauncherInstance?.[item.name]}
                                        </p>
                                    </button>
                                );
                            })
                        }
                    </div>
                )
            }
            <div
                className="w-full flex flex-col p-4 gap-2 bg-[#0c0c13]"
                style={{
                    borderBottomLeftRadius: (instanceBar?.opened || statusBar?.opened) ? "0" : "0.375rem",
                    borderBottomRightRadius: statusBar?.opened ? "0" : "0.375rem",
                    backgroundImage: catPackEnabled ? "url(/MiSide-screenshot-for-website-with-opacity.webp)" : "",
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                {
                    LAUNCHER_GROUPS.map((group) => {
                        return (
                            <React.Fragment key={group}>
                                <button
                                    onClick={() => toggleGroup(group)}
                                    className="select-none flex gap-2 items-center text-[#80859A] text-[10px] sm:text-[12px]"
                                >
                                    <div className="min-w-6 min-h-6">
                                        <Icon
                                            height={24}
                                            icon={
                                                hidden[group] ? "fluent:chevron-right-16-filled" : "fluent:chevron-down-16-filled"
                                            }
                                        />
                                    </div>
                                    <div className="flex-shrink-0 font-bold">
                                        {translationsLauncher?.[group]}
                                    </div>
                                    <div className="w-full h-[2px] bg-[#15161e]"/>
                                </button>
                                {
                                    !hidden[group] && (
                                        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                                            {
                                                filteredInstancesList.filter((instance: LauncherInstanceType) => {
                                                    return instance.group === group;
                                                }).map((instance: LauncherInstanceType) => {
                                                    if (currentInstance.deleted === DELETED.YES && instance.name === currentInstance.name) {
                                                        return (
                                                            <React.Fragment key={instance.name} />
                                                        );
                                                    }

                                                    return (
                                                        <InstanceButton
                                                            key={instance.name}
                                                            name={instance.name}
                                                            icon={instance.icon}
                                                            launched={null}
                                                            deleted={instance.deleted}
                                                            version={instance.version}
                                                            group={instance.group}
                                                        />
                                                    );
                                                })
                                            }
                                        </div>
                                    )
                                }
                            </React.Fragment>
                        );
                    })
                }
            </div>
        </div>
    );
}

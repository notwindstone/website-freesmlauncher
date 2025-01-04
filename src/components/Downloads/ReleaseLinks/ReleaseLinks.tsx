import { GithubReleaseType } from "@/types/GithubRelease.type";
import getLatestRelease from "@/utils/getLatestRelease";
import getReleaseName from "@/utils/getReleaseName";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {useTranslations} from "next-intl";
import {PLACEHOLDER_OS} from "@/configs/constants";

export default function ReleaseLinks({ platform }: { platform: string; }) {
    const translate = useTranslations('Translations');
    const info = useTranslations('Info');
    const locale = info('locale');

    const { isPending, error, data }: {
        isPending: boolean;
        error: Error | null;
        data: { data: GithubReleaseType } | undefined;
    } = useQuery({
        queryKey: ['github-releases'],
        queryFn: async () => {
            return await getLatestRelease();
        },
    });

    if (platform === PLACEHOLDER_OS) {
        return (
            <div className="text-[14px] sm:text-[16px] text-center text-gray-400">
                {translate('downloads.getting-platform')}
            </div>
        )
    }

    if (isPending) {
        return (
            <div className="text-[14px] sm:text-[16px] text-center text-gray-400">
            {translate('downloads.loading')}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-[14px] sm:text-[16px] text-center text-gray-400">
                {translate('downloads.error')}{' '}
                {error.message}.{' '}
                {translate('downloads.try-to-refresh')}
            </div>
        );
    }

    // build name is in the next format:
    // Freesm Launcher 9.2-free-2
    const buildName = data?.data?.name;
    const buildNameArr =  buildName?.split(' ');
    const buildVersion = buildNameArr?.pop();
    const assets = data?.data?.assets;
    let currentBuilds;

    switch (platform.toLowerCase()) {
        case 'linux':
            currentBuilds = assets?.filter((asset) => asset.name.toLowerCase().includes('linux'));
            break;
        case 'macos':
            currentBuilds = assets?.filter((asset) => asset.name.toLowerCase().includes('mac'));
            break;
        case 'windows':
        default:
            currentBuilds = assets?.filter((asset) => asset.name.toLowerCase().includes('windows'));
            break;
    }

    if (platform.toLowerCase() !== 'windows') {
        return (
            <div className="flex flex-col items-center justify-center gap-4">
                {
                    currentBuilds?.map((build) => {
                        const formattedName = getReleaseName({
                            name: build.name,
                            locale: locale,
                        });

                        if (formattedName === null) {
                            return;
                        }

                        return (
                            <Link
                                key={build.name}
                                className="text-[14px] sm:text-[16px] text-center w-fit text-balance transition border-b-[1px] border-transparent hover:border-white pb-1"
                                target="_blank"
                                href={build.browser_download_url}
                            >
                                {
                                    (
                                        // sorry, i'm lazy
                                        formattedName?.displayName?.includes('Universal')
                                        || formattedName?.extension.includes('.AppImage')
                                    ) && '⭐'
                                }{' '}
                                {formattedName.displayName}{' - v'}{buildVersion}{' '}
                                <span className="text-gray-400">
                                        {formattedName.extension}
                                    </span>
                            </Link>
                        );
                    })
                }
            </div>
        );
    }

    return (
        <>
            <div className="w-full flex gap-8 flex-wrap items-start">
                <div className="flex flex-col flex-1 items-center justify-center gap-4">
                    <p className="text-xl text-center text-gray-400">
                        Windows 64-bit
                    </p>
                    {
                        currentBuilds?.filter((build) => !build.name.toLowerCase().includes('arm64')).map((build) => {
                            const formattedName = getReleaseName({
                                name: build.name,
                                locale: locale,
                            });

                            if (formattedName === null) {
                                return;
                            }

                            if (formattedName.type?.includes('msvc')) {
                                return (
                                    <Link
                                        key={build.name}
                                        className="text-[14px] sm:text-[16px] flex flex-col w-fit text-center text-balance transition border-b-[1px] border-transparent hover:border-white pb-1"
                                        target="_blank"
                                        href={build.browser_download_url}
                                    >
                                        <p>
                                            {formattedName.displayName}{' - v'}{buildVersion}{' '}
                                            <span className="text-gray-400">
                                                {formattedName.extension}
                                            </span>
                                        </p>
                                        <p className="text-gray-400 text-[12px] sm:text-[14px]">
                                            (requires Visual C++ Redistributable)
                                        </p>
                                    </Link>
                                )
                            }

                            return (
                                <Link
                                    key={build.name}
                                    className="text-[14px] sm:text-[16px] w-fit text-center text-balance transition border-b-[1px] border-transparent hover:border-white pb-1"
                                    target="_blank" 
                                    href={build.browser_download_url}
                                >
                                    {formattedName?.type?.includes('setup') && '⭐'}{' '}
                                    {formattedName.displayName}{' - v'}{buildVersion}{' '}
                                    <span className="text-gray-400">
                                        {formattedName.extension}
                                    </span>
                                </Link>
                            );
                        })
                    }
                </div>
                <div className="flex flex-col flex-1 items-center justify-center gap-4">
                    <p className="text-xl text-center text-gray-400">
                        Windows ARM64
                    </p>
                    {
                        currentBuilds?.filter((build) => build.name.toLowerCase().includes('arm64')).map((build) => {
                            const formattedName = getReleaseName({
                                name: build.name,
                                locale: locale,
                            });

                            if (formattedName === null) {
                                return;
                            }

                            if (formattedName.type?.includes('msvc')) {
                                return (
                                    <Link
                                        key={build.name}
                                        className="text-[14px] sm:text-[16px] flex flex-col w-fit text-center text-balance transition border-b-[1px] border-transparent hover:border-white pb-1"
                                        target="_blank"
                                        href={build.browser_download_url}
                                    >
                                        <p>
                                            {formattedName.displayName}{' - v'}{buildVersion}{' '}
                                            <span className="text-gray-400">
                                                {formattedName.extension}
                                            </span>
                                        </p>
                                        <p className="text-gray-400 text-[12px] sm:text-[14px]">
                                            (requires Visual C++ Redistributable)
                                        </p>
                                    </Link>
                                )
                            }

                            return (
                                <Link
                                    key={build.name}
                                    className="text-[14px] sm:text-[16px] w-fit text-center text-balance transition border-b-[1px] border-transparent hover:border-white pb-1"
                                    target="_blank" 
                                    href={build.browser_download_url}
                                >
                                    {formattedName?.type?.includes('setup') && '⭐'}{' '}
                                    {formattedName.displayName}{' - v'}{buildVersion}{' '}
                                    <span className="text-gray-400">
                                        {formattedName.extension}
                                    </span>
                                </Link>
                            );
                        })
                    }
                </div>
            </div>
        </>
    );
}
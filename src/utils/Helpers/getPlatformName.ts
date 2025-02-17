import {LINUX_NAME, MACOS_NAME, PLACEHOLDER_OS, WINDOWS_NAME} from "@/configs/constants";

export default function getPlatformName(platform: string): 'macOS' | 'Windows' | 'Linux' | 'OS' {
    switch (true) {
        case platform.includes('iphone'):
        case platform.includes('ipad'):
        case platform.includes('ios'):
        case platform.includes('mac'):
            return MACOS_NAME;
        case platform.includes('windows'):
            return WINDOWS_NAME;
        case platform.includes('android'):
        case platform.includes('linux'):
            return LINUX_NAME;
        default:
            return PLACEHOLDER_OS;
    }
}

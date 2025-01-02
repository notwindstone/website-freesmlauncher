import {useInstanceStore} from "@/utils/stores";
import {DELETED} from "@/configs/launcher";
import WindowHeader from "@/components/Launcher/WindowHeader/WindowHeader";
import {useTranslations} from "next-intl";

export default function DeleteInstanceModal() {
    const instancesStore = useInstanceStore((state) => state);
    const { currentInstance, updateCurrentInstance } = instancesStore;
    const translate = useTranslations('Translations');

    function onClose() {
        updateCurrentInstance({
            ...currentInstance,
            deleted: DELETED.NO,
        })
    }

    function onConfirmation() {
        updateCurrentInstance({
            ...currentInstance,
            deleted: DELETED.YES,
        })
    }

    return (
        <div
            className="z-[1500] top-[50%] left-[50%] absolute transition text-white flex flex-col gap-0"
            style={{
                transform: currentInstance.deleted === DELETED.PROCESS ? (
                    `translateX(-50%) translateY(-50%) scale(100%)`
                ) : (
                    `translateX(-50%) translateY(-50%) scale(85%)`
                ),

                opacity: currentInstance.deleted === DELETED.PROCESS ? 1 : 0,
                visibility: currentInstance.deleted === DELETED.PROCESS ? 'visible' : 'hidden',
            }}
        >
            <WindowHeader
                name={translate('launcher.confirm-deletion')}
                onClose={onClose}
            />
            <div className="p-2 bg-[#11111b] rounded-b-md">
                Вы собираетесь удалить {currentInstance.name}
            </div>
            <button
                onClick={onConfirmation}
            >
                Да
            </button>
            <button
                onClick={onClose}
            >
                Нет
            </button>
        </div>
    );
}
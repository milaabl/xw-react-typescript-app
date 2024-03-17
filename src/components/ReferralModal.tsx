import { SyntheticEvent, useEffect, useMemo, useRef, useState } from "react";
import { createTeleporter } from "react-teleporter";
import CloseIcon from "/src/assets/svg/close.svg?react";
import { useCopyToClipboard } from "react-use";
import { useSelector } from "react-redux";
import { RootState } from "../store";

type Props = {
  closeModal: Function;
};

const ReferralModalTeleport = createTeleporter();

export function ReferralModalTarget() {
  return <ReferralModalTeleport.Target />;
}

export function ReferralModal({ closeModal }: Props) {
  const user = useSelector((state: RootState) => state.wallet.user);

  const refferralLink = useMemo(
    () => `https://www.xuirin.com/?ref=${user?.ref_address}`,
    [user]
  );
  const [copyBtnText, setCopyBtnText] = useState("Copy link" as string);
  const [_, copyText] = useCopyToClipboard();

  const copy = (text: string) => {
    copyText(text);
    setCopyBtnText("Copied!");
    setTimeout(() => {
      setCopyBtnText("Copy link");
    }, 4000);
  };

  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const clickOutside = (event: SyntheticEvent<HTMLDivElement>) => {
    const childElement = dialog.current;
    if (
      event.target instanceof HTMLElement &&
      !childElement?.contains(event.target)
    ) {
      closeModal();
      
    }
  };
  return (
    <ReferralModalTeleport.Source>
      <div
        className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-[#131212]/70 px-4 lg:px-0"
        onClick={clickOutside}
      >
        <div
          ref={dialog}
          className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#1A2025]/70 p-6 backdrop-blur-xl lg:p-8"
        >
          <div className="mb-2.5 flex items-center justify-between">
            <h4 className="text-2xl font-medium text-white">Your referral link</h4>
            <CloseIcon
              className="cursor-pointer transition-opacity duration-200 hover:opacity-75"
              onClick={() => closeModal()}
            />
          </div>
          <p className="mb-5 text-white/50">
          Share your link with your friends to receive 5% commission on every sale!
          </p>
          <div className="flex flex-wrap gap-4">
            <input
              className="flex-1 rounded-xl bg-[#232C3A]/50 py-4 px-4 text-white"
              disabled
              type="text"
              value={refferralLink}
            />
            <button
              onClick={() => copy(refferralLink)}
              className="rounded-xl bg-[#2F3B4F] py-4 px-6 transition-opacity duration-200 hover:opacity-75 text-white"
            >
              {copyBtnText}
            </button>
          </div>
        </div>
      </div>
    </ReferralModalTeleport.Source>
  );
}

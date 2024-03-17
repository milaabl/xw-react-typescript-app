import { SyntheticEvent, useEffect, useMemo, useRef } from "react";
import { createTeleporter } from "react-teleporter";
import CloseIcon from "../assets/svg/close.svg?react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import config from "../config";
import { useAccount } from "wagmi";
type Props = {
  closeModal: () => void;
  transactionHash: string;
};

const PurchaseModalTeleport = createTeleporter();

export function PurchaseModalTarget() {
  return <PurchaseModalTeleport.Target />;
}

export function PurchaseModal({ closeModal, transactionHash }: Props) {
  const { chain } = useAccount();
  const balanceLocked = useSelector(
    (state: RootState) =>
      state.wallet.balances[config.saleToken[config.chains[0].id].symbol]
  );
  const dialog = useRef<HTMLDivElement>(null);
  const blockExplorerUrl = useMemo(
    () => chain?.blockExplorers?.default.url || "",
    [chain]
  );
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
    <PurchaseModalTeleport.Source>
      <div
        className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-[#131212]/70 px-4 lg:px-0"
        onClick={clickOutside}
      >
        <div
          ref={dialog}
          className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#1A2025]/70 p-6 backdrop-blur-xl lg:p-8"
        >
          <div className="mb-2.5 flex items-center justify-end">
            <CloseIcon
              className="cursor-pointer transition-opacity duration-200 hover:opacity-75"
              onClick={() => closeModal()}
            />
          </div>
          <div className="mx-auto mt-6 flex max-w-md flex-col items-center">
            <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-green-400">
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="h-16 w-16 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                ></path>
              </svg>
            </div>
            <h4 className="mb-2 text-2xl">Your purchase was successful!</h4>
            <p className="mb-6 text-center text-gray-300">
              {balanceLocked} tokens will be avaliable for you to claim once the
              presale ends.
            </p>
            <a
              href={`${blockExplorerUrl}/tx/${transactionHash}`}
              className="flex items-center gap-1 rounded-lg bg-gradient-to-tr from-[#16A6EE] to-[#F320D8] py-4 px-6 text-sm font-semibold transition-opacity duration-200 hover:opacity-75 lg:text-base"
              target="_blank"
            >
              View Transition
            </a>
          </div>
        </div>
      </div>
    </PurchaseModalTeleport.Source>
  );
}

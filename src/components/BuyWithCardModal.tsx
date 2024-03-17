import { /*MouseEventHandler,*/ SyntheticEvent, useEffect, useRef } from "react";
import CloseIcon from "../assets/svg/ModalClose.svg?react";
import { createTeleporter } from "react-teleporter";

type Props = {
  closeModal: () => void;
};

const BuyWIthCardModalTeleport = createTeleporter();

export function BuyWIthCardModalTarget() {
  return <BuyWIthCardModalTeleport.Target />;
}

export function BuyWIthCardModal({ closeModal }: Props) {
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
    <BuyWIthCardModalTeleport.Source>
      <div
        className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/50"
        onClick={clickOutside}
      >
        <div ref={dialog} className="card w-full max-w-xl">
          <h4 className="mx-3 mt-2 mb-4 flex items-center justify-between text-xl font-bold uppercase text-primary">
            <span>Buy ETH with card</span>
            <CloseIcon
              className="cursor-pointer hover:opacity-80"
              onClick={() => closeModal()}
            />
          </h4>
          <iframe
            title="Transak"
            id="transak"
            allow="accelerometer; autoplay; camera; gyroscope; payment"
            height="750"
            className="block w-full rounded-lg border"
            src="https://global.transak.com/"
          >
            <p>Your browser does not support iframes.</p>
          </iframe>
        </div>
      </div>
    </BuyWIthCardModalTeleport.Source>
  );
}

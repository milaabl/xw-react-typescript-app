import { FC, useEffect } from "react";
import { useAccount, useAccountEffect } from "wagmi";
import { setUser } from "../store/wallet";
import { fetchReferralCode } from "../utils/apis";
import { useDispatch } from "react-redux";

export const EffectsModule: FC = () => {
    const { address, isConnected } = useAccount();
  const dispatch = useDispatch();

  useEffect(() => {
    const searchParams = new URLSearchParams(window?.location.search);
    const referralId = searchParams.get("ref");
    if (referralId?.length === 6) {
      localStorage.setItem("ref", referralId);
    }
  }, []);

  useEffect(() => {
    if (!isConnected) return;

    signIn();
  }, [address, isConnected]);

  const signIn = async () => {
    try {
      const { user } = await fetchReferralCode(address as string);
      const ref_address = await fetchReferralCode(address as string);
      dispatch(setUser({ ...user, ref_address: ref_address }));
    } catch (e) {
      console.log(e);
    }
  };
  useAccountEffect
  useEffect(() => {
    let newEvent: MouseEvent;

    window.addEventListener("mousemove", (event: MouseEvent) => {
      newEvent = new MouseEvent(event.type, event);
    });

    document.addEventListener("mousemove", (event: MouseEvent) => {
      if (event.isTrusted && newEvent) {
        document.getElementById("webgl-fluid")?.dispatchEvent(newEvent);
      }
    });
  }, []);

  return (<></>);
}
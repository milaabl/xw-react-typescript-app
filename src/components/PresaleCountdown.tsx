import Countdown, { zeroPad } from "react-countdown";
import PresaleCountdownItem from "./PresaleCountdownItem";
import { useTranslation } from "react-i18next";

type PresaleCountdownProps = {
  endTime: number;
};

const PresaleCountdown = ({ endTime }: PresaleCountdownProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8">
      <Countdown
        date={endTime * 1000}
        renderer={({ days, hours, minutes, seconds }) => (
          <div className="flex justify-center gap-1 px-6 lg:gap-3">
            <PresaleCountdownItem
              label={t("days")}
              value={(days / 30) * 100}
              time={zeroPad(days)}
            />
            <span className="-mt-0.5 text-xl font-bold lg:text-3xl">:</span>
            <PresaleCountdownItem
              label={t("hours")}
              value={(hours / 60) * 100}
              time={zeroPad(hours)}
            />
            <span className="-mt-0.5 text-xl font-bold lg:text-3xl">:</span>
            <PresaleCountdownItem
              label={t("minutes")}
              value={(minutes / 60) * 100}
              time={zeroPad(minutes)}
            />
            <span className="-mt-0.5 text-xl font-bold lg:text-3xl">:</span>
            <PresaleCountdownItem
              label={t("seconds")}
              value={(seconds / 60) * 100}
              time={zeroPad(seconds)}
            />
          </div>
        )}
      />
    </div>
  );
};

export default PresaleCountdown;

type PresaleCountdownItemProps = {
  label: string;
  value: number;
  time: string;
};

const PresaleCountdownItem = ({ label, time }: PresaleCountdownItemProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="min-w-[3.5rem] rounded-xl px-3 text-center">
        <span className="text-xl font-bold lg:text-3xl">{time}</span>
      </div>
      <span className="text-xs uppercase text-secondary lg:text-sm">
        {label}
      </span>
    </div>
  );
};

export default PresaleCountdownItem;

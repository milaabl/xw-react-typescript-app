import { useTranslation } from "react-i18next";
// import config from "../../config";
// import FadeLeft from "../animations/FadeLeft";
import FadeRight from "../animations/FadeRight";
import BuyForm from "../BuyForm";

const HeaderSection = () => {
  /*const { t } = */useTranslation();
  return (
    <section className="flex flex-1 flex-col justify-center py-6">
      <div className="container flex flex-col items-center">
        <FadeRight className="relative flex w-full justify-center lg:w-1/2">
          <BuyForm />
        </FadeRight>
      </div>
    </section>
  );
};

export default HeaderSection;

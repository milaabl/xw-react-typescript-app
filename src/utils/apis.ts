import axios from "axios";

export const storeTransaction = async (payload: any) => {
  await axios.post(`https://xuirin.com/api/transaction.php`, payload, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};

export const fetchReferralCode = async (address: string) => {
  const response = await axios.get(
    `https://xuirin.com/api/getReferral.php?address=${address}`
    
  );
  
  console.log(response.data);  
  return response.data;
  
};

export const fetchBalance = async (address: string) => {
  const response = await axios.get(
    `https://xuirin.com/api/getBalance.php?address=${address}`
  );

  return response.data?.data;
 
};

export const storeReferralTransaction = async (payload: any) => {
  const referralId = localStorage.getItem("ref");
  if (referralId?.length === 6) {
    await axios.post(
      `https://xuirin.com/api/referralTransaction.php`,
      { ...payload, ref_address: referralId },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    localStorage.removeItem("ref");
  }
};

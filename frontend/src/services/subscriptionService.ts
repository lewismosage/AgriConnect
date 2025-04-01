// services/subscriptionService.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL + '/api/subscriptions';

export const getSubscription = async (token: string) => {
  const response = await axios.get(`${API_URL}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createSubscription = async (token: string, plan: string) => {
  const response = await axios.post(
    `${API_URL}/create/`,
    { plan },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateSubscription = async (
  token: string,
  plan: string,
  paymentMethod: string,
  mpesaNumber?: string
) => {
  const response = await axios.patch(
    `${API_URL}/update/`,
    { plan, payment_method: paymentMethod, mpesa_number: mpesaNumber },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const makePayment = async (
  token: string,
  amount: number,
  paymentMethod: string,
  mpesaNumber?: string,
  cardToken?: string
) => {
  const response = await axios.post(
    `${API_URL}/pay/`,
    {
      amount,
      payment_method: paymentMethod,
      mpesa_number: mpesaNumber,
      card_token: cardToken,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const checkSubscriptionAccess = async (token: string) => {
  const response = await axios.get(`${API_URL}/check-access/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getPaymentHistory = async (token: string) => {
  const response = await axios.get(`${API_URL}/payments/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const cancelSubscription = async (token: string) => {
  const response = await axios.post(
    `${API_URL}/cancel/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getSubscriptionPlans = async (token: string) => {
  const response = await axios.get(`${API_URL}/plans/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
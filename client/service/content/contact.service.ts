import { api, getErrorMessage } from '../../config/axios';
import { CreateContactRequest, ContactResponse } from '../../interface/contact.interface';
import { API_ROUTES } from '../../constants/routes';

export type { CreateContactRequest, ContactResponse } from '../../interface/contact.interface';

export const submitContact = async (data: CreateContactRequest): Promise<ContactResponse> => {
  try {
    const response = await api.post<{ success: boolean; data: ContactResponse }>(
      API_ROUTES.CONTACT_SUBMIT,
      data
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const contactService = {
  submitContact,
};


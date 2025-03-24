export class ReturnRequest {
  fourteenDescount: number;
  thirtyDescount: number;
}

export class ResponseUserCore {
  id: string;
  email: string;
  name: string;
  phone: string;
  cpf: string;
  ValidationDocumentCompany: boolean;
  address: {
    zipcode: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    country?: string;
    complement?: string;
  };
  company: {
    document: string;
    socialName: string;
    fantasyName: string
    phone: string;
    disable: boolean;
    businessEmail: string;
  }
}
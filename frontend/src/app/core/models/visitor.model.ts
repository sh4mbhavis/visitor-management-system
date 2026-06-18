export interface Visitor {
  visitorId: number;
  fullName: string;
  mobile: string;
  email: string;
  gender: string;
  address: string;
  idProofType: string;
  idProofNumber: string;

  createdAt?: string;
  updatedAt?: string;
  photoPath?: string;
  faceEncoding?: string;
  isBlacklisted?: boolean;
}
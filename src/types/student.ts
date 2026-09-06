export interface Student {
  _id: string;
  studentId: string;

  nipunathaNumber: number;

  school: string;
  schoolNumber: number;

  grade: string;
  name: string;
  gender: "MALE" | "FEMALE";

  dateOfBirth: string;

  parentName: string;
  address: string;
  phone: string;

  addedBy: string;

  status:
    | "DRAFT"
    | "SUBMITTED"
    | "APPROVED"
    | "REJECTED";

  createdAt?: string;
  updatedAt?: string;
}
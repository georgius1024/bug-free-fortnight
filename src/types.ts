export interface Fragment {
  id?: string;
  name: string;
  description: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Stats {
  id?: string;
  size: number;
}

export interface Replacement {
  code: string;
  replacement: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface EquipmentCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconUrl: string;
  color: string;
  sortOrder?: number;
  isActive?: boolean;
}

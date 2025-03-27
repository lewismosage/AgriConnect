export interface User {
  id: string;
  email: string;
  role: 'farmer' | 'business' | 'consumer';
  name: string;
  businessName?: string;
  address: string;
  phone: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  farmId: string;
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  quantityAvailable: number;
  isOrganic: boolean;
  harvestDate?: Date;
  expiryDate?: Date;
  image: string;
  carbonFootprint?: number;
}

export interface Farm {
  id: string;
  userId: string;
  name: string;
  description: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  certifications: string[];
  sustainabilityScore: number;
  deliveryRadius: number;
  image: string;
}

export interface Order {
  id: string;
  buyerId: string;
  farmId: string;
  status: 'pending' | 'confirmed' | 'processing' | 'delivering' | 'completed' | 'cancelled' | 'shipped';
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: string;
  deliveryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  pricePerUnit: number;
}

export interface Subscription {
  id: string;
  userId: string;
  farmId: string;
  plan: 'weekly' | 'biweekly' | 'monthly';
  boxType: 'small' | 'medium' | 'large';
  preferences: string[];
  deliveryDay: string;
  nextDeliveryDate: Date;
  status: 'active' | 'paused' | 'cancelled';
  price: number;
}

export interface DeliveryRoute {
  id: string;
  farmId: string;
  date: Date;
  stops: DeliveryStop[];
  totalDistance: number;
  estimatedDuration: number;
  status: 'planned' | 'in-progress' | 'completed';
}

export interface DeliveryStop {
  orderId: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  estimatedArrival: Date;
  status: 'pending' | 'completed';
}

export interface SustainabilityMetrics {
  farmId: string;
  period: string;
  carbonFootprint: number;
  waterUsage: number;
  wasteReduction: number;
  organicPractices: number;
  localDeliveryPercentage: number;
}

export interface DemandForecast {
  productId: string;
  period: string;
  predictedDemand: number;
  confidenceScore: number;
  seasonalFactors: string[];
  marketTrends: string[];
}

export interface Analytics {
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
  };
  topProducts: {
    id: string;
    name: string;
    quantity: number;
    revenue: number;
  }[];
  sustainability: {
    carbonSaved: number;
    localDeliveryPercentage: number;
    organicPercentage: number;
  };
}
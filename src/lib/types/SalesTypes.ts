export interface DecimalValue {
    $numberDecimal: string;
}

export interface Item {
    name: string;
    tags: string[];
    price: DecimalValue;
    quantity: number;
}

export interface Customer {
    gender: string;
    age: number;
    email: string;
    satisfaction: number;
}

export interface SaleData {
    _id: string;
    saleDate: string;
    items: Item[];
    storeLocation: string;
    customer: Customer;
    couponUsed: boolean;
    purchaseMethod: string;
}
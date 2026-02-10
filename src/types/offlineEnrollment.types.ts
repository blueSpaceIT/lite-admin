export type TPayment = {
    amount: number;
    method: 'Bkash' | 'Nagad' | 'Bank' | 'Cash' | 'Other' | 'paystation';
    transactionId?: string;
    paymentDate: string;
    note?: string;
    month?: string;
    invoiceUrl?: string;
};

export type TOfflineEnrollment = {
    _id?: string;
    studentName: string;
    phone: string;
    studentId: string;
    email?: string;
    address?: string;
    class: string;
    batch: string;
    month?: string;
    status: 'Active' | 'Inactive' | 'Completed' | 'Cancelled';
    courseFee: number;
    paidAmount: number;
    dueAmount: number;
    paymentStatus: 'Paid' | 'Partial' | 'Due' | 'Refunded';
    payments: TPayment[];
    enrollmentDate: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export type TCreateOfflineEnrollmentPayload = {
    studentName: string;
    phone: string;
    studentId?: string;
    email?: string;
    address?: string;
    class: string;
    batch?: string;
    courseFee: number;
    payments?: TPayment[];
};

export type TAddPaymentPayload = {
    enrollmentId: string;
    payment: TPayment;
    autoGenerateInvoice?: boolean;
    sendSMS?: boolean;
};

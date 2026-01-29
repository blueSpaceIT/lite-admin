export type TErrorMessage = {
    path: string;
    message: string;
};

export type TErrorData = {
    status: number;
    success: boolean;
    message: string;
    errorMessages: TErrorMessage[];
};

export type TError = {
    status: number;
    data: TErrorData;
};

export type TData<T> = {
    status: number;
    success: boolean;
    message: string;
    data: T;
};

export type TMeta = {
    limit: number;
    page: number;
    totalPage: number;
    totalDoc: number;
};

export type TResponse<T> = {
    data?: TData<T>;
    error?: TError;
};

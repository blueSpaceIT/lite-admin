import type { ReactNode } from "react";
import {
    FormProvider,
    useForm,
    type DefaultValues,
    type FieldValues,
    type Resolver,
    type SubmitHandler,
} from "react-hook-form";

type Props<T extends FieldValues> = {
    onSubmit: SubmitHandler<T>;
    children: ReactNode;
} & TFormConfig<T>;

type TFormConfig<T extends FieldValues> = {
    defaultValues?: DefaultValues<T>;
    resolver?: Resolver<T>;
};

const Form = <T extends FieldValues>({
    onSubmit,
    children,
    defaultValues,
    resolver,
}: Props<T>) => {
    const formConfig: TFormConfig<T> = {};

    if (defaultValues) {
        formConfig["defaultValues"] = defaultValues;
    }

    if (resolver) {
        formConfig["resolver"] = resolver;
    }

    const form = useForm<T>(formConfig);

    const customOnSubmit = (data: T) => {
        onSubmit(data);
        form.reset();
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(customOnSubmit)}>{children}</form>
        </FormProvider>
    );
};

export default Form;

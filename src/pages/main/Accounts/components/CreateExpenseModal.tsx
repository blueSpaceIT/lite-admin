import { useState } from "react";
import type z from "zod";
import { AccountResolvers } from "../../../../resolvers/account.resolvers";
import { accountService } from "../../../../store/services/accountService";
import toast from "react-hot-toast";
import type { TError, TMethod } from "../../../../types";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Form from "../../../../components/common/Form/Form";
import { useAppSelector } from "../../../../store/hook";
import { useCurrentUser } from "../../../../store/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import SelectField from "../../../../components/common/Form/SelectField";
import { PAYMENT_METHODS_ARRAY } from "../../../../constants/paymentMethod.constants";
import NumberField from "../../../../components/common/Form/NumberField";

const expenses = [
    "Office Rent",
    "Teachers' Salaries",
    "Staff Salaries",
    "Electricity Bill and Charges",
    "Marketing – Boosting",
    "Marketing – SMS",
    "Marketing – Posters, Leaflets, Printing, Bannar",
    "Marketing – Advertisement (Miking, Distributors)",
    "Marketing – Posting and Distributing",
    "Photocopying",
    "Teachers' Snacks",
    "Staff Snacks",
    "Entertainment (Guests and Others)",
    "Stationery",
    "Form Commission",
    "Written Exam Paper (Evaluation)",
    "Repairs (All Products)",
    "Utilities (Water, Gas)",
    "Zoom Bill",
    "Fuel / Octane",
    "Teachers' TA/DA",
    "Staff TA/DA / Office Travel",
    "Equipment and Furniture",
    "Sheets / Books",
    "Internet / Cable TV",
    "Newspapers",
    "Postage & Courier",
    "Mobile Bill and Others",
    "Seminar Fees",
    "Honorarium",
    "Cleaning",
    "Overtime",
    "OMR Printing",
    "Sheet Printing",
    "Written Exam Paper Purchase",
    "Seminar / Workshop",
    "Cadre Reception",
    "Director's Salary",
    "Hall Booking",
    "VAT / Tax",
    "Book Printing",
    "Trade License Fee",
    "Google Sheets Purchase Fee",
    "Office Shifting Cost",
    "Research Salary",
    "Sponsorship or Donation",
    "Tips",
    "Printer and Toner Purchase",
    "Training",
    "Signboard / Decoration",
    "Office Decoration",
    "Others",
    "Reward Students",
    "Other Transport",
];

const ReasonSelect = () => {
    const options = expenses.map((item) => ({ value: item, label: item }));

    return (
        <SelectField
            name="reason[0]"
            options={options}
            placeholder="Expense Reason"
            label="Reason"
        />
    );
};

const CreateExpenseModal = () => {
    const user = useAppSelector(useCurrentUser);
    const [isOpen, setIsOpen] = useState(false);

    const paymentMethodOptions = PAYMENT_METHODS_ARRAY.map((method) => ({
        value: method,
        label: method,
    }));

    type TCreateExpenseFromData = z.infer<
        typeof AccountResolvers.createAccountValidationSchema
    >;

    const defaultValues = {
        type: "Expense" as "Expense" | "Earning",
        reason: null,
        method: "Cash" as TMethod,
        amount: 0,
        branch: String(user?.branch?.id),
    };

    const [createAccount] = accountService.useCreateAccountMutation();

    const createExpenseHandler = async (data: TCreateExpenseFromData) => {
        setIsOpen(false);
        const toastId = toast.loading("Wait a while");

        if (!data.reason) {
            toast.error("Reason required", {
                id: toastId,
            });
            return;
        }

        if (!data.branch || data?.branch === "") {
            toast.error("Branch required", {
                id: toastId,
            });
            return;
        }

        const result = await createAccount(data);
        if (result?.error) {
            toast.error((result?.error as TError)?.data?.message, {
                id: toastId,
            });
        }

        if (result?.data) {
            toast.success("Create successful", {
                id: toastId,
            });

            window.location.reload();
        }
    };

    return (
        <div>
            <Button
                onClick={() => setIsOpen(true)}
                className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm font-medium text-white cursor-pointer"
            >
                Create Expense
            </Button>

            <Dialog
                open={isOpen}
                as="div"
                className="relative z-40 focus:outline-none"
                onClose={() => setIsOpen(false)}
            >
                <div className="fixed inset-0 z-50 w-screen bg-black/40 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-white p-6 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                        >
                            <DialogTitle
                                as="h3"
                                className="text-base/7 font-medium text-indigo-600"
                            >
                                Create Expense Modal
                            </DialogTitle>
                            <Form<TCreateExpenseFromData>
                                onSubmit={createExpenseHandler}
                                defaultValues={defaultValues}
                                resolver={zodResolver(
                                    AccountResolvers.createAccountValidationSchema
                                )}
                            >
                                <ReasonSelect />
                                <NumberField name="amount" label="Amount" />
                                <SelectField
                                    name="method"
                                    placeholder="Select Method"
                                    label="Method"
                                    options={paymentMethodOptions}
                                />
                                <div className="flex justify-end items-center gap-2 mt-4">
                                    <Button
                                        className="inline-flex items-center gap-2 rounded-md bg-slate-200 px-3 py-1.5 text-sm/6 font-semibold text-slate-700 shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white cursor-pointer"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="inline-flex items-center gap-2 rounded-md bg-rose-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white cursor-pointer"
                                        type="submit"
                                    >
                                        Create Expense
                                    </Button>
                                </div>
                            </Form>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default CreateExpenseModal;

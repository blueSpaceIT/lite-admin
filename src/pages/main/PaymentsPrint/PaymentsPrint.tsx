import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { TPurchase } from "../../../types";
import { purchaseService } from "../../../store/services/purchaseService";
import formatDateDDMMYYYY from "../../../utils/formatDate";
import { numberToWords } from "../../../utils/formatAmount";

const PaymentsPrint = () => {
    const { purchaseID } = useParams();
    const [purchase, setPurchase] = useState<TPurchase | null>(null);
    const { data, isSuccess } = purchaseService.useGetPurchaseQuery(purchaseID);

    useEffect(() => {
        if (isSuccess && data?.success) {
            setPurchase(data?.data);
        }
    }, [isSuccess, data]);

    const printInvoiceHandler = (id: string) => {
        const element = document.getElementById(id);
        if (!element) return;

        const printContents = element.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    };

    if (purchase) {
        printInvoiceHandler("invoice");
    }
    // setTimeout(() => {
    //     printInvoiceHandler("invoice");
    // }, 2500);

    return (
        <div className="py-6" id={"invoice"}>
            {purchase ? (
                <div className="relative">
                    <img
                        src="/pay-reciept.jpg"
                        alt=""
                        className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-full"
                    />

                    <div className="text-xs relative z-20 flex justify-between gap-2 pt-[160px]">
                        <div className="w-full">
                            <div className="flex justify-between">
                                <h4 className="font-semibold mb-1.5 pl-[115px]">
                                    {purchase.id}
                                </h4>
                                <p className="pr-[125px]">
                                    {formatDateDDMMYYYY(
                                        purchase.createdAt as Date
                                    )}
                                </p>
                            </div>
                            <div className="flex justify-between pt-[16px]">
                                <p className="pl-[160px]">
                                    {purchase.student.name}
                                </p>
                                <p className="pr-[125px]">
                                    {purchase.student.phone}
                                </p>
                            </div>
                            <div className="flex justify-between pt-[20px]">
                                <p className="pl-[160px]">
                                    {purchase.course.name}
                                </p>
                            </div>
                            <div className="flex justify-between pt-[22px]">
                                <p className="pl-[160px]">
                                    {String(
                                        numberToWords(
                                            (purchase?.paymentDetails &&
                                                purchase?.paymentDetails[
                                                    purchase?.paymentDetails
                                                        ?.length - 1
                                                ].amount) ||
                                                0
                                        )
                                    ) + " taka only"}
                                </p>
                            </div>
                            <div className="flex justify-between pt-[22px]">
                                <p className="pl-[80px]">
                                    {purchase.paidAmount} BDT
                                </p>
                                <p className="">
                                    {purchase.totalAmount - purchase.paidAmount}{" "}
                                    BDT
                                </p>
                                <p className="pr-[130px]">
                                    {purchase.totalAmount !==
                                        purchase.paidAmount &&
                                        formatDateDDMMYYYY(
                                            purchase.dueDate as Date
                                        )}
                                </p>
                            </div>
                            <div className="flex justify-between pt-[24px]">
                                <p className="pl-[95px] text-base">
                                    {purchase?.paymentDetails &&
                                        purchase?.paymentDetails[
                                            purchase?.paymentDetails?.length - 1
                                        ].amount}{" "}
                                    BDT
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                "Loading..."
            )}
        </div>
    );
};

export default PaymentsPrint;

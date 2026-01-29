import { useParams } from "react-router-dom";
import localeDate from "../../../utils/localeDate";
import { Tag } from "antd";
import type { TOrder, TOrderProduct } from "../../../types/order.types";
import { useEffect, useState } from "react";
import { orderService } from "../../../store/services/orderService";

const PrintInvoice = () => {
    const { orderID } = useParams();
    const [order, setOrder] = useState<TOrder | null>(null);
    const { data, isSuccess } = orderService.useGetOrderQuery(orderID);

    useEffect(() => {
        if (isSuccess && data?.success) {
            setOrder(data?.data);
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

    if (order) {
        printInvoiceHandler("invoice");
    }
    // setTimeout(() => {
    //     printInvoiceHandler("invoice");
    // }, 2500);

    return (
        <div className="py-6" id={"invoice"}>
            {order ? (
                <div>
                    <div className="flex flex-row justify-between items-start gap-2 mb-6">
                        <div>
                            <h4 className="text-xl font-bold mb-1.5">
                                INVOICE
                            </h4>
                            <p className="italic text-slate-600 text-sm mb-3">
                                {order.id}
                            </p>
                            <p className="text-slate-800 text-sm">
                                {localeDate(order.createdAt as Date)}
                            </p>
                        </div>

                        <div className="text-right">
                            <div className="flex justify-end items-center gap-1 mb-1.5">
                                {order?.payMethod === "Cash On Delivery" ? (
                                    <Tag color="cyan">{order?.payMethod}</Tag>
                                ) : order?.payMethod === "Payment Gateway" ? (
                                    <Tag color="pink">{order?.payMethod}</Tag>
                                ) : (
                                    <Tag color="magenta">
                                        {order?.payMethod}
                                    </Tag>
                                )}

                                {order?.payStatus === "Paid" ? (
                                    <Tag color="green">{order?.payStatus}</Tag>
                                ) : order?.payStatus === "Pending" ? (
                                    <Tag color="gold">{order?.payStatus}</Tag>
                                ) : order?.payStatus === "Refunded" ? (
                                    <Tag color="volcano">
                                        {order?.payStatus}
                                    </Tag>
                                ) : (
                                    <Tag color="magenta">
                                        {order?.payStatus}
                                    </Tag>
                                )}
                            </div>
                            <h4 className="text-xl font-bold mb-1.5">
                                {order.name}
                            </h4>
                            <p className="text-sm mb-2">{order.phone}</p>
                            <p className="text-sm mb-2">{order.address}</p>
                        </div>
                    </div>

                    <table className="w-full align-middle border-neutral-200 mb-2">
                        <thead className="align-bottom">
                            <tr className="font-semibold text-[0.95rem]">
                                {["PD Name", "QTY", "Price", "Total"].length >
                                    0 &&
                                    ["PD Name", "QTY", "Price", "Total"].map(
                                        (item: string, index: number) => (
                                            <th
                                                key={index}
                                                className="text-xs font-semibold py-2 text-center border-b border-slate-300 bg-slate-100"
                                            >
                                                {item}
                                            </th>
                                        )
                                    )}
                            </tr>
                        </thead>

                        <tbody className="text-sm">
                            {order?.products?.map(
                                (item: TOrderProduct, index: number) => (
                                    <tr
                                        key={index}
                                        className="border-b border-dashed last:border-b-0 even:bg-slate-50"
                                    >
                                        <td className="p-3 text-center">
                                            {item.product.name}
                                        </td>
                                        <td className="p-3 text-center">
                                            {item.quantity}
                                        </td>
                                        <td className="p-3 text-center">
                                            {item.price}
                                        </td>
                                        <td className="p-3 text-center">
                                            {item.quantity * item.price}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                    <div className="flex justify-end items-center gap-2 text-sm text-right">
                        <div className="font-medium">
                            <p>Subtotal: </p>
                            <p>Discount: </p>
                            <p>Delivery charge: </p>
                            <p>Total: </p>
                        </div>
                        <div>
                            <p>{order.subtotal} BDT</p>
                            <p>{order.discount} BDT</p>
                            <p>{order.deliveryCharge} BDT</p>
                            <p>{order.totalAmount} BDT</p>
                        </div>
                    </div>
                </div>
            ) : (
                "Loading..."
            )}
        </div>
    );
};

export default PrintInvoice;

import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import type { TOrder, TOrderProduct } from "../../../../../types/order.types";
import { FaEye, FaPrint } from "react-icons/fa6";
import { useState } from "react";
import localeDate from "../../../../../utils/localeDate";
import { Tag } from "antd";
import { Link } from "react-router-dom";

const OrderModal = ({ order }: { order: TOrder }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <Button
                onClick={() => setIsOpen(true)}
                className="text-lime-600 bg-lime-100 hover:bg-lime-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center cursor-pointer"
            >
                <FaEye className="w-4 h-4" />
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
                            className="w-full max-w-2xl rounded-xl bg-white p-6 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                        >
                            <DialogTitle
                                as="h3"
                                className="text-base/7 font-medium text-indigo-600"
                            >
                                {order.id}
                            </DialogTitle>
                            <div>
                                <div className="flex justify-end">
                                    <Link
                                        to={`/print-invoice/${order.id}`}
                                        target="_blank"
                                    >
                                        <Button
                                            type="button"
                                            className="text-purple-600 bg-purple-100 hover:bg-purple-200 focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center cursor-pointer"
                                        >
                                            <FaPrint className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>

                                <div
                                    className="py-6"
                                    id={`invoice-${order.id}`}
                                >
                                    <div className="flex flex-col md:flex-row justify-center md:justify-between items-start gap-2 mb-6">
                                        <div>
                                            <h4 className="text-xl font-bold mb-1.5">
                                                INVOICE
                                            </h4>
                                            <p className="italic text-slate-600 text-sm mb-3">
                                                {order.id}
                                            </p>
                                            <p className="text-slate-800 text-sm">
                                                {localeDate(
                                                    order.createdAt as Date
                                                )}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <div className="flex justify-end items-center gap-1 mb-1.5">
                                                {order?.payMethod ===
                                                "Cash On Delivery" ? (
                                                    <Tag color="cyan">
                                                        {order?.payMethod}
                                                    </Tag>
                                                ) : order?.payMethod ===
                                                  "Payment Gateway" ? (
                                                    <Tag color="pink">
                                                        {order?.payMethod}
                                                    </Tag>
                                                ) : (
                                                    <Tag color="magenta">
                                                        {order?.payMethod}
                                                    </Tag>
                                                )}

                                                {order?.payStatus === "Paid" ? (
                                                    <Tag color="green">
                                                        {order?.payStatus}
                                                    </Tag>
                                                ) : order?.payStatus ===
                                                  "Pending" ? (
                                                    <Tag color="gold">
                                                        {order?.payStatus}
                                                    </Tag>
                                                ) : order?.payStatus ===
                                                  "Refunded" ? (
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
                                            <p className="text-sm mb-2">
                                                {order.phone}
                                            </p>
                                            <p className="text-sm mb-2">
                                                {order.address}
                                            </p>
                                        </div>
                                    </div>

                                    <table className="w-full align-middle border-neutral-200 mb-2">
                                        <thead className="align-bottom">
                                            <tr className="font-semibold text-[0.95rem]">
                                                {[
                                                    "PD Name",
                                                    "QTY",
                                                    "Price",
                                                    "Total",
                                                ].length > 0 &&
                                                    [
                                                        "PD Name",
                                                        "QTY",
                                                        "Price",
                                                        "Total",
                                                    ].map(
                                                        (
                                                            item: string,
                                                            index: number
                                                        ) => (
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
                                            {order.products.map(
                                                (
                                                    item: TOrderProduct,
                                                    index: number
                                                ) => (
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
                                                            {item.quantity *
                                                                item.price}
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
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default OrderModal;

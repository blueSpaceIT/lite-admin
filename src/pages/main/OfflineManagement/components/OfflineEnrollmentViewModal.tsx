import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { FaBookOpen, FaEnvelope, FaEye, FaHistory, FaLayerGroup, FaMapMarkerAlt, FaPhone, FaTimes, FaUser } from "react-icons/fa";
import type { TOfflineEnrollment, TPayment } from "../../../../types";

interface Props {
    enrollment: TOfflineEnrollment;
    classTitle?: string;
    batchTitle?: string;
}

const OfflineEnrollmentViewModal = ({ enrollment, classTitle, batchTitle }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    const statusColors = {
        Active: "bg-green-100 text-green-700",
        Inactive: "bg-slate-100 text-slate-700",
        Completed: "bg-blue-100 text-blue-700",
        Cancelled: "bg-rose-100 text-rose-700",
    };

    return (
        <>
            <Button
                onClick={open}
                className="p-2 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all scale-100 hover:scale-110 active:scale-95"
                title="View Details"
            >
                <FaEye className="w-4 h-4" />
            </Button>

            <Dialog open={isOpen} as="div" className="relative z-50 focus:outline-none" onClose={close}>
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 border border-slate-200"
                        >
                            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                <DialogTitle as="h3" className="text-xl font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                                    <div className="p-2 bg-slate-900 text-white rounded-lg">
                                        <FaUser className="w-4 h-4" />
                                    </div>
                                    Student Details
                                </DialogTitle>
                                <Button onClick={close} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <FaTimes className="w-6 h-6" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column: Basic Info */}
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Personal Information</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div className="p-1.5 bg-slate-50 text-slate-400 rounded-md mt-0.5">
                                                    <FaUser className="w-3.5 h-3.5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Name</p>
                                                    <p className="text-sm font-black text-slate-700">{enrollment.studentName}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="p-1.5 bg-slate-50 text-slate-400 rounded-md mt-0.5">
                                                    <FaPhone className="w-3.5 h-3.5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Phone</p>
                                                    <p className="text-sm font-black text-slate-700">{enrollment.phone}</p>
                                                </div>
                                            </div>
                                            {enrollment.studentId && (
                                                <div className="flex items-start gap-3">
                                                    <div className="p-1.5 bg-slate-50 text-slate-400 rounded-md mt-0.5 underline">
                                                        <span className="text-[10px] font-black">ID</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Student ID</p>
                                                        <p className="text-sm font-black text-slate-700">{enrollment.studentId}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {enrollment.email && (
                                                <div className="flex items-start gap-3">
                                                    <div className="p-1.5 bg-slate-50 text-slate-400 rounded-md mt-0.5">
                                                        <FaEnvelope className="w-3.5 h-3.5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Email</p>
                                                        <p className="text-sm font-black text-slate-700 lowercase">{enrollment.email}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {enrollment.address && (
                                                <div className="flex items-start gap-3">
                                                    <div className="p-1.5 bg-slate-50 text-slate-400 rounded-md mt-0.5">
                                                        <FaMapMarkerAlt className="w-3.5 h-3.5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Address</p>
                                                        <p className="text-sm font-black text-slate-700">{enrollment.address}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Status</h4>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${statusColors[enrollment.status as keyof typeof statusColors] || statusColors.Inactive}`}>
                                            {enrollment.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Right Column: Enrollment Info */}
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Academic Selection</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div className="p-1.5 bg-slate-50 text-slate-400 rounded-md mt-0.5">
                                                    <FaBookOpen className="w-3.5 h-3.5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Class</p>
                                                    <p className="text-sm font-black text-slate-700">{classTitle || "N/A"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="p-1.5 bg-slate-50 text-slate-400 rounded-md mt-0.5">
                                                    <FaLayerGroup className="w-3.5 h-3.5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Batch</p>
                                                    <p className="text-sm font-black text-slate-700">{batchTitle || "N/A"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Financial Overview</h4>
                                        <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold text-slate-400 uppercase">Course Fee</span>
                                                <span className="text-sm font-black text-slate-700">৳{enrollment.courseFee}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold text-green-500 uppercase">Paid Amount</span>
                                                <span className="text-sm font-black text-green-600">৳{enrollment.paidAmount}</span>
                                            </div>
                                            <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                                                <span className="text-xs font-black text-slate-500 uppercase">Due Balance</span>
                                                <span className="text-lg font-black text-rose-600">৳{enrollment.dueAmount}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment History Section */}
                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <FaHistory /> Payment History
                                </h4>
                                <div className="overflow-hidden rounded-xl border border-slate-100">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50">
                                            <tr className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                                                <th className="px-4 py-3">Date</th>
                                                <th className="px-4 py-3">Method</th>
                                                <th className="px-4 py-3">Txn ID</th>
                                                <th className="px-4 py-3 text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {enrollment.payments?.map((payment: TPayment, idx: number) => (
                                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-4 py-3 text-xs font-bold text-slate-600">
                                                        {new Date(payment.paymentDate).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-black uppercase tracking-tighter">
                                                            {payment.method}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">
                                                        {payment.transactionId || "-"}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-black text-slate-700 text-right">
                                                        ৳{payment.amount}
                                                    </td>
                                                </tr>
                                            ))}
                                            {(!enrollment.payments || enrollment.payments.length === 0) && (
                                                <tr>
                                                    <td colSpan={4} className="px-4 py-8 text-center text-xs font-bold text-slate-400 uppercase">
                                                        No payment records found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <Button
                                    onClick={close}
                                    className="px-6 py-2.5 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-slate-800 transition-all shadow-lg uppercase tracking-widest"
                                >
                                    Close Details
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default OfflineEnrollmentViewModal;

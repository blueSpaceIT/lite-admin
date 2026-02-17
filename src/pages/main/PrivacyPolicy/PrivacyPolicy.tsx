import TitleCard from "../../../components/common/TitleCard/TitleCard";

const PrivacyPolicy = () => {
    return (
        <div className="max-w-[1000px] md:w-full md:mx-auto mb-10">
            <TitleCard>
                <h3 className="text-center text-lg lg:text-3xl font-black uppercase tracking-widest text-slate-800">
                    Privacy Policy
                </h3>
            </TitleCard>

            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 space-y-10 text-slate-700 leading-relaxed">
                {/* Header Section */}
                <div>
                    <h4 className="text-xl font-black text-slate-900 mb-4 tracking-tight">Lite Edu Limited</h4>
                    <p className="font-medium text-slate-600">
                        We, Lite Edu Limited, incorporated under the Companies Act of Bangladesh, are committed to safeguarding your privacy and protecting your personal information. To provide our services effectively, we may collect and, where necessary, share certain information. This Privacy Policy explains how we collect, use, and protect your data when you use the Lite Edu Website and Lite Edu Mobile Application (collectively referred to as the “Platform”).
                    </p>
                    <p className="mt-4 font-bold text-slate-800 bg-slate-50 p-4 rounded-2xl border-l-4 border-slate-900 italic">
                        By accessing or using our Platform, you agree to the terms outlined in this Privacy Policy. If you do not agree, please discontinue use of our services. For questions or complaints, contact us at <span className="text-blue-600 underline">support@liteedu.com</span>.
                    </p>
                </div>

                {/* Policy Sections */}
                <div className="grid gap-10">
                    <section>
                        <h5 className="flex items-center gap-3 text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                            <span className="w-8 h-[2px] bg-slate-200"></span> 01. Definitions
                        </h5>
                        <ul className="space-y-3 font-medium">
                            <li className="flex gap-2">
                                <span className="font-black text-slate-900 whitespace-nowrap">“We”, “Our”, “Us”</span> – Refers to Lite Edu Limited.
                            </li>
                            <li className="flex gap-2">
                                <span className="font-black text-slate-900 whitespace-nowrap">“You”, “User”</span> – Refers to individuals or entities using our Platform.
                            </li>
                            <li className="flex gap-2">
                                <span className="font-black text-slate-900 whitespace-nowrap">“Platform”</span> – Refers to the Lite Edu Website and Mobile Application.
                            </li>
                            <li className="flex gap-2">
                                <span className="font-black text-slate-900 whitespace-nowrap">“Personal Information”</span> – Any information that can identify you personally.
                            </li>
                            <li className="flex gap-2">
                                <span className="font-black text-slate-900 whitespace-nowrap">“Third Parties”</span> – Any entity other than Lite Edu Limited and the User.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h5 className="flex items-center gap-3 text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                            <span className="w-8 h-[2px] bg-slate-200"></span> 02. Overview
                        </h5>
                        <p className="font-medium">
                            We respect your privacy and recognize the importance of protecting your personal information. This may include your name, email address, phone number, date of birth, address, educational information, and payment details when required for purchasing courses or services.
                        </p>
                        <p className="mt-4 font-medium italic text-slate-500">
                            This Privacy Policy applies to both registered users and visitors, including data collected from browsing activity and linked social accounts (if you choose to connect them).
                        </p>
                    </section>

                    <section>
                        <h5 className="flex items-center gap-3 text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                            <span className="w-8 h-[2px] bg-slate-200"></span> 03. Information You Provide
                        </h5>
                        <div className="space-y-4">
                            <p className="font-medium">When you register or use our services, you may provide:</p>
                            <ul className="list-disc list-inside space-y-2 font-bold text-slate-800 ml-4">
                                <li>Name, age, email address, phone number, password</li>
                                <li>Educational information (class, institution, subjects, interests)</li>
                                <li>Transaction details (course purchases, offers)</li>
                                <li>Queries, feedback, participation in discussions or assessments</li>
                            </ul>
                            <p className="font-medium text-slate-600">This information is considered Personal Information and is used to deliver services, notifications, and promotional communications.</p>
                        </div>
                    </section>

                    <section>
                        <h5 className="flex items-center gap-3 text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                            <span className="w-8 h-[2px] bg-slate-200"></span> 04. Automatically Collected Information
                        </h5>
                        <div className="space-y-4">
                            <p className="font-medium">We may automatically collect certain information such as:</p>
                            <ul className="list-disc list-inside space-y-2 font-bold text-slate-800 ml-4">
                                <li>Device type and operating system</li>
                                <li>IP address</li>
                                <li>Browser type</li>
                                <li>Usage statistics within the Platform</li>
                            </ul>
                            <p className="p-4 bg-green-50 rounded-2xl border-l-4 border-green-500 text-green-800 font-bold">
                                Payments are processed through secure third-party payment gateways. These providers do not store or share your personal data beyond transaction processing.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h5 className="flex items-center gap-3 text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                            <span className="w-8 h-[2px] bg-slate-200"></span> 05. How We Collect Information
                        </h5>
                        <p className="font-medium">
                            We collect information lawfully and with your knowledge or consent. Personal data is collected only for specified purposes and retained as long as necessary. We ensure the information remains accurate, complete, and up to date.
                        </p>
                    </section>

                    <section>
                        <h5 className="flex items-center gap-3 text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                            <span className="w-8 h-[2px] bg-slate-200"></span> 06. Cookies
                        </h5>
                        <p className="font-medium">
                            Lite Edu uses cookies to enhance your experience and provide customized services. Cookies help us analyze usage patterns and improve functionality. You may disable cookies through your browser settings; however, some features may not function properly without them.
                        </p>
                    </section>

                    <section>
                        <h5 className="flex items-center gap-3 text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                            <span className="w-8 h-[2px] bg-slate-200"></span> 07. External Links
                        </h5>
                        <p className="font-medium">
                            Our Platform may contain links to third-party websites. We are not responsible for their privacy practices. We encourage users to review the privacy policies of external websites before sharing personal information.
                        </p>
                    </section>

                    <section>
                        <h5 className="flex items-center gap-3 text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                            <span className="w-8 h-[2px] bg-slate-200"></span> 08. Use of Your Information
                        </h5>
                        <div className="space-y-4">
                            <p className="font-medium">We use your information to:</p>
                            <ul className="list-disc list-inside space-y-2 font-bold text-slate-800 ml-4">
                                <li>Provide and manage services</li>
                                <li>Communicate updates and promotions</li>
                                <li>Prevent fraud and unauthorized activities</li>
                                <li>Improve security and user experience</li>
                            </ul>
                            <p className="font-medium italic text-slate-500 uppercase text-xs tracking-wider">
                                We may disclose personal information when required by law or to protect our legal rights.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h5 className="flex items-center gap-3 text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                            <span className="w-8 h-[2px] bg-slate-200"></span> 09. Confidentiality
                        </h5>
                        <p className="font-medium">
                            Your personal information is treated as confidential. We do not sell, rent, or trade your data. Emails sent by Lite Edu will relate only to agreed services or relevant updates.
                        </p>
                    </section>

                    <section>
                        <h5 className="flex items-center gap-3 text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                            <span className="w-8 h-[2px] bg-slate-200"></span> 10. Disclosure of Information
                        </h5>
                        <div className="space-y-4">
                            <p className="font-medium">We may share information:</p>
                            <ul className="list-disc list-inside space-y-2 font-bold text-slate-800 ml-4">
                                <li>With service providers assisting in operations</li>
                                <li>With affiliated entities</li>
                                <li>In the event of a merger or acquisition</li>
                                <li>With law enforcement agencies if legally required</li>
                            </ul>
                            <p className="text-sm font-black text-slate-400 uppercase">We follow industry-standard practices to protect your data but cannot guarantee absolute security.</p>
                        </div>
                    </section>

                    <section>
                        <h5 className="flex items-center gap-3 text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                            <span className="w-8 h-[2px] bg-slate-200"></span> 11. Access and Review
                        </h5>
                        <p className="font-medium">
                            You may access and update your personal information through your account. Certain records may be retained for legal or operational purposes even after deletion requests.
                        </p>
                    </section>

                    <section>
                        <h5 className="flex items-center gap-3 text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                            <span className="w-8 h-[2px] bg-slate-200"></span> 12. Security
                        </h5>
                        <p className="font-medium">
                            We implement recognized security measures to protect data from unauthorized access. However, complete security cannot be guaranteed. Users are advised not to share sensitive financial information through unsecured channels.
                        </p>
                    </section>

                    <section>
                        <h5 className="flex items-center gap-3 text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                            <span className="w-8 h-[2px] bg-slate-200"></span> 13. Disclaimer
                        </h5>
                        <p className="font-medium bg-rose-50 p-4 rounded-2xl border-l-4 border-rose-500 text-rose-800 font-black italic">
                            While we strive to protect your information, no online transmission is entirely secure. By using our Platform, you acknowledge and accept this risk.
                        </p>
                    </section>

                    <section>
                        <h5 className="flex items-center gap-3 text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                            <span className="w-8 h-[2px] bg-slate-200"></span> 14. Disputes and Jurisdiction
                        </h5>
                        <p className="font-medium">
                            Any disputes arising under this Privacy Policy shall first be resolved through mediation. If unresolved, arbitration will take place in Dhaka, Bangladesh, and proceedings will be conducted in English. Decisions shall be binding on both parties.
                        </p>
                    </section>

                    <section>
                        <h5 className="flex items-center gap-3 text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                            <span className="w-8 h-[2px] bg-slate-200"></span> 15. Questions and Complaints
                        </h5>
                        <div className="bg-slate-900 border-2 border-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-200">
                            <p className="font-medium mb-2 opacity-80">If you have questions or concerns regarding this Privacy Policy, please contact us at:</p>
                            <p className="font-black text-xl tracking-tight">Email: support@liteedu.com</p>
                        </div>
                    </section>

                    <section>
                        <h5 className="flex items-center gap-3 text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                            <span className="w-8 h-[2px] bg-slate-200"></span> 16. Amendments
                        </h5>
                        <p className="font-medium">
                            Lite Edu reserves the right to update or modify this Privacy Policy at any time. Continued use of the Platform indicates acceptance of the updated terms.
                        </p>
                    </section>
                </div>

                {/* Footer Section */}
                <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">© 2026 Lite Edu Limited. All Rights Reserved.</p>
                    <div className="w-12 h-1 bg-slate-100 rounded-full md:hidden"></div>
                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Legal Documentation v1.0</div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

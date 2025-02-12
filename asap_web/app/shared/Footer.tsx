import React from "react";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import Image from "next/image";

const Footer = () => {
    return (
        <footer className="bg-blue-100 text-gray-700 py-8 px-4">
            <div className="max-w-7xl mx-auto container grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="flex flex-col md:flex-row">
                    <div>
                        <div className="w-[150px] h-[55px] sm:w-[120px] sm:h-[40px] md:w-[150px] md:h-[60px] relative ">
                            <Image
                                src="/logo.png"
                                alt="ASAP Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">Quick Links</h2>
                        <ul className="mt-4 space-y-2">
                            {["About Us", "Careers", "Blogs", "Press Release", "Jobs", "FAQs", "Internship", "Job Fair", "Placement", "Testimonials", "Grievances", "Contact Us", "Privacy Policy", "Terms & Conditions", "Sitemap"].map((link: string, index: number) => (
                                <li key={index}>
                                    <Link href="#" className="hover:text-blue-500">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div>
                    <h2 className="font-bold text-lg">Internship by Stream</h2>
                    <ul className="mt-4 space-y-2">
                        {["Computer Science", "Electronics", "Marketing", "Finance", "Civil", "Chemical", "View all Internship"].map((stream: string, index: number) => (
                            <li key={index}>
                                <Link href="#" className="hover:text-blue-500">{stream}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h2 className="font-bold text-lg">Guaranteed Courses</h2>
                    <ul className="mt-4 space-y-2">
                        {["HR Management", "Digital Marketing", "Electric Vehicle", "UI/UX Design", "Product Management", "Full Stack Development", "Data Science"].map((course: string, index: number) => (
                            <li key={index}>
                                <Link href="#" className="hover:text-blue-500">{course}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h2 className="font-bold text-lg">Are you having any issues?</h2>
                    <p className="mt-4">Call Support: <span className="font-semibold">+91 9495999623</span></p>
                    <p>Email Support: <Link href="mailto:info@asapkerala.gov.in" className="text-blue-500">info@asapkerala.gov.in</Link></p>
                    <h2 className="font-bold text-lg mt-6">Newsletter</h2>
                    <p className="mt-2">Never miss a beat with our newsletter updates!</p>
                    <div className="mt-4 flex">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="p-2 border border-gray-400 rounded-l-md w-full"
                        />
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded-r-md hover:bg-green-600 transition-colors"
                        >
                            Subscribe
                        </button>
                    </div>
                    <div className="mt-6 flex space-x-4">
                        {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube].map((Icon, index: number) => (
                            <Icon
                                key={index}
                                className="text-gray-600 hover:text-blue-500 text-xl cursor-pointer transition-colors"
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="text-center text-gray-600 mt-8 border-t pt-4">
                <p>&copy; {new Date().getFullYear()} ASAP Kerala. All Rights Reserved</p>
                <p>Powered by SRV InfoTech</p>
            </div>
        </footer>
    );
};

export default Footer;

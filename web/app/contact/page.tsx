"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission, e.g., send the form data to your server or API

  };

  return (
    <section className="relative bg-green-50 min-h-screen py-12 flex items-center justify-center">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-green-200 opacity-20 z-0"></div>

      {/* Decorative elements for a more dynamic background */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>

      <div className="container mx-auto px-6 lg:px-12 z-10 relative flex flex-col items-center">
        {/* Left Section (Form) */}
        <div className="w-full bg-white p-6 shadow-md rounded-lg max-w-lg">
          <h1 className="text-3xl lg:text-4xl font-bold text-center text-green-800 mb-6">
            Get in Touch!
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="name" className="mb-2 block">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="email" className="mb-2 block">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="message" className="mb-2 block">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Enter your message"
                required
              />
            </div>

            <Button type="submit">
              Send Message
            </Button>
          </form>
        </div>

        {/* Right Section (Text) */}
        <div className="w-full text-center mt-8 lg:mt-12 lg:px-8">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">
            We&apos;d Love to Hear From You! {/* Replace `'` with &apos; */}
          </h2>
          <p className="text-sm text-gray-700 mb-4">
            Whether you have questions, feedback, or want to collaborate with
            us, don&apos;t hesitate to reach out. Your thoughts matter to us.
          </p>
          <p className="text-sm text-gray-700 mb-6">
            Neuro Kodes is always looking for new ways to improve and connect
            with the agricultural community. Let us know how we can assist you.
          </p>
        </div>
      </div>
    </section>
  );
}

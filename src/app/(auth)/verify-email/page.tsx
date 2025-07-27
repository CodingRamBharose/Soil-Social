"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function VerifyEmailContent() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || null;

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: email || "",
      code: "",
    },
  });

  useEffect(() => {
    if (email) {
      form.setValue("email", email);
    }
  }, [email, form]);

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post("/api/verify-code", data);

      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
        router.push("/sign-in");
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>; 
      toast({
        title: "Verification Failed",
        description: axiosError.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const resendCode = async () => {
    try {
      const response = await axios.post("/api/resend-code", {
        email: form.getValues("email"),
      });

      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        title: "Failed to resend code",
        description: axiosError.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Verify your email</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Enter the verification code sent to your email
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-gray-300">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@example.com"
                      {...field}
                      disabled={!!email}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-gray-300">Verification Code</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      {...field}
                      className="justify-center"
                    >
                      <InputOTPGroup className="gap-2">
                        {[...Array(6)].map((_, i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="h-12 w-12 text-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Verify Email
            </Button>
          </form>
        </Form>
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Didn&apos;t receive a code?{" "}
          <Button
            variant="link"
            className="p-0 text-primary dark:text-primary-400"
            onClick={resendCode}
          >
            Resend code
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
import { NextResponse } from "next/server";
import UserModel from "@/models/User";
import dbConnect from "@/config/dbConnect";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email } = await request.json();

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: "User is already verified" },
        { status: 400 }
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.verifyCode = verifyCode;
    user.verifyCodeExpiry = verifyCodeExpiry;
    await user.save();

    // Send verification email
    const emailResponse = await sendVerificationEmail({
      email: user.email,
      username: user.name,
      otp: verifyCode,
    });

    if (!emailResponse.success) {
      return NextResponse.json(
        { success: false, message: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Verification code resent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resending verification code:", error);
    return NextResponse.json(
      { success: false, message: "Failed to resend verification code" },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import UserModel from '@/models/User';
import dbConnect from '@/config/dbConnect';
import { verifySchema } from '@/schemas/verifySchema';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();

    let parsedBody;
    try {
      parsedBody = verifySchema.parse(body);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: 'Invalid input format' },
        { status: 400 }
      );
    }

    const { email, code } = parsedBody;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: 'User is already verified' },
        { status: 400 }
      );
    }

    if (!user.verifyCode || user.verifyCode !== code) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification code' },
        { status: 400 }
      );
    }

    if (!user.verifyCodeExpiry || user.verifyCodeExpiry < new Date()) {
      return NextResponse.json(
        { success: false, message: 'Verification code has expired' },
        { status: 400 }
      );
    }

    user.isVerified = true;

    try {
      await user.save();
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Database error while updating user' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during verification:', error);
    return NextResponse.json(
      { success: false, message: 'Email verification failed' },
      { status: 500 }
    );
  }
}

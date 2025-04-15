import { NextResponse } from 'next/server';
import UserModel from '@/models/User';
import dbConnect from '@/config/dbConnect';
import bcrypt from 'bcryptjs';
import { signUpSchema } from '@/schemas/signUpSchema';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';
import { ZodError } from 'zod';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const validatedData = signUpSchema.parse({
      ...body,
      email: body.email.toLowerCase().trim(),
    });

    // Check for existing user
    const existingUser = await UserModel.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const user = await UserModel.create({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      verifyCode,
      verifyCodeExpiry,
      isVerified: false,
      location: "",
      cropsGrown: [],
      farmingTechniques: [],
      profilePicture: "",
      bio: "",
      connections: [],
    });

    // Send verification email
    try {
      const emailResponse = await sendVerificationEmail({
        email: validatedData.email,
        username: validatedData.name, 
        otp: verifyCode,               
      });

      if (!emailResponse.success) {
        await UserModel.findByIdAndDelete(user._id);
        return NextResponse.json(
          { success: false, message: emailResponse.error ? String(emailResponse.error) : 'Failed to send verification email' },
          { status: 500 }
        );
      }
      
    } catch (emailError) {
      await UserModel.findByIdAndDelete(user._id);
      console.error('Email sending error:', emailError);
      return NextResponse.json(
        { success: false, message: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'User registered successfully. Please verify your email.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error during sign-up:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed',
          errors: error.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Sign-up failed' 
      },
      { status: 500 }
    );
  }
}
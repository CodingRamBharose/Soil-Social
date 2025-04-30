import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const product = await db.collection("products").findOne({
      _id: new ObjectId(params.id),
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Populate seller information
    const seller = await db.collection("users").findOne(
      { _id: new ObjectId(product.seller) },
      { projection: { name: 1, email: 1 } }
    );

    return NextResponse.json({
      success: true,
      data: { ...product, seller },
    });
  } catch (error: any) {
    console.error("Product fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const product = await db.collection("products").findOne({
      _id: new ObjectId(params.id),
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.seller.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const updates = await req.json();
    const updatedProduct = await db.collection("products").findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    return NextResponse.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error: any) {
    console.error("Product update error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const product = await db.collection("products").findOne({
      _id: new ObjectId(params.id),
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.seller.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    await db.collection("products").deleteOne({
      _id: new ObjectId(params.id),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Product deletion error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
} 
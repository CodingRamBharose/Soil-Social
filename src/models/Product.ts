import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface Product extends Document {
  name: string;
  description: string;
  price: number;
  category: "food" | "equipment";
  images: string[];
  seller: Types.ObjectId;
  location: string;
  condition?: "new" | "like-new" | "good" | "fair" | "poor";
  quantity: number;
  unit?: "kg" | "quintal" | "ton" | "piece" | "dozen" | "bunch" | "L" | "kL" | "bag" | "sack";
  status: "available" | "sold" | "reserved";
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  formattedPrice: string;

  // Methods
  isAvailable(): boolean;
}

const ProductSchema: Schema<Product> = new Schema<Product>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["food", "equipment"],
    },
    images: [
      {
        type: String,
      },
    ],
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    condition: {
      type: String,
      required: function (this: Product) {
        return this.category === "equipment";
      },
      enum: ["new", "like-new", "good", "fair", "poor"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    unit: {
      type: String,
      required: function (this: Product) {
        return this.category === "food";
      },
      enum: ["kg", "quintal", "ton", "piece", "dozen", "bunch", "L", "kL", "bag", "sack"],
    },
    status: {
      type: String,
      enum: ["available", "sold", "reserved"],
      default: "available",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add indexes for performance
ProductSchema.index({ category: 1 });
ProductSchema.index({ seller: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ price: 1 });

// Virtual: formatted price
ProductSchema.virtual("formattedPrice").get(function (this: Product) {
  return `$${this.price.toFixed(2)}`;
});

// Method: check availability
ProductSchema.methods.isAvailable = function (this: Product): boolean {
  return this.status === "available" && this.quantity > 0;
};

// Safe model creation with type assertion
const ProductModel =
  (mongoose.models.Product as Model<Product>) ||
  mongoose.model<Product>("Product", ProductSchema);

export default ProductModel;

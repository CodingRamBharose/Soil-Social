import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
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
      required: function () {
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
      required: function () {
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
  }
);

// Add indexes for better query performance
ProductSchema.index({ category: 1 });
ProductSchema.index({ seller: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ price: 1 });

// Virtual for formatted price
ProductSchema.virtual("formattedPrice").get(function () {
  return `$${this.price.toFixed(2)}`;
});

// Method to check if product is available
ProductSchema.methods.isAvailable = function (): boolean {
  return this.status === "available" && this.quantity > 0;
};

const Product = models.Product || model("Product", ProductSchema);

export default Product; 
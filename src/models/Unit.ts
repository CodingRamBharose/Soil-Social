import { Schema, model, models } from "mongoose";

const UnitSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Unit name is required"],
      unique: true,
      trim: true,
    },
    symbol: {
      type: String,
      required: [true, "Unit symbol is required"],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["food", "equipment"],
    },
  },
  {
    timestamps: true,
  }
);

const Unit = models.Unit || model("Unit", UnitSchema);

export default Unit; 
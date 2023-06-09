import { ObjectId } from "mongoose";
import dbConnect from "@/utils/dbConnect";
import Todo from "@/models/todo";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const body = await req.json();
    await dbConnect();
    await Todo.deleteOne(body);
    return NextResponse.json(
      { message: "Todo deleted successfully!" },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Server error, please try again!" },
      { status: 500 }
    );
  }
}

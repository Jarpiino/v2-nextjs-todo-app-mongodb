import { ObjectId } from "mongoose";
import dbConnect from "@/utils/dbConnect";
import Todo from "@/models/todo";
import { NextResponse } from "next/server";

export async function PUT(req, res) {
  try {
    const body = await req.json();
    console.log(body.todoname);
    const filter = { _id: body._id };
    const update = { completed: body.completed };
    await dbConnect();

    // console.log(body);
    await Todo.findOneAndUpdate(filter, update);

    return NextResponse.json(
      { message: "Message sent successfully!" },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Server error, please try again!" },
      { status: 500 }
    );
  }
}

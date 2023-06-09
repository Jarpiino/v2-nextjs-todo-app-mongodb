import { ObjectId } from "mongoose";
import dbConnect from "@/utils/dbConnect";
import Todo from "@/models/todo";
import { NextResponse } from "next/server";

export async function PUT(req, res) {
  try {
    const body = await req.json();
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
export async function POST(req, res) {
  try {
    const body = await req.json();
    await dbConnect();

    console.log(body);
    await Todo.create(body);

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

// !!!GET V
export const GET = async (request) => {
  try {
    await dbConnect();
    const todo = await Todo.find();

    return new NextResponse(JSON.stringify(todo), { status: 200 });
  } catch (err) {
    return new NextResponse("database error", { status: 500 });
  }
};

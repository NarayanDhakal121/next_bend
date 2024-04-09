import bcryptjs from "bcryptjs";
import User from "../../../../models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/dbConfig/dbConfig";
import jwt from "jsonwebtoken";

connectDb();

export async function POST(request: NextRequest) {
  try {
    // 1) take the data from the user
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log(reqBody);

    // 2) checks wheather the user exists or not.
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    console.log("User exists");

    // 3) check wheather the provided credintials are valid or not
    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        { error: "Check your creanditials" },
        { status: 400 }
      );
    }

    // jwt token

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    // 4) use of jwt for comparision

    const token = jwt.sign(tokenData, "ghfdffcgvhghd", { expiresIn: "1d" });

    const response = NextResponse.json({
      message: "logged in suscess",
      suscess: true,
    });

    // setting the cookie

    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

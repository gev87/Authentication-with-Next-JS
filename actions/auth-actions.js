"use server";

import { hashUserPassword } from "@/lib/hash";
import { createUser } from "@/lib/user";
import { redirect } from "next/navigation";

export async function signup(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const enteredEmail = typeof email === "string" ? email : "";
  const enteredPassword = typeof password === "string" ? password : "";

  let errors = {};
  if (!enteredEmail.includes("@")) {
    errors.email = "Please enter a valid email address.";
  }

  if (enteredPassword.trim().length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  const hashedPassword = hashUserPassword(enteredPassword);
  try {
    createUser(enteredEmail, hashedPassword);
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        errors: {
          email: "It seems like an account for the chosen email already exist.",
        },
      };
    }
    throw error;
  }

  redirect("/training")
}

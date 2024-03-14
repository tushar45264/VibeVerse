import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { authOptions } from "@/app/libs/authOptions";
import { NextApiRequest,NextApiResponse } from "next";

interface RouteHandlerContext {
    params: { nextauth: string[] }
  }

const handler = async (req: NextRequest, context: RouteHandlerContext) => {
    return await NextAuth(req, context, authOptions);
  };

export {handler as GET ,handler as POST};
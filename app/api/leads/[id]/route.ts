import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request)
{const {userId}=await auth()
    
}
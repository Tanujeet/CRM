import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    const { userId } = await auth()
    if (!userId) {
        return new NextResponse("Unauthorised", { status: 403 })
        
    }


    try {
        
    } catch (e) {
        console.error("Failed to update users")
        return new NextResponse("Failed to update Users", {
            status:500
        })
        
    }
    
}
export async function DELETE(req: Request) {
    const { userId } = await auth()
    if (!userId) {
        return new NextResponse("Unauthorised", { status: 403 })
        
    }


    try {
        
    } catch (e) {
        console.error("Failed to update users")
        return new NextResponse("Failed to update Users", {
            status:500
        })
        
    }
    
}
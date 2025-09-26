import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
       const memberships = await prisma.membership.findMany({
         where: { userId },
         select: { teamId: true },
       });
    
    
    const teamIds = memberships.map((m) => m.teamId);
    
       const getCustomers = await prisma.customer.findMany({
         where: {
           teamId: { in: teamIds },
           isDeleted: false,
         },
       });
    return NextResponse.json(getCustomers);
  } catch (err) {
    console.error("Failed to fetch customers", err);
    return new NextResponse("Failed to fetch customers", { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  const { name, email, phone, company, teamId } = await req.json();

  if (!name) {
    return new NextResponse("name is missing", { status: 404 });
  }
  try {
    const memberships = await prisma.membership.findMany({
      where: { userId },
      select: { teamId: true },
    });
    const teamIds = memberships.map((m) => m.teamId);
    if (!teamIds.includes(teamId)) {
      return new NextResponse("Forbidden: Not part of this team", {
        status: 403,
      });
    }
    const createCustomer = await prisma.customer.create({
      data: { name, email, phone, company, teamId },
    });

    return NextResponse.json(createCustomer);
  } catch (err) {
    console.error("Failed to create customer", err);
    return new NextResponse("Failed to create customer", { status: 500 });
  }
}
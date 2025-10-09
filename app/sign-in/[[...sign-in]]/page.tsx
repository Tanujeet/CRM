import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async () => {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }
  return (
    <main className="flex justify-center items-center h-screen">
      <SignIn redirectUrl="/dashboard" />
    </main>
  );
};

export default Page;

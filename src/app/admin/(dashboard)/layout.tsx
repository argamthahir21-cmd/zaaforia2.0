import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebarWrapper from "@/components/admin/AdminSidebarWrapper";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Guard the route on the server side
  if (!session || session.user.role?.toLowerCase() !== "admin") {
    redirect("/auth/login?callbackUrl=/admin");
  }

  return (
    <AdminSidebarWrapper session={session}>
      {children}
    </AdminSidebarWrapper>
  );
}

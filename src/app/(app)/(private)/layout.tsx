import UserInitializer from "@/components/UserInitializer";
import { getUser } from "@/services/api/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  const accessToken = (await cookies()).get("accessToken");
  if (accessToken) {
    await queryClient.prefetchQuery({
      queryKey: ["getUser"],
      queryFn: async () => await getUser(),
    });
  }

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserInitializer />
      </HydrationBoundary>
      {children}
    </>
  );
}

import ClientUserProfile from "./ClientUserProfile";

export default async function Page({ params }: { params: { userId: string } }) {
  const userId = params.userId.toString(); // safe access

  return <ClientUserProfile userId={userId} />;
}

import ClientUserProfile from "./ClientUserProfile";

export default async function Page({ params }: { params: { userId: string } }) {
  return <ClientUserProfile userId={params.userId} />;
}

import ClientUserProfile from "./ClientUserProfile";

export default async function Page({ params }) {
  return <ClientUserProfile userId={params.userId} />;
}

import ClientUserProfile from "./ClientUserProfile";

export default function Page({ params }) {
  return <ClientUserProfile userId={params.userId} />;
}

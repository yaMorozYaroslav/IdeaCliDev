import ClientUserProfile from "./ClientUserProfile";

export default function Page({ params }: { params: any }) {
  return <ClientUserProfile userId={params.userId} />;
}

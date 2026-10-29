import { NewCorrection } from "@/app/app/nova/NewCorrection";
import { Conversion } from "@/components/Consent";
import { getProfile, hasPass, requireUser } from "@/lib/account";
import { TASKS } from "@/lib/tasks";

export const metadata = { title: "Nova correcció" };

export default async function Page({ searchParams }: PageProps<"/app/nova">) {
  const welcome = !!(await searchParams).benvinguda;
  const user = await requireUser();
  const profile = await getProfile(user.id);
  return (
    <>
      {welcome && <Conversion kind="signup" />}
      <NewCorrection tasks={TASKS} canCorrect={hasPass(profile) || profile.credits > 0} />
    </>
  );
}

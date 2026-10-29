import { NewCorrection } from "@/app/app/nova/NewCorrection";
import { getProfile, hasPass, requireUser } from "@/lib/account";
import { TASKS } from "@/lib/tasks";

export const metadata = { title: "Nova correcció" };

export default async function Page() {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  return <NewCorrection tasks={TASKS} canCorrect={hasPass(profile) || profile.credits > 0} />;
}

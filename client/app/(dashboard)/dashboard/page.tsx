import { redirect } from "next/navigation";

const DashboardPage = () => {
  redirect("/dashboard/calendar");
};

export default DashboardPage;

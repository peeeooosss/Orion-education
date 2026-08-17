import { StudentLayout } from "@/components/layout/StudentLayout";

export default function StudentLayoutRoute({ children }: { children: React.ReactNode }) {
  return <StudentLayout>{children}</StudentLayout>;
}

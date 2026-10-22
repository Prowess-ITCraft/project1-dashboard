import { LoginScreen } from "@/features/auth/login-screen";
import { loadStaff } from "@/features/dashboard/mock/load-staff";

export default function HomePage() {
  const staff = loadStaff().map((person) => ({
    name: person.name,
    email: person.email,
    role: person.role,
  }));
  return <LoginScreen staff={staff} />;
}

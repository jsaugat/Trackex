import { useTheme } from "./theme-provider";
import { Toaster as SonnerToaster } from "sonner";

export function GlobalToaster() {
  const { theme } = useTheme() as { theme: string };

  return (
    <SonnerToaster
      theme={theme as "light" | "dark" | "system"}
      richColors
      position="bottom-right"
    />
  );
}

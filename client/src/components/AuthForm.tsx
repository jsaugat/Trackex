import { cn } from "@/lib/utils";

export default function AuthForm({ submitHandler, className, children }) {
  return (
    <form
      className={cn(
        " max-w-md md:border shadow-lg rounded-[30px] px-10 py-14 text-sm flex flex-col justify-start dark:bg-background",
        className,
      )}
      onSubmit={submitHandler}
    >
      {children}
    </form>
  );
}

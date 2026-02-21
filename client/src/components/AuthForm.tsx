import { cn } from "@/lib/utils";

export default function AuthForm({ submitHandler, className, children }) {
  return (
    <form
      className={cn(
        "h-full md:h-[84vh] md:border shadow-lg rounded-[30px] px-14 py-14 text-sm flex flex-col justify-start items-center dark:bg-background",
        className
      )}
      onSubmit={submitHandler}
    >
      {children}
    </form>
  );
}

import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "~/common/tailwind";

type LoadingSkeletonProps = HTMLMotionProps<"div">;

export function LoadingSkeleton({ className, ...props }: LoadingSkeletonProps) {
  return (
    <motion.div
      {...props}
      className={cn(
        "h-10 bg-neutral-200 rounded-md animate-pulse w-full opacity-30",
        className,
      )}
    />
  );
}

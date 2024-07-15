import React from "react";
import { cn } from "@/lib/utils";
import { LoaderCircle, LoaderIcon } from "lucide-react";

const spinnerVariants = "w-16 h-16 rounded-full animate-spin";

const LoadingSpinner = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div className="max-w-6xl mx-auto min-h-96 flex items-center justify-center">
      <LoaderCircle
        ref={ref}
        className={cn(spinnerVariants, className)} // Combine base styles with any additional class names passed via props
        {...rest} // Spread any additional HTML attributes
      />
    </div>
  );
});

LoadingSpinner.displayName = "LoadingSpinner";

export default LoadingSpinner;

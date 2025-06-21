import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { clsx } from "clsx";
import { useFormContext } from "react-hook-form";

export default function BasicFormField({
  name,
  placeholder,
  label,
  required,
  type,
  className,
  disabled = false,
}) {
  const { control } = useFormContext();
  return (
    <FormField
      disabled={disabled}
      key={name}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          {label && (
            <FormLabel>
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              className={clsx(className)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Minus } from "lucide-react";

const ArrayFieldComponent = ({
  fields,
  append,
  remove,
  name,
  placeholder,
  label,
}) => {
  const { control } = useFormContext();
  return (
    <div className="space-y-2">
      <Label className="text-sm mb-2 font-medium">{label}</Label>
      {fields.fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <Controller
            control={control}
            name={`${name}.${index}`}
            render={({ field }) => (
              <Input {...field} placeholder={placeholder} className="flex-1" />
            )}
          />
          {fields.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => remove(index)}
            >
              <Minus className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append("")}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add {label.slice(0, -1)}
      </Button>
    </div>
  );
};
export default ArrayFieldComponent;

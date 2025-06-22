import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import BasicFormField from "@/components/FormElements/BasicFormField";
import TextAreaFormField from "@/components/FormElements/TextAreaFormField";
import { useFormContext } from "react-hook-form";

const ArrayFieldComponent = ({
  fields,
  append,
  remove,
  name,
  placeholder,
  label,
  type = "input",
  rows = 3,
}) => {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <div key={name} className="space-y-2">
      <span className="text-sm font-medium">{label}</span>

      {fields.fields.map((field, index) => {
        const fieldError = errors?.[name]?.[index]?.message;

        return (
          <div key={field.id} className="flex flex-col gap-1">
            <div className="flex gap-2 items-start">
              {type === "input" ? (
                <BasicFormField
                  name={`${name}.${index}`}
                  placeholder={placeholder}
                  type="text"
                />
              ) : (
                <TextAreaFormField
                  name={`${name}.${index}`}
                  placeholder={placeholder}
                  rows={rows}
                />
              )}

              {fields.fields.length > 1 && (
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

            {fieldError && (
              <span className="text-xs text-red-500 ml-1">{fieldError}</span>
            )}
          </div>
        );
      })}

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

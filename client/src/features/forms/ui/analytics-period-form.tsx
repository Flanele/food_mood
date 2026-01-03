"use client";

import {
  analyticsCustomPeriodSchema,
  AnalyticsPeriodInput,
  AnalyticsPeriodOutput,
} from "@/shared/schemas";
import { Button } from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "./input-form";

interface Props {
  className?: string;
  defaultValues: AnalyticsPeriodInput;
  onApply: (values: AnalyticsPeriodOutput) => void;
  onClear: () => void;
}

export const AnalyticsPeriodForm: React.FC<Props> = ({
  className,
  defaultValues,
  onApply,
  onClear,
}) => {
  const form = useForm<AnalyticsPeriodInput>({
    resolver: zodResolver(analyticsCustomPeriodSchema),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  const { handleSubmit, formState, watch, trigger } = form;

  const from = watch("from");

  React.useEffect(() => {
    trigger("to");
  }, [from, trigger]);

  return (
    <div className={className}>
      <FormProvider {...form}>
        <form
          className="flex flex-wrap items-start gap-6 rounded-lg border border-secondary p-4"
          onSubmit={handleSubmit(onApply)}
        >
          <FormInput
            name="from"
            label="From:"
            type="datetime-local"
            className="w-[240px]"
          />

          <FormInput
            name="to"
            label="To:"
            type="datetime-local"
            className="w-[240px]"
          />

          <div className="flex self-start mt-8 gap-3">
            <Button
              type="submit"
              variant="secondary"
              disabled={!formState.isValid}
            >
              Apply
            </Button>

            <Button type="button" variant="outline" onClick={onClear}>
              Clear
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

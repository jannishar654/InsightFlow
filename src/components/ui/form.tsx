"use client"

import * as React from "react"
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldValues,
  type FieldPath,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

// ---------------- FORM ----------------
export const Form = FormProvider

// ---------------- FIELD CONTEXT ----------------
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

// ---------------- FORM FIELD ----------------
export function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

// ---------------- HOOK ----------------
export function useFormField() {
  const fieldContext = React.useContext(FormFieldContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  return {
    name: fieldContext.name,
    ...fieldState,
  }
}

// ---------------- FORM ITEM ----------------
export function FormItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-2", className)} {...props} />
  )
}

// ---------------- FORM LABEL ----------------
export function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  const { error } = useFormField()

  return (
    <Label
      className={cn(error && "text-red-500", className)}
      {...props}
    />
  )
}

// ---------------- FORM CONTROL ----------------
export function FormControl({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />
}

// ---------------- FORM MESSAGE ----------------
export function FormMessage({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const { error } = useFormField()

  if (!error) return null

  return (
    <p className={cn("text-sm text-red-500", className)}>
      {String(error.message)}
    </p>
  )
}
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Textarea } from "@chakra-ui/react";
import { FieldHookConfig, GenericFieldHTMLAttributes, useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps = {
  name: string;
  label: string;
  type?: string;
  placeholder: string;
  required?: boolean;
  textArea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = (props) => {
  const [field, meta, helpers] = useField(props);

  let InputType;
  if (props.textArea) {
    InputType = Textarea;
  } else {
    InputType = Input;
  }
  return (
    <FormControl isInvalid={!!meta.error}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>

      <InputType
        {...field}
        name={props.name}
        id={props.name}
        type={props.type}
        placeholder={props.placeholder}
      />

      {meta.error ? <FormErrorMessage>{meta.error}</FormErrorMessage> : null}
    </FormControl>
  );
};

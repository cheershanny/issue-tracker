"use client";
import { Button, Callout, Text, TextField } from "@radix-ui/themes";
import { useForm, Controller } from "react-hook-form";
import React, { useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createIssueSchema } from "@/app/validationSchema";

type IssueForm = z.infer<typeof createIssueSchema>;

const NewIssuePage = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IssueForm>({ resolver: zodResolver(createIssueSchema) });
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onSubmit = async (data: IssueForm) => {
    await fetch("/api/issues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.ok) router.push("/issues");
      else setErrorMessage("An unexpected error occurred");
    });
  };
  return (
    <div className="max-w-xl">
      {errorMessage && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Icon>
            <AiOutlineInfoCircle />
          </Callout.Icon>
          <Callout.Text>{errorMessage}</Callout.Text>
        </Callout.Root>
      )}
      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <TextField.Root
          placeholder="Title"
          size="3"
          {...register("title")}
        ></TextField.Root>
        {errors.title && (
          <Text color="red" as="p">
            {errors.title.message}
          </Text>
        )}
        <Controller
          name="description"
          control={control}
          render={({ field }) => <SimpleMDE {...field} />}
        />
        {errors.description && (
          <Text color="red" as="p">
            {errors.description.message}
          </Text>
        )}
        <Button>Submit new Issue</Button>
      </form>
    </div>
  );
};

export default NewIssuePage;

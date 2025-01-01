"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, SendHorizonal } from "lucide-react";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal-store";
import { EmojiPicker } from "@/components/emoji-picker";

interface ChatInputProps {
    apiUrl: string;
    query: Record<string, string | number | boolean | null | undefined>;
    name: string;
    type: "conversation" | "channel";
}

const fromSchema = z.object({
    content: z.string().min(1),
});

export const ChatInput = ({
    apiUrl,
    query,
    name,
    type
}: ChatInputProps) => {
    const { onOpen } = useModal();
    const router = useRouter();

    const form = useForm<z.infer<typeof fromSchema>>({
        resolver: zodResolver(fromSchema),
        defaultValues: {
            content: "",
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof fromSchema>) => {
        // console.log(value);
        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query,
            });

            await axios.post(url, values);
            form.reset();
            router.refresh();
            // window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4 pb-6 flex">
                                    <button
                                        type="button"
                                        onClick={() => onOpen("messageFile", { apiUrl, query })}
                                        className="absolute top-7 left-8 h-[24px] w-[24px] 
                                        bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600
                                        dark:hover:bg-zinc-300 rounded-full transition p-1 
                                        flex items-center justify-center"
                                    >
                                        <Plus className=" text-white dark:text-[#313338]" />
                                    </button>
                                    <Input
                                        disabled={isLoading}
                                        className="px-14 py-6 bg-zinc-100 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 
                                        focus-visible:ring-offset-0  text-zinc-600 dark:text-zinc-200 rounded-full "
                                        placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
                                        {...field}
                                    />
                                    <div className="absolute flex items-center justify-center right-20 top-7">
                                        <EmojiPicker
                                            // onChange={(emoji) => {
                                            //     form.setValue("content", form.getValues("content") + emoji);
                                            // }}
                                            onChange={(emoji: string) => field.onChange(`${field.value}${emoji}`)}
                                        />
                                    </div>
                                    <div className="ml-1">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-[48px] h-[48px]
                                                            bg-indigo-500 dark:bg-indigo-500 hover:bg-indigo-600
                                                            dark:hover:bg-indigo-600 rounded-full transition p-1 
                                                            flex items-center justify-center"
                                        >
                                            <SendHorizonal className="text-white w-5 h-5" />
                                        </button>
                                    </div>

                                </div>
                            </FormControl>
                        </FormItem>
                    )}>
                </FormField>
            </form>
        </Form>
    )
}
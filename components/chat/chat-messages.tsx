"use client";

import { Fragment } from "react";
import { Member, Message, Profile } from "@prisma/client";
import { Loader2, ServerCrash } from "lucide-react";

import { ChatWelcome } from "./chat-welcome";

import { useChatQuery } from "@/hooks/use-chat-query";

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

interface ChatMessagesProps {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation";
}

export const ChatMessages = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type
}: ChatMessagesProps) => {
    const queryKey = `messages-${chatId}`;
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue
    })

    if (status === "pending") {
        return (
            <div className="flex-1 flex flex-col items-center justify-center">
                <Loader2 className="w-7 h-7 text-zinc-500 animate-spin my-4"/>
                <p className="text-zinc-500 text-xs dark:text-zinc-400">
                    Loading messages...
                </p>
            </div>
        )
    }

    if (status === "error") {
        return (
            <div className="flex-1 flex flex-col items-center justify-center">
                <ServerCrash className="w-7 h-7 text-zinc-500 my-4"/>
                <p className="text-zinc-500 text-xs dark:text-zinc-400">
                    Something went wrong!
                </p>
            </div>
        )
    }
    return (
        <div className="flex-1 flex flex-col py-4 overflow-y-auto">
            <div className="flex-1" />
            <ChatWelcome
                type={type}
                name={name}
            />
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group, index) => (
                    <Fragment key={index}>
                        {group.items.map((message: MessageWithMemberWithProfile) => (
                            <div key={message.id} className="flex items-center space-x-2">
                                {message.content}
                            </div>
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}
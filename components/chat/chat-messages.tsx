"use client";

import { Fragment, useRef, ElementRef} from "react";
import { format } from "date-fns";
import { Member, Message, Profile } from "@prisma/client";
import { Loader2, ServerCrash } from "lucide-react";

import { useChatQuery } from "@/hooks/use-chat-query";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

import { ChatItem } from "./chat-item";
import { ChatWelcome } from "./chat-welcome";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

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
    const queryKey = `chat:${chatId}`;
    const addKey = `chat:${chatId}:messages`;
    const updateKey = `chat:${chatId}:messages:update`;

    const chatRef = useRef<ElementRef<"div">>(null);
    const bottomRef = useRef<ElementRef<"div">>(null);

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

    useChatSocket({ queryKey, addKey, updateKey })
    useChatScroll({
        chatRef,
        bottomRef,
        loadMore: fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        count: data?.pages?.[0]?.items?.length ?? 0,
    });


    if (status === "pending") {
        return (
            // <div className="flex-1 flex flex-col items-center justify-center">
            //     <Loader2 className="w-7 h-7 text-zinc-500 animate-spin my-4" />
            //     <p className="text-zinc-500 text-xs dark:text-zinc-400">
            //         Loading messages...
            //     </p>
            // </div>
            <div className="flex-1 flex flex-col items-center justify-center">
                <Loader2 className="w-7 h-7 text-zinc-500 animate-spin my-4" />
                <div className="bg-gray-200 h-6 w-4/5 rounded-md my-2 animate-pulse" />
                <div className="bg-gray-200 h-6 w-3/5 rounded-md animate-pulse" />
                <div className="bg-gray-200 h-6 w-4/6 rounded-md my-2 animate-pulse" />
                <div className="bg-gray-200 h-6 w-3/5 rounded-md animate-pulse" />
            </div>
        )
    }

    if (status === "error") {
        return (
            // <div className="flex-1 flex flex-col items-center justify-center">
            //     <ServerCrash className="w-7 h-7 text-zinc-500 my-4" />
            //     <p className="text-zinc-500 text-xs dark:text-zinc-400">
            //         Something went wrong!
            //     </p>
            // </div>
            <div className="flex-1 flex flex-col items-center justify-center">
                <ServerCrash className="w-7 h-7 text-zinc-500 my-4" />
                <p className="text-zinc-500 text-xs dark:text-zinc-400">
                    Something went wrong!
                </p>
                <button
                    onClick={() => fetchNextPage()}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        )
    }
    return (
        <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
            {!hasNextPage && <div className="flex-1" />}
            {!hasNextPage &&
                <ChatWelcome
                    type={type}
                    name={name}
                />
            }
            {hasNextPage && (
                <div className="flex justify-center mb-4">
                    {isFetchingNextPage ? (
                        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
                    ) : (
                        <button
                            onClick={() => fetchNextPage()}
                            className="text-zinc-500 text-xs dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300
                            my-4 transition"
                        >
                            Load more messages
                        </button>
                    )}
                </div>
            )}
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group, index) => (
                    <Fragment key={index}>
                        {group.items.map((message: MessageWithMemberWithProfile) => (
                            <ChatItem
                                key={message.id}
                                id={message.id}
                                currentMember={member}
                                member={message.member}
                                content={message.content}
                                fileUrl={message.fileUrl}
                                deleted={message.deleted}
                                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                                isUpdate={message.updatedAt !== message.createdAt}
                                socketUrl={socketUrl}
                                socketQuery={socketQuery}
                            />

                        ))}
                    </Fragment>
                ))}
            </div>
            <div ref={bottomRef} />
        </div>
    )
}
import { currentProfile } from "@/lib/current-profile";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";

import { db } from "@/lib/db";

interface ChannelIdPageProps {
    params: Promise<{
        serverId: string;
        channelId: string;
    }>;
}

const ChannelIdPage = async ({
    params
}: ChannelIdPageProps) => {
    const profile = await currentProfile();
    const { channelId, serverId } = await params;

    if (!profile) {
        return <RedirectToSignIn/>;
    }

    const channel = await db.channel.findUnique({
        where: {
            id: channelId,
        }
    });

    const member = await db.member.findFirst({
        where: {
            serverId: serverId,
            profileId: profile.id
        }
    });

    if (!channel || !member) {
        redirect("/");
    }

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                name={channel.name}
                serverId={channel.serverId}
                type="channel"
            />
            <div className="flex-1" >Future Messages</div>
            <ChatInput
                name={channel.name}
                type="channel"
                apiUrl="/api/socket/messages"
                query={{
                    channelId: channel.id,
                    serverId: channel.serverId,
                }}
            />
        </div>
    );
}

export default ChannelIdPage;
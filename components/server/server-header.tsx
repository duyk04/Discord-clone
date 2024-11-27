"use client";

import { ServerWithMembersWithProfile } from "@/types";
import { MemberRole } from "@prisma/client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
    ChevronDown,
    LogOut,
    PlusCircle,
    Settings,
    Trash,
    User,
    UserPlus } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerHeaderProps {
    server: ServerWithMembersWithProfile;
    role?: MemberRole;
}

export const ServerHeader = ({
    server,
    role
}: ServerHeaderProps) => {
    const { onOpen } = useModal();
    const isAdmin = role === MemberRole.ADMIN;
    const isModerator = isAdmin || role === MemberRole.MODERATOR;

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none" asChild>
                    <button className="w-full text-md font-semibold px-3 flex items-centerh-12
                     dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10
                     dark:hover:bg-zinc-700/50 transition">
                        {server.name}
                        <ChevronDown className="h-5 w-5 ml-auto" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                    className="w-56 text-xs font-medium text-black
                    dark:text-neutral-400 space-y-[2px]"
                >
                    {isModerator && (
                        <DropdownMenuItem
                        onClick={() => onOpen("invite", { server })}
                            className="text-emerald-600 dark:text-emerald-600
                            px-3 py-2 text-sm cursor-pointer
                            hover:bg-emerald-500 dark:hover:bg-emerald-600
                            hover:text-white dark:hover:text-emerald-100 "
                        >
                            Invite People
                            <UserPlus className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>
                    )}
                    {isAdmin && (
                        <DropdownMenuItem
                        onClick={() => onOpen("editServer", { server })}
                            className="px-3 py-2 text-sm cursor-pointer
                             dark:hover:bg-indigo-500 dark:hover:text-white 
                             hover:bg-indigo-500 hover:text-white"
                        >
                            Server Settings
                            <Settings className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>
                    )}
                    {isAdmin && (
                        <DropdownMenuItem
                            className="px-3 py-2 text-sm cursor-pointer
                             dark:hover:bg-indigo-500 dark:hover:text-white 
                             hover:bg-indigo-500 hover:text-white"
                        >
                            Manage Members
                            <User className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>
                    )}
                    {isModerator && (
                        <DropdownMenuItem
                            className="px-3 py-2 text-sm cursor-pointer
                             dark:hover:bg-indigo-500 dark:hover:text-white 
                             hover:bg-indigo-500 hover:text-white"
                        >
                            Create Channel
                            <PlusCircle className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>
                    )}
                    
                        <DropdownMenuSeparator />
                    
                    {isAdmin && (
                        <DropdownMenuItem
                            className="text-rose-500 px-3 py-2 text-sm cursor-pointer
                            hover:bg-rose-500 hover:text-white
                            dark:hover:bg-rose-600 dark:hover:text-white"
                        >
                            Delete Server
                            <Trash className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>
                    )}
                    {!isAdmin && (
                        <DropdownMenuItem
                            className="text-rose-500 px-3 py-2 text-sm cursor-pointer
                            hover:bg-rose-500 hover:text-white
                            dark:hover:bg-rose-600 dark:hover:text-white"
                        >
                            Leave Server
                            <LogOut className="h-4 w-4 ml-auto"/>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}